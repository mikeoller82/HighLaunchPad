import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { getAdminApp } from '@/lib/firebase-admin';

// Initialize Firebase Admin SDK
getAdminApp();

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GEMINI_API_KEY }),
  ],
});

