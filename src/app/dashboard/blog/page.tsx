'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Eye, Clock, Lightbulb, Brain, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { blogTemplates } from '@/lib/blog-templates';
import { useAuth } from '@/context/auth-context';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';

interface Post {
    id: string;
    title: string;
    description: string;
    image: string;
    hint: string;
    status: 'Published' | 'Draft';
    author: string;
    publishDate: string | null;
    agentGenerated?: boolean;
    createdAt?: Date;
}

export default function BlogPage() {
    const { user, db } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load AI-generated blog posts from Firestore
    useEffect(() => {
        if (!user || !db) return;

        const blogQuery = query(
            collection(db, 'workspaces', user.uid, 'blog_drafts'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(blogQuery, (snapshot) => {
            const blogPosts: Post[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title || 'Untitled Post',
                    description: data.description || data.seoDescription || 'No description available',
                    image: data.image || '/images/blog-placeholder.jpg',
                    hint: data.hint || 'AI-generated blog post',
                    status: data.status === 'published' ? 'Published' : 'Draft',
                    author: data.author || 'Content Creation Agent',
                    publishDate: data.publishDate ? new Date(data.publishDate).toLocaleDateString() : null,
                    agentGenerated: data.agentGenerated || false,
                    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date()
                };
            });

            setPosts(blogPosts);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, db]);

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
                        <p className="text-blue-600">
                            Create and manage your content marketing.
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading your blog posts...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
                    <p className="text-blue-600">
                        Create and manage your content marketing.
                    </p>
                </div>
            </div>

            {posts.length > 0 && (
                <div>
                     <h3 className="text-xl font-semibold tracking-tight mb-4">Your Posts</h3>
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {posts.map(post => (
                            <Card key={post.id} className="overflow-hidden flex flex-col">
                                <div className="relative h-48 w-full">
                                    <Image src={post.image} alt={post.title} fill className="object-cover" data-ai-hint={post.hint} />
                                </div>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{post.title}</CardTitle>
                                        <div className="flex gap-2">
                                            {post.agentGenerated && (
                                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                                    <Brain className="h-3 w-3 mr-1" />
                                                    AI Generated
                                                </Badge>
                                            )}
                                            <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
                                                {post.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardDescription className="h-10 pt-1">{post.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                <p className="text-xs text-blue-600">By {post.author}</p>
                                {post.publishDate && <p className="text-xs text-blue-600 flex items-center gap-1.5"><Clock className="h-3 w-3"/> Published on {post.publishDate}</p>}
                                </CardContent>
                                <CardFooter className="mt-auto grid grid-cols-2 gap-2 pt-4">
                                    <Button variant="outline" className="w-full">
                                        <Eye className="mr-2 h-4 w-4" /> View Post
                                    </Button>
                                    <Button asChild className="w-full">
                                        <Link href={`/dashboard/blog/${post.id}`}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit Post
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            
            <div>
                 <h3 className="text-xl font-semibold tracking-tight mb-4">Start from a Template</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {blogTemplates.map(template => (
                        <Card key={template.id} className="overflow-hidden flex flex-col">
                            <div className="relative h-48 w-full bg-muted">
                                <Image src={template.image} alt={template.title} fill className="object-cover" data-ai-hint={template.hint} />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg">{template.title}</CardTitle>
                                <CardDescription className="h-12 pt-1">{template.description}</CardDescription>
                            </CardHeader>
                            <CardFooter className="mt-auto grid grid-cols-2 gap-2 pt-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" className="w-full">
                                                <Lightbulb className="mr-2 h-4 w-4" /> AI Insights
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent align="start">
                                            <p className="max-w-xs">{template.aiInsight}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <Button asChild className="w-full">
                                    <Link href={`/dashboard/blog/${template.id}`}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Use Template
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}