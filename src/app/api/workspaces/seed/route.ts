import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/db';
import { websiteTemplates } from '@/lib/website-templates';
const DEFAULT_TEMPLATE_ID = 'saas';
import { getFirebaseAuth } from '@/lib/firebase-admin';

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
    const { workspaceId, templateId = DEFAULT_TEMPLATE_ID } = await request.json();

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
    }

    // Validate that we have templates available
    const templates = await websiteTemplates;
    if (!templates || templates.length === 0) {
      console.error('No website templates available');
      return NextResponse.json({ error: 'No website templates available' }, { status: 500 });
    }

    const db = firestore();

    // 1. Create/update workspace doc with user ownership
    const wsRef = db.collection('workspaces').doc(workspaceId);
    await wsRef.set({ 
      name: workspaceId,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true });


    // 2. Pick template with better error handling
    let template = templates.find((t: any) => t.id === templateId);
    
    if (!template) {
      console.warn(`Template "${templateId}" not found, falling back to default template "${DEFAULT_TEMPLATE_ID}"`);
      template = templates.find((t: any) => t.id === DEFAULT_TEMPLATE_ID);
    }
    
    if (!template) {
      console.warn(`Default template "${DEFAULT_TEMPLATE_ID}" not found, using first available template`);
      template = templates[0];
    }

    if (!template) {
      console.error('No templates available at all');
      return NextResponse.json({ error: 'No templates available' }, { status: 500 });
    }

    console.log(`Using template: ${template.id} with ${template.components?.length || 0} components`);

    // 3. Create a single home page with all template components
    const pageRef = wsRef
      .collection('pages')
      .doc(encodeURIComponent('/'));
    await pageRef.set(
      {
        path: '/',
        name: 'Home',
        seoTitle: template.title || 'Home',
        seoDescription: template.description || 'Welcome to our website',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { merge: true },
    );

    // 4. Add all template components to the home page with better error handling
    if (template.components && template.components.length > 0) {
      for (let i = 0; i < template.components.length; i++) {
        const component = template.components[i];
        
        // Validate component structure
        if (!component.id || !component.type) {
          console.warn(`Skipping invalid component at index ${i}:`, component);
          continue;
        }

        try {
          await pageRef
            .collection('components')
            .doc(component.id.toString())
            .set({
              order: i,
              type: component.type,
              props: component.content || {},
              design: component.design || {},
              name: component.name || `${component.type} Component`,
              locked: component.locked || false,
              hidden: component.hidden || false,
              createdAt: new Date(),
              updatedAt: new Date()
            });
        } catch (componentError) {
          console.error(`Error adding component ${component.id}:`, componentError);
          // Continue with other components instead of failing completely
        }
      }
    } else {
      console.warn(`Template "${template.id}" has no components`);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Workspace "${workspaceId}" seeded with template "${template.id}"`,
      workspaceId,
      templateId: template.id,
      componentsAdded: template.components?.length || 0
    });

  } catch (error) {
    console.error('Error seeding workspace:', error);
    return NextResponse.json(
      { 
        error: 'Failed to seed workspace', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}