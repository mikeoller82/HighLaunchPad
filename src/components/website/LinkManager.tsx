'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Link, 
  ExternalLink, 
  Mail, 
  Phone, 
  Download, 
  Anchor, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  Eye, 
  Target,
  Globe,
  FileText,
  Image as ImageIcon,
  Video,
  ShoppingCart,
  Calendar,
  MapPin,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  type: 'internal' | 'external' | 'email' | 'phone' | 'download' | 'anchor';
  target: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
  tracking?: {
    enabled: boolean;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
  };
  styling?: {
    color: string;
    hoverColor: string;
    underline: boolean;
    bold: boolean;
    italic: boolean;
  };
  conditions?: {
    showOnMobile: boolean;
    showOnTablet: boolean;
    showOnDesktop: boolean;
    requireAuth: boolean;
  };
}

interface LinkManagerProps {
  links: LinkItem[];
  onLinksChange: (links: LinkItem[]) => void;
}

// Link Type Templates
const LINK_TYPES = [
  { 
    type: 'internal', 
    icon: Link, 
    label: 'Internal Page', 
    description: 'Link to another page on your site',
    urlPlaceholder: '/about-us'
  },
  { 
    type: 'external', 
    icon: ExternalLink, 
    label: 'External URL', 
    description: 'Link to another website',
    urlPlaceholder: 'https://example.com'
  },
  { 
    type: 'email', 
    icon: Mail, 
    label: 'Email Address', 
    description: 'Open email client',
    urlPlaceholder: 'contact@example.com'
  },
  { 
    type: 'phone', 
    icon: Phone, 
    label: 'Phone Number', 
    description: 'Call phone number',
    urlPlaceholder: '+1-555-123-4567'
  },
  { 
    type: 'download', 
    icon: Download, 
    label: 'File Download', 
    description: 'Download a file',
    urlPlaceholder: '/files/document.pdf'
  },
  { 
    type: 'anchor', 
    icon: Anchor, 
    label: 'Page Anchor', 
    description: 'Jump to section on same page',
    urlPlaceholder: '#section-id'
  },
];

// Common Internal Pages
const INTERNAL_PAGES = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/services', label: 'Services' },
  { path: '/products', label: 'Products' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/testimonials', label: 'Testimonials' },
  { path: '/faq', label: 'FAQ' },
  { path: '/privacy', label: 'Privacy Policy' },
  { path: '/terms', label: 'Terms of Service' },
];

// Link Editor Component
const LinkEditor = ({ 
  link, 
  onUpdate, 
  onDelete 
}: { 
  link: LinkItem; 
  onUpdate: (link: LinkItem) => void; 
  onDelete: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateLink = (updates: Partial<LinkItem>) => {
    onUpdate({ ...link, ...updates });
  };

  const updateTracking = (tracking: Partial<LinkItem['tracking']>) => {
    onUpdate({ 
      ...link, 
      tracking: { 
        enabled: false,
        ...link.tracking, 
        ...tracking 
      } 
    });
  };

  const updateStyling = (styling: Partial<LinkItem['styling']>) => {
    onUpdate({ 
      ...link, 
      styling: { 
        color: '#3b82f6',
        hoverColor: '#1d4ed8',
        underline: false,
        bold: false,
        italic: false,
        ...link.styling, 
        ...styling 
      } 
    });
  };

  const updateConditions = (conditions: Partial<LinkItem['conditions']>) => {
    onUpdate({ 
      ...link, 
      conditions: { 
        showOnMobile: true,
        showOnTablet: true,
        showOnDesktop: true,
        requireAuth: false,
        ...link.conditions, 
        ...conditions 
      } 
    });
  };

  const getTypeIcon = () => {
    const typeConfig = LINK_TYPES.find(t => t.type === link.type);
    return typeConfig?.icon || Link;
  };

  const TypeIcon = getTypeIcon();

  const formatUrl = (url: string, type: string) => {
    switch (type) {
      case 'email':
        return url.startsWith('mailto:') ? url : `mailto:${url}`;
      case 'phone':
        return url.startsWith('tel:') ? url : `tel:${url}`;
      case 'anchor':
        return url.startsWith('#') ? url : `#${url}`;
      default:
        return url;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TypeIcon className="h-5 w-5 text-blue-700" />
            <div>
              <CardTitle className="text-sm">{link.label || 'Untitled Link'}</CardTitle>
              <p className="text-xs text-blue-600">{link.url}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {link.type}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
              <TabsTrigger value="styling">Styling</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label>Link Text</Label>
                <Input
                  value={link.label}
                  onChange={(e) => updateLink({ label: e.target.value })}
                  placeholder="Click here"
                />
              </div>
              
              <div>
                <Label>Link Type</Label>
                <Select 
                  value={link.type} 
                  onValueChange={(value) => updateLink({ type: value as LinkItem['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LINK_TYPES.map((type) => (
                      <SelectItem key={type.type} value={type.type}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>URL / Destination</Label>
                {link.type === 'internal' ? (
                  <Select 
                    value={link.url} 
                    onValueChange={(value) => updateLink({ url: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a page" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERNAL_PAGES.map((page) => (
                        <SelectItem key={page.path} value={page.path}>
                          {page.label} ({page.path})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={link.url}
                    onChange={(e) => updateLink({ url: formatUrl(e.target.value, link.type) })}
                    placeholder={LINK_TYPES.find(t => t.type === link.type)?.urlPlaceholder}
                  />
                )}
              </div>
              
              <div>
                <Label>Open In</Label>
                <Select 
                  value={link.target} 
                  onValueChange={(value) => updateLink({ target: value as LinkItem['target'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_self">Same Window</SelectItem>
                    <SelectItem value="_blank">New Window/Tab</SelectItem>
                    <SelectItem value="_parent">Parent Frame</SelectItem>
                    <SelectItem value="_top">Full Window</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Rel Attribute</Label>
                <Input
                  value={link.rel || ''}
                  onChange={(e) => updateLink({ rel: e.target.value })}
                  placeholder="nofollow, noopener, noreferrer"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="tracking" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable UTM Tracking</Label>
                <Switch
                  checked={link.tracking?.enabled || false}
                  onCheckedChange={(checked) => updateTracking({ enabled: checked })}
                />
              </div>
              
              {link.tracking?.enabled && (
                <>
                  <div>
                    <Label>UTM Source</Label>
                    <Input
                      value={link.tracking?.utmSource || ''}
                      onChange={(e) => updateTracking({ utmSource: e.target.value })}
                      placeholder="google, facebook, newsletter"
                    />
                  </div>
                  <div>
                    <Label>UTM Medium</Label>
                    <Input
                      value={link.tracking?.utmMedium || ''}
                      onChange={(e) => updateTracking({ utmMedium: e.target.value })}
                      placeholder="cpc, email, social"
                    />
                  </div>
                  <div>
                    <Label>UTM Campaign</Label>
                    <Input
                      value={link.tracking?.utmCampaign || ''}
                      onChange={(e) => updateTracking({ utmCampaign: e.target.value })}
                      placeholder="summer_sale, product_launch"
                    />
                  </div>
                  <div>
                    <Label>UTM Term</Label>
                    <Input
                      value={link.tracking?.utmTerm || ''}
                      onChange={(e) => updateTracking({ utmTerm: e.target.value })}
                      placeholder="keyword, search_term"
                    />
                  </div>
                  <div>
                    <Label>UTM Content</Label>
                    <Input
                      value={link.tracking?.utmContent || ''}
                      onChange={(e) => updateTracking({ utmContent: e.target.value })}
                      placeholder="banner_ad, text_link"
                    />
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="styling" className="space-y-4">
              <div>
                <Label>Link Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded border cursor-pointer"
                    style={{ backgroundColor: link.styling?.color || '#3b82f6' }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'color';
                      input.value = link.styling?.color || '#3b82f6';
                      input.onchange = (e) => updateStyling({ 
                        color: (e.target as HTMLInputElement).value 
                      });
                      input.click();
                    }}
                  />
                  <Input
                    value={link.styling?.color || '#3b82f6'}
                    onChange={(e) => updateStyling({ color: e.target.value })}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              
              <div>
                <Label>Hover Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded border cursor-pointer"
                    style={{ backgroundColor: link.styling?.hoverColor || '#1d4ed8' }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'color';
                      input.value = link.styling?.hoverColor || '#1d4ed8';
                      input.onchange = (e) => updateStyling({ 
                        hoverColor: (e.target as HTMLInputElement).value 
                      });
                      input.click();
                    }}
                  />
                  <Input
                    value={link.styling?.hoverColor || '#1d4ed8'}
                    onChange={(e) => updateStyling({ hoverColor: e.target.value })}
                    placeholder="#1d4ed8"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Underline</Label>
                <Switch
                  checked={link.styling?.underline || false}
                  onCheckedChange={(checked) => updateStyling({ underline: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Bold</Label>
                <Switch
                  checked={link.styling?.bold || false}
                  onCheckedChange={(checked) => updateStyling({ bold: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Italic</Label>
                <Switch
                  checked={link.styling?.italic || false}
                  onCheckedChange={(checked) => updateStyling({ italic: checked })}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="conditions" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Show on Mobile</Label>
                <Switch
                  checked={link.conditions?.showOnMobile !== false}
                  onCheckedChange={(checked) => updateConditions({ showOnMobile: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Show on Tablet</Label>
                <Switch
                  checked={link.conditions?.showOnTablet !== false}
                  onCheckedChange={(checked) => updateConditions({ showOnTablet: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Show on Desktop</Label>
                <Switch
                  checked={link.conditions?.showOnDesktop !== false}
                  onCheckedChange={(checked) => updateConditions({ showOnDesktop: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Require Authentication</Label>
                <Switch
                  checked={link.conditions?.requireAuth || false}
                  onCheckedChange={(checked) => updateConditions({ requireAuth: checked })}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};

// Link Preview Component
const LinkPreview = ({ link }: { link: LinkItem }) => {
  const TypeIcon = LINK_TYPES.find(t => t.type === link.type)?.icon || Link;
  
  const buildUrl = () => {
    let url = link.url;
    
    if (link.tracking?.enabled && link.type !== 'email' && link.type !== 'phone') {
      const params = new URLSearchParams();
      if (link.tracking.utmSource) params.set('utm_source', link.tracking.utmSource);
      if (link.tracking.utmMedium) params.set('utm_medium', link.tracking.utmMedium);
      if (link.tracking.utmCampaign) params.set('utm_campaign', link.tracking.utmCampaign);
      if (link.tracking.utmTerm) params.set('utm_term', link.tracking.utmTerm);
      if (link.tracking.utmContent) params.set('utm_content', link.tracking.utmContent);
      
      if (params.toString()) {
        url += (url.includes('?') ? '&' : '?') + params.toString();
      }
    }
    
    return url;
  };

  return (
    <div className="p-4 border rounded-lg bg-blue-50">
      <div className="flex items-center gap-2 mb-2">
        <TypeIcon className="h-4 w-4 text-blue-700" />
        <span className="text-sm font-medium">Link Preview</span>
      </div>
      
      <a
        href={buildUrl()}
        target={link.target}
        rel={link.rel}
        className={cn(
          "inline-block transition-colors",
          link.styling?.underline && "underline",
          link.styling?.bold && "font-bold",
          link.styling?.italic && "italic"
        )}
        style={{
          color: link.styling?.color || '#3b82f6',
        }}
        onMouseEnter={(e) => {
          if (link.styling?.hoverColor) {
            e.currentTarget.style.color = link.styling.hoverColor;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = link.styling?.color || '#3b82f6';
        }}
      >
        {link.label || 'Link Text'}
      </a>
      
      <div className="mt-2 text-xs text-blue-600">
        <p>URL: {buildUrl()}</p>
        <p>Target: {link.target}</p>
        {link.rel && <p>Rel: {link.rel}</p>}
      </div>
    </div>
  );
};

export const LinkManager: React.FC<LinkManagerProps> = ({ links, onLinksChange }) => {
  const [activeTab, setActiveTab] = useState('links');

  const addLink = (type: LinkItem['type']) => {
    const newLink: LinkItem = {
      id: `link_${Date.now()}`,
      label: 'New Link',
      url: '',
      type,
      target: type === 'external' ? '_blank' : '_self',
      tracking: {
        enabled: false as const
      },
      styling: {
        color: '#3b82f6' as const,
        hoverColor: '#1d4ed8' as const,
        underline: false as const,
        bold: false as const,
        italic: false as const
      },
      conditions: {
        showOnMobile: true as const,
        showOnTablet: true as const,
        showOnDesktop: true as const,
        requireAuth: false as const
      }
    };
    
    onLinksChange([...links, newLink]);
  };

  const updateLink = (index: number, updatedLink: LinkItem) => {
    const newLinks = [...links];
    newLinks[index] = updatedLink;
    onLinksChange(newLinks);
  };

  const deleteLink = (index: number) => {
    onLinksChange(links.filter((_, i) => i !== index));
  };

  const duplicateLink = (index: number) => {
    const link = links[index];
    const newLink: LinkItem = {
      ...link,
      id: `link_${Date.now()}`,
      label: `${link.label} (Copy)`
    };
    onLinksChange([...links.slice(0, index + 1), newLink, ...links.slice(index + 1)]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Link Manager</h3>
        <p className="text-sm text-blue-700">Manage all links and navigation</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="flex-1 p-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Add New Link</h4>
              <div className="grid grid-cols-2 gap-2">
                {LINK_TYPES.map((linkType) => {
                  const IconComponent = linkType.icon;
                  return (
                    <Button
                      key={linkType.type}
                      variant="outline"
                      size="sm"
                      onClick={() => addLink(linkType.type as LinkItem['type'])}
                      className="flex items-center gap-2 h-auto p-3"
                    >
                      <IconComponent className="h-4 w-4" />
                      <div className="text-left">
                        <div className="text-xs font-medium">{linkType.label}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Existing Links</h4>
              <ScrollArea className="h-96">
                {links.length === 0 ? (
                  <div className="text-center text-blue-600 py-8">
                    <Link className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No links created yet</p>
                    <p className="text-sm">Click a link type above to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {links.map((link, index) => (
                      <div key={link.id}>
                        <LinkEditor
                          link={link}
                          onUpdate={(updatedLink) => updateLink(index, updatedLink)}
                          onDelete={() => deleteLink(index)}
                        />
                        <LinkPreview link={link} />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="flex-1 p-4">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Link Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-blue-600 py-8">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Link analytics coming soon</p>
                  <p className="text-sm">Track clicks, conversions, and performance</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};