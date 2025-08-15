import { getAdminDb } from '@/lib/firebase-admin';
import { logger } from '@/lib/logger';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

// Migration interface
export interface Migration {
  id: string;
  version: string;
  name: string;
  description: string;
  up: (db: FirebaseFirestore.Firestore) => Promise<void>;
  down: (db: FirebaseFirestore.Firestore) => Promise<void>;
  dependencies?: string[]; // IDs of migrations this one depends on
  estimatedDuration?: number; // in milliseconds
  rollbackSafe?: boolean; // whether this migration can be safely rolled back
}

// Migration status tracking
interface MigrationRecord {
  id: string;
  version: string;
  name: string;
  appliedAt: Timestamp;
  duration: number;
  status: 'applied' | 'rolled_back' | 'failed';
  error?: string;
  checksum?: string;
}

export class MigrationSystem {
  private db: FirebaseFirestore.Firestore;
  private migrationCollection = '_migrations';
  private lockCollection = '_migration_locks';
  private migrations: Map<string, Migration> = new Map();
  private migrationLogger = logger.child({ component: 'migration_system' });

  constructor() {
    this.db = getAdminDb();
  }

  // Register a migration
  registerMigration(migration: Migration): void {
    if (this.migrations.has(migration.id)) {
      throw new Error(`Migration with ID ${migration.id} already registered`);
    }
    
    this.migrations.set(migration.id, migration);
    this.migrationLogger.info('Migration registered', {
      id: migration.id,
      version: migration.version,
      name: migration.name
    });
  }

  // Register multiple migrations
  registerMigrations(migrations: Migration[]): void {
    for (const migration of migrations) {
      this.registerMigration(migration);
    }
  }

  // Get migration history from database
  private async getMigrationHistory(): Promise<MigrationRecord[]> {
    const snapshot = await this.db
      .collection(this.migrationCollection)
      .orderBy('appliedAt', 'asc')
      .get();

    return snapshot.docs.map(doc => doc.data() as MigrationRecord);
  }

  // Record migration completion
  private async recordMigration(migration: Migration, duration: number, status: 'applied' | 'failed', error?: string): Promise<void> {
    const record: MigrationRecord = {
      id: migration.id,
      version: migration.version,
      name: migration.name,
      appliedAt: Timestamp.now(),
      duration,
      status,
      error,
      checksum: this.calculateMigrationChecksum(migration)
    };

    await this.db.collection(this.migrationCollection).doc(migration.id).set(record);
  }

  // Calculate checksum for migration verification
  private calculateMigrationChecksum(migration: Migration): string {
    const content = `${migration.id}:${migration.version}:${migration.name}:${migration.description}`;
    return Buffer.from(content).toString('base64');
  }

  // Acquire migration lock to prevent concurrent migrations
  private async acquireLock(lockId: string = 'global'): Promise<boolean> {
    const lockDoc = this.db.collection(this.lockCollection).doc(lockId);
    const now = Timestamp.now();
    const expiresAt = Timestamp.fromMillis(now.toMillis() + 30 * 60 * 1000); // 30 minutes

    try {
      await this.db.runTransaction(async (transaction) => {
        const lock = await transaction.get(lockDoc);
        
        if (lock.exists) {
          const lockData = lock.data();
          if (lockData?.expiresAt && lockData.expiresAt.toMillis() > now.toMillis()) {
            throw new Error('Migration already in progress');
          }
        }

        transaction.set(lockDoc, {
          acquiredAt: now,
          expiresAt,
          pid: process.pid,
          hostname: require('os').hostname()
        });
      });

      return true;
    } catch (error) {
      this.migrationLogger.warn('Failed to acquire migration lock', { error: error instanceof Error ? error.message : error });
      return false;
    }
  }

  // Release migration lock
  private async releaseLock(lockId: string = 'global'): Promise<void> {
    try {
      await this.db.collection(this.lockCollection).doc(lockId).delete();
    } catch (error) {
      this.migrationLogger.warn('Failed to release migration lock', { error: error instanceof Error ? error.message : error });
    }
  }

  // Check which migrations need to be applied
  private async getPendingMigrations(): Promise<Migration[]> {
    const history = await this.getMigrationHistory();
    const appliedMigrations = new Set(
      history.filter(record => record.status === 'applied').map(record => record.id)
    );

    const allMigrations = Array.from(this.migrations.values())
      .sort((a, b) => a.version.localeCompare(b.version));

    return allMigrations.filter(migration => !appliedMigrations.has(migration.id));
  }

  // Validate migration dependencies
  private validateDependencies(migrations: Migration[]): void {
    const migrationMap = new Map(migrations.map(m => [m.id, m]));
    
    for (const migration of migrations) {
      if (migration.dependencies) {
        for (const depId of migration.dependencies) {
          if (!migrationMap.has(depId)) {
            throw new Error(`Migration ${migration.id} depends on missing migration ${depId}`);
          }
        }
      }
    }
  }

  // Sort migrations by dependencies (topological sort)
  private sortByDependencies(migrations: Migration[]): Migration[] {
    const sorted: Migration[] = [];
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const migrationMap = new Map(migrations.map(m => [m.id, m]));

    const visit = (migration: Migration) => {
      if (visiting.has(migration.id)) {
        throw new Error(`Circular dependency detected involving migration ${migration.id}`);
      }
      if (visited.has(migration.id)) {
        return;
      }

      visiting.add(migration.id);

      if (migration.dependencies) {
        for (const depId of migration.dependencies) {
          const dependency = migrationMap.get(depId);
          if (dependency) {
            visit(dependency);
          }
        }
      }

      visiting.delete(migration.id);
      visited.add(migration.id);
      sorted.push(migration);
    };

    for (const migration of migrations) {
      if (!visited.has(migration.id)) {
        visit(migration);
      }
    }

    return sorted;
  }

  // Apply a single migration
  private async applyMigration(migration: Migration): Promise<void> {
    this.migrationLogger.info('Applying migration', {
      id: migration.id,
      version: migration.version,
      name: migration.name
    });

    const startTime = Date.now();

    try {
      await migration.up(this.db);
      const duration = Date.now() - startTime;
      
      await this.recordMigration(migration, duration, 'applied');
      
      this.migrationLogger.info('Migration applied successfully', {
        id: migration.id,
        version: migration.version,
        duration
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      await this.recordMigration(migration, duration, 'failed', errorMessage);
      
      this.migrationLogger.error('Migration failed', {
        id: migration.id,
        version: migration.version,
        error: errorMessage,
        duration
      });
      
      throw error;
    }
  }

  // Run all pending migrations
  async migrate(dryRun: boolean = false): Promise<{ applied: Migration[], skipped: Migration[] }> {
    if (dryRun) {
      this.migrationLogger.info('Running migration dry run');
    } else {
      this.migrationLogger.info('Starting migration process');
    }

    // Acquire lock
    if (!dryRun && !await this.acquireLock()) {
      throw new Error('Could not acquire migration lock. Another migration may be in progress.');
    }

    try {
      const pendingMigrations = await this.getPendingMigrations();
      
      if (pendingMigrations.length === 0) {
        this.migrationLogger.info('No pending migrations found');
        return { applied: [], skipped: [] };
      }

      this.migrationLogger.info(`Found ${pendingMigrations.length} pending migrations`);

      // Validate dependencies
      this.validateDependencies(pendingMigrations);

      // Sort by dependencies
      const sortedMigrations = this.sortByDependencies(pendingMigrations);

      if (dryRun) {
        this.migrationLogger.info('Dry run - would apply the following migrations:', {
          migrations: sortedMigrations.map(m => ({
            id: m.id,
            version: m.version,
            name: m.name
          }))
        });
        return { applied: [], skipped: sortedMigrations };
      }

      // Apply migrations
      const applied: Migration[] = [];
      for (const migration of sortedMigrations) {
        await this.applyMigration(migration);
        applied.push(migration);
      }

      this.migrationLogger.info('Migration process completed successfully', {
        appliedCount: applied.length
      });

      return { applied, skipped: [] };

    } finally {
      if (!dryRun) {
        await this.releaseLock();
      }
    }
  }

  // Rollback the last applied migration
  async rollback(): Promise<void> {
    this.migrationLogger.info('Starting rollback process');

    if (!await this.acquireLock()) {
      throw new Error('Could not acquire migration lock. Another migration may be in progress.');
    }

    try {
      const history = await this.getMigrationHistory();
      const lastApplied = history
        .filter(record => record.status === 'applied')
        .sort((a, b) => b.appliedAt.toMillis() - a.appliedAt.toMillis())[0];

      if (!lastApplied) {
        this.migrationLogger.info('No migrations to rollback');
        return;
      }

      const migration = this.migrations.get(lastApplied.id);
      if (!migration) {
        throw new Error(`Migration ${lastApplied.id} not found in registered migrations`);
      }

      if (migration.rollbackSafe === false) {
        throw new Error(`Migration ${migration.id} is marked as not rollback-safe`);
      }

      this.migrationLogger.info('Rolling back migration', {
        id: migration.id,
        version: migration.version,
        name: migration.name
      });

      const startTime = Date.now();

      try {
        await migration.down(this.db);
        const duration = Date.now() - startTime;

        // Update migration record
        await this.db.collection(this.migrationCollection).doc(migration.id).update({
          status: 'rolled_back',
          rolledBackAt: Timestamp.now(),
          rollbackDuration: duration
        });

        this.migrationLogger.info('Migration rolled back successfully', {
          id: migration.id,
          version: migration.version,
          duration
        });

      } catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        this.migrationLogger.error('Rollback failed', {
          id: migration.id,
          version: migration.version,
          error: errorMessage,
          duration
        });
        
        throw error;
      }

    } finally {
      await this.releaseLock();
    }
  }

  // Get migration status
  async getStatus(): Promise<{
    appliedMigrations: MigrationRecord[];
    pendingMigrations: Migration[];
    registeredCount: number;
  }> {
    const history = await this.getMigrationHistory();
    const pending = await this.getPendingMigrations();

    return {
      appliedMigrations: history.filter(record => record.status === 'applied'),
      pendingMigrations: pending,
      registeredCount: this.migrations.size
    };
  }

  // Validate migration integrity
  async validateIntegrity(): Promise<{ valid: boolean, issues: string[] }> {
    const issues: string[] = [];
    const history = await this.getMigrationHistory();

    for (const record of history) {
      if (record.status === 'applied') {
        const migration = this.migrations.get(record.id);
        if (!migration) {
          issues.push(`Applied migration ${record.id} not found in registered migrations`);
          continue;
        }

        const currentChecksum = this.calculateMigrationChecksum(migration);
        if (record.checksum && record.checksum !== currentChecksum) {
          issues.push(`Migration ${record.id} checksum mismatch - migration may have been modified`);
        }
      }
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

// Export singleton instance
export const migrationSystem = new MigrationSystem();

export default migrationSystem;