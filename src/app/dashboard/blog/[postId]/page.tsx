'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { getBlogTemplateById } from '@/lib/blog-templates';
import WebsiteBuilder from '@/components/website/WebsiteBuilder';
import { Loader2 } from 'lucide-react';
import type { Component } from '@/lib/types';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  content?: string;
  components?: Component[];
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export default function BlogPostPage() {
  const params = useParams();
  const { user, db } = useAuth();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const postId = params?.postId as string;

  useEffect(() => {
    if (!user || !db || !postId) {
      setIsLoading(false);
      return;
    }

    // Check if it's a template ID first
    const template = getBlogTemplateById(postId);
    if (template && postId !== 'default') {
      // It's a template, create a new blog post from template
      setBlogPost({
        id: postId,
        title: template.title,
        description: template.description,
        components: template.components,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setIsLoading(false);
      return;
    }

    // It's an existing blog post, load from Firestore
    const blogDocRef = doc(db, 'workspaces', user.uid, 'blog_drafts', postId);
    
    const unsubscribe = onSnapshot(
      blogDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setBlogPost({
            id: docSnapshot.id,
            title: data.title || 'Untitled Post',
            description: data.description || data.seoDescription || '',
            content: data.content || '',
            components: data.components || getBlogTemplateById('default').components,
            status: data.status || 'draft',
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          });
        } else {
          // Document doesn't exist, use default template
          const defaultTemplate = getBlogTemplateById('default');
          setBlogPost({
            id: postId,
            title: 'New Blog Post',
            description: 'A new blog post',
            components: defaultTemplate.components,
            status: 'draft',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('Error loading blog post:', err);
        setError('Failed to load blog post');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, db, postId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading blog post...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Blog Post</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Blog Post Not Found</h2>
          <p className="text-gray-600">The requested blog post could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <WebsiteBuilder 
        templateId={postId}
        renderComponent={undefined}
      />
    </div>
  );
}