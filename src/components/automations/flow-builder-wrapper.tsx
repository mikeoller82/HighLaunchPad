'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { getTemplateById } from '@/lib/automation-templates';

// Enable FlowBuilder with proper dynamic import
const FlowBuilder = dynamic(() => import('./flow-builder').then(mod => ({ default: mod.FlowBuilder })), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-blue-600">Loading Flow Builder...</p>
      </div>
    </div>
  )
});

// interface FlowBuilderWrapperProps {
//   initialNodes?: any[];
//   initialEdges?: any[];
// }

export function FlowBuilderWrapper() {
  const params = useParams();
  const automationId = params?.automationId as string;
  const template = getTemplateById(automationId);

  return (
    <Suspense fallback={
      <div className="flex h-full w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-blue-600">Loading Flow Builder...</p>
        </div>
      </div>
    }>
      <FlowBuilder 
        initialNodes={template.nodes} 
        initialEdges={template.edges}
      />
    </Suspense>
  );
}