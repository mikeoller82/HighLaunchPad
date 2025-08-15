import type { ComponentType, ComponentContent, ComponentDesign } from './types';

export interface Block {
  id: string;
  name: string;
  description: string;
  category: BlockCategory;
  type: ComponentType;
  thumbnail: string;
  content: ComponentContent;
  design?: ComponentDesign;
  tags: string[];
  isCustom?: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  usageCount?: number;
  rating?: number;
  featured?: boolean;
}

export type BlockCategory = 
  | 'headers'
  | 'heroes' 
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'footers'
  | 'cta'
  | 'content'
  | 'forms'
  | 'media'
  | 'navigation'
  | 'social'
  | 'custom';

export interface BlockCollection {
  id: string;
  name: string;
  description: string;
  blocks: Block[];
  category: BlockCategory;
  featured?: boolean;
}

export interface UserBlock extends Block {
  workspaceId: string;
  isPrivate: boolean;
  sharedWith?: string[];
}

export interface BlocksFilter {
  category?: BlockCategory;
  tags?: string[];
  search?: string;
  featured?: boolean;
  custom?: boolean;
}

export interface BlocksResponse {
  blocks: Block[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}