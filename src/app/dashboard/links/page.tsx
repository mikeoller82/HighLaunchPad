
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MoreHorizontal, Copy, Edit, Trash2, Link as LinkIcon, BarChart, Users, DollarSign, Activity, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { nanoid } from 'nanoid';
import { AffiliateAPI, type AffiliateLink } from '@/lib/affiliate-api';

export default function LinksPage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [links, setLinks] = useState<AffiliateLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    
    // State for Create Dialog
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newLinkName, setNewLinkName] = useState('');
    const [newLinkTargetUrl, setNewLinkTargetUrl] = useState('');

    // State for Edit Dialog
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<AffiliateLink | null>(null);
    const [editedLinkName, setEditedLinkName] = useState('');
    const [editedLinkTargetUrl, setEditedLinkTargetUrl] = useState('');

    const [origin, setOrigin] = useState('');
    
    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    // Load affiliate links on component mount
    useEffect(() => {
        const loadLinks = async () => {
            if (!user) return;
            
            try {
                setLoading(true);
                const fetchedLinks = await AffiliateAPI.getLinks(user);
                setLinks(fetchedLinks || []);
            } catch (error) {
                console.error('Error loading affiliate links:', error);
                setLinks([]); // Set empty array on error
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: error instanceof Error ? error.message : 'Failed to load affiliate links. Please try again.',
                });
            } finally {
                setLoading(false);
            }
        };

        loadLinks();
    }, [user, toast]);


    const handleCopy = (slug: string) => {
        const shortUrl = `${origin}/go/${slug}`;
        navigator.clipboard.writeText(shortUrl);
        toast({
          title: "Copied!",
          description: "Short link copied to clipboard.",
        });
    }

    const handleCreateLink = async () => {
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'You must be logged in to create links.',
            });
            return;
        }

        if (!newLinkName || !newLinkTargetUrl) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please provide both a name and a target URL.',
            });
            return;
        }

        try {
            setCreating(true);
            const slug = nanoid(8);
            const newLink = await AffiliateAPI.createLink(user, {
                name: newLinkName,
                targetUrl: newLinkTargetUrl,
                slug,
            });

            setLinks(prev => [newLink, ...prev]);
            setIsCreateDialogOpen(false);
            setNewLinkName('');
            setNewLinkTargetUrl('');
            toast({
                title: 'Link Created',
                description: `Successfully created short link for ${newLinkName}.`,
            });
        } catch (error) {
            console.error('Error creating link:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to create link. Please try again.',
            });
        } finally {
            setCreating(false);
        }
    };

    const handleOpenEditDialog = (link: AffiliateLink) => {
        setEditingLink(link);
        setEditedLinkName(link.name);
        setEditedLinkTargetUrl(link.targetUrl);
        setIsEditDialogOpen(true);
    };

    const handleUpdateLink = async () => {
        if (!user || !editingLink || !editedLinkName || !editedLinkTargetUrl) {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please fill out all fields.',
            });
            return;
        }
        
        try {
            setUpdating(true);
            const updatedLink = await AffiliateAPI.updateLink(user, {
                id: editingLink.id,
                name: editedLinkName,
                targetUrl: editedLinkTargetUrl,
            });

            setLinks(prev => prev.map(link => 
                link.id === editingLink.id ? updatedLink : link
            ));

            setIsEditDialogOpen(false);
            setEditingLink(null);
            toast({
                title: 'Link Updated',
                description: 'Your link has been successfully updated.',
            });
        } catch (error) {
            console.error('Error updating link:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update link. Please try again.',
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleArchiveLink = async (id: string) => {
        if (!user) return;

        try {
            await AffiliateAPI.updateLink(user, {
                id,
                status: 'Archived',
            });

            setLinks(prev => prev.map(link => 
                link.id === id ? { ...link, status: 'Archived' } : link
            ));
            toast({
                title: 'Link Archived',
                description: 'The link has been moved to archives.',
            });
        } catch (error) {
            console.error('Error archiving link:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to archive link. Please try again.',
            });
        }
    };
    
    const handleViewAnalytics = () => {
        toast({
            title: 'Coming Soon!',
            description: 'Detailed link analytics are on the way.',
        });
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                     <div>
                        <h2 className="text-2xl font-bold tracking-tight">Affiliate Links</h2>
                        <p className="text-blue-600">
                            Manage and analyze your tracking links and campaigns.
                        </p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create New Link
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Short Link</DialogTitle>
                                <DialogDescription>
                                    Create a new shortened affiliate link. The slug will be generated automatically.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="link-name">Name</Label>
                                    <Input id="link-name" placeholder="e.g., My Awesome Product" value={newLinkName} onChange={(e) => setNewLinkName(e.target.value)} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="link-target-url">Target URL</Label>
                                    <Input id="link-target-url" placeholder="https://youraffiliatelink.com/..." value={newLinkTargetUrl} onChange={(e) => setNewLinkTargetUrl(e.target.value)} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={creating}>Cancel</Button>
                                <Button onClick={handleCreateLink} disabled={creating}>
                                    {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Link
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                
                {loading ? (
                    <Card className="flex flex-col items-center justify-center border-dashed min-h-[400px]">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 mx-auto text-blue-600 animate-spin" />
                            <h3 className="mt-4 text-lg font-semibold">Loading Links</h3>
                            <p className="mt-1 text-sm text-blue-600">Please wait while we fetch your affiliate links.</p>
                        </div>
                    </Card>
                ) : links.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center border-dashed min-h-[400px]">
                        <div className="text-center">
                            <LinkIcon className="h-12 w-12 mx-auto text-blue-600" />
                            <h3 className="mt-4 text-lg font-semibold">No Links Found</h3>
                            <p className="mt-1 text-sm text-blue-600">Get started by creating your first affiliate link.</p>
                            <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create New Link
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {links.map((link) => {
                            const ctr = link.clicks > 0 ? (link.conversions / link.clicks) * 100 : 0;
                            const shortUrl = `${origin}/go/${link.slug}`;
                            return (
                                <Card key={link.id}>
                                    <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-2">
                                        <div className="flex-1 overflow-hidden">
                                            <CardTitle className="truncate">{link.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-2 pt-1 text-xs break-all">
                                                <LinkIcon className="h-3 w-3 flex-shrink-0" />
                                                {shortUrl}
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                             <Badge variant={link.status === "Active" ? "outline" : "secondary"} className={link.status === "Active" ? 'border-green-600 bg-green-50 text-green-700 dark:border-green-500/80 dark:bg-green-950 dark:text-green-400' : ''}>
                                                {link.status}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onSelect={() => handleCopy(link.slug)}><Copy className="mr-2 h-4 w-4" /> Copy Link</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleOpenEditDialog(link)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={handleViewAnalytics}><BarChart className="mr-2 h-4 w-4" /> View Analytics</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {link.status === 'Active' && <DropdownMenuItem className="text-destructive" onSelect={() => handleArchiveLink(link.id)}><Trash2 className="mr-2 h-4 w-4" /> Archive</DropdownMenuItem>}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                            <div className="flex items-center gap-3 rounded-lg border p-3">
                                                <Activity className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="text-sm text-blue-600">Clicks</p>
                                                    <p className="text-lg font-bold">{link.clicks.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 rounded-lg border p-3">
                                                <Users className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="text-sm text-blue-600">Conversions</p>
                                                    <p className="text-lg font-bold">{link.conversions.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 rounded-lg border p-3">
                                                <DollarSign className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="text-sm text-blue-600">Commission</p>
                                                    <p className="text-lg font-bold">${link.commission.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 rounded-lg border p-3">
                                                <BarChart className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="text-sm text-blue-600">CTR</p>
                                                    <p className="text-lg font-bold">{ctr.toFixed(2)}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Link</DialogTitle>
                        <DialogDescription>
                           Make changes to your affiliate link here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-link-name">Name</Label>
                            <Input id="edit-link-name" value={editedLinkName} onChange={(e) => setEditedLinkName(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="edit-link-target-url">Target URL</Label>
                            <Input id="edit-link-target-url" value={editedLinkTargetUrl} onChange={(e) => setEditedLinkTargetUrl(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={updating}>Cancel</Button>
                        <Button onClick={handleUpdateLink} disabled={updating}>
                            {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
