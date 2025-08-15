
'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy, Star, Palette, MapPin, CreditCard, Grid3X3, BarChart3, Target, Minus, Code, Image, Video, Flag, DollarSign, Calculator, CalendarDays, Shield, Clock, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import type { FormField } from '@/lib/form-types';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';

interface SortableFieldProps {
  field: FormField;
  isSelected: boolean;
  onSelect: (field: FormField) => void;
  onDelete: (id: string) => void;
  onDuplicate: (field: FormField) => void;
}

function SortableField({ field, isSelected, onSelect, onDelete, onDuplicate }: SortableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderField = () => {
    const commonProps = {
      placeholder: field.placeholder,
      disabled: true,
      className: "w-full"
    };

    switch(field.type) {
      case 'text':
        return <Input {...commonProps} />;
      
      case 'textarea':
        return <Textarea {...commonProps} rows={field.rows || 4} />;
      
      case 'email':
        return <Input type="email" {...commonProps} />;
      
      case 'phone':
        return <Input type="tel" {...commonProps} />;
      
      case 'number':
        return <Input type="number" {...commonProps} min={field.min} max={field.max} step={field.step} />;
      
      case 'url':
        return <Input type="url" {...commonProps} />;
      
      case 'password':
        return <Input type="password" {...commonProps} />;
      
      case 'date':
        return <Input type="date" {...commonProps} />;
      
      case 'time':
        return <Input type="time" {...commonProps} />;
      
      case 'datetime':
        return <Input type="datetime-local" {...commonProps} />;
      
      case 'color':
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded border bg-blue-500"></div>
            <Input {...commonProps} value="#3b82f6" />
          </div>
        );
      
      case 'range':
        return (
          <div className="space-y-2">
            <Slider defaultValue={[50]} max={field.max || 100} min={field.min || 0} step={field.step || 1} disabled />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{field.min || 0}</span>
              <span>{field.max || 100}</span>
            </div>
          </div>
        );
      
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'multi-select':
        return (
          <div className="space-y-2">
            {field.options?.slice(0, 3).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox disabled />
                <Label className="text-sm">{option}</Label>
              </div>
            ))}
            {field.options && field.options.length > 3 && (
              <div className="text-xs text-muted-foreground">+{field.options.length - 3} more options</div>
            )}
          </div>
        );
      
      case 'radio':
        return (
          <RadioGroup disabled>
            {field.options?.slice(0, 3).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} disabled />
                <Label className="text-sm">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox disabled />
            <Label className="text-sm">{field.label}</Label>
          </div>
        );
      
      case 'file':
        return (
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <div className="text-sm text-muted-foreground">
              Click to upload or drag and drop
              {field.accept && <div className="text-xs mt-1">Accepted: {field.accept}</div>}
              {field.maxFileSize && <div className="text-xs">Max size: {field.maxFileSize}MB</div>}
            </div>
          </div>
        );
      
      case 'rating':
        return (
          <div className="flex items-center gap-1">
            {Array.from({ length: field.ratingScale || 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </div>
        );
      
      case 'signature':
        return (
          <div className="border rounded-lg p-4 h-24 bg-gray-50 flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Signature pad</div>
          </div>
        );
      
      case 'address':
        return (
          <div className="space-y-2">
            <Input placeholder="Street Address" disabled />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="City" disabled />
              <Input placeholder="State" disabled />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="ZIP Code" disabled />
              <Input placeholder="Country" disabled />
            </div>
          </div>
        );
      
      case 'payment':
        return (
          <div className="space-y-3 p-4 border rounded-lg">
            <Input placeholder="Card Number" disabled />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="MM/YY" disabled />
              <Input placeholder="CVC" disabled />
            </div>
            <Input placeholder="Cardholder Name" disabled />
          </div>
        );
      
      case 'matrix':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left"></th>
                  {field.matrixColumns?.map((col, i) => (
                    <th key={i} className="border p-2 text-center text-xs">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {field.matrixRows?.map((row, i) => (
                  <tr key={i}>
                    <td className="border p-2 text-sm">{row}</td>
                    {field.matrixColumns?.map((_, j) => (
                      <td key={j} className="border p-2 text-center">
                        <input type="radio" disabled className="w-4 h-4" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case 'likert':
        return (
          <div className="space-y-3">
            {field.matrixRows?.slice(0, 2).map((row, i) => (
              <div key={i} className="space-y-2">
                <div className="text-sm font-medium">{row}</div>
                <div className="flex justify-between">
                  {field.likertScale?.map((scale, j) => (
                    <div key={j} className="flex flex-col items-center gap-1">
                      <input type="radio" disabled className="w-4 h-4" />
                      <span className="text-xs text-center">{scale}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'nps':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">{field.npsLabels?.low}</span>
              <span className="text-sm">{field.npsLabels?.high}</span>
            </div>
            <div className="flex justify-between">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <input type="radio" disabled className="w-4 h-4" />
                  <span className="text-xs">{i}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'section':
        return (
          <div className="border-l-4 border-primary pl-4">
            <h3 className="text-lg font-semibold">{field.label}</h3>
            {field.description && <p className="text-sm text-muted-foreground mt-1">{field.description}</p>}
          </div>
        );
      
      case 'divider':
        return <hr className="border-t-2 border-gray-200" />;
      
      case 'html':
        return (
          <div className="p-3 bg-gray-50 rounded border">
            <div className="text-xs text-muted-foreground mb-2">HTML Content:</div>
            <div className="font-mono text-sm">{field.defaultValue}</div>
          </div>
        );
      
      case 'image':
        return (
          <div className="border rounded-lg overflow-hidden">
            <div className="h-32 bg-gray-100 flex items-center justify-center">
              <Image className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="border rounded-lg overflow-hidden">
            <div className="h-32 bg-gray-100 flex items-center justify-center">
              <Video className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        );
      
      case 'country':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Select country..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">🇺🇸 United States</SelectItem>
              <SelectItem value="ca">🇨🇦 Canada</SelectItem>
              <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
            </SelectContent>
          </Select>
        );
      
      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
            <Input {...commonProps} className="pl-8" />
          </div>
        );
      
      case 'calculation':
        return (
          <div className="p-3 bg-gray-50 rounded border">
            <div className="text-sm font-medium">Calculated Value</div>
            <div className="text-xs text-muted-foreground mt-1">
              Formula: {field.calculations?.formula || 'No formula set'}
            </div>
          </div>
        );
      
      case 'appointment':
        return (
          <div className="space-y-3">
            <Input type="date" disabled />
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'captcha':
        return (
          <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-center">
            <div className="text-sm text-muted-foreground">CAPTCHA verification</div>
          </div>
        );
      
      default:
        return <Input {...commonProps} />;
    }
  };

  const getFieldIcon = () => {
    const iconMap = {
      rating: Star,
      color: Palette,
      address: MapPin,
      payment: CreditCard,
      matrix: Grid3X3,
      likert: BarChart3,
      nps: Target,
      divider: Minus,
      html: Code,
      image: Image,
      video: Video,
      country: Flag,
      currency: DollarSign,
      calculation: Calculator,
      appointment: CalendarDays,
      captcha: Shield,
      time: Clock,
      url: Globe,
      password: Lock
    };
    
    const Icon = iconMap[field.type as keyof typeof iconMap];
    return Icon ? <Icon className="h-3 w-3" /> : null;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group rounded-lg bg-card border transition-all cursor-pointer',
        field.width === 'half' && 'w-1/2',
        field.width === 'third' && 'w-1/3',
        field.width === 'quarter' && 'w-1/4',
        isSelected ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-border hover:border-primary/50',
        field.type === 'section' && 'bg-gradient-to-r from-primary/5 to-transparent',
        field.type === 'divider' && 'p-2',
        field.type !== 'divider' && 'p-4'
      )}
      onClick={() => onSelect(field)}
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button variant="ghost" size="icon" className="h-6 w-6 cursor-grab" {...attributes} {...listeners}>
          <GripVertical className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onDuplicate(field); }}>
          <Copy className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(field.id); }}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {field.type !== 'divider' && field.type !== 'section' && (
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-auto">
            <div className="flex items-center gap-1">
              {getFieldIcon()}
              {field.type}
            </div>
          </Badge>
        </div>
      )}

      <div className={cn(
        "space-y-2 pointer-events-none",
        field.type === 'section' && "pt-6",
        field.type !== 'checkbox' && field.type !== 'section' && field.type !== 'divider' && "pt-6"
      )}>
        {field.type !== 'checkbox' && field.type !== 'divider' && (
          <Label className="font-semibold flex items-center gap-2">
            {field.label}
            {field.required && <span className="text-destructive">*</span>}
            {field.description && (
              <span className="text-xs text-muted-foreground font-normal">
                - {field.description}
              </span>
            )}
          </Label>
        )}
        {renderField()}
        {field.helpText && (
          <div className="text-xs text-muted-foreground">{field.helpText}</div>
        )}
      </div>
    </div>
  );
}

interface FormCanvasProps {
    fields: FormField[];
    selectedField: FormField | null;
    onSelectField: (field: FormField) => void;
    onDeleteField: (id: string) => void;
    onDuplicateField: (field: FormField) => void;
}

export function FormCanvas({ fields, selectedField, onSelectField, onDeleteField, onDuplicateField }: FormCanvasProps) {
  return (
    <div className="w-full bg-card border rounded-lg p-6 min-h-[400px]">
      {fields.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center py-16 border-2 border-dashed rounded-lg">
          <div>
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium mb-2">Start Building Your Form</h3>
            <p className="text-muted-foreground">Add fields from the left sidebar or choose a template to get started.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map(field => (
            <SortableField
              key={field.id}
              field={field}
              isSelected={selectedField?.id === field.id}
              onSelect={onSelectField}
              onDelete={onDeleteField}
              onDuplicate={onDuplicateField}
            />
          ))}
        </div>
      )}
    </div>
  );
}
