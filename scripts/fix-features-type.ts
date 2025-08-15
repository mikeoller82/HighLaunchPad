#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../src/lib/website-templates.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the features object to be an array
const oldFeatures = `          features: {
            freeShipping: "Free shipping over $150",
            returns: "30-day returns",
            support: "24/7 concierge",
          },`;

const newFeatures = `          features: [
            { title: "Free Shipping", description: "Free shipping over $150" },
            { title: "Easy Returns", description: "30-day returns" },
            { title: "VIP Support", description: "24/7 concierge" },
          ],`;

content = content.replace(oldFeatures, newFeatures);

fs.writeFileSync(filePath, content);
console.log('✅ Fixed features type error in website-templates.ts');