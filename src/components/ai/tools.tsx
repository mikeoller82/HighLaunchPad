
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useApiKey } from '@/context/ApiKeyContext';

// Import AI client functions
import { 
  suggestCTAs, 
  generateProductReview, 
  generateProductHook, 
  generateEmailContent, 

} from '@/lib/ai-client';
import { EnhancedResults } from './enhanced-results';

// Define proper TypeScript interfaces for the response types
interface GenerateAdCopyOutput {
  headlines: string[];
  primary_text: string;
  descriptions: string[];
}

interface SuggestCTAsOutput extends Array<string> {}

interface GenerateEmailContentOutput {
  subjectLines: string[];
  body: string;
}

interface GenerateProductReviewOutput {
  review: string;
}

interface GenerateProductHookOutput {
  hooks: string[];
}

interface GeneratedImage {
  imageUrl: string;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function useAiForm() {
  const { checkApiKey } = useApiKey();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Set ready to true after component mounts
    setIsReady(true);
  }, []);

  return { checkApiKey, isKeyReady: isReady };
}

const adCopyFormSchema = z.object({
  product: z.string().min(3, 'Product name is required.'),
  audience: z.string().min(3, 'Target audience is required.'),
  platform: z.string().min(1, 'Platform is required.'),
});

export function AdCopyGenerator() {
  const [result, setResult] = useState<GenerateAdCopyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkApiKey, isKeyReady } = useAiForm();

  const form = useForm<z.infer<typeof adCopyFormSchema>>({
    resolver: zodResolver(adCopyFormSchema),
    defaultValues: { product: "", audience: "", platform: "Facebook" },
  });

  async function onSubmit(values: z.infer<typeof adCopyFormSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const userApiKey = localStorage.getItem('user_gemini_api_key');
      if (!userApiKey) {
        checkApiKey();
        return;
      }
      const response = await fetch('/api/ai/generate-ad-copy', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': userApiKey
        },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Ad copy result received:', result);
      
      if (!result.headlines || !result.primaryText) {
        console.error('Invalid result structure:', result);
        throw new Error('Invalid response structure from API');
      }
      
      setResult(result);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to generate ad copy." });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGenerateClick = () => {
    if (!checkApiKey()) return;
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-4">
          <FormField control={form.control} name="product" render={({ field }) => (
            <FormItem>
              <FormLabel>Product / Offer Description</FormLabel>
              <FormControl><Input placeholder="e.g., SaaS for project management" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="audience" render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl><Input placeholder="e.g., Small business owners" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="platform" render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger></FormControl>
                 <SelectContent>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Google Ads">Google Ads</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="button" onClick={handleGenerateClick} disabled={isLoading || !isKeyReady}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Copy"}
          </Button>
        </form>
      </Form>
      {isLoading && <LoadingSpinner />}
      {result && (
        <EnhancedResults 
          title="Generated Ad Copy" 
          data={result} 
          type="ad-copy" 
        />
      )}
    </div>
  );
}

const ctaFormSchema = z.object({
  context: z.string().min(10, 'Context must be at least 10 characters.'),
});

export function CtaSuggestor() {
  const [result, setResult] = useState<SuggestCTAsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkApiKey, isKeyReady } = useAiForm();

  const form = useForm<z.infer<typeof ctaFormSchema>>({
    resolver: zodResolver(ctaFormSchema),
    defaultValues: { context: "" },
  });

  async function onSubmit(values: z.infer<typeof ctaFormSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const userApiKey = localStorage.getItem('user_gemini_api_key');
      if (!userApiKey) {
        checkApiKey();
        return;
      }
      const response = await fetch('/api/ai/suggest-ctas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': userApiKey
        },
        body: JSON.stringify({ context: values.context })
      });
      const result = await response.json();
      setResult(result);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to suggest CTAs." });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGenerateClick = () => {
    if (!checkApiKey()) return;
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-4">
          <FormField control={form.control} name="context" render={({ field }) => (
            <FormItem>
              <FormLabel>Context / Intent</FormLabel>
              <FormControl><Textarea placeholder="Describe where the Call-To-Action will be used..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="button" onClick={handleGenerateClick} disabled={isLoading || !isKeyReady}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Suggest CTAs"}
          </Button>
        </form>
      </Form>
      {isLoading && <LoadingSpinner />}
      {result && (
        <EnhancedResults 
          title="Suggested CTAs" 
          data={result} 
          type="ctas" 
        />
      )}
    </div>
  );
}

const productReviewSchema = z.object({
  productName: z.string().min(3, "Product name is required."),
  features: z.string().min(10, "Please describe some features or benefits."),
});

export function ProductReviewWriter() {
  const [result, setResult] = useState<GenerateProductReviewOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkApiKey, isKeyReady } = useAiForm();

  const form = useForm<z.infer<typeof productReviewSchema>>({
    resolver: zodResolver(productReviewSchema),
    defaultValues: { productName: "", features: "" },
  });

  async function onSubmit(values: z.infer<typeof productReviewSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const userApiKey = localStorage.getItem('user_gemini_api_key');
      if (!userApiKey) {
        checkApiKey();
        return;
      }
      const response = await generateProductReview({ ...values, apiKey: userApiKey });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to generate product review." });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGenerateClick = () => {
    if (!checkApiKey()) return;
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-4">
          <FormField control={form.control} name="productName" render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl><Input placeholder="e.g., The Amazing Widget Pro" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
           <FormField control={form.control} name="features" render={({ field }) => (
            <FormItem>
              <FormLabel>Key Features / Talking Points</FormLabel>
              <FormControl><Textarea placeholder="List the key features, benefits, and selling points..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="button" onClick={handleGenerateClick} disabled={isLoading || !isKeyReady}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Review"}
          </Button>
        </form>
      </Form>
      {isLoading && <LoadingSpinner />}
      {result && (
        <EnhancedResults 
          title="Generated Product Review" 
          data={result} 
          type="review" 
        />
      )}
    </div>
  );
}

const productHookSchema = z.object({
  productDescription: z.string().min(10, 'Product description is required.'),
  emotion: z.string().min(1, 'Emotion is required.'),
});

export function ProductHookGenerator() {
  const [result, setResult] = useState<GenerateProductHookOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkApiKey, isKeyReady } = useAiForm();

  const form = useForm<z.infer<typeof productHookSchema>>({
    resolver: zodResolver(productHookSchema),
    defaultValues: { productDescription: "", emotion: "Curiosity" },
  });

  async function onSubmit(values: z.infer<typeof productHookSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const userApiKey = localStorage.getItem('user_gemini_api_key');
      if (!userApiKey) {
        checkApiKey();
        return;
      }
      const response = await generateProductHook({ ...values, apiKey: userApiKey });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to generate product hooks." });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGenerateClick = () => {
    if (!checkApiKey()) return;
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-4">
           <FormField control={form.control} name="productDescription" render={({ field }) => (
            <FormItem>
              <FormLabel>Product / Offer Description</FormLabel>
              <FormControl><Textarea placeholder="Briefly describe your product or offer." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
           <FormField control={form.control} name="emotion" render={({ field }) => (
            <FormItem>
              <FormLabel>Target Emotion</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select an emotion" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Curiosity">Curiosity</SelectItem>
                  <SelectItem value="Urgency">Urgency</SelectItem>
                  <SelectItem value="Transformation">Transformation</SelectItem>
                  <SelectItem value="Pain Point">Pain Point</SelectItem>
                   <SelectItem value="Contrarian">Contrarian</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="button" onClick={handleGenerateClick} disabled={isLoading || !isKeyReady}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Hooks"}
          </Button>
        </form>
      </Form>
      {isLoading && <LoadingSpinner />}
      {result && (
        <EnhancedResults 
          title="Generated Product Hooks" 
          data={result} 
          type="hooks" 
        />
      )}
    </div>
  );
}

const emailFormSchema = z.object({
  objective: z.string().min(10, 'Objective must be at least 10 characters.'),
  tone: z.string().min(1, 'Tone is required.'),
  productDetails: z.string().min(10, 'Product details must be at least 10 characters.'),
});

interface EmailGeneratorProps {
  defaultValues?: z.infer<typeof emailFormSchema>;
}

export function EmailGenerator({ defaultValues }: EmailGeneratorProps) {
  const [result, setResult] = useState<GenerateEmailContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkApiKey, isKeyReady } = useAiForm();

  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: defaultValues || { objective: "", tone: "Professional", productDetails: "" },
  });

  async function onSubmit(values: z.infer<typeof emailFormSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const userApiKey = localStorage.getItem('user_gemini_api_key');
      if (!userApiKey) {
        checkApiKey();
        return;
      }
      const response = await generateEmailContent({ ...values, apiKey: userApiKey });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to generate email content." });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleGenerateClick = () => {
    if (!checkApiKey()) return;
    form.handleSubmit(onSubmit)();
  };



  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-4">
          <FormField control={form.control} name="objective" render={({ field }) => (
            <FormItem>
              <FormLabel>Email Objective</FormLabel>
              <FormControl><Input placeholder="e.g., Promote new summer collection" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
           <FormField control={form.control} name="productDetails" render={({ field }) => (
            <FormItem>
              <FormLabel>Product / Offer Details</FormLabel>
              <FormControl><Textarea placeholder="Describe the product, offer, or message..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="tone" render={({ field }) => (
            <FormItem>
              <FormLabel>Tone of Voice</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a tone" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="Witty">Witty</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="button" onClick={handleGenerateClick} disabled={isLoading || !isKeyReady}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Email"}
          </Button>
        </form>
      </Form>
      {isLoading && <LoadingSpinner />}
      {result && (
        <EnhancedResults 
          title="Generated Email Content" 
          data={result} 
          type="email" 
        />
      )}
    </div>
  );
}

const imageGeneratorSchema = z.object({
  prompt: z.string().min(10, 'A detailed prompt is required (max 480 characters).').max(480, 'Prompt must be 480 characters or less.'),
  aspectRatio: z.enum(['1:1', '3:4', '4:3', '9:16', '16:9']),
});

export function ImageGenerator() {
  const [result, setResult] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkApiKey, isKeyReady } = useAiForm();

  const form = useForm<z.infer<typeof imageGeneratorSchema>>({
    resolver: zodResolver(imageGeneratorSchema),
    defaultValues: { prompt: "", aspectRatio: "1:1" },
  });

  async function onSubmit(values: z.infer<typeof imageGeneratorSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const userApiKey = localStorage.getItem('user_gemini_api_key');
      if (!userApiKey) {
        checkApiKey();
        return;
      }
      
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': userApiKey
        },
        body: JSON.stringify({
          prompt: values.prompt,
          numberOfImages: 1,
          aspectRatio: values.aspectRatio
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      if (result.images && result.images.length > 0) {
        const imageData = result.images[0];
        const imageUrl = `data:${imageData.mimeType};base64,${imageData.imageBytes}`;
        setResult({ imageUrl });
        toast({
          title: 'Success',
          description: 'Image generated successfully!',
        });
      } else {
        throw new Error('No images were generated');
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({ 
        variant: "destructive", 
        title: "Image Generation Failed", 
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGenerateClick = () => {
    if (!checkApiKey()) return;
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-4">
           <FormField control={form.control} name="prompt" render={({ field }) => (
            <FormItem>
              <FormLabel>Image Prompt</FormLabel>
              <FormControl><Textarea placeholder="e.g., A photorealistic image..." {...field} className="min-h-[100px]" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
           <FormField control={form.control} name="aspectRatio" render={({ field }) => (
            <FormItem>
              <FormLabel>Aspect Ratio</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select an aspect ratio" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="1:1">Square (1:1)</SelectItem>
                  <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                  <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="button" onClick={handleGenerateClick} disabled={isLoading || !isKeyReady}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Image"}
          </Button>
        </form>
      </Form>
      {isLoading && <LoadingSpinner />}
      {result && (
        <Card className="mt-6 bg-muted/30">
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video w-full max-w-lg mx-auto rounded-lg overflow-hidden border">
                <Image src={result.imageUrl} alt={form.getValues('prompt')} fill className="object-contain"/>
            </div>
            <div className="flex justify-center">
              <Button asChild>
                <a href={result.imageUrl} download={`${form.getValues('prompt').substring(0, 20)}.png`}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
