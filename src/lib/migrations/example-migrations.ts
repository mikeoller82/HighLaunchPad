import { Migration } from './migration-system';
import { FieldValue } from 'firebase-admin/firestore';

// Example migration 1: Add user timestamps
export const addUserTimestamps: Migration = {
  id: 'add_user_timestamps_001',
  version: '1.0.0',
  name: 'Add timestamps to user documents',
  description: 'Adds createdAt and updatedAt fields to all user documents',
  rollbackSafe: true,
  estimatedDuration: 30000, // 30 seconds
  
  async up(db) {
    // Get all user documents that don't have timestamps
    const usersSnapshot = await db.collection('users')
      .where('createdAt', '==', null)
      .get();

    if (usersSnapshot.empty) {
      return; // No users to update
    }

    // Update in batches of 500 (Firestore limit)
    const batchSize = 500;
    const batches = [];
    
    for (let i = 0; i < usersSnapshot.docs.length; i += batchSize) {
      const batch = db.batch();
      const batchDocs = usersSnapshot.docs.slice(i, i + batchSize);
      
      for (const doc of batchDocs) {
        batch.update(doc.ref, {
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        });
      }
      
      batches.push(batch.commit());
    }

    await Promise.all(batches);
  },

  async down(db) {
    // Remove timestamp fields from all user documents
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      return;
    }

    const batchSize = 500;
    const batches = [];
    
    for (let i = 0; i < usersSnapshot.docs.length; i += batchSize) {
      const batch = db.batch();
      const batchDocs = usersSnapshot.docs.slice(i, i + batchSize);
      
      for (const doc of batchDocs) {
        batch.update(doc.ref, {
          createdAt: FieldValue.delete(),
          updatedAt: FieldValue.delete()
        });
      }
      
      batches.push(batch.commit());
    }

    await Promise.all(batches);
  }
};

// Example migration 2: Add workspace settings
export const addWorkspaceSettings: Migration = {
  id: 'add_workspace_settings_002',
  version: '1.1.0',
  name: 'Add settings collection to workspaces',
  description: 'Creates a settings subcollection for each workspace with default values',
  dependencies: ['add_user_timestamps_001'], // Depends on the previous migration
  rollbackSafe: true,
  estimatedDuration: 60000, // 1 minute
  
  async up(db) {
    // Get all workspaces
    const workspacesSnapshot = await db.collection('workspaces').get();

    if (workspacesSnapshot.empty) {
      return;
    }

    const defaultSettings = {
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        digest: 'weekly'
      },
      privacy: {
        profileVisible: true,
        allowSearch: true
      },
      features: {
        aiEnabled: true,
        collaborationEnabled: true
      },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    // Create settings for each workspace
    const promises = workspacesSnapshot.docs.map(async (workspaceDoc) => {
      const settingsCollection = workspaceDoc.ref.collection('settings');
      
      // Check if settings already exist
      const existingSettings = await settingsCollection.doc('general').get();
      
      if (!existingSettings.exists) {
        await settingsCollection.doc('general').set(defaultSettings);
      }
    });

    await Promise.all(promises);
  },

  async down(db) {
    // Remove settings subcollections from all workspaces
    const workspacesSnapshot = await db.collection('workspaces').get();
    
    if (workspacesSnapshot.empty) {
      return;
    }

    const promises = workspacesSnapshot.docs.map(async (workspaceDoc) => {
      const settingsSnapshot = await workspaceDoc.ref.collection('settings').get();
      
      const batch = db.batch();
      settingsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      if (settingsSnapshot.docs.length > 0) {
        await batch.commit();
      }
    });

    await Promise.all(promises);
  }
};

// Example migration 3: Index optimization
export const optimizeUserIndexes: Migration = {
  id: 'optimize_user_indexes_003',
  version: '1.2.0',
  name: 'Optimize user collection indexes',
  description: 'Creates composite indexes for common user queries',
  rollbackSafe: false, // Indexes can't be easily rolled back
  estimatedDuration: 120000, // 2 minutes
  
  async up(db) {
    // Note: In a real Firestore application, indexes are typically managed
    // through firebase.json or the Firebase Console, not through code.
    // This is just an example of how you might track index-related migrations.
    
    // Create a document to track that this index optimization was applied
    await db.collection('_system').doc('index_optimizations').set({
      userIndexesOptimized: true,
      appliedAt: FieldValue.serverTimestamp(),
      version: '1.2.0',
      description: 'Added composite indexes for common user queries',
      indexes: [
        'users: email, status',
        'users: createdAt, status',
        'users: updatedAt desc, status'
      ]
    }, { merge: true });
    
    // In practice, you would apply these indexes through:
    // 1. Firebase Console
    // 2. firebase.json configuration
    // 3. gcloud CLI commands
    // 4. Firebase Admin SDK (limited support)
  },

  async down(db) {
    // Remove the tracking document
    await db.collection('_system').doc('index_optimizations').update({
      userIndexesOptimized: FieldValue.delete()
    });
    
    // Note: In practice, you would need to manually remove indexes
    // through the Firebase Console or gcloud CLI
  }
};

// Example migration 4: Data migration with validation
export const migrateUserProfiles: Migration = {
  id: 'migrate_user_profiles_004',
  version: '2.0.0',
  name: 'Migrate user profile structure',
  description: 'Migrates user profile data to new structure with validation',
  dependencies: ['add_workspace_settings_002'],
  rollbackSafe: true,
  estimatedDuration: 300000, // 5 minutes
  
  async up(db) {
    // Get all users with old profile structure
    const usersSnapshot = await db.collection('users')
      .where('profileVersion', '==', null)
      .get();

    if (usersSnapshot.empty) {
      return;
    }

    const batchSize = 100; // Smaller batches for complex operations
    const batches = [];
    
    for (let i = 0; i < usersSnapshot.docs.length; i += batchSize) {
      const batchDocs = usersSnapshot.docs.slice(i, i + batchSize);
      
      const batchPromises = batchDocs.map(async (doc) => {
        const userData = doc.data();
        
        // Migrate profile structure
        const newProfileData = {
          profileVersion: '2.0',
          personalInfo: {
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`.trim(),
            bio: userData.bio || '',
            avatarUrl: userData.avatarUrl || null
          },
          contactInfo: {
            email: userData.email || '',
            phone: userData.phone || null,
            timezone: userData.timezone || 'UTC',
            preferredLanguage: userData.language || 'en'
          },
          preferences: {
            emailNotifications: userData.emailNotifications !== false,
            pushNotifications: userData.pushNotifications !== false,
            marketingEmails: userData.marketingEmails === true
          },
          metadata: {
            lastProfileUpdate: FieldValue.serverTimestamp(),
            migrationApplied: '2.0.0'
          }
        };

        // Validate required fields
        if (!newProfileData.contactInfo.email) {
          throw new Error(`User ${doc.id} missing required email field`);
        }

        // Update the document
        await doc.ref.update(newProfileData);
      });
      
      batches.push(Promise.all(batchPromises));
    }

    await Promise.all(batches);
  },

  async down(db) {
    // Revert to old profile structure
    const usersSnapshot = await db.collection('users')
      .where('profileVersion', '==', '2.0')
      .get();

    if (usersSnapshot.empty) {
      return;
    }

    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < usersSnapshot.docs.length; i += batchSize) {
      const batch = db.batch();
      const batchDocs = usersSnapshot.docs.slice(i, i + batchSize);
      
      for (const doc of batchDocs) {
        const userData = doc.data();
        
        // Revert to old structure
        const oldProfileData = {
          firstName: userData.personalInfo?.firstName || '',
          lastName: userData.personalInfo?.lastName || '',
          displayName: userData.personalInfo?.displayName || '',
          bio: userData.personalInfo?.bio || '',
          avatarUrl: userData.personalInfo?.avatarUrl || null,
          email: userData.contactInfo?.email || '',
          phone: userData.contactInfo?.phone || null,
          timezone: userData.contactInfo?.timezone || 'UTC',
          language: userData.contactInfo?.preferredLanguage || 'en',
          emailNotifications: userData.preferences?.emailNotifications !== false,
          pushNotifications: userData.preferences?.pushNotifications !== false,
          marketingEmails: userData.preferences?.marketingEmails === true,
          
          // Remove new fields
          profileVersion: FieldValue.delete(),
          personalInfo: FieldValue.delete(),
          contactInfo: FieldValue.delete(),
          preferences: FieldValue.delete(),
          metadata: FieldValue.delete()
        };
        
        batch.update(doc.ref, oldProfileData);
      }
      
      batches.push(batch.commit());
    }

    await Promise.all(batches);
  }
};

// Export all migrations
export const exampleMigrations: Migration[] = [
  addUserTimestamps,
  addWorkspaceSettings,
  optimizeUserIndexes,
  migrateUserProfiles
];

export default exampleMigrations;