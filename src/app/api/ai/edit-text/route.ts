import { NextRequest, NextResponse } from 'next/server';
import { editTextFlow } from '@/ai/flows/edit-text';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await editTextFlow(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Text editing API error:', error);
    return NextResponse.json(
      { error: 'Failed to edit text' },
      { status: 500 }
    );
  }
}