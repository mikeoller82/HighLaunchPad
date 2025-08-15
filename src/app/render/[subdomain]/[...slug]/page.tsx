import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import WebsiteBuilder from '@/components/website/WebsiteBuilder';
import { firestore } from '@/lib/db';

type Params = { params: { subdomain: string; slug: string[] } };

export async function generateMetadata({ params }: Params) {
  const { subdomain, slug } = params;
  const path = '/' + slug.join('/');

  const pageSnap = await firestore()
    .collection('workspaces')
    .doc(subdomain)
    .collection('pages')
    .doc(encodeURIComponent(path))
    .get();

  if (!pageSnap.exists) return {};

  const { seoTitle, seoDescription } = pageSnap.data() as {
    seoTitle?: string;
    seoDescription?: string;
  };

  return {
    title: seoTitle,
    description: seoDescription,
  };
}

export default async function RenderUserSitePage({ params }: Params) {
  const { subdomain, slug } = params;
  const path = '/' + slug.join('/');

  /* 1. workspace */
  const wsSnap = await db()
    .collection('workspaces')
    .doc(subdomain)
    .get();
  if (!wsSnap.exists) notFound();

  /* 2. page */
  const pageSnap = await wsSnap.ref
    .collection('pages')
    .doc(encodeURIComponent(path))
    .get();
  if (!pageSnap.exists) notFound();

  /* 3. components */
  const compSnaps = await pageSnap.ref
    .collection('components')
    .orderBy('order')
    .get();

  // --- CHANGE 1: Add a log to see all components your code knows about ---
  


  return <WebsiteBuilder templateId={pageSnap.id} />;
}