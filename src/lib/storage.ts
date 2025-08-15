import { getStorage } from 'firebase-admin/storage';
import { getAdminApp } from '@/lib/firebase-admin';

/** Returns the Firebase-Storage bucket your project owns. */
export function bucket() {
  const app = getAdminApp();
  return getStorage(app).bucket();
}