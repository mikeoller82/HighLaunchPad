'use client';

import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/40">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 py-12 text-sm">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <ImageWithFallback
              src="https://cdn.leonardo.ai/users/31a55a1b-10c8-4725-a4ad-b72817f069e1/generations/39ccab2d-4951-448b-b285-ccef2b6f670a/segments/1:1:1/Default_A_cuttingedge_HighlaunchPadAIpowered_CRM_logo_exuding__0.jpg"
              alt="HighLaunchPad Logo"
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="font-bold">HighLaunchPad</span>
          </Link>
          <p className="text-muted-foreground">The all-in-one platform to launch, automate, and scale your business.</p>
          <p className="text-muted-foreground" suppressHydrationWarning>© {new Date().getFullYear()} HighLaunchPad. All rights reserved.</p>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold">Product</h4>
          <Link href="#features" className="block text-muted-foreground hover:text-foreground">Features</Link>
          <Link href="#pricing" className="block text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link href="#ai-spotlight" className="block text-muted-foreground hover:text-foreground">AI Tools</Link>
          <Link href="/login" className="block text-muted-foreground hover:text-foreground">Login</Link>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold">Company</h4>
          <Link href="#" className="block text-muted-foreground hover:text-foreground">About Us</Link>
          <Link href="#" className="block text-muted-foreground hover:text-foreground">Careers</Link>
          <Link href="#" className="block text-muted-foreground hover:text-foreground">Contact</Link>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold">Legal</h4>
          <Link href="/privacy" className="block text-muted-foreground hover:text-foreground">Privacy Policy</Link>
          <Link href="#" className="block text-muted-foreground hover:text-foreground">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
