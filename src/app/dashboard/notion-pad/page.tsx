
'use client';

import dynamicImport from 'next/dynamic';

const NotionPad = dynamicImport(
    () => import('@/components/notionpad').then(mod => mod.NotionPad),
    { 
        ssr: false,
        loading: () => <div>Loading editor...</div>
    }
);

export const dynamic = 'force-dynamic';

export default function NotionPadPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">NotionPad Editor</h2>
                <p className="text-blue-600">
                    A modular, Notion-style rich text editor component.
                </p>
            </div>
            <NotionPad />
        </div>
    );
}

