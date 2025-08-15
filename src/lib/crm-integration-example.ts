// CRM Integration Example
// This file demonstrates how to integrate AI agents with CRM systems

import { Deal, PipelineStage } from './crm-types';
import { DealValidator } from './deal-validation';

// Example: Creating a deal with AI predictions
export function createDealExample(): Partial<Deal> {
  const deal: Partial<Deal> = {
    id: 'deal-123',
    title: 'Enterprise Software License',
    description: 'Large enterprise client interested in our software solution',
    
    // Financial details
    value: 50000,
    contactId: 'customer-456',
    assignedTo: 'sales-rep-789',
    
    // Deal details
    stage: {
      id: 'proposal',
      name: 'Proposal',
      color: '#fbbf24',
      order: 2
    } as PipelineStage,
    currency: 'USD',
    expectedCloseDate: new Date('2024-04-15'),
    
    // Pipeline Management  
    probability: 70,
    
    // Required Deal properties
    status: 'active' as any, // Using DealStatus
    tags: ['enterprise', 'software'],
    customFields: {
      // AI Predictions stored in customFields
      aiPredictions: {
        closureProbability: 0.72,
        predictedCloseDate: new Date('2024-04-10'),
        confidenceInterval: {
          lower: new Date('2024-04-05'),
          upper: new Date('2024-04-20'),
          confidence: 0.85
        },
        valueConfidence: 0.78,
        stageProgression: [{
          fromStage: { id: 'proposal', name: 'Proposal', color: '#fbbf24', order: 2 } as PipelineStage,
          toStage: { id: 'negotiation', name: 'Negotiation', color: '#f59e0b', order: 3 } as PipelineStage,
          probability: 0.65,
          estimatedDays: 5,
          confidence: 0.78,
          requiredActions: ['Follow up on proposal', 'Schedule demo']
        }],
      timeToClose: {
        estimated: 15, // days
        range: {
          min: 10,
          max: 25
        },
        confidence: 0.80
      },
      winProbabilityTrend: [
        {
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          probability: 0.60,
          factors: ['Initial contact made']
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          probability: 0.65,
          factors: ['Demo scheduled']
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          probability: 0.70,
          factors: ['Proposal sent']
        },
        {
          date: new Date(), // today
          probability: 0.72,
          factors: ['Follow-up completed']
        }
      ],
        modelVersion: '1.2.0',
        lastUpdated: new Date()
      }
    },
    userId: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return deal;
}

// Example: Validating a deal
export function validateDealExample(): boolean {
  const deal = createDealExample();
  
  try {
    const validationResult = DealValidator.validateDeal(deal);
    console.log('Deal validation result:', validationResult);
    return validationResult.isValid;
  } catch (error) {
    console.error('Deal validation failed:', error);
    return false;
  }
}

// Example: Processing deal updates
export function processDealUpdate(dealId: string, updates: Partial<Deal>): Partial<Deal> | null {
  console.log(`Processing deal update for ${dealId}:`, updates);
  
  // This would typically fetch the deal from the database
  const existingDeal = createDealExample();
  
  // Apply updates
  const updatedDeal: Partial<Deal> = {
    ...existingDeal,
    ...updates,
    updatedAt: new Date()
  };
  
  // Validate the updated deal
  if (DealValidator.validateDeal(updatedDeal).isValid) {
    console.log('Deal updated successfully');
    return updatedDeal;
  } else {
    console.error('Deal update validation failed');
    return null;
  }
}