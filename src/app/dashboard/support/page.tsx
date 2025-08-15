'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Mail, MessageSquare, Bug, Lightbulb, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

const supportFormSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters.'),
  category: z.string().min(1, 'Please select a category.'),
  priority: z.string().min(1, 'Please select a priority level.'),
  message: z.string().min(20, 'Message must be at least 20 characters.'),
});

type SupportFormData = z.infer<typeof supportFormSchema>;

const categories = [
  { value: 'technical', label: 'Technical Issue', icon: Bug },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb },
  { value: 'billing', label: 'Billing & Account', icon: Mail },
  { value: 'general', label: 'General Question', icon: HelpCircle },
  { value: 'feedback', label: 'Feedback', icon: MessageSquare },
];

const priorities = [
  { value: 'low', label: 'Low - General inquiry' },
  { value: 'medium', label: 'Medium - Standard support' },
  { value: 'high', label: 'High - Urgent issue' },
  { value: 'critical', label: 'Critical - System down' },
];

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<SupportFormData>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      subject: '',
      category: '',
      priority: 'medium',
      message: '',
    },
  });

  async function onSubmit(data: SupportFormData) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userEmail: user?.email,
          userName: user?.displayName || user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send support request');
      }

      toast({
        title: 'Support Request Sent',
        description: "We&apos;ve received your message and will get back to you within 24 hours.",
      });

      form.reset();
    } catch (error) {
      console.error('Error sending support request:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send support request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Support Center</h1>
        <p className="text-blue-600">
          Need help? Send us a message and we&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of your issue..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                              <SelectItem key={category.value} value={category.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {category.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, or relevant information..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Support Request
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Help</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Common Issues</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• OAuth connection problems</li>
                <li>• AI tools not responding</li>
                <li>• Form builder issues</li>
                <li>• Email delivery problems</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Response Times</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Critical: Within 2 hours</li>
                <li>• High: Within 8 hours</li>
                <li>• Medium: Within 24 hours</li>
                <li>• Low: Within 48 hours</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}