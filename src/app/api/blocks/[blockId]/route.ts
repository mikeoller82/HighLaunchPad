import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/db';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';
import { getBlockById } from '@/lib/prebuilt-blocks';
import type { UserBlock } from '@/lib/blocks-types';

export async function GET(
  _request: NextRequest,
  { params }: { params: { blockId: string } }
) {
  try {
    const { blockId } = params;

    const prebuiltBlock = getBlockById(blockId);
    if (prebuiltBlock) {
      return NextResponse.json(prebuiltBlock);
    }

    const db = firestore();
    const blockDoc = await db.collection('blocks').doc(blockId).get();
    
    if (!blockDoc.exists) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    const block = { id: blockDoc.id, ...blockDoc.data() } as UserBlock;
    return NextResponse.json(block);

  } catch (error) {
    console.error('Error fetching block:', error);
    return NextResponse.json(
      { error: 'Failed to fetch block' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { blockId: string } }
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

    const { blockId } = params;
    const updateData = await request.json();

    const db = firestore();
    const blockDoc = await db.collection('blocks').doc(blockId).get();
    
    if (!blockDoc.exists) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    const existingBlock = blockDoc.data() as UserBlock;
    
    if (existingBlock.createdBy !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedBlock = {
      ...existingBlock,
      ...updateData,
      updatedAt: new Date()
    };

    await db.collection('blocks').doc(blockId).update(updatedBlock);

    return NextResponse.json(updatedBlock);

  } catch (error) {
    console.error('Error updating block:', error);
    return NextResponse.json(
      { error: 'Failed to update block' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { blockId: string } }
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

    const { blockId } = params;

    const db = firestore();
    const blockDoc = await db.collection('blocks').doc(blockId).get();
    
    if (!blockDoc.exists) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    const existingBlock = blockDoc.data() as UserBlock;
    
    if (existingBlock.createdBy !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.collection('blocks').doc(blockId).delete();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting block:', error);
    return NextResponse.json(
      { error: 'Failed to delete block' },
      { status: 500 }
    );
  }
}