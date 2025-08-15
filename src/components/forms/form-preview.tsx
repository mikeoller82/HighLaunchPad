
'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, CreditCard, MapPin, PenTool, Calendar, Shield } from 'lucide-react';
import type { FormField, FormSettings } from '@/lib/form-types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FormPreviewProps {
  fields: FormField[];
  settings: FormSettings;
}

export function FormPreview({ fields, settings }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  
  const totalFields = fields.filter(f => f.type !== 'section' && f.type !== 'divider' && f.type !== 'html' && f.type !== 'image' && f.type !== 'video').length;
  const completedFields = Object.keys(formData).length;
  const progress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;

  const updateFormData = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const renderField = (field: FormField) => {
    const fieldId = `preview-${field.id}`;
    const commonProps = {
      id: fieldId,
      required: field.required,
      className: cn(
        "w-full",
        field.width === 'half' && 'w-1/2',
        field.width === 'third' && 'w-1/3',
        field.width === 'quarter' && 'w-1/4'
      )
    };

    switch (field.type) {
      case 'text':
        return (
          <Input 
            {...commonProps}
            placeholder={field.placeholder}
            onChange={(e) => updateFormData(fieldId, e.target.value)}
          />
        );
      
      case 'textarea':
        return (
          <Textarea 
            {...commonProps}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            onChange={(e) => updateFormData(fieldId, e.target.value)}
          />
        );
      
      case 'email':
        return (
          <Input 
            {...commonProps}
            type="email"
            placeholder={field.placeholder}
            onChange={(e) => updateFormData(fieldId, e.target.value)}
          />
        );
      
      case 'phone':
        return (
          <Input 
            {...commonProps}
            type="tel"
            placeholder={field.placeholder}
            onChange={(e) => updateFormData(fieldId, e.target.value)}
          />
        );
      
      case 'number':
        return (
          <Input 
            {...commonProps}
            type="number"
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) => updateFormData(fieldId, parseFloat(e.target.value))}
          />
        );
      
      case 'url':
        return (
          <Input 
            {...commonProps}
            type="url"
            placeholder={field.placeholder}
            onChange={(e) => updateFormData(fieldId, e.target.value)}
          />
        );
      
      case 'password':
        return (
          <Input 
            {...commonProps}
            type="password"
            placeholder={field.placeholder}
            onChange={(e) => updateFormData(fieldId, e.target.value)}
          />
        );
      
      case 'date':
        return (
          <Input 
            {...commonProps}
            type="date"
            onChange={(e) => updateFormData(fieldId, e.target.value)}
          />
        );
      
      case 'time':
        return (
          <Input 
            {...commonProps}
            type="time"
            onChange={(e) => updateFormData(fieldId, e.target.value)}
          />
        );
      
      case 'datetime':
        return (
          <Input 
            {...commonProps}
            type="datetime-local"
            onChange={(e) => updateFormData(fieldId, e.target.value)}
          />
        );
      
      case 'color':
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              className="w-12 h-10 rounded border cursor-pointer"
              onChange={(e) => updateFormData(fieldId, e.target.value)}
            />
            <Input 
              value={formData[fieldId] || '#000000'}
              onChange={(e) => updateFormData(fieldId, e.target.value)}
              placeholder="#000000"
            />
          </div>
        );
      
      case 'range':
        return (
          <div className="space-y-3">
            <Slider
              defaultValue={[field.defaultValue || 50]}
              max={field.max || 100}
              min={field.min || 0}
              step={field.step || 1}
              onValueChange={(value) => updateFormData(fieldId, value[0])}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{field.min || 0}</span>
              <span className="font-medium">{formData[fieldId] || field.defaultValue || 50}</span>
              <span>{field.max || 100}</span>
            </div>
          </div>
        );
      
      case 'select':
        return (
          <Select onValueChange={(value) => updateFormData(fieldId, value)}>
            <SelectTrigger {...commonProps}>
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
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  id={`${fieldId}-${index}`}
                  onCheckedChange={(checked) => {
                    const currentValues = formData[fieldId] || [];
                    if (checked) {
                      updateFormData(fieldId, [...currentValues, option]);
                    } else {
                      updateFormData(fieldId, currentValues.filter((v: string) => v !== option));
                    }
                  }}
                />
                <Label htmlFor={`${fieldId}-${index}`} className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
        );
      
      case 'radio':
        return (
          <RadioGroup onValueChange={(value) => updateFormData(fieldId, value)}>
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${fieldId}-${index}`} />
                <Label htmlFor={`${fieldId}-${index}`} className="text-sm">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={fieldId}
              required={field.required}
              onCheckedChange={(checked) => updateFormData(fieldId, checked)}
            />
            <Label htmlFor={fieldId} className="text-sm font-medium">
              {field.label}
            </Label>
          </div>
        );
      
      case 'file':
        return (
          <div className="space-y-2">
            <Input 
              {...commonProps}
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              onChange={(e) => updateFormData(fieldId, e.target.files)}
            />
            {field.maxFileSize && (
              <p className="text-xs text-muted-foreground">
                Max file size: {field.maxFileSize}MB
              </p>
            )}
          </div>
        );
      
      case 'rating':
        return (
          <div className="flex items-center gap-1">
            {Array.from({ length: field.ratingScale || 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  "h-6 w-6 cursor-pointer transition-colors",
                  (formData[fieldId] || 0) > i ? "text-yellow-400 fill-current" : "text-gray-300"
                )}
                onClick={() => updateFormData(fieldId, i + 1)}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {formData[fieldId] || 0} / {field.ratingScale || 5}
            </span>
          </div>
        );
      
      case 'signature':
        return (
          <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50">
            <PenTool className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-muted-foreground">Click to sign</p>
          </div>
        );
      
      case 'address':
        return (
          <div className="space-y-3">
            <Input placeholder="Street Address" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="City" />
              <Input placeholder="State/Province" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="ZIP/Postal Code" />
              <Input placeholder="Country" />
            </div>
          </div>
        );
      
      case 'payment':
        return (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5" />
              <span className="font-medium">Payment Information</span>
            </div>
            <Input placeholder="Card Number" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="MM/YY" />
              <Input placeholder="CVC" />
            </div>
            <Input placeholder="Cardholder Name" />
          </div>
        );
      
      case 'matrix':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-3 text-left bg-gray-50"></th>
                  {field.matrixColumns?.map((col, i) => (
                    <th key={i} className="border p-3 text-center bg-gray-50 text-sm font-medium">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {field.matrixRows?.map((row, i) => (
                  <tr key={i}>
                    <td className="border p-3 font-medium text-sm">{row}</td>
                    {field.matrixColumns?.map((_, j) => (
                      <td key={j} className="border p-3 text-center">
                        <input 
                          type="radio" 
                          name={`${fieldId}-row-${i}`}
                          className="w-4 h-4"
                          onChange={() => updateFormData(`${fieldId}-${i}`, j)}
                        />
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
          <div className="space-y-4">
            {field.matrixRows?.map((row, i) => (
              <div key={i} className="space-y-2">
                <div className="font-medium text-sm">{row}</div>
                <div className="flex justify-between items-center">
                  {field.likertScale?.map((scale, j) => (
                    <div key={j} className="flex flex-col items-center gap-2">
                      <input 
                        type="radio" 
                        name={`${fieldId}-row-${i}`}
                        className="w-4 h-4"
                        onChange={() => updateFormData(`${fieldId}-${i}`, j)}
                      />
                      <span className="text-xs text-center max-w-16">{scale}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'nps':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{field.npsLabels?.low}</span>
              <span>{field.npsLabels?.high}</span>
            </div>
            <div className="flex justify-between">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <input 
                    type="radio" 
                    name={fieldId}
                    className="w-4 h-4"
                    onChange={() => updateFormData(fieldId, i)}
                  />
                  <span className="text-sm font-medium">{i}</span>
                </div>
              ))}
            </div>
            {formData[fieldId] !== undefined && (
              <div className="text-center text-sm text-muted-foreground">
                Selected: {formData[fieldId]}
              </div>
            )}
          </div>
        );
      
      case 'section':
        return (
          <div className="border-l-4 border-primary pl-4 py-2">
            <h3 className="text-xl font-semibold text-primary">{field.label}</h3>
            {field.description && (
              <p className="text-muted-foreground mt-1">{field.description}</p>
            )}
          </div>
        );
      
      case 'divider':
        return <Separator className="my-6" />;
      
      case 'html':
        return (
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: field.defaultValue || '' }}
          />
        );
      
      case 'image':
        return (
          <div className="rounded-lg overflow-hidden">
            <Image 
              src={field.defaultValue || 'https://via.placeholder.com/400x200'} 
              alt={field.label}
              width={400}
              height={200}
              className="w-full h-auto"
            />
          </div>
        );
      
      case 'video':
        return (
          <div className="rounded-lg overflow-hidden">
            <iframe
              src={field.defaultValue}
              className="w-full h-64"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        );
      
      case 'country':
        return (
          <Select onValueChange={(value) => updateFormData(fieldId, value)}>
            <SelectTrigger {...commonProps}>
              <SelectValue placeholder="Select country..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">🇺🇸 United States</SelectItem>
              <SelectItem value="ca">🇨🇦 Canada</SelectItem>
              <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
              <SelectItem value="de">🇩🇪 Germany</SelectItem>
              <SelectItem value="fr">🇫🇷 France</SelectItem>
              <SelectItem value="au">🇦🇺 Australia</SelectItem>
            </SelectContent>
          </Select>
        );
      
      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input 
              {...commonProps}
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-8"
              onChange={(e) => updateFormData(fieldId, parseFloat(e.target.value))}
            />
          </div>
        );
      
      case 'calculation':
        return (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="text-lg font-semibold">
              {formData[fieldId] || '0'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Calculated field: {field.calculations?.formula || 'No formula'}
            </div>
          </div>
        );
      
      case 'appointment':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Book Appointment</span>
            </div>
            <Input type="date" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="09:00">9:00 AM - 9:30 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM - 10:30 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM - 11:30 AM</SelectItem>
                <SelectItem value="14:00">2:00 PM - 2:30 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM - 3:30 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'captcha':
        return (
          <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">CAPTCHA Verification</span>
              <Badge variant="secondary">Verified</Badge>
            </div>
          </div>
        );
      
      default:
        return (
          <Input 
            {...commonProps}
            placeholder={field.placeholder}
            onChange={(e) => updateFormData(fieldId, e.target.value)}
          />
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${settings.successMessage}\n\nForm Data:\n${JSON.stringify(formData, null, 2)}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{settings.name}</CardTitle>
          {settings.description && (
            <CardDescription className="text-base mt-2">
              {settings.description}
            </CardDescription>
          )}
          
          {settings.enableProgressBar && totalFields > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field, index) => {
              const isLayoutField = ['section', 'divider', 'html', 'image', 'video'].includes(field.type);
              
              return (
                <div 
                  key={field.id} 
                  className={cn(
                    "transition-all duration-200",
                    field.width === 'half' && 'w-1/2 inline-block pr-3',
                    field.width === 'third' && 'w-1/3 inline-block pr-3',
                    field.width === 'quarter' && 'w-1/4 inline-block pr-3',
                    field.type === 'section' && 'mt-8 first:mt-0',
                    field.type === 'divider' && 'my-8'
                  )}
                >
                  {!isLayoutField && field.type !== 'checkbox' && (
                    <div className="space-y-2 mb-3">
                      <Label htmlFor={`preview-${field.id}`} className="text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      {field.description && (
                        <p className="text-xs text-muted-foreground">{field.description}</p>
                      )}
                    </div>
                  )}
                  
                  {renderField(field)}
                  
                  {field.helpText && !isLayoutField && (
                    <p className="text-xs text-muted-foreground mt-1">{field.helpText}</p>
                  )}
                </div>
              );
            })}
            
            {fields.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No fields to preview. Add some fields to see the form.</p>
              </div>
            )}
            
            {fields.length > 0 && (
              <div className="flex gap-3 pt-6">
                {settings.enableSaveAndContinue && (
                  <Button type="button" variant="outline" className="flex-1">
                    Save & Continue Later
                  </Button>
                )}
                <Button type="submit" className="flex-1">
                  {settings.submitButtonText}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
