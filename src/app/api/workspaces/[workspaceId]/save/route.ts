import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/db';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';

// POST - Save workspace components
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = getAuth(getAdminApp());
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { workspaceId } = params;
    const { components, pageData } = await request.json();

    if (!components || !Array.isArray(components)) {
      return NextResponse.json({ error: 'Components array is required' }, { status: 400 });
    }

    const db = firestore();

    // Verify workspace ownership
    const workspaceDoc = await db.collection('workspaces').doc(workspaceId).get();
    if (!workspaceDoc.exists || workspaceDoc.data()?.ownerId !== userId) {
      return NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 404 });
    }

    // Update workspace timestamp
    await workspaceDoc.ref.update({
      updatedAt: new Date()
    });

    // Get or create the home page
    const pageRef = db
      .collection('workspaces')
      .doc(workspaceId)
      .collection('pages')
      .doc(encodeURIComponent('/'));

    // Update page metadata if provided
    if (pageData) {
      await pageRef.set({
        path: '/',
        name: pageData.name || 'Home',
        seoTitle: pageData.seoTitle || 'Home',
        seoDescription: pageData.seoDescription || '',
        updatedAt: new Date()
      }, { merge: true });
    }

    // Clear existing components
    const existingComponents = await pageRef.collection('components').get();
    const batch = db.batch();
    
    existingComponents.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Add new components
    components.forEach((component: any, index: number) => {
      const componentRef = pageRef.collection('components').doc(component.id.toString());
      batch.set(componentRef, {
        order: index,
        type: component.type,
        props: component.content || {},
        design: component.design || {},
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: 'Workspace saved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving workspace:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}