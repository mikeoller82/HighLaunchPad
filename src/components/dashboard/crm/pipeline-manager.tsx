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
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  GitBranch, 
  ArrowRight,
  GripVertical,
  MoreHorizontal,
  Target,
  DollarSign,
  Clock,
  Users
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
import { Pipeline as PipelineType, PipelineStage } from "@/lib/crm-types";

interface PipelineManagerProps {
  onPipelineChange?: (pipeline: PipelineType) => void;
  currentPipeline?: PipelineType;
}

export function PipelineManager({ onPipelineChange, currentPipeline }: PipelineManagerProps) {
  const [pipelines, setPipelines] = useState<PipelineType[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<PipelineType | null>(currentPipeline || null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState<PipelineType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const [newPipeline, setNewPipeline] = useState({
    name: '',
    description: '',
    stages: [
      { name: 'New Leads', color: '#3B82F6', order: 0 },
      { name: 'Contacted', color: '#F59E0B', order: 1 },
      { name: 'Qualified', color: '#8B5CF6', order: 2 },
      { name: 'Proposal', color: '#EF4444', order: 3 },
      { name: 'Won', color: '#10B981', order: 4 }
    ]
  });

  // Load pipelines from Firestore
  useEffect(() => {
    if (!user) return;

    const pipelinesRef = collection(db, 'pipelines');
    const q = query(
      pipelinesRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pipelineData: PipelineType[] = [];
      snapshot.forEach((doc) => {
        pipelineData.push({ id: doc.id, ...doc.data() } as PipelineType);
      });
      
      setPipelines(pipelineData);
      
      // Set default pipeline if none selected
      if (!selectedPipeline && pipelineData.length > 0) {
        const defaultPipeline = pipelineData.find(p => p.isDefault) || pipelineData[0];
        setSelectedPipeline(defaultPipeline);
        onPipelineChange?.(defaultPipeline);
      }
    });

    return () => unsubscribe();
  }, [user, selectedPipeline, onPipelineChange]);

  const handleCreatePipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const pipelineData: Omit<PipelineType, 'id'> = {
        name: newPipeline.name,
        description: newPipeline.description,
        stages: newPipeline.stages.map((stage, index) => ({
          id: `stage-${index}`,
          name: stage.name,
          color: stage.color,
          order: index,
          isDefault: index === 0
        })),
        userId: user.uid,
        isDefault: pipelines.length === 0, // First pipeline is default
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'pipelines'), pipelineData);
      
      toast({
        title: "Pipeline Created",
        description: `${newPipeline.name} has been created successfully.`
      });

      setNewPipeline({
        name: '',
        description: '',
        stages: [
          { name: 'New Leads', color: '#3B82F6', order: 0 },
          { name: 'Contacted', color: '#F59E0B', order: 1 },
          { name: 'Qualified', color: '#8B5CF6', order: 2 },
          { name: 'Proposal', color: '#EF4444', order: 3 },
          { name: 'Won', color: '#10B981', order: 4 }
        ]
      });
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Error creating pipeline:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create pipeline. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingPipeline) return;

    setIsLoading(true);
    try {
      const pipelineRef = doc(db, 'pipelines', editingPipeline.id);
      await updateDoc(pipelineRef, {
        name: editingPipeline.name,
        description: editingPipeline.description,
        stages: editingPipeline.stages,
        updatedAt: serverTimestamp()
      });

      toast({
        title: "Pipeline Updated",
        description: `${editingPipeline.name} has been updated successfully.`
      });

      setIsEditOpen(false);
      setEditingPipeline(null);
    } catch (error) {
      console.error('Error updating pipeline:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update pipeline. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePipeline = async (pipelineId: string) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete this pipeline? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'pipelines', pipelineId));
      
      toast({
        title: "Pipeline Deleted",
        description: "Pipeline has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting pipeline:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete pipeline. Please try again."
      });
    }
  };

  const handleSetDefault = async (pipelineId: string) => {
    if (!user) return;

    try {
      const batch = writeBatch(db);
      
      // Remove default from all pipelines
      pipelines.forEach(pipeline => {
        const pipelineRef = doc(db, 'pipelines', pipeline.id);
        batch.update(pipelineRef, { isDefault: false });
      });
      
      // Set new default
      const newDefaultRef = doc(db, 'pipelines', pipelineId);
      batch.update(newDefaultRef, { isDefault: true });
      
      await batch.commit();
      
      toast({
        title: "Default Pipeline Set",
        description: "Default pipeline has been updated."
      });
    } catch (error) {
      console.error('Error setting default pipeline:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set default pipeline."
      });
    }
  };

  const addStage = () => {
    setNewPipeline(prev => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          name: `Stage ${prev.stages.length + 1}`,
          color: '#6B7280',
          order: prev.stages.length
        }
      ]
    }));
  };

  const removeStage = (index: number) => {
    setNewPipeline(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index).map((stage, i) => ({
        ...stage,
        order: i
      }))
    }));
  };

  const updateStage = (index: number, field: string, value: string) => {
    setNewPipeline(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) => 
        i === index ? { ...stage, [field]: value } : stage
      )
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Pipeline Management</h2>
          <p className="text-sm text-gray-600">Create and manage your sales pipelines</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Pipeline
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Pipeline</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePipeline} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Pipeline Name</Label>
                  <Input
                    id="name"
                    value={newPipeline.name}
                    onChange={(e) => setNewPipeline(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Sales Pipeline"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newPipeline.description}
                    onChange={(e) => setNewPipeline(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Main sales pipeline"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Pipeline Stages</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addStage}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Stage
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {newPipeline.stages.map((stage, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <Input
                        value={stage.name}
                        onChange={(e) => updateStage(index, 'name', e.target.value)}
                        placeholder="Stage name"
                        className="flex-1"
                      />
                      <Input
                        type="color"
                        value={stage.color}
                        onChange={(e) => updateStage(index, 'color', e.target.value)}
                        className="w-16"
                      />
                      {newPipeline.stages.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStage(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Pipeline'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Pipeline */}
      {selectedPipeline && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  {selectedPipeline.name}
                  {selectedPipeline.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-gray-600">{selectedPipeline.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingPipeline(selectedPipeline);
                    setIsEditOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Select
                  value={selectedPipeline.id}
                  onValueChange={(value) => {
                    const pipeline = pipelines.find(p => p.id === value);
                    if (pipeline) {
                      setSelectedPipeline(pipeline);
                      onPipelineChange?.(pipeline);
                    }
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelines.map((pipeline) => (
                      <SelectItem key={pipeline.id} value={pipeline.id}>
                        {pipeline.name}
                        {pipeline.isDefault && ' (Default)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {selectedPipeline.stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: stage.color }}>
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-sm font-medium">{stage.name}</span>
                  </div>
                  {index < selectedPipeline.stages.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Pipelines */}
      <div>
        <h3 className="text-md font-medium mb-4">All Pipelines</h3>
        <div className="grid gap-4">
          {pipelines.map((pipeline) => (
            <Card key={pipeline.id} className={cn(
              "transition-colors",
              selectedPipeline?.id === pipeline.id && "ring-2 ring-blue-500"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{pipeline.name}</h4>
                      {pipeline.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                      {!pipeline.isActive && (
                        <Badge variant="outline" className="text-xs">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{pipeline.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{pipeline.stages.length} stages</span>
                      <span>Created {new Date(pipeline.createdAt?.seconds * 1000 || 0).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!pipeline.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(pipeline.id)}
                      >
                        <Target className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingPipeline(pipeline);
                        setIsEditOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePipeline(pipeline.id)}
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

      {/* Edit Pipeline Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Pipeline</DialogTitle>
          </DialogHeader>
          {editingPipeline && (
            <form onSubmit={handleEditPipeline} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Pipeline Name</Label>
                  <Input
                    id="edit-name"
                    value={editingPipeline.name}
                    onChange={(e) => setEditingPipeline(prev => prev ? { ...prev, name: e.target.value } : null)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={editingPipeline.description || ''}
                    onChange={(e) => setEditingPipeline(prev => prev ? { ...prev, description: e.target.value } : null)}
                  />
                </div>
              </div>

              <div>
                <Label>Pipeline Stages</Label>
                <div className="space-y-3 mt-2">
                  {editingPipeline.stages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <Input
                        value={stage.name}
                        onChange={(e) => {
                          const updatedStages = [...editingPipeline.stages];
                          updatedStages[index] = { ...stage, name: e.target.value };
                          setEditingPipeline(prev => prev ? { ...prev, stages: updatedStages } : null);
                        }}
                        className="flex-1"
                      />
                      <Input
                        type="color"
                        value={stage.color}
                        onChange={(e) => {
                          const updatedStages = [...editingPipeline.stages];
                          updatedStages[index] = { ...stage, color: e.target.value };
                          setEditingPipeline(prev => prev ? { ...prev, stages: updatedStages } : null);
                        }}
                        className="w-16"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Pipeline'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}