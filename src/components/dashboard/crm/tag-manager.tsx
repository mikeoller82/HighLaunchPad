'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  Hash,
  Zap,
  Target,
  Filter,
  Search,
  MoreHorizontal,
  Settings,
  Palette
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  writeBatch,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tag as TagType, TagCategory, AutoTagRule, AutoTagCondition } from "@/lib/crm-types";

interface TagManagerProps {
  onTagsChange?: (tags: TagType[]) => void;
  selectedTags?: string[];
  onTagSelect?: (tagId: string) => void;
  mode?: 'manage' | 'select';
}

const TAG_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E', '#6B7280', '#374151', '#1F2937'
];

const TAG_CATEGORIES: TagCategory[] = [
  TagCategory.LEAD_SOURCE,
  TagCategory.INDUSTRY,
  TagCategory.COMPANY_SIZE,
  TagCategory.PRIORITY,
  TagCategory.STATUS,
  TagCategory.BEHAVIOR,
  TagCategory.CUSTOM
];

export function TagManager({ onTagsChange, selectedTags = [], onTagSelect, mode = 'manage' }: TagManagerProps) {
  const [tags, setTags] = useState<TagType[]>([]);
  const [autoTagRules, setAutoTagRules] = useState<AutoTagRule[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRuleOpen, setIsRuleOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TagCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const [newTag, setNewTag] = useState({
    name: '',
    description: '',
    color: TAG_COLORS[0],
    category: TagCategory.CUSTOM,
    isActive: true
  });

  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    conditions: [
      {
        field: 'source',
        operator: 'equals' as const,
        value: ''
      }
    ] as AutoTagCondition[],
    tagIds: [] as string[],
    isActive: true
  });

  // Load tags from Firestore
  useEffect(() => {
    if (!user) return;

    const tagsRef = collection(db, 'tags');
    const q = query(
      tagsRef,
      where('userId', '==', user.uid),
      orderBy('name', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tagData: TagType[] = [];
      snapshot.forEach((doc) => {
        tagData.push({ id: doc.id, ...doc.data() } as TagType);
      });
      
      setTags(tagData);
      onTagsChange?.(tagData);
    });

    return () => unsubscribe();
  }, [user, onTagsChange]);

  // Load auto-tag rules
  useEffect(() => {
    if (!user) return;

    const rulesRef = collection(db, 'autoTagRules');
    const q = query(
      rulesRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ruleData: AutoTagRule[] = [];
      snapshot.forEach((doc) => {
        ruleData.push({ id: doc.id, ...doc.data() } as AutoTagRule);
      });
      
      setAutoTagRules(ruleData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const tagData: Omit<TagType, 'id'> = {
        name: newTag.name,
        description: newTag.description,
        color: newTag.color,
        category: newTag.category,
        isActive: newTag.isActive,
        userId: user.uid,
        usageCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'tags'), tagData);
      
      toast({
        title: "Tag Created",
        description: `${newTag.name} has been created successfully.`
      });

      setNewTag({
        name: '',
        description: '',
        color: TAG_COLORS[0],
        category: TagCategory.CUSTOM,
        isActive: true
      });
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create tag. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingTag) return;

    setIsLoading(true);
    try {
      const tagRef = doc(db, 'tags', editingTag.id);
      await updateDoc(tagRef, {
        name: editingTag.name,
        description: editingTag.description,
        color: editingTag.color,
        category: editingTag.category,
        isActive: editingTag.isActive,
        updatedAt: serverTimestamp()
      });

      toast({
        title: "Tag Updated",
        description: `${editingTag.name} has been updated successfully.`
      });

      setIsEditOpen(false);
      setEditingTag(null);
    } catch (error) {
      console.error('Error updating tag:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tag. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'tags', tagId));
      
      toast({
        title: "Tag Deleted",
        description: "Tag has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete tag. Please try again."
      });
    }
  };

  const handleCreateAutoTagRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const ruleData: Omit<AutoTagRule, 'id'> = {
        name: newRule.name,
        description: newRule.description,
        conditions: newRule.conditions,
        tagIds: newRule.tagIds,
        isActive: newRule.isActive,
        userId: user.uid,
        triggerCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'autoTagRules'), ruleData);
      
      toast({
        title: "Auto-Tag Rule Created",
        description: `${newRule.name} has been created successfully.`
      });

      setNewRule({
        name: '',
        description: '',
        conditions: [{ field: 'source', operator: 'equals', value: '' }],
        tagIds: [],
        isActive: true
      });
      setIsRuleOpen(false);
    } catch (error) {
      console.error('Error creating auto-tag rule:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create auto-tag rule. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tag.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tag.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: TagCategory) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (mode === 'select') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filteredTags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              style={{
                backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'transparent',
                borderColor: tag.color,
                color: selectedTags.includes(tag.id) ? 'white' : tag.color
              }}
              onClick={() => onTagSelect?.(tag.id)}
            >
              <Tag className="mr-1 h-3 w-3" />
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Tag Management</h2>
          <p className="text-sm text-gray-600">Organize and categorize your contacts</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isRuleOpen} onOpenChange={setIsRuleOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Zap className="mr-2 h-4 w-4" />
                Auto-Tag Rules
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Auto-Tag Rule</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateAutoTagRule} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rule-name">Rule Name</Label>
                    <Input
                      id="rule-name"
                      value={newRule.name}
                      onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enterprise Leads"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rule-description">Description</Label>
                    <Input
                      id="rule-description"
                      value={newRule.description}
                      onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Auto-tag enterprise leads"
                    />
                  </div>
                </div>

                <div>
                  <Label>Conditions</Label>
                  <div className="space-y-2 mt-2">
                    {newRule.conditions.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                        <Select
                          value={condition.field}
                          onValueChange={(value) => {
                            const updatedConditions = [...newRule.conditions];
                            updatedConditions[index] = { ...condition, field: value };
                            setNewRule(prev => ({ ...prev, conditions: updatedConditions }));
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="source">Source</SelectItem>
                            <SelectItem value="company">Company</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="value">Deal Value</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select
                          value={condition.operator}
                          onValueChange={(value) => {
                            const updatedConditions = [...newRule.conditions];
                            updatedConditions[index] = { ...condition, operator: value as 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' };
                            setNewRule(prev => ({ ...prev, conditions: updatedConditions }));
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="starts_with">Starts With</SelectItem>
                            <SelectItem value="greater_than">Greater Than</SelectItem>
                            <SelectItem value="less_than">Less Than</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Input
                          value={condition.value}
                          onChange={(e) => {
                            const updatedConditions = [...newRule.conditions];
                            updatedConditions[index] = { ...condition, value: e.target.value };
                            setNewRule(prev => ({ ...prev, conditions: updatedConditions }));
                          }}
                          placeholder="Value"
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Tags to Apply</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={newRule.tagIds.includes(tag.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        style={{
                          backgroundColor: newRule.tagIds.includes(tag.id) ? tag.color : 'transparent',
                          borderColor: tag.color,
                          color: newRule.tagIds.includes(tag.id) ? 'white' : tag.color
                        }}
                        onClick={() => {
                          const updatedTagIds = newRule.tagIds.includes(tag.id)
                            ? newRule.tagIds.filter(id => id !== tag.id)
                            : [...newRule.tagIds, tag.id];
                          setNewRule(prev => ({ ...prev, tagIds: updatedTagIds }));
                        }}
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsRuleOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Rule'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Tag</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTag} className="space-y-4">
                <div>
                  <Label htmlFor="name">Tag Name</Label>
                  <Input
                    id="name"
                    value={newTag.name}
                    onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Hot Lead"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTag.description}
                    onChange={(e) => setNewTag(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="High-priority leads requiring immediate attention"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newTag.category} onValueChange={(value: TagCategory) => setNewTag(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TAG_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {getCategoryLabel(category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={newTag.color}
                        onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                        className="w-16"
                      />
                      <div className="flex flex-wrap gap-1">
                        {TAG_COLORS.slice(0, 8).map((color) => (
                          <button
                            key={color}
                            type="button"
                            className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400"
                            style={{ backgroundColor: color }}
                            onClick={() => setNewTag(prev => ({ ...prev, color }))}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Tag'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={(value: TagCategory | 'all') => setSelectedCategory(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {TAG_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {getCategoryLabel(category)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTags.map((tag) => (
          <Card key={tag.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: tag.color }}
                  />
                  <h4 className="font-medium">{tag.name}</h4>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingTag(tag);
                      setIsEditOpen(true);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTag(tag.id)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {tag.description && (
                <p className="text-sm text-gray-600 mb-2">{tag.description}</p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <Badge variant="outline" className="text-xs">
                  {getCategoryLabel(tag.category)}
                </Badge>
                <span>{tag.usageCount || 0} uses</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Auto-Tag Rules */}
      {autoTagRules.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-4">Auto-Tag Rules</h3>
          <div className="space-y-3">
            {autoTagRules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        <h4 className="font-medium">{rule.name}</h4>
                        {!rule.isActive && (
                          <Badge variant="outline" className="text-xs">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{rule.conditions.length} condition{rule.conditions.length > 1 ? 's' : ''}</span>
                        <span>{rule.tagIds.length} tag{rule.tagIds.length > 1 ? 's' : ''}</span>
                        <span>{rule.triggerCount || 0} triggers</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={async (checked) => {
                          try {
                            const ruleRef = doc(db, 'autoTagRules', rule.id);
                            await updateDoc(ruleRef, { isActive: checked });
                          } catch (error) {
                            console.error('Error updating rule:', error);
                          }
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDoc(doc(db, 'autoTagRules', rule.id))}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Edit Tag Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          {editingTag && (
            <form onSubmit={handleEditTag} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Tag Name</Label>
                <Input
                  id="edit-name"
                  value={editingTag.name}
                  onChange={(e) => setEditingTag(prev => prev ? { ...prev, name: e.target.value } : null)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingTag.description || ''}
                  onChange={(e) => setEditingTag(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={editingTag.category} 
                    onValueChange={(value: TagCategory) => setEditingTag(prev => prev ? { ...prev, category: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TAG_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {getCategoryLabel(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-color">Color</Label>
                  <Input
                    type="color"
                    value={editingTag.color}
                    onChange={(e) => setEditingTag(prev => prev ? { ...prev, color: e.target.value } : null)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingTag.isActive}
                  onCheckedChange={(checked) => setEditingTag(prev => prev ? { ...prev, isActive: checked } : null)}
                />
                <Label>Active</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Tag'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}