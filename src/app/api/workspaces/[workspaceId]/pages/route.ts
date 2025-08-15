import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/db';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';

// GET - Fetch all pages for a workspace
export async function GET(
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
    const db = firestore();

    // Verify workspace ownership
    const workspaceDoc = await db.collection('workspaces').doc(workspaceId).get();
    if (!workspaceDoc.exists || workspaceDoc.data()?.ownerId !== userId) {
      return NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 404 });
    }

    // Get all pages
    const pagesSnapshot = await db
      .collection('workspaces')
      .doc(workspaceId)
      .collection('pages')
      .get();

    const pages = await Promise.all(
      pagesSnapshot.docs.map(async (pageDoc) => {
        const pageData = pageDoc.data();
        
        // Get components for this page
        const componentsSnapshot = await pageDoc.ref
          .collection('components')
          .orderBy('order')
          .get();

        const components = componentsSnapshot.docs.map(compDoc => ({
          id: compDoc.id,
          ...compDoc.data(),
          createdAt: compDoc.data().createdAt?.toDate?.() || new Date(),
          updatedAt: compDoc.data().updatedAt?.toDate?.() || new Date(),
        }));

        return {
          id: pageDoc.id,
          ...pageData,
          components,
          createdAt: pageData.createdAt?.toDate?.() || new Date(),
          updatedAt: pageData.updatedAt?.toDate?.() || new Date(),
        };
      })
    );

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new page
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
    const { path, name, seoTitle, seoDescription, components } = await request.json();

    if (!path || !name) {
      return NextResponse.json({ error: 'Path and name are required' }, { status: 400 });
    }

    const db = firestore();

    // Verify workspace ownership
    const workspaceDoc = await db.collection('workspaces').doc(workspaceId).get();
    if (!workspaceDoc.exists || workspaceDoc.data()?.ownerId !== userId) {
      return NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 404 });
    }

    // Create page
    const pageRef = db
      .collection('workspaces')
      .doc(workspaceId)
      .collection('pages')
      .doc(encodeURIComponent(path));

    await pageRef.set({
      path,
      name,
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Add components if provided
    if (components && Array.isArray(components)) {
      for (let i = 0; i < components.length; i++) {
        const component = components[i];
        await pageRef
          .collection('components')
          .doc(component.id.toString())
          .set({
            order: i,
            type: component.type,
            props: component.content,
            design: component.design || {},
            createdAt: new Date(),
            updatedAt: new Date()
          });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Page created successfully',
      pageId: pageRef.id
    });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}