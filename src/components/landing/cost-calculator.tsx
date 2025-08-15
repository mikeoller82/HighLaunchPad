'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, TrendingDown, Zap } from 'lucide-react';

const tools = [
  { name: 'Website Builder', price: 29, description: 'Wix, Squarespace, etc.', checked: true },
  { name: 'Funnel Builder', price: 97, description: 'ClickFunnels, Leadpages', checked: true },
  { name: 'Email Marketing', price: 49, description: 'Mailchimp, ConvertKit', checked: true },
  { name: 'CRM System', price: 50, description: 'HubSpot, Pipedrive', checked: true },
  { name: 'Course Platform', price: 39, description: 'Teachable, Thinkific', checked: false },
  { name: 'Scheduling Tool', price: 15, description: 'Calendly, Acuity', checked: false },
  { name: 'Analytics Tool', price: 25, description: 'Google Analytics Pro', checked: false },
  { name: 'Social Scheduler', price: 19, description: 'Buffer, Hootsuite', checked: false },
  { name: 'Form Builder', price: 20, description: 'Typeform, JotForm', checked: false },
  { name: 'Live Chat', price: 16, description: 'Intercom, Drift', checked: false },
];

export function CostCalculator() {
  const [selectedTools, setSelectedTools] = useState(
    tools.map(tool => ({ ...tool, checked: tool.checked }))
  );

  const toggleTool = (index: number) => {
    setSelectedTools(prev => 
      prev.map((tool, i) => 
        i === index ? { ...tool, checked: !tool.checked } : tool
      )
    );
  };

  const totalCost = selectedTools
    .filter(tool => tool.checked)
    .reduce((sum, tool) => sum + tool.price, 0);

  const annualCost = totalCost * 12;
  const highLaunchPadCost = 29;
  const annualSavings = annualCost - (highLaunchPadCost * 12);
  const monthlySavings = totalCost - highLaunchPadCost;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 font-medium">
          <Calculator className="h-5 w-5" />
          Interactive Cost Calculator
        </div>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
           See How Much You&apos;ll Save        </h2>
        <p className="mt-4 text-lg text-blue-600 max-w-2xl mx-auto">
           Select the tools you&apos;re currently using (or planning to use) and see your potential savings with HighLaunchPad.        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Tool Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Your Current Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedTools.map((tool, index) => (
                <div key={tool.name} className="flex items-center space-x-3">
                  <Checkbox
                    id={`tool-${index}`}
                    checked={tool.checked}
                    onCheckedChange={() => toggleTool(index)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`tool-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {tool.name}
                    </label>
                    <p className="text-xs text-blue-600">{tool.description}</p>
                  </div>
                  <Badge variant="outline">${tool.price}/mo</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {/* Current Cost */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Your Current Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Monthly Total:</span>
                  <span className="text-2xl font-bold text-destructive">${totalCost}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-blue-600">
                  <span>Annual Total:</span>
                  <span>${annualCost.toLocaleString()}</span>
                </div>
                <div className="text-xs text-blue-600 pt-2 border-t">
                  {selectedTools.filter(t => t.checked).length} tools selected
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HighLaunchPad Cost */}
          <Card className="border-primary/50 border-2">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Zap className="h-5 w-5" />
                With HighLaunchPad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Monthly Cost:</span>
                  <span className="text-2xl font-bold text-primary">${highLaunchPadCost}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-blue-600">
                  <span>Annual Cost:</span>
                  <span>${(highLaunchPadCost * 12).toLocaleString()}</span>
                </div>
                <div className="text-xs text-primary pt-2 border-t font-medium">
                  All tools included + AI features
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Savings */}
          {totalCost > highLaunchPadCost && (
            <Card className="border-green-500/50 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Your Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Monthly Savings:</span>
                    <span className="text-2xl font-bold text-green-700">${monthlySavings}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-blue-600">
                    <span>Annual Savings:</span>
                    <span className="text-green-700 font-semibold">${annualSavings.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-green-700 pt-2 border-t font-medium">
                    {Math.round((monthlySavings / totalCost) * 100)}% cost reduction
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            size="lg" 
            className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all"
          >
            Get Early Access + 50% Launch Discount
          </Button>
          <p className="text-xs text-center text-blue-600">
            30-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}