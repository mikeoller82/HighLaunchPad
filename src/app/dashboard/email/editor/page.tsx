'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EmailEditor } from '@/components/email/EmailEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function EmailEditorContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams?.get('template');
  const emailId = searchParams?.get('email');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/email">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Editor</h1>
          <p className="text-muted-foreground">
            {templateId ? 'Create email from template' : emailId ? 'Edit existing email' : 'Create new email'}
          </p>
        </div>
      </div>

      <EmailEditor 
        templateId={templateId || undefined}
        emailId={emailId || undefined}
        onSave={(email) => {
          console.log('Email saved:', email);
        }}
        onSend={(email) => {
          console.log('Email sent:', email);
        }}
      />
    </div>
  );
}

export default function EmailEditorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading email editor...</p>
        </div>
      </div>
    }>
      <EmailEditorContent />
    </Suspense>
  );
}