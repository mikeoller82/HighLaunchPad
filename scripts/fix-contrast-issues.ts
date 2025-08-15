#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Color mappings for better contrast
const colorReplacements = {
  // Gray on white backgrounds - replace with blue variants
  'bg-gray-50': 'bg-blue-50',
  'text-gray-500': 'text-blue-600',
  'text-gray-600': 'text-blue-700',
  'text-gray-700': 'text-blue-800',
  'text-gray-400': 'text-blue-500',
  'text-muted-foreground': 'text-blue-600',
  
  // White on gray backgrounds - ensure good contrast
  'bg-gray-900': 'bg-slate-900',
  'bg-gray-800': 'bg-slate-800',
  'text-gray-100': 'text-white',
  'text-gray-200': 'text-white',
  
  // Dashboard specific replacements
  'text-slate-500': 'text-blue-600',
  'text-slate-600': 'text-blue-700',
};

// Template-specific color schemes for uniqueness
const templateColorSchemes = [
  {
    name: 'Ocean',
    colors: {
      'bg-gray-50': 'bg-blue-50',
      'bg-gray-900': 'bg-blue-900',
      'text-gray-900': 'text-blue-900',
      'text-gray-100': 'text-blue-50',
    } as Record<string, string>
  },
  {
    name: 'Forest',
    colors: {
      'bg-gray-50': 'bg-green-50',
      'bg-gray-900': 'bg-green-900',
      'text-gray-900': 'text-green-900',
      'text-gray-100': 'text-green-50',
    } as Record<string, string>
  },
  {
    name: 'Sunset',
    colors: {
      'bg-gray-50': 'bg-orange-50',
      'bg-gray-900': 'bg-orange-900',
      'text-gray-900': 'text-orange-900',
      'text-gray-100': 'text-orange-50',
    } as Record<string, string>
  },
  {
    name: 'Royal',
    colors: {
      'bg-gray-50': 'bg-purple-50',
      'bg-gray-900': 'bg-purple-900',
      'text-gray-900': 'text-purple-900',
      'text-gray-100': 'text-purple-50',
    } as Record<string, string>
  },
  {
    name: 'Ruby',
    colors: {
      'bg-gray-50': 'bg-red-50',
      'bg-gray-900': 'bg-red-900',
      'text-gray-900': 'text-red-900',
      'text-gray-100': 'text-red-50',
    } as Record<string, string>
  },
  {
    name: 'Teal',
    colors: {
      'bg-gray-50': 'bg-teal-50',
      'bg-gray-900': 'bg-teal-900',
      'text-gray-900': 'text-teal-900',
      'text-gray-100': 'text-teal-50',
    } as Record<string, string>
  },
  {
    name: 'Indigo',
    colors: {
      'bg-gray-50': 'bg-indigo-50',
      'bg-gray-900': 'bg-indigo-900',
      'text-gray-900': 'text-indigo-900',
      'text-gray-100': 'text-indigo-50',
    } as Record<string, string>
  },
  {
    name: 'Rose',
    colors: {
      'bg-gray-50': 'bg-rose-50',
      'bg-gray-900': 'bg-rose-900',
      'text-gray-900': 'text-rose-900',
      'text-gray-100': 'text-rose-50',
    } as Record<string, string>
  },
];

function processFile(filePath: string, replacements: Record<string, string>) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const [oldColor, newColor] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, newColor);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
  }
  
  return modified;
}

function fixWebsiteTemplates() {
  console.log('🎨 Fixing website templates...');
  const templateFile = path.join(__dirname, '../src/lib/website-templates.ts');
  
  let content = fs.readFileSync(templateFile, 'utf8');
  
  // Apply unique color schemes to different templates
  let templateIndex = 0;
  const templateRegex = /export const \w+Template[^=]*=\s*{[\s\S]*?(?=export const|\$)/g;
  
  content = content.replace(templateRegex, (match) => {
    const scheme = templateColorSchemes[templateIndex % templateColorSchemes.length];
    let updatedMatch = match;
    
    // Apply the color scheme
    for (const [oldColor, newColor] of Object.entries(scheme.colors)) {
      const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
      updatedMatch = updatedMatch.replace(regex, newColor);
    }
    
    // Also apply general contrast fixes
    for (const [oldColor, newColor] of Object.entries(colorReplacements)) {
      if (!scheme.colors[oldColor]) {
        const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
        updatedMatch = updatedMatch.replace(regex, newColor);
      }
    }
    
    templateIndex++;
    return updatedMatch;
  });
  
  fs.writeFileSync(templateFile, content);
  console.log(`✅ Updated website templates with unique color schemes`);
}

function fixFunnelTemplates() {
  console.log('🎨 Fixing funnel templates...');
  const templateFile = path.join(__dirname, '../src/lib/funnel-templates.ts');
  
  let content = fs.readFileSync(templateFile, 'utf8');
  
  // Apply unique color schemes to different templates
  let templateIndex = 0;
  const templateRegex = /export const \w+FunnelTemplate[^=]*=\s*{[\s\S]*?(?=export const|\$)/g;
  
  content = content.replace(templateRegex, (match) => {
    const scheme = templateColorSchemes[templateIndex % templateColorSchemes.length];
    let updatedMatch = match;
    
    // Apply the color scheme
    for (const [oldColor, newColor] of Object.entries(scheme.colors)) {
      const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
      updatedMatch = updatedMatch.replace(regex, newColor);
    }
    
    // Also apply general contrast fixes
    for (const [oldColor, newColor] of Object.entries(colorReplacements)) {
      if (!scheme.colors[oldColor]) {
        const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
        updatedMatch = updatedMatch.replace(regex, newColor);
      }
    }
    
    templateIndex++;
    return updatedMatch;
  });
  
  fs.writeFileSync(templateFile, content);
  console.log(`✅ Updated funnel templates with unique color schemes`);
}

function fixDashboardComponents() {
  console.log('🎨 Fixing dashboard components...');
  
  const dashboardFiles = [
    'src/app/dashboard/layout.tsx',
    'src/app/dashboard/page.tsx',
    'src/app/dashboard/links/page.tsx',
    'src/app/dashboard/docs/page.tsx',
    'src/app/dashboard/docs/[docId]/page.tsx',
    'src/app/dashboard/support/page.tsx',
    'src/app/dashboard/courses/page.tsx',
    'src/components/ui/sidebar.tsx',
  ];
  
  for (const file of dashboardFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      processFile(filePath, colorReplacements);
    }
  }
  
  // Find and fix all dashboard files
  const dashboardDir = path.join(__dirname, '../src/app/dashboard');
  const componentDir = path.join(__dirname, '../src/components');
  
  function walkDir(dir: string) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        processFile(filePath, colorReplacements);
      }
    }
  }
  
  walkDir(dashboardDir);
  walkDir(componentDir);
}

// Main execution
console.log('🚀 Starting contrast fix process...\n');

fixWebsiteTemplates();
console.log('');

fixFunnelTemplates();
console.log('');

fixDashboardComponents();

console.log('\n✨ Contrast fix complete!');