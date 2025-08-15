
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useApiKey } from '@/context/ApiKeyContext'; // 1. Import the custom hook

// 2. The props interface is no longer needed.
// interface ApiKeyDialogProps { ... }

// 3. The function no longer accepts props.
export function ApiKeyDialog() {
  const [key, setKey] = useState('');
  const { toast } = useToast();

  // 4. Get the state and functions directly from our global context.
  const { isDialogOpen, setIsDialogOpen, setApiKey: saveApiKeyToContext } = useApiKey();

  const handleSave = () => {
    if (!key.trim()) {
      toast({
        variant: 'destructive',
        title: 'API Key Required',
        description: 'Please enter a valid Google AI API key to continue.',
      });
      return;
    }
    // 5. Call the context function to save the key globally.
    saveApiKeyToContext(key);

    toast({
      title: 'API Key Saved',
      description: 'Your Google AI API key has been saved locally for future use.',
    });

    // 6. Use the context function to close the dialog.
    setIsDialogOpen(false);
  };

  // 7. The dialog's visibility is now controlled by the global context state.
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Your API Key</DialogTitle>
          <DialogDescription>
            To use the AI tools, please provide your own Google AI API key. Your key is stored securely in your browser and is never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Google AI API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your API key"
            />
          </div>
           <p className="text-xs text-blue-600">
              You can get a free API key from {' '}
              <Link href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">
                 Google AI Studio
              </Link>.
            </p>
        </div>
        <DialogFooter>
           <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}