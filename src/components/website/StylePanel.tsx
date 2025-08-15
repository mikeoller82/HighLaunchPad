'use client';

import React, { useState } from 'react';
import { Component, ComponentDesign } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Palette, 
  Type, 
  Layout, 
  Square,
  Frame,
  Zap as Shadow,
  RotateCcw,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Link,
  Image as ImageIcon,
  Video,
  Zap,
  MousePointer,
  Move,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Layers,
  ChevronDown,
  ChevronUp,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StylePanelProps {
  component: Component;
  onUpdate: (component: Component) => void;
}

// Color Palette Presets
const COLOR_PRESETS = {
  primary: ['#3B82F6', '#1D4ED8', '#1E40AF', '#1E3A8A', '#312E81'],
  secondary: ['#6B7280', '#4B5563', '#374151', '#1F2937', '#111827'],
  success: ['#10B981', '#059669', '#047857', '#065F46', '#064E3B'],
  warning: ['#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F'],
  danger: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D'],
  info: ['#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63'],
};

// Font Families
const FONT_FAMILIES = [
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Lato, sans-serif', label: 'Lato' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Playfair Display, serif', label: 'Playfair Display' },
  { value: 'Merriweather, serif', label: 'Merriweather' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Monaco, monospace', label: 'Monaco' },
];

// Animation Presets
const ANIMATION_PRESETS = [
  { value: 'none', label: 'None' },
  { value: 'fadeIn', label: 'Fade In' },
  { value: 'slideInUp', label: 'Slide Up' },
  { value: 'slideInDown', label: 'Slide Down' },
  { value: 'slideInLeft', label: 'Slide Left' },
  { value: 'slideInRight', label: 'Slide Right' },
  { value: 'zoomIn', label: 'Zoom In' },
  { value: 'zoomOut', label: 'Zoom Out' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'shake', label: 'Shake' },
  { value: 'flip', label: 'Flip' },
];

// Color Picker Component
const ColorPicker = ({ 
  value, 
  onChange, 
  label,
  presets 
}: { 
  value: string; 
  onChange: (color: string) => void; 
  label: string;
  presets?: string[];
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'color';
            input.value = value;
            input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
            input.click();
          }}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 text-xs"
        />
      </div>
      {presets && (
        <div className="flex flex-wrap gap-1">
          {presets.map((color) => (
            <div
              key={color}
              className="w-6 h-6 rounded cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Spacing Control Component
const SpacingControl = ({ 
  value, 
  onChange, 
  label,
  min = 0,
  max = 100,
  step = 1
}: { 
  value: number; 
  onChange: (value: number) => void; 
  label: string;
  min?: number;
  max?: number;
  step?: number;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-xs text-blue-600">{value}px</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
};

export const StylePanel: React.FC<StylePanelProps> = ({ component, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('design');
  
  const design = {
    ...(component.design || {}),
    typography: (component.design && component.design.typography) || {},
    colors: (component.design && component.design.colors) || {},
    shadows: (component.design && component.design.shadows) || {},
    borders: (component.design && component.design.borders) || {},
    interactions: (component.design && component.design.interactions) || {},
  };
  const content = component.content || {};

  const updateDesign = (updates: Partial<ComponentDesign>) => {
    onUpdate({
      ...component,
      design: {
        ...design,
        ...updates,
        typography: (design.typography ?? {}),
        colors: (design.colors ?? {}),
        shadows: (design.shadows ?? {}),
        borders: (design.borders ?? {}),
        interactions: (design.interactions ?? {}),
      },
    });
  };

  const updateContent = (updates: any) => {
    onUpdate({
      ...component,
      content: { ...content, ...updates }
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Style Panel</h3>
        <p className="text-sm text-blue-700 capitalize">{component.type} Component</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto p-4 space-y-6">
          <TabsContent value="design" className="space-y-6 mt-0">
            {/* Theme Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Theme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Style Theme</Label>
                  <Select 
                    value={design.theme || 'corporate'} 
                    onValueChange={(value) => updateDesign({ theme: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="elegant">Elegant</SelectItem>
                      <SelectItem value="energetic">Energetic</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="nature">Nature</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Colors */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ColorPicker
                  value={design.backgroundColor || '#ffffff'}
                  onChange={(color) => updateDesign({ backgroundColor: color })}
                  label="Background Color"
                  presets={COLOR_PRESETS.primary}
                />
                <ColorPicker
                  value={design.textColor || '#000000'}
                  onChange={(color) => updateDesign({ textColor: color })}
                  label="Text Color"
                  presets={COLOR_PRESETS.secondary}
                />
                <ColorPicker
                  value={design.accentColor || '#3B82F6'}
                  onChange={(color) => updateDesign({ accentColor: color })}
                  label="Accent Color"
                  presets={COLOR_PRESETS.primary}
                />
              </CardContent>
            </Card>

            {/* Typography */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Font Family</Label>
                  <Select 
                    value={content.fontFamily || 'Inter, sans-serif'} 
                    onValueChange={(value) => updateContent({ fontFamily: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>{font.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <SpacingControl
                  value={content.fontSize || 16}
                  onChange={(value) => updateContent({ fontSize: value })}
                  label="Font Size"
                  min={8}
                  max={72}
                />

                <SpacingControl
                  value={content.lineHeight || 1.5}
                  onChange={(value) => updateContent({ lineHeight: value })}
                  label="Line Height"
                  min={1}
                  max={3}
                  step={0.1}
                />

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={content.fontWeight === 'bold' ? 'default' : 'outline'}
                    onClick={() => updateContent({ 
                      fontWeight: content.fontWeight === 'bold' ? 'normal' : 'bold' 
                    })}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={content.fontStyle === 'italic' ? 'default' : 'outline'}
                    onClick={() => updateContent({ 
                      fontStyle: content.fontStyle === 'italic' ? 'normal' : 'italic' 
                    })}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={content.textDecoration === 'underline' ? 'default' : 'outline'}
                    onClick={() => updateContent({ 
                      textDecoration: content.textDecoration === 'underline' ? 'none' : 'underline' 
                    })}
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={content.textAlign === 'left' ? 'default' : 'outline'}
                    onClick={() => updateContent({ textAlign: 'left' })}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={content.textAlign === 'center' ? 'default' : 'outline'}
                    onClick={() => updateContent({ textAlign: 'center' })}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={content.textAlign === 'right' ? 'default' : 'outline'}
                    onClick={() => updateContent({ textAlign: 'right' })}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={content.textAlign === 'justify' ? 'default' : 'outline'}
                    onClick={() => updateContent({ textAlign: 'justify' })}
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6 mt-0">
            {/* Layout Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Layout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Layout Style</Label>
                  <Select 
                    value={design.layout || 'default'} 
                    onValueChange={(value) => updateDesign({ layout: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="split">Split Layout</SelectItem>
                      <SelectItem value="centered">Centered</SelectItem>
                      <SelectItem value="full-width-image">Full Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Spacing */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  Spacing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SpacingControl
                  value={content.paddingTop || 0}
                  onChange={(value) => updateContent({ paddingTop: value })}
                  label="Padding Top"
                  max={200}
                />
                <SpacingControl
                  value={content.paddingBottom || 0}
                  onChange={(value) => updateContent({ paddingBottom: value })}
                  label="Padding Bottom"
                  max={200}
                />
                <SpacingControl
                  value={content.paddingLeft || 0}
                  onChange={(value) => updateContent({ paddingLeft: value })}
                  label="Padding Left"
                  max={200}
                />
                <SpacingControl
                  value={content.paddingRight || 0}
                  onChange={(value) => updateContent({ paddingRight: value })}
                  label="Padding Right"
                  max={200}
                />
                
                <Separator />
                
                <SpacingControl
                  value={content.marginTop || 0}
                  onChange={(value) => updateContent({ marginTop: value })}
                  label="Margin Top"
                  max={200}
                />
                <SpacingControl
                  value={content.marginBottom || 0}
                  onChange={(value) => updateContent({ marginBottom: value })}
                  label="Margin Bottom"
                  max={200}
                />
              </CardContent>
            </Card>

            {/* Border & Radius */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Frame className="h-4 w-4" />
                  Border
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SpacingControl
                  value={content.borderWidth || 0}
                  onChange={(value) => updateContent({ borderWidth: value })}
                  label="Border Width"
                  max={20}
                />
                <ColorPicker
                  value={content.borderColor || '#e5e7eb'}
                  onChange={(color) => updateContent({ borderColor: color })}
                  label="Border Color"
                  presets={COLOR_PRESETS.secondary}
                />
                <SpacingControl
                  value={content.borderRadius || 0}
                  onChange={(value) => updateContent({ borderRadius: value })}
                  label="Border Radius"
                  max={50}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="effects" className="space-y-6 mt-0">
            {/* Shadow */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shadow className="h-4 w-4" />
                  Shadow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Enable Shadow</Label>
                  <Switch
                    checked={content.hasShadow || false}
                    onCheckedChange={(checked) => updateContent({ hasShadow: checked })}
                  />
                </div>
                
                {content.hasShadow && (
                  <>
                    <SpacingControl
                      value={content.shadowBlur || 10}
                      onChange={(value) => updateContent({ shadowBlur: value })}
                      label="Shadow Blur"
                      max={50}
                    />
                    <SpacingControl
                      value={content.shadowSpread || 0}
                      onChange={(value) => updateContent({ shadowSpread: value })}
                      label="Shadow Spread"
                      min={-20}
                      max={20}
                    />
                    <ColorPicker
                      value={content.shadowColor || '#00000020'}
                      onChange={(color) => updateContent({ shadowColor: color })}
                      label="Shadow Color"
                      presets={['#00000010', '#00000020', '#00000040', '#00000060', '#00000080']}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Animation */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Animation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Animation Type</Label>
                  <Select 
                    value={content.animation || 'none'} 
                    onValueChange={(value) => updateContent({ animation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ANIMATION_PRESETS.map((animation) => (
                        <SelectItem key={animation.value} value={animation.value}>
                          {animation.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {content.animation && content.animation !== 'none' && (
                  <>
                    <SpacingControl
                      value={content.animationDuration || 1}
                      onChange={(value) => updateContent({ animationDuration: value })}
                      label="Duration (seconds)"
                      min={0.1}
                      max={5}
                      step={0.1}
                    />
                    <SpacingControl
                      value={content.animationDelay || 0}
                      onChange={(value) => updateContent({ animationDelay: value })}
                      label="Delay (seconds)"
                      min={0}
                      max={3}
                      step={0.1}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Transform */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <RotateCw className="h-4 w-4" />
                  Transform
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SpacingControl
                  value={content.rotate || 0}
                  onChange={(value) => updateContent({ rotate: value })}
                  label="Rotation (degrees)"
                  min={-180}
                  max={180}
                />
                <SpacingControl
                  value={content.scale || 1}
                  onChange={(value) => updateContent({ scale: value })}
                  label="Scale"
                  min={0.1}
                  max={3}
                  step={0.1}
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={content.flipHorizontal ? 'default' : 'outline'}
                    onClick={() => updateContent({ flipHorizontal: !content.flipHorizontal })}
                  >
                    <FlipHorizontal className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={content.flipVertical ? 'default' : 'outline'}
                    onClick={() => updateContent({ flipVertical: !content.flipVertical })}
                  >
                    <FlipVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-0">
            {/* Visibility */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Visible</Label>
                  <Switch
                    checked={content.visible !== false}
                    onCheckedChange={(checked) => updateContent({ visible: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Hide on Mobile</Label>
                  <Switch
                    checked={content.hideOnMobile || false}
                    onCheckedChange={(checked) => updateContent({ hideOnMobile: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Hide on Tablet</Label>
                  <Switch
                    checked={content.hideOnTablet || false}
                    onCheckedChange={(checked) => updateContent({ hideOnTablet: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Hide on Desktop</Label>
                  <Switch
                    checked={content.hideOnDesktop || false}
                    onCheckedChange={(checked) => updateContent({ hideOnDesktop: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Position */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Move className="h-4 w-4" />
                  Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Position Type</Label>
                  <Select 
                    value={content.position || 'static'} 
                    onValueChange={(value) => updateContent({ position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="static">Static</SelectItem>
                      <SelectItem value="relative">Relative</SelectItem>
                      <SelectItem value="absolute">Absolute</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="sticky">Sticky</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {content.position && content.position !== 'static' && (
                  <>
                    <SpacingControl
                      value={content.top || 0}
                      onChange={(value) => updateContent({ top: value })}
                      label="Top"
                      min={-200}
                      max={200}
                    />
                    <SpacingControl
                      value={content.left || 0}
                      onChange={(value) => updateContent({ left: value })}
                      label="Left"
                      min={-200}
                      max={200}
                    />
                    <SpacingControl
                      value={content.zIndex || 0}
                      onChange={(value) => updateContent({ zIndex: value })}
                      label="Z-Index"
                      min={-10}
                      max={100}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Custom CSS */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Custom CSS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">CSS Classes</Label>
                  <Input
                    value={content.customClasses || ''}
                    onChange={(e) => updateContent({ customClasses: e.target.value })}
                    placeholder="custom-class another-class"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Custom Styles</Label>
                  <textarea
                    value={content.customStyles || ''}
                    onChange={(e) => updateContent({ customStyles: e.target.value })}
                    placeholder="color: red; font-size: 18px;"
                    className="w-full h-20 p-2 border rounded text-xs font-mono"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};