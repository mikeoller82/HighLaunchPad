/* ts-node src/scripts/seedWorkspace.ts <workspaceSubdomain> <templateId> */
import 'dotenv/config';                 // so FIREBASE_SERVICE_ACCOUNT works
import { firestore } from '@/lib/db';
import { websiteTemplates } from '../lib/website-templates';
const DEFAULT_TEMPLATE_ID = 'saas';

async function seed(workspaceId: string, templateId: string) {
  const db = firestore();

  // 1. create / update workspace doc
  const wsRef = db.collection('workspaces').doc(workspaceId);
  await wsRef.set({ name: workspaceId }, { merge: true });

  // 2. pick template (fallback to default)
  const templates = await websiteTemplates;
  let template = templates.find((t) => t.id === templateId) ??
    templates.find((t) => t.id === DEFAULT_TEMPLATE_ID);
  if (!template) {
    throw new Error('No valid template found');
  }

  // 3. create a single home page with all template components
  const pageRef = wsRef
    .collection('pages')
    .doc(encodeURIComponent('/'));
  await pageRef.set(
    {
      path: '/',
      name: 'Home',
      seoTitle: template.title,
      seoDescription: template.description,
    },
    { merge: true },
  );

  // 4. add all template components to the home page
  for (let i = 0; i < template.components.length; i++) {
    const component = template.components[i];
    await pageRef
      .collection('components')
      .doc(component.id.toString())
      .set({
        order: i,
        type: component.type,
        props: component.content,
      });
  }

  console.log(`Seeded "${workspaceId}" with template "${template.id}" ✔`);
}

const [workspaceId, templateId = DEFAULT_TEMPLATE_ID] = process.argv.slice(2);
if (!workspaceId) {
  console.error('Usage: ts-node seedWorkspace.ts <subdomain> [templateId]');
  process.exit(1);
}

seed(workspaceId, templateId).then(() => process.exit());