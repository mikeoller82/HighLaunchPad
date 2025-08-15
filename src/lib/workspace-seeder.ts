import { firestore } from '@/lib/db';
import { websiteTemplates } from './website-templates';
import type { Template } from './website-templates';

const DEFAULT_TEMPLATE_ID = 'consulting'; // Changed from 'saas' to 'consulting' as requested

// Function to get all available templates
export async function getAllTemplates(): Promise<Template[]> {
  return await websiteTemplates;
}

// Function to get template by ID
export async function getTemplateById(templateId: string): Promise<Template | undefined> {
  const templates = await websiteTemplates;
  return templates.find((t: any) => t.id === templateId);
}

// Function to get available template IDs
export async function getAvailableTemplateIds(): Promise<string[]> {
  const templates = await websiteTemplates;
  return templates.map((t: any) => t.id);
}

export async function seedUserWorkspace(userId: string, workspaceId: string, templateId: string = DEFAULT_TEMPLATE_ID) {
  const db = firestore();

  try {
    // Validate that we have templates available
    const templates = await getAllTemplates();
    if (!templates || templates.length === 0) {
      throw new Error('No website templates available. Please check template configuration.');
    }

    // 1. Create/update workspace doc with user ownership
    const wsRef = db.collection('workspaces').doc(workspaceId);
    await wsRef.set({ 
      name: workspaceId,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true });

  // 2. Pick template with better error handling
  let template = await getTemplateById(templateId);
  if (!template) {
    console.warn(`Template "${templateId}" not found, falling back to default template "${DEFAULT_TEMPLATE_ID}"`);
    template = await getTemplateById(DEFAULT_TEMPLATE_ID);
  }
  if (!template) {
    console.warn(`Default template "${DEFAULT_TEMPLATE_ID}" not found, using first available template`);
    template = templates[0];
  }

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

  console.log(`Seeded workspace "${workspaceId}" for user "${userId}" with template "${template.id}" (${template.components?.length || 0} components)`);
  return { success: true, templateId: template.id, componentsCount: template.components?.length || 0 };

} catch (error) {
  console.error('Error seeding workspace:', error);
  return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
}
}