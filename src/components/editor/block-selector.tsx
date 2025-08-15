"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import type { Block, BlockCategory, BlocksResponse } from '@/lib/blocks-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search, PlusCircle, Star, User } from 'lucide-react';
import Image from 'next/image';

interface BlockSelectorProps {
  onSelectBlock: (block: Block) => void;
}

export function BlockSelector({ onSelectBlock }: BlockSelectorProps) {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [customBlocks, setCustomBlocks] = useState<Block[]>([]);

  const fetchBlocks = useCallback(async (category: string, search: string, custom: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '100',
        category: category === 'all' ? '' : category,
        search,
        custom: String(custom)
      });
      
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`/api/blocks?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch blocks');
      }
      const data: BlocksResponse = await response.json();
      
      if (custom) {
        setCustomBlocks(data.blocks);
      } else {
        setBlocks(data.blocks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'custom') {
      fetchBlocks('', searchQuery, true);
    } else {
      fetchBlocks(activeTab, searchQuery, false);
    }
  }, [activeTab, searchQuery, fetchBlocks]);

  const filteredBlocks = useMemo(() => {
    const source = activeTab === 'custom' ? customBlocks : blocks;
    return source.filter(block => 
      (block.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (block.tags && block.tags.some(tag => tag?.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [searchQuery, blocks, customBlocks, activeTab]);

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Add Block</h3>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <div className="px-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              <Star className="h-4 w-4 mr-2" />
              Pre-built
            </TabsTrigger>
            <TabsTrigger value="custom">
              <User className="h-4 w-4 mr-2" />
              Custom
            </TabsTrigger>
            <TabsTrigger value="new">
              <PlusCircle className="h-4 w-4 mr-2" />
              New
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="flex-grow overflow-hidden">
          <BlockGrid blocks={filteredBlocks} onSelectBlock={onSelectBlock} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="custom" className="flex-grow overflow-hidden">
          <BlockGrid blocks={filteredBlocks} onSelectBlock={onSelectBlock} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="new" className="p-4 text-center">
          <p className="text-muted-foreground">Create a new reusable block from any component on your page.</p>
          <Button className="mt-4">Learn How</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface BlockGridProps {
  blocks: Block[];
  onSelectBlock: (block: Block) => void;
  isLoading: boolean;
}

function BlockGrid({ blocks, onSelectBlock, isLoading }: BlockGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No blocks found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-2 gap-2 p-4">
        {blocks.map((block) => (
          <div
            key={block.id}
            className="relative group cursor-pointer border rounded-md overflow-hidden"
            onClick={() => onSelectBlock(block)}
          >
            <Image
              src={block.thumbnail}
              alt={block.name}
              width={200}
              height={150}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-semibold text-center p-2">{block.name}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}