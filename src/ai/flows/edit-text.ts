import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';

const EditTextInputSchema = z.object({
  text: z.string().describe('The original text to be edited.'),
  instruction: z.string().describe('Editing instructions (e.g., "summarize", "fix grammar")'),
  temperature: z.number().min(0).max(1).default(0.7).optional()
});
export type EditTextInput = z.infer<typeof EditTextInputSchema>;

const EditTextOutputSchema = z.object({
  editedText: z.string().describe('The resulting edited text.')
});
export type EditTextOutput = z.infer<typeof EditTextOutputSchema>;

export const editTextFlow = ai.defineFlow({
  name: 'editTextFlow',
  inputSchema: EditTextInputSchema,
  outputSchema: EditTextOutputSchema,
}, async (input: EditTextInput) => {
  const { text, instruction, temperature = 0.7 } = input;
  const prompt = `You are an expert copy editor. Edit the text below based on these instructions:

## Instruction
${instruction}

## Original Text
${text}

Return ONLY the edited text in JSON format with key 'editedText'`;

  try {
    const response = await ai.generate({
      model: googleAI.model('gemini-2.0-flash'),
      prompt: prompt,
      config: { temperature },
      output: { 
        format: 'json',
        schema: EditTextOutputSchema
      }
    });

    if (!response.output || typeof response.output.editedText !== 'string') {
      throw new Error("Invalid response format from AI model");
    }
    
    return response.output;
  } catch (error) {
    console.error("Text editing failed:", error);
    throw new Error(`Text editing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});
