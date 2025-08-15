import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/db';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request: NextRequest) {
  try {
    const { type, id, data } = await request.json();
    
    // Get user from session
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const db = firestore();
    
    // Publish content to Firestore
    const publishedData = {
      ...data,
      userId,
      type,
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString(),
    };

    // Save to published content collection
    await db.collection('published_content').doc(`${type}_${id}`).set(publishedData);
    
    // Also save/update draft
    await db.collection('content_drafts').doc(`${type}_${id}`).set({
      ...publishedData,
      status: 'draft'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Content published successfully',
      publishedUrl: generatePublishedUrl(type, id, data)
    });
  } catch (error) {
    console.error('Error publishing content:', error);
    return NextResponse.json({ error: 'Failed to publish content' }, { status: 500 });
  }
}

function generatePublishedUrl(type: string, id: string, data: any): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://highlaunchpad.com';
  
  switch (type) {
    case 'website':
      return data.domain ? `https://${data.domain}/${data.slug || id}` : `${baseUrl}/sites/${id}`;
    case 'funnel':
      return data.domain ? `https://${data.domain}/${data.slug || id}` : `${baseUrl}/go/${id}`;
    case 'blog':
      return `${baseUrl}/blog/${data.slug || id}`;
    case 'newsletter':
      return `${baseUrl}/newsletter/${data.slug || id}`;
    default:
      return `${baseUrl}/${type}/${id}`;
  }
}