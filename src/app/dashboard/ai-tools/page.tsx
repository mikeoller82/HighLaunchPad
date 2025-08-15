import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdCopyGenerator, CtaSuggestor, EmailGenerator, ProductReviewWriter, ProductHookGenerator, ImageGenerator } from '@/components/ai/tools';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AIToolsPage() {
  return (
    <Tabs defaultValue="agents" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-7">
        <TabsTrigger value="agents">AI Agents</TabsTrigger>
        <TabsTrigger value="ad-copy">Ad Generator</TabsTrigger>
        <TabsTrigger value="product-review">Product Review</TabsTrigger>
        <TabsTrigger value="cta-optimizer">CTA Optimizer</TabsTrigger>
        <TabsTrigger value="product-hook">Hook Generator</TabsTrigger>
        <TabsTrigger value="email-content">Email Content</TabsTrigger>
        <TabsTrigger value="image-generator">Image Generator</TabsTrigger>
      </TabsList>
      <TabsContent value="agents">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5" />
              AI Agents Management
            </CardTitle>
            <CardDescription>
              AI Agents have been moved to a new unified interface with chat functionality and task-based interactions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">New AI Agents Experience</h3>
              <p className="text-blue-700 text-sm mb-4">
                Experience our enhanced AI Agents interface with:
              </p>
              <ul className="text-blue-700 text-sm space-y-1 mb-4">
                <li>• Interactive chat with AI agents</li>
                <li>• Task-based execution system</li>
                <li>• Real-time status monitoring</li>
                <li>• Unified agent management</li>
              </ul>
              <Link href="/dashboard/ai-agents">
                <Button className="gap-2">
                  <BrainCircuit className="h-4 w-4" />
                  Go to AI Agents
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="ad-copy">
        <Card>
          <CardHeader>
            <CardTitle>Affiliate Ad Generator</CardTitle>
            <CardDescription>Generates short-form copy for platforms like Facebook Ads, TikTok, and X.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdCopyGenerator />
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="product-review">
        <Card>
          <CardHeader>
            <CardTitle>Product Review Writer</CardTitle>
            <CardDescription>Generates SEO-optimized blog reviews or YouTube scripts.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductReviewWriter />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="cta-optimizer">
        <Card>
          <CardHeader>
            <CardTitle>CTA Optimizer</CardTitle>
            <CardDescription>Suggests strong calls to action based on tone and intent.</CardDescription>
          </CardHeader>
          <CardContent>
            <CtaSuggestor />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="product-hook">
        <Card>
          <CardHeader>
            <CardTitle>Product Hook Generator</CardTitle>
            <CardDescription>Short, punchy hook ideas tailored for social posts, landing pages, or ads.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductHookGenerator />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="email-content">
        <Card>
          <CardHeader>
            <CardTitle>AI Email Assistant</CardTitle>
            <CardDescription>Generate compelling email subject lines and body copy in seconds.</CardDescription>
          </CardHeader>
          <CardContent>
            <EmailGenerator />
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="image-generator">
        <Card>
          <CardHeader>
            <CardTitle>AI Image Generator</CardTitle>
            <CardDescription>Create unique, high-quality images from a text description for your ads, funnels, and content.</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageGenerator />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
