'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Move, 
  Settings, 
  Type, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Link, 
  Hash, 
  ToggleLeft, 
  CheckSquare, 
  Circle, 
  List, 
  Upload, 
  Star, 
  CreditCard, 
  User, 
  Lock,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  GripVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'number' | 'url' | 'file' | 'rating' | 'payment';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  styling?: {
    width: 'full' | 'half' | 'third';
    labelPosition: 'top' | 'left' | 'inside';
    size: 'sm' | 'md' | 'lg';
  };
  conditional?: {
    showIf: string;
    value: string;
  };
}

export interface FormSettings {
  title: string;
  description?: string;
  submitText: string;
  successMessage: string;
  redirectUrl?: string;
  emailNotifications: boolean;
  emailTo?: string;
  styling: {
    theme: 'default' | 'modern' | 'minimal' | 'colorful';
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    borderRadius: number;
    spacing: number;
  };
}

interface FormBuilderProps {
  fields: FormField[];
  settings: FormSettings;
  onFieldsChange: (fields: FormField[]) => void;
  onSettingsChange: (settings: FormSettings) => void;
}

// Field Type Library
const FIELD_TYPES = [
  { type: 'text', icon: Type, label: 'Text Input', description: 'Single line text' },
  { type: 'email', icon: Mail, label: 'Email', description: 'Email address input' },
  { type: 'phone', icon: Phone, label: 'Phone', description: 'Phone number input' },
  { type: 'textarea', icon: Type, label: 'Textarea', description: 'Multi-line text' },
  { type: 'select', icon: List, label: 'Dropdown', description: 'Select from options' },
  { type: 'radio', icon: Circle, label: 'Radio Buttons', description: 'Single choice' },
  { type: 'checkbox', icon: CheckSquare, label: 'Checkboxes', description: 'Multiple choices' },
  { type: 'date', icon: Calendar, label: 'Date Picker', description: 'Date selection' },
  { type: 'number', icon: Hash, label: 'Number', description: 'Numeric input' },
  { type: 'url', icon: Link, label: 'URL', description: 'Website URL' },
  { type: 'file', icon: Upload, label: 'File Upload', description: 'File attachment' },
  { type: 'rating', icon: Star, label: 'Rating', description: 'Star rating' },
  { type: 'payment', icon: CreditCard, label: 'Payment', description: 'Payment details' },
];

// Field Editor Component
const FieldEditor = ({ 
  field, 
  onUpdate, 
  onDelete 
}: { 
  field: FormField; 
  onUpdate: (field: FormField) => void; 
  onDelete: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateField = (updates: Partial<FormField>) => {
    onUpdate({ ...field, ...updates });
  };

  const updateValidation = (validation: Partial<FormField['validation']>) => {
    onUpdate({ 
      ...field, 
      validation: { ...field.validation, ...validation } 
    });
  };

  const updateStyling = (styling: Partial<FormField['styling']>) => {
    onUpdate({ 
      ...field, 
      styling: { 
        width: 'full',
        labelPosition: 'top',
        size: 'md',
        ...field.styling, 
        ...styling 
      } 
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-blue-500 cursor-move" />
            <div>
              <CardTitle className="text-sm capitalize">{field.type} Field</CardTitle>
              <p className="text-xs text-blue-600">{field.label || 'Untitled Field'}</p>
            </div>
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="styling">Styling</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label>Field Label</Label>
                <Input
                  value={field.label}
                  onChange={(e) => updateField({ label: e.target.value })}
                  placeholder="Enter field label"
                />
              </div>
              
              <div>
                <Label>Placeholder Text</Label>
                <Input
                  value={field.placeholder || ''}
                  onChange={(e) => updateField({ placeholder: e.target.value })}
                  placeholder="Enter placeholder text"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Required Field</Label>
                <Switch
                  checked={field.required}
                  onCheckedChange={(checked) => updateField({ required: checked })}
                />
              </div>
              
              {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                <div>
                  <Label>Options (one per line)</Label>
                  <Textarea
                    value={field.options?.join('\n') || ''}
                    onChange={(e) => updateField({ options: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    rows={4}
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="validation" className="space-y-4">
              {field.type === 'text' || field.type === 'textarea' ? (
                <>
                  <div>
                    <Label>Minimum Length</Label>
                    <Input
                      type="number"
                      value={field.validation?.minLength || ''}
                      onChange={(e) => updateValidation({ minLength: parseInt(e.target.value) || undefined })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Maximum Length</Label>
                    <Input
                      type="number"
                      value={field.validation?.maxLength || ''}
                      onChange={(e) => updateValidation({ maxLength: parseInt(e.target.value) || undefined })}
                      placeholder="100"
                    />
                  </div>
                </>
              ) : null}
              
              {field.type === 'number' ? (
                <>
                  <div>
                    <Label>Minimum Value</Label>
                    <Input
                      type="number"
                      value={field.validation?.min || ''}
                      onChange={(e) => updateValidation({ min: parseInt(e.target.value) || undefined })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Maximum Value</Label>
                    <Input
                      type="number"
                      value={field.validation?.max || ''}
                      onChange={(e) => updateValidation({ max: parseInt(e.target.value) || undefined })}
                      placeholder="100"
                    />
                  </div>
                </>
              ) : null}
              
              <div>
                <Label>Custom Pattern (Regex)</Label>
                <Input
                  value={field.validation?.pattern || ''}
                  onChange={(e) => updateValidation({ pattern: e.target.value })}
                  placeholder="^[A-Za-z]+$"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="styling" className="space-y-4">
              <div>
                <Label>Field Width</Label>
                <Select 
                  value={field.styling?.width || 'full'} 
                  onValueChange={(value) => updateStyling({ width: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Width</SelectItem>
                    <SelectItem value="half">Half Width</SelectItem>
                    <SelectItem value="third">Third Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Label Position</Label>
                <Select 
                  value={field.styling?.labelPosition || 'top'} 
                  onValueChange={(value) => updateStyling({ labelPosition: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Above Field</SelectItem>
                    <SelectItem value="left">Left of Field</SelectItem>
                    <SelectItem value="inside">Inside Field</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Field Size</Label>
                <Select 
                  value={field.styling?.size || 'md'} 
                  onValueChange={(value) => updateStyling({ size: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};

// Form Preview Component
const FormPreview = ({ fields, settings }: { fields: FormField[]; settings: FormSettings }) => {
  const renderField = (field: FormField) => {
    const baseClasses = cn(
      "transition-all",
      field.styling?.size === 'sm' && "text-sm",
      field.styling?.size === 'lg' && "text-lg",
      field.styling?.width === 'half' && "w-1/2",
      field.styling?.width === 'third' && "w-1/3"
    );

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
      case 'number':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            className={baseClasses}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            required={field.required}
            className={baseClasses}
            rows={4}
          />
        );
      
      case 'select':
        return (
          <Select required={field.required}>
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.id}-${index}`}
                  name={field.id}
                  value={option}
                  className="w-4 h-4"
                />
                <label htmlFor={`${field.id}-${index}`} className="text-sm">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${field.id}-${index}`}
                  value={option}
                  className="w-4 h-4"
                />
                <label htmlFor={`${field.id}-${index}`} className="text-sm">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'date':
        return (
          <Input
            type="date"
            required={field.required}
            className={baseClasses}
          />
        );
      
      case 'file':
        return (
          <Input
            type="file"
            required={field.required}
            className={baseClasses}
          />
        );
      
      case 'rating':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer" />
            ))}
          </div>
        );
      
      default:
        return (
          <Input
            placeholder={field.placeholder}
            required={field.required}
            className={baseClasses}
          />
        );
    }
  };

  return (
    <div 
      className="p-6 rounded-lg border"
      style={{ 
        backgroundColor: settings.styling.backgroundColor,
        color: settings.styling.textColor 
      }}
    >
      {settings.title && (
        <h2 className="text-2xl font-bold mb-2">{settings.title}</h2>
      )}
      {settings.description && (
        <p className="text-blue-700 mb-6">{settings.description}</p>
      )}
      
      <form className="space-y-6">
        {fields.map((field) => (
          <div key={field.id} className={cn(
            "space-y-2",
            field.styling?.width === 'half' && "inline-block w-1/2 pr-2",
            field.styling?.width === 'third' && "inline-block w-1/3 pr-2"
          )}>
            {field.styling?.labelPosition !== 'inside' && (
              <Label className={cn(
                field.styling?.labelPosition === 'left' && "inline-block w-1/3"
              )}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            )}
            <div className={cn(
              field.styling?.labelPosition === 'left' && "inline-block w-2/3"
            )}>
              {renderField(field)}
            </div>
          </div>
        ))}
        
        <Button 
          type="submit" 
          className="w-full"
          style={{ 
            backgroundColor: settings.styling.buttonColor,
            borderRadius: `${settings.styling.borderRadius}px`
          }}
        >
          {settings.submitText}
        </Button>
      </form>
    </div>
  );
};

export const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  settings,
  onFieldsChange,
  onSettingsChange
}) => {
  const [activeTab, setActiveTab] = useState('fields');

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      styling: {
        width: 'full' as const,
        labelPosition: 'top' as const,
        size: 'md' as const
      }
    };
    
    if (type === 'select' || type === 'radio' || type === 'checkbox') {
      newField.options = ['Option 1', 'Option 2', 'Option 3'];
    }
    
    onFieldsChange([...fields, newField]);
  };

  const updateField = (index: number, updatedField: FormField) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    onFieldsChange(newFields);
  };

  const deleteField = (index: number) => {
    onFieldsChange(fields.filter((_, i) => i !== index));
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    onFieldsChange(newFields);
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Form Builder */}
      <div className="w-1/2 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Form Builder</h3>
          <p className="text-sm text-blue-700">Design your form with drag-and-drop fields</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="fields" className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Add Fields</h4>
                <div className="grid grid-cols-2 gap-2">
                  {FIELD_TYPES.map((fieldType) => {
                    const IconComponent = fieldType.icon;
                    return (
                      <Button
                        key={fieldType.type}
                        variant="outline"
                        size="sm"
                        onClick={() => addField(fieldType.type as FormField['type'])}
                        className="flex items-center gap-2 h-auto p-3"
                      >
                        <IconComponent className="h-4 w-4" />
                        <div className="text-left">
                          <div className="text-xs font-medium">{fieldType.label}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Form Fields</h4>
                <ScrollArea className="h-96">
                  {fields.length === 0 ? (
                    <div className="text-center text-blue-600 py-8">
                      <Type className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No fields added yet</p>
                      <p className="text-sm">Click a field type above to get started</p>
                    </div>
                  ) : (
                    fields.map((field, index) => (
                      <FieldEditor
                        key={field.id}
                        field={field}
                        onUpdate={(updatedField) => updateField(index, updatedField)}
                        onDelete={() => deleteField(index)}
                      />
                    ))
                  )}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Form Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Form Title</Label>
                      <Input
                        value={settings.title}
                        onChange={(e) => onSettingsChange({ ...settings, title: e.target.value })}
                        placeholder="Contact Form"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={settings.description || ''}
                        onChange={(e) => onSettingsChange({ ...settings, description: e.target.value })}
                        placeholder="Please fill out this form..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Submit Button Text</Label>
                      <Input
                        value={settings.submitText}
                        onChange={(e) => onSettingsChange({ ...settings, submitText: e.target.value })}
                        placeholder="Submit"
                      />
                    </div>
                    <div>
                      <Label>Success Message</Label>
                      <Input
                        value={settings.successMessage}
                        onChange={(e) => onSettingsChange({ ...settings, successMessage: e.target.value })}
                        placeholder="Thank you for your submission!"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Form Styling</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Theme</Label>
                      <Select 
                        value={settings.styling.theme} 
                        onValueChange={(value) => onSettingsChange({ 
                          ...settings, 
                          styling: { ...settings.styling, theme: value as any }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="colorful">Colorful</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Background Color</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border cursor-pointer"
                          style={{ backgroundColor: settings.styling.backgroundColor }}
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'color';
                            input.value = settings.styling.backgroundColor;
                            input.onchange = (e) => onSettingsChange({
                              ...settings,
                              styling: { 
                                ...settings.styling, 
                                backgroundColor: (e.target as HTMLInputElement).value 
                              }
                            });
                            input.click();
                          }}
                        />
                        <Input
                          value={settings.styling.backgroundColor}
                          onChange={(e) => onSettingsChange({
                            ...settings,
                            styling: { ...settings.styling, backgroundColor: e.target.value }
                          })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel - Preview */}
      <div className="w-1/2 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Form Preview</h3>
          <p className="text-sm text-blue-700">See how your form will look</p>
        </div>
        
        <div className="flex-1 p-4 bg-blue-50">
          <FormPreview fields={fields} settings={settings} />
        </div>
      </div>
    </div>
  );
};