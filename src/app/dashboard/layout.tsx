// /src/app/dashboard/layout.tsx

'use client';

import type React from 'react';
import { useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { OptimizedLink } from '@/components/ui/optimized-link';
import { useBrowserNavigation } from '@/hooks/use-browser-navigation';
import { signOut } from 'firebase/auth';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    LayoutDashboard, Link as LinkIcon, Filter, Mail, Users, Settings, HelpCircle, Search, Bell, BrainCircuit, FileText, Workflow, ClipboardList, Globe, Newspaper, Mails, BookText, LogOut, Loader2, Share2, MessagesSquare, GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { NotificationProvider } from '@/components/ui/notification-system';
// Note: ApiKeyProvider is already in the root layout, so it's not needed here.

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/ai-agents', icon: BrainCircuit, label: 'AI Agents' },
    { href: '/dashboard/links', icon: LinkIcon, label: 'Affiliate Links' },
    { href: '/dashboard/affiliate-program', icon: Users, label: 'Affiliate Program' },
    { href: '/dashboard/funnels', icon: Filter, label: 'Funnels' },
    { href: '/dashboard/websites', icon: Globe, label: 'Websites' },
    { href: '/dashboard/courses', icon: GraduationCap, label: 'Courses' },
    { href: '/dashboard/blog', icon: Newspaper, label: 'Blog' },
    { href: '/dashboard/newsletter', icon: Mails, label: 'Newsletters' },
    { href: '/dashboard/social-scheduler', icon: Share2, label: 'Social Scheduler' },
    { href: '/dashboard/docs', icon: BookText, label: 'Docs' },
    { href: '/dashboard/notion-pad', icon: FileText, label: 'NotionPad' },
    { href: '/dashboard/forms', icon: ClipboardList, label: 'Forms' },
    { href: '/dashboard/crm', icon: Users, label: 'CRM' },
    { href: '/dashboard/conversations', icon: MessagesSquare, label: 'Conversations' },
    { href: '/dashboard/email', icon: Mail, label: 'Email Marketing' },
    { href: '/dashboard/automations', icon: Workflow, label: 'Automations' },
    { href: '/dashboard/ai-tools', icon: BrainCircuit, label: 'AI Tools' },
];

function MainContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    const pageTitle = useMemo(() => {
        if (!pathname) return 'Dashboard';
        if (pathname.startsWith('/dashboard/settings')) return 'Settings';
        for (const item of navItems) {
             if (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))) {
                return item.label;
            }
        }
        return 'Dashboard';
    }, [pathname]);
    
    const isBuilderPage = useMemo(() => 
        pathname ? (/^\/dashboard\/(funnels|websites|automations|forms|blog|newsletter|docs|notion-pad|courses)\/(\w|\d)/.test(pathname) || pathname === '/dashboard/notion-pad') : false,
        [pathname]
    );

    return (
        <div className="flex flex-col h-screen bg-white">
            <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b bg-gradient-to-r from-white to-gray-50/50 px-6 shadow-interactive">
                <SidebarTrigger className="md:hidden"/>
                <div className="flex-1">
                    <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                        <Input placeholder="Search..." className="w-full bg-background pl-9 md:w-64" />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                </div>
            </header>
            <main className={cn("flex-1 overflow-y-auto", !isBuilderPage && "p-6")}>{children}</main>
        </div>
    );
}

function AppSidebar() {
    const pathname = usePathname();
    const { user, auth } = useAuth();
    const { toast } = useToast();

    const handleSignOut = useCallback(async () => {
        if (!auth) return;
        try {
            await fetch('/api/auth/session-logout', { method: 'POST' });
            await signOut(auth);
            toast({ title: "Signed Out", description: "You have been successfully signed out." });
        } catch (error) {
            console.error("Error signing out:", error);
            toast({ variant: 'destructive', title: "Error", description: "Failed to sign out." });
        }
    }, [auth, toast]);
    
    const isActive = useCallback((href: string) => {
        if (!pathname) return false;
        if (href === '/dashboard') return pathname === href;
        return pathname.startsWith(href);
    }, [pathname]);

    return (
        <Sidebar>
            <SidebarHeader className="p-4 border-b">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="p-1 bg-transparent rounded-lg">
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/firebase-veilnet.firebasestorage.app/o/Default_A_cuttingedge_HighlaunchPadAIpowered_CRM_logo_exuding__0.jpg?alt=media&token=65b41f51-fd64-4aef-9580-736d2f3f14f4"
                            alt="HighLaunchPad AI CRM Logo"
                            width={32} height={32} className="rounded-md"
                        />
                    </div>
                    <h1 className="text-xl font-semibold text-foreground">HighLaunchPad</h1>
                </Link>
            </SidebarHeader>
            <SidebarContent className="p-4">
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{children: item.label}}>
                                <OptimizedLink href={item.href} prefetch={true}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </OptimizedLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
                

            </SidebarContent>
            <SidebarFooter className="mt-auto border-t p-4 space-y-4">
                 <SidebarMenu>
                    <SidebarMenuItem>
                         <SidebarMenuButton asChild isActive={isActive('/dashboard/support')} tooltip={{children: 'Support'}}>
                             <Link href="/dashboard/support">
                                 <HelpCircle />
                                 <span>Support</span>
                             </Link>
                         </SidebarMenuButton>                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/dashboard/settings')} tooltip={{children: 'Settings'}}>
                            <Link href="/dashboard/settings">
                                <Settings />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="p-2 rounded-lg">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.photoURL || undefined} />
                            <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                            <p className="font-semibold text-sm truncate">{user?.displayName || 'User'}</p>
                            <p className="text-xs text-blue-600 truncate">{user?.email}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleSignOut} className="group-data-[collapsible=icon]:hidden">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { navigateWithState } = useBrowserNavigation();

    useEffect(() => {
        if (!loading && !user) {
            navigateWithState('/login', { replace: true, preserveScroll: false });
        }
    }, [user, loading, navigateWithState]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!user) {
        return null;
    }

    return (
        // The ApiKeyProvider is now in the root layout, so it doesn't need to be here.
        <NotificationProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <MainContent>{children}</MainContent>
                </SidebarInset>
            </SidebarProvider>
        </NotificationProvider>
    );
}