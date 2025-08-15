/* src/lib/db.ts */
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';

/**
 * Singleton Firestore instance.
 * Usage:  const db = firestore();  db.collection('workspaces')…
 */
export const firestore = () => getFirestore(getAdminApp());

/**
 * Export db as alias for firestore for compatibility
 */
export const db = firestore;