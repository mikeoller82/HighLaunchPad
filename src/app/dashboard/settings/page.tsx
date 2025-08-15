
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Building, Mail, Globe, Key, CreditCard, Users, Share2, Facebook, Instagram, Twitter, Linkedin, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { doc, setDoc, collection, onSnapshot } from 'firebase/firestore';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import AgentToggles from '@/components/dashboard/AgentToggles';
import { CustomDomainManager } from '@/components/dashboard/custom-domain-manager';
import { ApiKeySettings } from '@/components/dashboard/api-key-settings';

const BillingForm = dynamicImport(
    () => import('@/components/dashboard/billing-form').then(mod => mod.BillingForm),
    { 
        ssr: false,
        loading: () => <div>Loading billing information...</div>
    }
);

const socialPlatforms: { name: 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn'; icon: keyof typeof Icons; color: string; realAuth: boolean; }[] = [
    { name: 'Facebook', icon: 'Facebook', color: 'text-[#1877F2]', realAuth: true },
    { name: 'Instagram', icon: 'Instagram', color: 'text-[#E4405F]', realAuth: true },
    { name: 'Twitter', icon: 'Twitter', color: 'text-[#1DA1F2]', realAuth: true },
    { name: 'LinkedIn', icon: 'Linkedin', color: 'text-[#0A66C2]', realAuth: true },
];

function SettingsPageComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const { user, db } = useAuth();
    const defaultTab = searchParams?.get('tab') || 'profile';
    const [isConnecting, setIsConnecting] = useState<string | null>(null);
    const [connectedProfiles, setConnectedProfiles] = useState<any[]>([]);

    useEffect(() => {
        const error = searchParams?.get('error');
        const success = searchParams?.get('success');
        const cancelled = searchParams?.get('cancelled');
        const tab = searchParams?.get('tab');

        if (error) {
            if (tab === 'billing') {
                toast({
                    variant: 'destructive',
                    title: 'Payment Failed',
                    description: 'Something went wrong with your payment. Please try again.',
                });
                router.replace('/dashboard/settings?tab=billing');
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Connection Failed',
                    description: `Something went wrong while connecting your account. Error: ${error}`,
                });
                router.replace('/dashboard/settings?tab=social');
            }
        }

        if (success) {
            if (tab === 'billing') {
                toast({
                    title: 'Payment Successful!',
                    description: 'Your subscription has been activated. Welcome to Pro!',
                });
                router.replace('/dashboard/settings?tab=billing');
            } else {
                toast({
                    title: 'Account Connected!',
                    description: 'Your social account has been successfully connected.',
                });
                router.replace('/dashboard/settings?tab=social');
            }
        }

        if (cancelled && tab === 'billing') {
            toast({
                title: 'Payment Cancelled',
                description: 'Your payment was cancelled. You can try again anytime.',
            });
            router.replace('/dashboard/settings?tab=billing');
        }
    }, [searchParams, toast, router]);

    useEffect(() => {
        if (!user || !db) return;

        const profilesQuery = collection(db, 'workspaces', user.uid, 'profiles');
        const unsubscribe = onSnapshot(profilesQuery, (snapshot) => {
            const profiles = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setConnectedProfiles(profiles);
        });

        return unsubscribe;
    }, [user, db]);


    const handleSave = () => {
        toast({
            title: "Settings Saved",
            description: "Your changes have been successfully saved.",
        });
    };
    
    const handleConnect = async (platform: typeof socialPlatforms[0]) => {
        if (!user || !db) {
            toast({ title: "Error", description: "You must be logged in to connect accounts."});
            return;
        }

        if (platform.realAuth) {
            setIsConnecting(platform.name);
            try {
                const token = await user.getIdToken(true); // Force refresh
                const response = await fetch(`/api/oauth/${platform.name.toLowerCase()}/connect`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to start connection process.');
                }
                
                const { authUrl } = await response.json();
                
                // Use popup for all platforms to prevent hanging
                const popup = window.open(
                    authUrl,
                    `${platform.name}OAuth`,
                    'width=600,height=700,scrollbars=yes,resizable=yes'
                );

                if (!popup) {
                    throw new Error('Popup blocked. Please allow popups for this site and try again.');
                }

                // Listen for messages from the popup
                const handleMessage = (event: MessageEvent) => {
                    if (event.origin !== window.location.origin) return;
                    
                    if (event.data.type === 'oauth-success') {
                        toast({
                            title: `${platform.name} Connected!`,
                            description: 'Your social account has been successfully connected.',
                        });
                        setIsConnecting(null);
                        // Refresh the page to show updated connection status
                        window.location.reload();
                    } else if (event.data.type === 'oauth-error') {
                        toast({
                            variant: 'destructive',
                            title: `Failed to connect ${platform.name}`,
                            description: event.data.details || 'An unknown error occurred.'
                        });
                        setIsConnecting(null);
                    }
                };

                window.addEventListener('message', handleMessage);

                // Also listen for the popup to close as a fallback
                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', handleMessage);
                        if (isConnecting === platform.name) {
                            setIsConnecting(null);
                        }
                    }
                }, 1000);

            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: `Failed to connect ${platform.name}`,
                    description: error instanceof Error ? error.message : 'An unknown error occurred.'
                });
                setIsConnecting(null);
            }
        } else {
            // This simulates a profile connection for non-implemented platforms
            const profileId = `${platform.name.toLowerCase()}_${user.uid}`;
            const profileRef = doc(db, 'workspaces', user.uid, 'profiles', profileId);

            const newProfile = {
                id: profileId,
                platform: platform.name,
                platformIcon: platform.icon,
                name: `${platform.name} Profile (${user.email?.split('@')[0]})`,
            };

            try {
                await setDoc(profileRef, newProfile, { merge: true });
                toast({
                    title: `Connected to ${platform.name}`,
                    description: 'This is a simulation. A real OAuth flow would happen here.',
                });
            } catch (error) {
                console.error("Failed to connect profile:", error);
                toast({
                    variant: 'destructive',
                    title: `Failed to connect ${platform.name}`,
                    description: 'Could not save profile information.'
                });
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-blue-600">
                    Manage your account, workspace, and integration settings.
                </p>
            </div>
            <Tabs defaultValue={defaultTab} className="flex flex-col md:flex-row gap-6">
                <TabsList className="flex flex-col h-full bg-transparent p-0 border-r w-full md:w-48">
                    <TabsTrigger value="profile" className="w-full justify-start gap-2"><User />Profile</TabsTrigger>
                    <TabsTrigger value="workspace" className="w-full justify-start gap-2"><Building />Workspace</TabsTrigger>
                    <TabsTrigger value="billing" className="w-full justify-start gap-2"><CreditCard />Billing</TabsTrigger>
                    <TabsTrigger value="email" className="w-full justify-start gap-2"><Mail />Email</TabsTrigger>
                    <TabsTrigger value="domains" className="w-full justify-start gap-2"><Globe />Domains</TabsTrigger>
                    <TabsTrigger value="social" className="w-full justify-start gap-2"><Share2 />Social Accounts</TabsTrigger>
                    <TabsTrigger value="api" className="w-full justify-start gap-2"><Key />API Keys</TabsTrigger>
                    <TabsTrigger value="team" className="w-full justify-start gap-2"><Users />Team</TabsTrigger>
                    <TabsTrigger value="ai-agents" className="w-full justify-start gap-2"><Icons.Bot className="h-4 w-4" />AI Agents</TabsTrigger>
                </TabsList>
                <div className="flex-1">
                    <TabsContent value="profile" className="mt-0">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update your personal information and photo.</CardDescription></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&auto=format" data-ai-hint="profile picture" />
                                            <AvatarFallback>DU</AvatarFallback>
                                        </Avatar>
                                        <Button variant="outline">Upload Photo</Button>
                                    </div>
                                    <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" defaultValue="Demo User" /></div>
                                    <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" defaultValue="user@example.com" disabled /></div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Change Password</CardTitle><CardDescription>Update your password. It&apos;s a good idea to use a strong, unique password.</CardDescription></CardHeader>
                                <CardContent>
                                    <form className="space-y-4">
                                        <div className="space-y-2"><Label htmlFor="current-password">Current Password</Label><Input id="current-password" type="password" /></div>
                                        <div className="space-y-2"><Label htmlFor="new-password">New Password</Label><Input id="new-password" type="password" /></div>
                                        <div className="space-y-2"><Label htmlFor="confirm-password">Confirm New Password</Label><Input id="confirm-password" type="password" /></div>
                                        <Button type="submit">Update Password</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="workspace" className="mt-0">
                         <Card>
                            <CardHeader><CardTitle>Workspace</CardTitle><CardDescription>Manage your workspace name and general settings.</CardDescription></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2"><Label htmlFor="workspace-name">Workspace Name</Label><Input id="workspace-name" defaultValue="Demo Workspace" /></div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="billing" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Manage Subscription</CardTitle>
                                <CardDescription>View your current plan, update payment details, and view billing history.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BillingForm />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="email" className="mt-0">
                        <div className="space-y-6">
                           <Card>
                                <CardHeader>
                                    <CardTitle>Sending Provider (SMTP)</CardTitle>
                                    <CardDescription>Connect to a service to send your emails. We recommend Amazon SES for deliverability.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="provider">Provider</Label>
                                        <Select defaultValue="ses">
                                            <SelectTrigger id="provider"><SelectValue placeholder="Select a provider" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ses">Amazon SES</SelectItem>
                                                <SelectItem value="sendgrid">SendGrid</SelectItem>
                                                <SelectItem value="mailgun">Mailgun</SelectItem>
                                                <SelectItem value="postmark">Postmark</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                     <div className="space-y-2"><Label htmlFor="api-key">API Key</Label><Input id="api-key" type="password" placeholder="••••••••••••••••••••••••" /></div>
                                     <div className="space-y-2"><Label htmlFor="region">AWS Region (if using SES)</Label><Input id="region" placeholder="e.g., us-east-1" /></div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader><CardTitle>Sending Defaults</CardTitle><CardDescription>Default settings for all outgoing campaigns.</CardDescription></CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="space-y-2"><Label htmlFor="from-name">&quot;From&quot; Name</Label><Input id="from-name" placeholder="Your Company Name" /></div>
                                     <div className="space-y-2"><Label htmlFor="from-email">&quot;From&quot; Email Address</Label><Input id="from-email" type="email" placeholder="hello@yourdomain.com" /></div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="domains" className="mt-0">
                        <CustomDomainManager />
                    </TabsContent>
                    <TabsContent value="social" className="mt-0">
                         <Card>
                            <CardHeader>
                                <CardTitle>Connect Social Accounts</CardTitle>
                                <CardDescription>Connect your social media profiles to start scheduling posts and managing conversations.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {connectedProfiles.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-semibold mb-3">Connected Accounts</h4>
                                    <div className="space-y-2">
                                       {connectedProfiles.map((profile) => {
                                         const IconComponent = Icons[profile.platformIcon as keyof typeof Icons] as React.ElementType;                                        return (
                                          <div key={profile.id} className="flex items-center justify-between rounded-lg border p-3 bg-green-50 border-green-200">
                                            <div className="flex items-center gap-3">
                                              <IconComponent className="h-5 w-5 text-green-600" />
                                              <div>
                                                <span className="font-medium text-sm">{profile.name}</span>
                                                <p className="text-xs text-blue-600">{profile.platform}</p>
                                              </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                                
                                <div>
                                  <h4 className="text-sm font-semibold mb-3">Available Platforms</h4>
                                  <div className="space-y-3">
                                    {socialPlatforms.map((platform) => {
                                         const IconComponent = Icons[platform.icon] as React.ElementType;
                                         const isConnected = connectedProfiles.some(p => p.platform === platform.name);
                                         return (
                                             <div key={platform.name} className="flex items-center justify-between rounded-lg border p-4">
                                                 <div className="flex items-center gap-3">
                                                     <IconComponent className={cn("h-6 w-6", platform.color)} />
                                                     <div>
                                                       <span className="font-medium">{platform.name}</span>
                                                        <p className="text-sm text-blue-600">
                                                          Connect your {platform.name} account for posting
                                                        </p>                                                     </div>
                                                 </div>
                                                  <Button 
                                                    variant={isConnected ? "secondary" : "outline"} 
                                                    onClick={() => handleConnect(platform)} 
                                                    disabled={isConnecting === platform.name || isConnected}
                                                  >
                                                      {isConnecting === platform.name && platform.realAuth && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                      {isConnected ? 'Connected' : 'Connect'}
                                                  </Button>                                             </div>
                                         )                                    })}
                                  </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                     <TabsContent value="api" className="mt-0">
                         <Card>
                            <CardHeader><CardTitle>API Keys</CardTitle><CardDescription>Enter your Google AI API key to enable AI-powered features.</CardDescription></CardHeader>
                            <CardContent>
                                <ApiKeySettings />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="team" className="mt-0">
                         <Card>
                            <CardHeader><CardTitle>Team Management</CardTitle><CardDescription>Invite and manage team members for your workspace.</CardDescription></CardHeader>
                            <CardContent>
                                <div className="text-center text-blue-600 border-2 border-dashed rounded-lg p-8">
                                    <p>You are the only member of this workspace.</p>
                                    <Button variant="outline" className="mt-4">Invite Team Member</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="ai-agents" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>AI Agents</CardTitle>
                                <CardDescription>Activate or deactivate AI agents for your workspace.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AgentToggles />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <div className="flex justify-end mt-6">
                        <Button onClick={handleSave}>Save All Changes</Button>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}


export default function SettingsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SettingsPageComponent />
        </Suspense>
    )
}
