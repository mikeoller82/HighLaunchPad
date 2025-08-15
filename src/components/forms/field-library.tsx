'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FormInput, Pilcrow, AtSign, Phone, List, CheckSquare, Calendar, FileUp, Hash,
  Clock, Globe, Lock, Palette, Star, PenTool, MapPin, CreditCard, Grid3X3,
  BarChart3, Target, Minus, Code, Image, Video, CheckSquare2, Flag,
  DollarSign, Calculator, CalendarDays, Shield, Search
} from 'lucide-react';
import type { FormFieldType } from '@/lib/form-types';
import { useState } from 'react';

interface FieldLibrarySidebarProps {
  addField: (type: FormFieldType) => void;
}

const fieldCategories = {
  basic: [
    { type: 'text' as FormFieldType, label: 'Text Input', icon: FormInput, description: 'Single line text input' },
    { type: 'textarea' as FormFieldType, label: 'Text Area', icon: Pilcrow, description: 'Multi-line text input' },
    { type: 'email' as FormFieldType, label: 'Email', icon: AtSign, description: 'Email address input' },
    { type: 'phone' as FormFieldType, label: 'Phone', icon: Phone, description: 'Phone number input' },
    { type: 'number' as FormFieldType, label: 'Number', icon: Hash, description: 'Numeric input' },
    { type: 'url' as FormFieldType, label: 'URL', icon: Globe, description: 'Website URL input' },
    { type: 'password' as FormFieldType, label: 'Password', icon: Lock, description: 'Password input field' },
  ],
  selection: [
    { type: 'select' as FormFieldType, label: 'Dropdown', icon: List, description: 'Single selection dropdown' },
    { type: 'multi-select' as FormFieldType, label: 'Multi Select', icon: CheckSquare2, description: 'Multiple selection dropdown' },
    { type: 'radio' as FormFieldType, label: 'Radio Group', icon: List, description: 'Single choice options' },
    { type: 'checkbox' as FormFieldType, label: 'Checkbox', icon: CheckSquare, description: 'Multiple choice options' },
    { type: 'country' as FormFieldType, label: 'Country', icon: Flag, description: 'Country selection' },
  ],
  datetime: [
    { type: 'date' as FormFieldType, label: 'Date Picker', icon: Calendar, description: 'Date selection' },
    { type: 'time' as FormFieldType, label: 'Time Picker', icon: Clock, description: 'Time selection' },
    { type: 'datetime' as FormFieldType, label: 'Date & Time', icon: CalendarDays, description: 'Date and time selection' },
    { type: 'appointment' as FormFieldType, label: 'Appointment', icon: CalendarDays, description: 'Appointment booking' },
  ],
  advanced: [
    { type: 'file' as FormFieldType, label: 'File Upload', icon: FileUp, description: 'File upload field' },
    { type: 'signature' as FormFieldType, label: 'Signature', icon: PenTool, description: 'Digital signature pad' },
    { type: 'address' as FormFieldType, label: 'Address', icon: MapPin, description: 'Complete address input' },
    { type: 'rating' as FormFieldType, label: 'Rating', icon: Star, description: 'Star rating field' },
    { type: 'range' as FormFieldType, label: 'Range Slider', icon: BarChart3, description: 'Numeric range slider' },
    { type: 'color' as FormFieldType, label: 'Color Picker', icon: Palette, description: 'Color selection' },
  ],
  survey: [
    { type: 'matrix' as FormFieldType, label: 'Matrix', icon: Grid3X3, description: 'Matrix/grid questions' },
    { type: 'likert' as FormFieldType, label: 'Likert Scale', icon: BarChart3, description: 'Agreement scale' },
    { type: 'nps' as FormFieldType, label: 'NPS Score', icon: Target, description: 'Net Promoter Score' },
  ],
  payment: [
    { type: 'payment' as FormFieldType, label: 'Payment', icon: CreditCard, description: 'Payment processing' },
    { type: 'currency' as FormFieldType, label: 'Currency', icon: DollarSign, description: 'Currency amount input' },
    { type: 'calculation' as FormFieldType, label: 'Calculation', icon: Calculator, description: 'Auto-calculated field' },
  ],
  layout: [
    { type: 'section' as FormFieldType, label: 'Section', icon: List, description: 'Section header' },
    { type: 'divider' as FormFieldType, label: 'Divider', icon: Minus, description: 'Visual separator' },
    { type: 'html' as FormFieldType, label: 'HTML Block', icon: Code, description: 'Custom HTML content' },
    { type: 'image' as FormFieldType, label: 'Image', icon: Image, description: 'Display image' },
    { type: 'video' as FormFieldType, label: 'Video', icon: Video, description: 'Embed video' },
  ],
  security: [
    { type: 'captcha' as FormFieldType, label: 'CAPTCHA', icon: Shield, description: 'Bot protection' },
  ]
};

export function FieldLibrarySidebar({ addField }: FieldLibrarySidebarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('basic');

    const filteredFields = searchTerm 
      ? Object.values(fieldCategories).flat().filter(field => 
          field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          field.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : fieldCategories[activeCategory as keyof typeof fieldCategories];

    return (
        <div className="h-full flex flex-col">
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-3">Form Fields</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search fields..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {!searchTerm && (
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1 flex flex-col">
                    <TabsList className="grid grid-cols-3 mb-3">
                        <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
                        <TabsTrigger value="selection" className="text-xs">Select</TabsTrigger>
                        <TabsTrigger value="datetime" className="text-xs">Date</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid grid-cols-3 mb-3">
                        <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
                        <TabsTrigger value="survey" className="text-xs">Survey</TabsTrigger>
                        <TabsTrigger value="payment" className="text-xs">Payment</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
                        <TabsTrigger value="security" className="text-xs">Security</TabsTrigger>
                    </TabsList>

                    <ScrollArea className="flex-1">
                        {Object.entries(fieldCategories).map(([category, fields]) => (
                            <TabsContent key={category} value={category} className="mt-0">
                                <div className="space-y-2">
                                    {fields.map(field => (
                                        <Button 
                                            key={field.type} 
                                            variant="outline"
                                            className="w-full h-auto p-3 flex items-start gap-3 text-left hover:bg-accent"
                                            onClick={() => addField(field.type)}
                                        >
                                            <field.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm">{field.label}</div>
                                                <div className="text-xs text-muted-foreground mt-1">{field.description}</div>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </TabsContent>
                        ))}
                    </ScrollArea>
                </Tabs>
            )}

            {searchTerm && (
                <ScrollArea className="flex-1">
                    <div className="space-y-2">
                        {filteredFields.length > 0 ? (
                            filteredFields.map(field => (
                                <Button 
                                    key={field.type} 
                                    variant="outline"
                                    className="w-full h-auto p-3 flex items-start gap-3 text-left hover:bg-accent"
                                    onClick={() => addField(field.type)}
                                >
                                    <field.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm">{field.label}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{field.description}</div>
                                    </div>
                                </Button>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No fields found</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
}
