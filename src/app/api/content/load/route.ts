import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    
    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    // Get user from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Load content from Firestore
    const docRef = db.collection('content').doc(`${userId}_${type}_${id}`);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({
        content: {},
        isPublished: false,
        publishedUrl: ''
      });
    }

    const data = doc.data();
    
    return NextResponse.json({
      content: data?.content || {},
      isPublished: data?.isPublished || false,
      publishedUrl: data?.publishedUrl || '',
      lastModified: data?.lastModified || null
    });

  } catch (error) {
    console.error('Error loading content:', error);
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    );
  }
}