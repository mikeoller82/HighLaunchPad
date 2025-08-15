'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Download, FileText, Eye, Code, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface EnhancedResultsProps {
  title: string;
  data: any;
  type: 'ad-copy' | 'email' | 'review' | 'hooks' | 'ctas';
}

export function EnhancedResults({ title, data, type }: EnhancedResultsProps) {
  const [activeTab, setActiveTab] = useState('formatted');
  const { toast } = useToast();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: `${label} copied to clipboard.` });
  };

  const handleExportPDF = async () => {
    try {
      const element = document.getElementById('enhanced-results-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      pdf.save(filename);

      toast({ title: 'Exported!', description: 'Content exported as PDF.' });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Export Failed', 
        description: 'Failed to export PDF. Please try again.' 
      });
    }
  };

  const handleExport = (format: 'txt' | 'md' | 'json') => {
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'txt':
        content = formatAsText();
        filename = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
        mimeType = 'text/plain';
        break;
      case 'md':
        content = formatAsMarkdown();
        filename = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
        mimeType = 'text/markdown';
        break;
      case 'json':
        content = JSON.stringify(data, null, 2);
        filename = `${title.toLowerCase().replace(/\s+/g, '-')}.json`;
        mimeType = 'application/json';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: 'Exported!', description: `Content exported as ${format.toUpperCase()}.` });
  };

  const formatAsText = () => {
    // Add null/undefined checks
    if (!data) return 'No data available';
    
    switch (type) {
      case 'ad-copy':
        const headlines = data.headlines || [];
        const descriptions = data.descriptions || [];
        const primaryText = data.primaryText || data.primary_text || '';
        return `${title}\n${'='.repeat(title.length)}\n\nHEADLINES:\n${headlines.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n')}\n\nPRIMARY TEXT:\n${primaryText}\n\nDESCRIPTIONS:\n${descriptions.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n')}`;
      case 'email':
        const subjectLines = data.subjectLines || [];
        return `${title}\n${'='.repeat(title.length)}\n\nSUBJECT LINES:\n${subjectLines.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}\n\nEMAIL BODY:\n${data.body || ''}`;
      case 'review':
        return data.review || '';
      case 'hooks':
        const hooks = data.hooks || [];
        return `${title}\n${'='.repeat(title.length)}\n\n${hooks.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n')}`;
      case 'ctas':
        const ctas = Array.isArray(data) ? data : [];
        return `${title}\n${'='.repeat(title.length)}\n\n${ctas.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}`;
      default:
        return JSON.stringify(data, null, 2);
    }
  };

  const formatAsMarkdown = () => {
    if (!data) return `# ${title}\n\nNo data available`;
    
    switch (type) {
      case 'ad-copy':
        const headlines = data.headlines || [];
        const descriptions = data.descriptions || [];
        const primaryText = data.primaryText || data.primary_text || '';
        return `# ${title}\n\n## Headlines\n${headlines.map((h: string, i: number) => `${i + 1}. **${h}**`).join('\n')}\n\n## Primary Text\n${primaryText}\n\n## Descriptions\n${descriptions.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n')}`;
      case 'email':
        const subjectLines = data.subjectLines || [];
        return `# ${title}\n\n## Subject Lines\n${subjectLines.map((s: string, i: number) => `${i + 1}. **${s}**`).join('\n')}\n\n## Email Body\n${data.body || ''}`;
      case 'review':
        return data.review || '';
      case 'hooks':
        const hooks = data.hooks || [];
        return `# ${title}\n\n${hooks.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n')}`;
      case 'ctas':
        const ctas = Array.isArray(data) ? data : [];
        return `# ${title}\n\n${ctas.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}`;
      default:
        return `# ${title}\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
    }
  };

  const renderFormattedContent = () => {
    switch (type) {
      case 'ad-copy':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  📢 Headlines
                  <Badge variant="secondary">{data.headlines?.length || 0}</Badge>
                </h3>
                <Button variant="outline" size="sm" onClick={() => handleCopy((data.headlines || []).join('\n'), 'Headlines')}>
                  <Copy className="h-4 w-4 mr-2" />Copy All
                </Button>
              </div>
              <div className="grid gap-3">
                 {(data.headlines || []).map((headline: string, i: number) => (
                   <div key={i} className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm">
                     <Badge variant="outline" className="min-w-[24px] justify-center bg-white text-blue-700 border-blue-300">{i + 1}</Badge>
                     <p className="flex-1 font-medium text-gray-900 leading-relaxed">{headline}</p>
                     <Button variant="ghost" size="sm" onClick={() => handleCopy(headline, `Headline ${i + 1}`)} className="hover:bg-blue-200">
                       <Copy className="h-4 w-4 text-blue-800" />
                     </Button>
                   </div>
                 ))}              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">📝 Primary Text</h3>
                <Button variant="outline" size="sm" onClick={() => handleCopy(data.primaryText || data.primary_text || '', 'Primary Text')}>
                  <Copy className="h-4 w-4 mr-2" />Copy
                </Button>
              </div>
               <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 shadow-sm">
                 <p className="whitespace-pre-wrap leading-relaxed text-gray-900 font-medium">{data.primaryText || data.primary_text || ''}</p>
               </div>            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  📋 Descriptions
                  <Badge variant="secondary">{data.descriptions?.length || 0}</Badge>
                </h3>
                <Button variant="outline" size="sm" onClick={() => handleCopy((data.descriptions || []).join('\n'), 'Descriptions')}>
                  <Copy className="h-4 w-4 mr-2" />Copy All
                </Button>
              </div>
              <div className="grid gap-3">
                 {(data.descriptions || []).map((desc: string, i: number) => (
                   <div key={i} className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 shadow-sm">
                     <Badge variant="outline" className="min-w-[24px] justify-center bg-white text-purple-700 border-purple-300">{i + 1}</Badge>
                     <p className="flex-1 text-gray-900 leading-relaxed">{desc}</p>
                     <Button variant="ghost" size="sm" onClick={() => handleCopy(desc, `Description ${i + 1}`)} className="hover:bg-purple-200">
                       <Copy className="h-4 w-4 text-blue-800" />
                     </Button>
                   </div>
                 ))}              </div>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  📧 Subject Lines
                  <Badge variant="secondary">{data.subjectLines.length}</Badge>
                </h3>
                <Button variant="outline" size="sm" onClick={() => handleCopy(data.subjectLines.join('\n'), 'Subject Lines')}>
                  <Copy className="h-4 w-4 mr-2" />Copy All
                </Button>
              </div>
              <div className="grid gap-3">
                 {data.subjectLines.map((subject: string, i: number) => (
                   <div key={i} className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm">
                     <Badge variant="outline" className="min-w-[24px] justify-center bg-white text-blue-700 border-blue-300">{i + 1}</Badge>
                     <p className="flex-1 font-medium text-gray-900 leading-relaxed">{subject}</p>
                     <Badge variant="secondary" className="text-xs bg-blue-200 text-blue-800">{subject.length} chars</Badge>
                     <Button variant="ghost" size="sm" onClick={() => handleCopy(subject, `Subject Line ${i + 1}`)} className="hover:bg-blue-200">
                       <Copy className="h-4 w-4 text-blue-800" />
                     </Button>
                   </div>
                 ))}              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">✉️ Email Body</h3>
                <Button variant="outline" size="sm" onClick={() => handleCopy(data.body, 'Email Body')}>
                  <Copy className="h-4 w-4 mr-2" />Copy
                </Button>
              </div>
               <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 shadow-sm">
                 <p className="whitespace-pre-wrap leading-relaxed text-gray-900 font-medium">{data.body}</p>
               </div>            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">📝 Product Review</h3>
              <Button variant="outline" size="sm" onClick={() => handleCopy(data.review, 'Product Review')}>
                <Copy className="h-4 w-4 mr-2" />Copy
              </Button>
            </div>
             <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200 shadow-sm">
               <div className="prose prose-sm max-w-none">
                 <pre className="whitespace-pre-wrap font-sans leading-relaxed text-gray-900">{data.review}</pre>
               </div>
             </div>          </div>
        );

      case 'hooks':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                🎣 Product Hooks
                <Badge variant="secondary">{data.hooks.length}</Badge>
              </h3>
              <Button variant="outline" size="sm" onClick={() => handleCopy(data.hooks.join('\n'), 'Product Hooks')}>
                <Copy className="h-4 w-4 mr-2" />Copy All
              </Button>
            </div>
            <div className="grid gap-3">
               {data.hooks.map((hook: string, i: number) => (
                 <div key={i} className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200 shadow-sm">
                   <Badge variant="outline" className="min-w-[24px] justify-center bg-white text-orange-700 border-orange-300">{i + 1}</Badge>
                   <p className="flex-1 font-medium text-gray-900 leading-relaxed">{hook}</p>
                   <Button variant="ghost" size="sm" onClick={() => handleCopy(hook, `Hook ${i + 1}`)} className="hover:bg-orange-200">
                     <Copy className="h-4 w-4 text-blue-800" />
                   </Button>
                 </div>
               ))}            </div>
          </div>
        );

      case 'ctas':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                🎯 Call-to-Actions
                <Badge variant="secondary">{data.length}</Badge>
              </h3>
              <Button variant="outline" size="sm" onClick={() => handleCopy(data.join('\n'), 'CTAs')}>
                <Copy className="h-4 w-4 mr-2" />Copy All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.map((cta: string, i: number) => (
               <Button
                 key={i}
                 variant="outline"
                 className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 hover:from-blue-100 hover:to-purple-100 text-gray-900 font-medium shadow-sm"
                 onClick={() => handleCopy(cta, `CTA ${i + 1}`)}
               >
                 {cta}
               </Button>              ))}
            </div>
          </div>
        );

       default:
         return <pre className="whitespace-pre-wrap text-gray-900 bg-slate-100 p-4 rounded-lg border border-slate-200">{JSON.stringify(data, null, 2)}</pre>;    }
  };

  return (
    <Card className="mt-6 bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('md')}>
              <FileText className="h-4 w-4 mr-2" />
              Export MD
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('txt')}>
              <Download className="h-4 w-4 mr-2" />
              Export TXT
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div id="enhanced-results-content">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="formatted" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Formatted
            </TabsTrigger>
            <TabsTrigger value="markdown" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Markdown
            </TabsTrigger>
            <TabsTrigger value="raw" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Raw JSON
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="formatted" className="mt-4">
            {renderFormattedContent()}
          </TabsContent>
          
          <TabsContent value="markdown" className="mt-4">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => handleCopy(formatAsMarkdown(), 'Markdown')}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <pre className="bg-slate-100 text-slate-800 p-4 rounded-lg overflow-auto text-sm border border-slate-300 shadow-sm">
                {formatAsMarkdown()}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="raw" className="mt-4">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => handleCopy(JSON.stringify(data, null, 2), 'Raw JSON')}
              >
                <Copy className="h-4 w-4" />
              </Button>
               <pre className="bg-slate-100 text-slate-800 p-4 rounded-lg overflow-auto text-sm border border-slate-300 shadow-sm">
                 {JSON.stringify(data, null, 2)}
               </pre>            </div>
          </TabsContent>
        </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}