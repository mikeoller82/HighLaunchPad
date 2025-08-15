import React from 'react';

export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-bold mb-4 text-primary">CSS Test Page</h1>
      <p className="mb-4 text-muted-foreground">If you can see styled text, CSS is working!</p>
      
      <div className="flex gap-4 mb-6">
        <button className="btn btn-primary">Primary Button</button>
        <button className="btn btn-secondary">Secondary Button</button>
        <button className="btn btn-outline">Outline Button</button>
      </div>
      
      <div className="card p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-2">Card Component</h2>
        <p className="text-muted-foreground">This is a card with styling from globals.css</p>
      </div>
      
      <div className="mt-6 p-4 bg-primary text-primary-foreground rounded">
        <p>Primary color background with primary-foreground text</p>
      </div>
    </div>
  );
}