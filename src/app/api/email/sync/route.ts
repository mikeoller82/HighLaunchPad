import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/db';
import { getFirebaseAuth } from '@/lib/firebase-admin';
import { ImapFlow } from 'imapflow';

interface EmailMessage {
  id: string;
  subject: string;
  from: { name?: string; email: string };
  to: { name?: string; email: string }[];
  date: Date;
  body: string;
  bodyText: string;
  isRead: boolean;
  hasAttachments: boolean;
  labels: string[];
}

// IMAP configuration for different providers
const getImapConfig = (provider: string, email: string, password: string) => {
  const configs = {
    gmail: {
      host: 'imap.gmail.com',
      port: 993,
      secure: true,
      auth: { user: email, pass: password }
    },
    outlook: {
      host: 'outlook.office365.com',
      port: 993,
      secure: true,
      auth: { user: email, pass: password }
    },
    yahoo: {
      host: 'imap.mail.yahoo.com',
      port: 993,
      secure: true,
      auth: { user: email, pass: password }
    }
  };
  
  return configs[provider as keyof typeof configs];
};

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { provider, email, password, folder = 'INBOX' } = await request.json();
    
    if (!provider || !email || !password) {
      return NextResponse.json(
        { error: 'Provider, email, and password are required' },
        { status: 400 }
      );
    }

    const db = firestore();

    // Get IMAP configuration
    const imapConfig = getImapConfig(provider, email, password);
    if (!imapConfig) {
      return NextResponse.json(
        { error: 'Unsupported email provider' },
        { status: 400 }
      );
    }

    let client: ImapFlow | null = null;
    
    try {
      // Connect to IMAP server
      client = new ImapFlow(imapConfig as any);
      await client.connect();

      // Select folder
      await client.mailboxOpen(folder);

      // Get recent emails (last 50)
      const messages = client.fetch('1:50', {
        envelope: true,
        bodyStructure: true,
        source: true
      });

      const emailMessages: EmailMessage[] = [];

      for await (const message of messages) {
        try {
          const envelope = message.envelope;
          const body = message.source?.toString() || '';
          
          // Parse email content (basic parsing)
          const bodyText = body.replace(/<[^>]*>/g, '').trim();
          
          const emailMessage: EmailMessage = {
            id: message.uid?.toString() || Date.now().toString(),
            subject: envelope?.subject || 'No Subject',
            from: {
              name: envelope?.from?.[0]?.name || '',
              email: envelope?.from?.[0]?.address || ''
            },
            to: envelope?.to?.map(addr => ({
              name: addr.name || '',
              email: addr.address || ''
            })) || [],
            date: envelope?.date || new Date(),
            body: body,
            bodyText: bodyText,
            isRead: message.flags?.has('\\Seen') || false,
            hasAttachments: false, // TODO: Parse attachments
            labels: Array.from(message.flags || [])
          };

          emailMessages.push(emailMessage);
        } catch (parseError) {
          console.error('Error parsing email message:', parseError);
        }
      }

      // Save emails to Firestore
      const batch = db.batch();
      
      emailMessages.forEach(emailMsg => {
        const emailRef = db
          .collection('users')
          .doc(userId)
          .collection('emails')
          .doc(emailMsg.id);
        
        batch.set(emailRef, {
          ...emailMsg,
          userId,
          syncedAt: new Date(),
          provider,
          folder
        }, { merge: true });
      });

      await batch.commit();

      // Update sync status
      const syncRef = db
        .collection('users')
        .doc(userId)
        .collection('emailSync')
        .doc(provider);
      
      await syncRef.set({
        provider,
        email,
        lastSync: new Date(),
        emailCount: emailMessages.length,
        status: 'success'
      }, { merge: true });

      return NextResponse.json({
        success: true,
        syncedEmails: emailMessages.length,
        provider,
        folder
      });

    } finally {
      if (client) {
        await client.logout();
      }
    }

  } catch (error) {
    console.error('Email sync error:', error);
    
    // Log sync error to database
    try {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        const auth = getFirebaseAuth();
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;
        
        const db = firestore();
        const errorRef = db
          .collection('users')
          .doc(userId)
          .collection('emailSync')
          .doc('error');
        
        await errorRef.set({
          error: (error as Error).message,
          timestamp: new Date(),
          status: 'failed'
        });
      }
    } catch (logError) {
      console.error('Failed to log sync error:', logError);
    }

    return NextResponse.json(
      { error: 'Failed to sync emails', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const db = firestore();
    
    // Get synced emails
    const emailsSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('emails')
      .orderBy('date', 'desc')
      .limit(100)
      .get();

    const emails = emailsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || null,
      syncedAt: doc.data().syncedAt?.toDate?.()?.toISOString() || null
    }));

    return NextResponse.json({ emails });

  } catch (error) {
    console.error('Error fetching synced emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}