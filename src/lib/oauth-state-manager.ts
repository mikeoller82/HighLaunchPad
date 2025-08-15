import jwt from 'jsonwebtoken';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from './firebase-admin';

interface OAuthState {
  uid: string;
  platform: string;
  codeVerifier?: string;
  expires: Date;
}

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development';

export class OAuthStateManager {
  private db: FirebaseFirestore.Firestore | null = null;
  private useFirestore = true;

  constructor() {
    try {
      const adminApp = getAdminApp();
      this.db = getFirestore(adminApp);
    } catch (error) {
      console.warn('[OAuthStateManager] Firebase not available, using JWT fallback');
      this.useFirestore = false;
    }
  }

  async storeState(stateId: string, stateData: OAuthState): Promise<void> {
    if (this.useFirestore && this.db) {
      try {
        const stateRef = this.db.collection('oauth_states').doc(stateId);
        await stateRef.set({
          ...stateData,
          expires: stateData.expires,
        });
        console.log(`[OAuthStateManager] State stored in Firestore: ${stateId}`);
        return;
      } catch (error) {
        console.error('[OAuthStateManager] Firestore storage failed:', error);
        console.log('[OAuthStateManager] Falling back to JWT encoding');
        this.useFirestore = false;
      }
    }

    // JWT fallback - encode state data in the state parameter itself
    console.log(`[OAuthStateManager] Using JWT fallback for state: ${stateId}`);
    
    // In JWT mode, we don't actually store anything - the state IS the data
    // The stateId should be the JWT token in this case
  }

  async retrieveState(stateId: string): Promise<OAuthState | null> {
    if (this.useFirestore && this.db) {
      try {
        const stateRef = this.db.collection('oauth_states').doc(stateId);
        const stateDoc = await stateRef.get();
        
        if (stateDoc.exists) {
          const data = stateDoc.data() as OAuthState;
          await stateRef.delete(); // Clean up
          console.log(`[OAuthStateManager] State retrieved from Firestore: ${stateId}`);
          return data;
        }
      } catch (error) {
        console.error('[OAuthStateManager] Firestore retrieval failed:', error);
        console.log('[OAuthStateManager] Trying JWT decode as fallback');
      }
    }

    // JWT fallback - decode state from the stateId itself
    try {
      const decoded = jwt.verify(stateId, JWT_SECRET) as OAuthState;
      console.log(`[OAuthStateManager] State decoded from JWT: ${stateId.substring(0, 20)}...`);
      return decoded;
    } catch (error) {
      console.error('[OAuthStateManager] JWT decode failed:', error);
      return null;
    }
  }

  generateStateId(): string {
    return require('crypto').randomBytes(16).toString('hex');
  }

  // For JWT mode, we need to generate the JWT token as the state ID
  async generateJWTState(stateData: Omit<OAuthState, 'expires'>): Promise<string> {
    const fullStateData: OAuthState = {
      ...stateData,
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    };

    const token = jwt.sign(fullStateData, JWT_SECRET, { expiresIn: '15m' });
    return token;
  }
}