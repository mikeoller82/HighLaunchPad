import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';

interface ContentData {
  components?: any[];
  styles?: any;
  settings?: any;
  [key: string]: any;
}

export function useContentManager(type: 'website' | 'funnel' | 'blog' | 'newsletter', id: string) {
  const { user } = useAuth();
  const [isPublished, setIsPublished] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string>('');
  const [content, setContent] = useState<ContentData>({});
  const [isLoading, setIsLoading] = useState(false);

  const saveDraft = async (data: ContentData) => {
    if (!user) throw new Error('User not authenticated');

    const token = await user.getIdToken();
    const response = await fetch('/api/content/save-draft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        type,
        id,
        data,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save draft');
    }

    return response.json();
  };

  const publishLive = async (data: ContentData) => {
    if (!user) throw new Error('User not authenticated');

    const token = await user.getIdToken();
    const response = await fetch('/api/content/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        type,
        id,
        data,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to publish content');
    }

    const result = await response.json();
    setIsPublished(true);
    setPublishedUrl(result.publishedUrl);
    return result;
  };

  const loadContent = async () => {
    if (!user || !id) return;
    
    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/content/load?type=${type}&id=${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContent(data.content || {});
        setIsPublished(data.isPublished || false);
        setPublishedUrl(data.publishedUrl || '');
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = (newContent: Partial<ContentData>) => {
    setContent(prev => ({ ...prev, ...newContent }));
  };

  const saveContent = async (data: ContentData) => {
    const result = await saveDraft(data);
    setContent(data);
    return result;
  };

  const generatePreviewUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://highlaunchpad.com';
    return `${baseUrl}/preview/${type}/${id}`;
  };

  useEffect(() => {
    loadContent();
  }, [user, id, type]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    content,
    updateContent,
    saveContent,
    saveDraft,
    publishLive,
    generatePreviewUrl,
    isPublished,
    publishedUrl,
    isLoading,
  };
}