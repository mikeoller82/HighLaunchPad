"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Smartphone, Tablet, X } from 'lucide-react';

interface LivePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  backgroundColor?: string;
}

export function LivePreview({ isOpen, onClose, title, children, backgroundColor = '#ffffff' }: LivePreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getDeviceStyles = () => {
    switch (device) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Preview: {title}</DialogTitle>
          <div className="flex items-center gap-2">
            <Tabs value={device} onValueChange={(value) => setDevice(value as any)}>
              <TabsList>
                <TabsTrigger value="desktop" className="p-2">
                  <Monitor className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="tablet" className="p-2">
                  <Tablet className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="mobile" className="p-2">
                  <Smartphone className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden p-4">
          <div 
            className="border rounded-lg overflow-auto shadow-lg transition-all duration-300 w-full h-full"
            style={{ ...getDeviceStyles(), backgroundColor }}
          >
            <div className="w-full h-full overflow-auto prose dark:prose-invert max-w-none">
              {children}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}