import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/db';
import { getFirebaseAuth } from '@/lib/firebase-admin';
import { seedUserWorkspace } from '@/lib/workspace-seeder';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get auth token from request
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const db = firestore();

    // Get all workspaces owned by the user
    const workspacesSnapshot = await db
      .collection('workspaces')
      .where('ownerId', '==', userId)
      .get();

    const workspaces = workspacesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null
    }));

    return NextResponse.json({ workspaces });

  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workspaces' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get auth token from request
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get request body
    const { workspaceId, templateId } = await request.json();

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
    }

    // Use the improved workspace seeder
    const result = await seedUserWorkspace(userId, workspaceId, templateId);

    return NextResponse.json({ 
      success: true, 
      message: `Workspace "${workspaceId}" created successfully`,
      workspaceId,
      templateId: result.templateId,
      componentsAdded: result.componentsCount
    });

  } catch (error) {
    console.error('Error creating workspace:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create workspace', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}