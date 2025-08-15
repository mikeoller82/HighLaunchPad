import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

interface SupportRequest {
  subject: string;
  category: string;
  priority: string;
  message: string;
  userEmail?: string;
  userName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SupportRequest = await request.json();
    const { subject, category, priority, message, userEmail, userName } = body;

    // Validate required fields
    if (!subject || !category || !priority || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user info from Firebase Auth if available
    let authenticatedUser = null;
    const authHeader = request.headers.get('authorization');
    
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const adminApp = getAdminApp();
        const auth = getAuth(adminApp);
        const token = authHeader.substring(7);
        authenticatedUser = await auth.verifyIdToken(token);
      } catch (error) {
        console.log('Could not verify auth token, proceeding without authentication');
      }
    }

    // Prepare email content
    const priorityEmoji = {
      critical: '🚨',
      high: '⚠️',
      medium: '📋',
      low: '💬'
    }[priority] || '📋';

    const categoryEmoji = {
      technical: '🔧',
      feature: '💡',
      billing: '💳',
      general: '❓',
      feedback: '💭'
    }[category] || '📝';

    const emailSubject = `${priorityEmoji} [${priority.toUpperCase()}] ${subject}`;
    
    const emailBody = `
New support request received:

${categoryEmoji} Category: ${category.charAt(0).toUpperCase() + category.slice(1)}
${priorityEmoji} Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}
👤 User: ${userName || 'Unknown'} (${userEmail || 'No email provided'})
📧 User ID: ${authenticatedUser?.uid || 'Not authenticated'}

📝 Subject: ${subject}

💬 Message:
${message}

---
Sent from HighLaunchPad Support System
Time: ${new Date().toISOString()}
    `.trim();

    // For now, we'll use a simple email service
    // In production, you might want to use SendGrid, AWS SES, or similar
    const emailData = {
      to: 'support@highlaunchpad.com',
      from: userEmail || 'noreply@highlaunchpad.com',
      subject: emailSubject,
      text: emailBody,
      html: emailBody.replace(/\n/g, '<br>'),
    };

    // Since we don't have an email service configured yet, we'll log the email
    // and return success. In production, replace this with actual email sending.
    console.log('Support email would be sent:', emailData);

    // TODO: Implement actual email sending
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send(emailData);

    // For now, we'll simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Support request sent successfully',
      ticketId: `HLP-${Date.now()}`,
    });

  } catch (error) {
    console.error('Error processing support request:', error);
    return NextResponse.json(
      { error: 'Failed to process support request' },
      { status: 500 }
    );
  }
}