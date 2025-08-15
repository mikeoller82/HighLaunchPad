
'use client';
import { useState } from 'react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { FieldLibrarySidebar } from './field-library';
import { FormCanvas } from './form-canvas';
import { SettingsPanel } from './settings-panel';
import { FormPreview } from './form-preview';
import { FormTemplates } from './form-templates';
import type { FormField, FormSettings, FormTemplate } from '@/lib/form-types';
import { Button } from '@/components/ui/button';
import { Eye, Settings, Save, FileText, Download, Upload, Share2, BarChart3, Palette, Zap, Copy, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface FormBuilderProps {
    initialFields: FormField[];
    initialSettings: FormSettings;
}

export function FormBuilder({ initialFields, initialSettings }: FormBuilderProps) {
    const [fields, setFields] = useState<FormField[]>(() => JSON.parse(JSON.stringify(initialFields)));
    const [selectedField, setSelectedField] = useState<FormField | null>(null);
    const [formSettings, setFormSettings] = useState<FormSettings>(initialSettings);
    const [showTemplates, setShowTemplates] = useState(false);
    const [activeTab, setActiveTab] = useState('edit');

    const addField = (type: FormField['type']) => {
        const fieldDefaults: Record<string, Partial<FormField>> = {
            text: { label: 'Text Input', placeholder: 'Enter text...' },
            textarea: { label: 'Text Area', placeholder: 'Enter your message...', rows: 4 },
            email: { label: 'Email Address', placeholder: 'your@email.com' },
            phone: { label: 'Phone Number', placeholder: '+1 (555) 123-4567' },
            number: { label: 'Number', placeholder: '0' },
            url: { label: 'Website URL', placeholder: 'https://example.com' },
            password: { label: 'Password', placeholder: 'Enter password' },
            select: { label: 'Select Option', options: ['Option 1', 'Option 2', 'Option 3'] },
            'multi-select': { label: 'Multiple Selection', options: ['Option 1', 'Option 2', 'Option 3'], multiple: true },
            radio: { label: 'Choose One', options: ['Option 1', 'Option 2', 'Option 3'] },
            checkbox: { label: 'I agree to the terms and conditions' },
            date: { label: 'Date' },
            time: { label: 'Time' },
            datetime: { label: 'Date & Time' },
            file: { label: 'File Upload', accept: '.pdf,.doc,.docx,.jpg,.png', maxFileSize: 5 },
            rating: { label: 'Rating', ratingScale: 5 },
            range: { label: 'Range', min: 0, max: 100, step: 1 },
            color: { label: 'Color' },
            signature: { label: 'Signature' },
            address: { label: 'Address', addressFields: ['street', 'city', 'state', 'zip', 'country'] },
            payment: { label: 'Payment Information' },
            matrix: { label: 'Matrix Question', matrixRows: ['Row 1', 'Row 2'], matrixColumns: ['Column 1', 'Column 2'] },
            likert: { label: 'Agreement Scale', likertScale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
            nps: { label: 'Net Promoter Score', npsLabels: { low: 'Not likely', high: 'Very likely' } },
            section: { label: 'Section Title' },
            divider: { label: 'Divider' },
            html: { label: 'HTML Content', defaultValue: '<p>Custom HTML content</p>' },
            image: { label: 'Image', defaultValue: 'https://via.placeholder.com/400x200' },
            video: { label: 'Video', defaultValue: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
            country: { label: 'Country' },
            currency: { label: 'Amount', placeholder: '$0.00' },
            calculation: { label: 'Calculated Field', calculations: { formula: '', fields: [] } },
            appointment: { label: 'Book Appointment', appointmentSettings: { duration: 30, availableSlots: [], timezone: 'UTC' } },
            captcha: { label: 'CAPTCHA Verification' }
        };

        const newField: FormField = {
            id: nanoid(),
            type,
            required: false,
            width: 'full',
            label: fieldDefaults[type]?.label || type,
            ...fieldDefaults[type]
        };

        setFields(prev => [...prev, newField]);
        setSelectedField(newField);
        toast.success(`${fieldDefaults[type]?.label || type} field added`);
    };
    
    const updateField = (id: string, newProps: Partial<FormField>) => {
        setFields(prev => prev.map(f => (f.id === id ? { ...f, ...newProps } : f)));
        if (selectedField?.id === id) {
            setSelectedField(prev => prev ? { ...prev, ...newProps } : null);
        }
    };
    
    const deleteField = (id: string) => {
        setFields(prev => prev.filter(f => f.id !== id));
        if (selectedField?.id === id) {
            setSelectedField(null);
        }
        toast.success('Field deleted');
    };

    const duplicateField = (field: FormField) => {
        const newField = { ...field, id: nanoid(), label: `${field.label} (Copy)` };
        const fieldIndex = fields.findIndex(f => f.id === field.id);
        setFields(prev => [
            ...prev.slice(0, fieldIndex + 1),
            newField,
            ...prev.slice(fieldIndex + 1)
        ]);
        toast.success('Field duplicated');
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setFields((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleTemplateSelect = (template: FormTemplate) => {
        setFields(template.fields.map(field => ({ ...field, id: nanoid() })));
        setFormSettings(template.settings);
        setShowTemplates(false);
        setSelectedField(null);
        toast.success(`Template "${template.name}" applied`);
    };

    const saveForm = async () => {
        try {
            // Here you would save to your backend/database
            const formData = {
                fields,
                settings: formSettings,
                updatedAt: new Date().toISOString()
            };
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toast.success('Form saved successfully');
        } catch (error) {
            toast.error('Failed to save form');
        }
    };

    const exportForm = () => {
        const formData = { fields, settings: formSettings };
        const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formSettings.name.replace(/\s+/g, '-').toLowerCase()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Form exported');
    };

    const clearForm = () => {
        if (confirm('Are you sure you want to clear all fields? This action cannot be undone.')) {
            setFields([]);
            setSelectedField(null);
            toast.success('Form cleared');
        }
    };

    return (
        <>
            <div className="flex h-full w-full bg-background text-foreground">
                {/* Left Sidebar: Fields Library */}
                <div className="w-64 border-r bg-card">
                    <FieldLibrarySidebar addField={addField} />
                </div>

                {/* Middle Panel: Canvas & Preview */}
                <main className="flex-1 flex flex-col bg-background">
                    <div className="border-b p-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList>
                                        <TabsTrigger value="edit" className="flex items-center gap-2">
                                            <Settings className="h-4 w-4"/>
                                            Editor
                                        </TabsTrigger>
                                        <TabsTrigger value="preview" className="flex items-center gap-2">
                                            <Eye className="h-4 w-4"/>
                                            Preview
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                
                                <div className="text-sm text-muted-foreground">
                                    {fields.length} field{fields.length !== 1 ? 's' : ''}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" onClick={() => setShowTemplates(true)}>
                                    <FileText className="mr-2 h-4 w-4"/>
                                    Templates
                                </Button>
                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <Zap className="mr-2 h-4 w-4"/>
                                            Actions
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={exportForm}>
                                            <Download className="mr-2 h-4 w-4"/>
                                            Export Form
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Upload className="mr-2 h-4 w-4"/>
                                            Import Form
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Share2 className="mr-2 h-4 w-4"/>
                                            Share Form
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <BarChart3 className="mr-2 h-4 w-4"/>
                                            Analytics
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Palette className="mr-2 h-4 w-4"/>
                                            Customize Theme
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={clearForm} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4"/>
                                            Clear Form
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Button onClick={saveForm}>
                                    <Save className="mr-2 h-4 w-4"/>
                                    Save Form
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="w-full max-w-4xl mx-auto">
                            {activeTab === 'edit' && (
                                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                                    <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                                        <FormCanvas
                                            fields={fields}
                                            selectedField={selectedField}
                                            onSelectField={setSelectedField}
                                            onDeleteField={deleteField}
                                            onDuplicateField={duplicateField}
                                        />
                                    </SortableContext>
                                </DndContext>
                            )}
                            
                            {activeTab === 'preview' && (
                                <FormPreview fields={fields} settings={formSettings} />
                            )}
                        </div>
                    </div>
                </main>

                {/* Right Sidebar: Settings Panel */}
                <aside className="w-80 border-l bg-card overflow-y-auto">
                    <SettingsPanel 
                        selectedField={selectedField} 
                        onUpdateField={updateField} 
                        onClearSelection={() => setSelectedField(null)}
                        formSettings={formSettings}
                        onUpdateFormSettings={(settings) => setFormSettings(prev => ({ ...prev, ...settings }))}
                    />
                </aside>
            </div>

            {showTemplates && (
                <FormTemplates 
                    onSelectTemplate={handleTemplateSelect}
                    onClose={() => setShowTemplates(false)}
                />
            )}
        </>
    );
}
