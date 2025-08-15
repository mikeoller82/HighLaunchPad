import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/db';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';

interface AffiliateLink {
  id: string;
  name: string;
  targetUrl: string;
  slug: string;
  clicks: number;
  conversions: number;
  commission: number;
  status: 'Active' | 'Archived';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// GET - Fetch all affiliate links for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = getAuth(getAdminApp());
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;
    console.log('Fetching links for user:', userId);

    const db = firestore();
    let linksSnapshot;
    
    try {
      linksSnapshot = await db
        .collection('affiliateLinks')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
    } catch (dbError: any) {
      console.error('Database query error:', dbError);
      
      // If it's an index error, try without ordering
      if (dbError?.code === 'failed-precondition' || dbError?.message?.includes('index')) {
        console.log('Trying query without ordering due to missing index');
        try {
          linksSnapshot = await db
            .collection('affiliateLinks')
            .where('userId', '==', userId)
            .get();
        } catch (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
          return NextResponse.json({ error: 'Database query failed', links: [] }, { status: 500 });
        }
      } else {
        return NextResponse.json({ error: 'Database query failed', links: [] }, { status: 500 });
      }
    }

    console.log('Found links:', linksSnapshot.size);

    const links = linksSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      };
    });

    return NextResponse.json({ links: links || [] });
  } catch (error) {
    console.error('Error fetching affiliate links:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new affiliate link
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = getAuth(getAdminApp());
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { name, targetUrl, slug } = await request.json();

    if (!name || !targetUrl || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = firestore();
    
    // Check if slug already exists
    const existingSlugSnapshot = await db
      .collection('affiliateLinks')
      .where('slug', '==', slug)
      .get();

    if (!existingSlugSnapshot.empty) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const newLink: Omit<AffiliateLink, 'id'> = {
      name,
      targetUrl,
      slug,
      clicks: 0,
      conversions: 0,
      commission: 0,
      status: 'Active',
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('affiliateLinks').add(newLink);
    const createdLink = { 
      id: docRef.id, 
      ...newLink,
      createdAt: newLink.createdAt,
      updatedAt: newLink.updatedAt,
    };

    return NextResponse.json({ link: createdLink }, { status: 201 });
  } catch (error) {
    console.error('Error creating affiliate link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update an existing affiliate link
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = getAuth(getAdminApp());
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { id, name, targetUrl, status } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 });
    }

    const db = firestore();
    const linkRef = db.collection('affiliateLinks').doc(id);
    const linkDoc = await linkRef.get();

    if (!linkDoc.exists) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const linkData = linkDoc.data();
    if (linkData?.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: Partial<AffiliateLink> = {
      updatedAt: new Date()
    };

    if (name) updateData.name = name;
    if (targetUrl) updateData.targetUrl = targetUrl;
    if (status) updateData.status = status;

    await linkRef.update(updateData);

    const updatedDoc = await linkRef.get();
    const updatedLink = { 
      id: updatedDoc.id, 
      ...updatedDoc.data(),
      createdAt: updatedDoc.data()?.createdAt?.toDate?.() || new Date(),
      updatedAt: updatedDoc.data()?.updatedAt?.toDate?.() || new Date(),
    };

    return NextResponse.json({ link: updatedLink });
  } catch (error) {
    console.error('Error updating affiliate link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}