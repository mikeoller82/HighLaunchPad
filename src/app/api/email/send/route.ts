import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/db';
import { FieldValue } from 'firebase-admin/firestore';
import { getFirebaseAuth } from '@/lib/firebase-admin';
import nodemailer from 'nodemailer';

// Email service configuration
const createTransporter = () => {
  // Configure your email service here
  // This example uses Gmail SMTP, but you can use any provider
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    // Get auth token from request
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    const emailData = await request.json();
    const db = firestore();

    // Get user's email settings
    const userSettingsRef = db.collection('users').doc(userId).collection('settings').doc('email');
    const userSettingsDoc = await userSettingsRef.get();
    const emailSettings = userSettingsDoc.data();

    if (!emailSettings?.configured) {
      return NextResponse.json(
        { error: 'Email service not configured. Please configure your email settings first.' },
        { status: 400 }
      );
    }

    // Get recipients (for now, we'll use a test list or the user's email)
    const recipients = emailData.recipients || [userEmail];

    // Create transporter
    const transporter = createTransporter();

    // Process variables in email content
    let processedHtmlContent = emailData.htmlContent;
    let processedTextContent = emailData.textContent;
    let processedSubject = emailData.subject;

    if (emailData.variables) {
      Object.entries(emailData.variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processedHtmlContent = processedHtmlContent.replace(regex, value as string);
        processedTextContent = processedTextContent.replace(regex, value as string);
        processedSubject = processedSubject.replace(regex, value as string);
      });
    }

    // Send emails
    const sendPromises = recipients.map(async (recipient: string) => {
      const mailOptions = {
        from: emailSettings.fromEmail || userEmail,
        to: recipient,
        subject: processedSubject,
        html: processedHtmlContent,
        text: processedTextContent,
      };

      try {
        const result = await transporter.sendMail(mailOptions);
        return { recipient, success: true, messageId: result.messageId };
      } catch (error) {
        console.error(`Failed to send email to ${recipient}:`, error);
        return { recipient, success: false, error: (error as Error).message };
      }
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    // Save email record to database
    const emailRecord = {
      ...emailData,
      userId,
      status: 'sent',
      sentAt: new Date(),
      recipients: recipients.length,
      successCount,
      failureCount,
      results,
    };

    const emailRef = db.collection('emails').doc();
    await emailRef.set(emailRecord);

    // Update email analytics
    const analyticsRef = db.collection('users').doc(userId).collection('analytics').doc('email');
    await analyticsRef.set({
      totalEmailsSent: FieldValue.increment(successCount),
      totalEmailsFailed: FieldValue.increment(failureCount),
      lastEmailSent: new Date(),
    }, { merge: true });

    return NextResponse.json({
      success: true,
      recipientCount: successCount,
      failureCount,
      results: results.filter(r => !r.success), // Only return failures for debugging
      emailId: emailRef.id
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}