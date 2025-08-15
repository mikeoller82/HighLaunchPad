import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/db';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';
import type { Block, UserBlock } from '@/lib/blocks-types';
import { prebuiltBlocks } from '@/lib/prebuilt-blocks';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';
    const custom = searchParams.get('custom') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let blocks: Block[] = [];

    if (custom) {
      const authHeader = request.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const token = authHeader.split('Bearer ')[1];
      const auth = getAuth(getAdminApp());
      const decodedToken = await auth.verifyIdToken(token);
      const userId = decodedToken.uid;

      const db = firestore();
      const userBlocksRef = db.collection('blocks').where('createdBy', '==', userId);
      const snapshot = await userBlocksRef.get();
      
      blocks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserBlock[];
    } else {
      blocks = prebuiltBlocks;
    }

    if (search) {
      const searchQuery = search.toLowerCase();
      blocks = blocks.filter(block => 
        block.name.toLowerCase().includes(searchQuery) ||
        block.description.toLowerCase().includes(searchQuery) ||
        block.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    }

    if (category) {
      blocks = blocks.filter(block => block.category === category);
    }

    if (featured && !custom) {
      blocks = blocks.filter(block => block.featured);
    }

    const total = blocks.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBlocks = blocks.slice(startIndex, endIndex);

    return NextResponse.json({
      blocks: paginatedBlocks,
      total,
      page,
      limit,
      hasMore: endIndex < total
    });

  } catch (error) {
    console.error('Error fetching blocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocks' },
      { status: 500 }
    );
  }
}

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

    const blockData = await request.json();
    
    const userBlock: UserBlock = {
      ...blockData,
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isCustom: true,
      isPrivate: blockData.isPrivate || false,
      usageCount: 0,
      rating: 0
    };

    const db = firestore();
    await db.collection('blocks').doc(userBlock.id).set(userBlock);

    return NextResponse.json(userBlock, { status: 201 });

  } catch (error) {
    console.error('Error creating block:', error);
    return NextResponse.json(
      { error: 'Failed to create block' },
      { status: 500 }
    );
  }
}