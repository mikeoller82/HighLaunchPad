/**
 * Firestore Error Handler for AI Agents
 * Provides consistent error handling and user-friendly messages
 */

export interface FirestoreError {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  suggestions: string[];
}

export class FirestoreErrorHandler {
  private static instance: FirestoreErrorHandler;

  private constructor() {}

  public static getInstance(): FirestoreErrorHandler {
    if (!FirestoreErrorHandler.instance) {
      FirestoreErrorHandler.instance = new FirestoreErrorHandler();
    }
    return FirestoreErrorHandler.instance;
  }

  /**
   * Handle Firestore errors and provide user-friendly messages
   */
  public handleError(error: any): FirestoreError {
    const code = error?.code || 'unknown';
    const message = error?.message || 'Unknown error occurred';

    switch (code) {
      case 'permission-denied':
        return {
          code,
          message,
          userMessage: 'Access denied. Please check your permissions.',
          retryable: false,
          suggestions: [
            'Ensure you are logged in',
            'Check Firestore security rules',
            'Verify your account has proper permissions'
          ]
        };

      case 'not-found':
        return {
          code,
          message,
          userMessage: 'Document or collection not found.',
          retryable: true,
          suggestions: [
            'Initialize your workspace',
            'Check if the document exists',
            'Verify the document path is correct'
          ]
        };

      case 'unavailable':
        return {
          code,
          message,
          userMessage: 'Service temporarily unavailable. Please try again.',
          retryable: true,
          suggestions: [
            'Wait a moment and try again',
            'Check your internet connection',
            'Verify Firestore service status'
          ]
        };

      case 'deadline-exceeded':
        return {
          code,
          message,
          userMessage: 'Request timed out. Please try again.',
          retryable: true,
          suggestions: [
            'Try again with a smaller request',
            'Check your internet connection',
            'Consider breaking the operation into smaller parts'
          ]
        };

      case 'resource-exhausted':
        return {
          code,
          message,
          userMessage: 'Too many requests. Please wait and try again.',
          retryable: true,
          suggestions: [
            'Wait a few minutes before retrying',
            'Reduce the frequency of requests',
            'Consider upgrading your Firestore plan'
          ]
        };

      case 'failed-precondition':
        return {
          code,
          message,
          userMessage: 'Operation failed due to system state.',
          retryable: true,
          suggestions: [
            'Ensure required documents exist',
            'Check if indexes are properly deployed',
            'Verify document structure is correct'
          ]
        };

      case 'aborted':
        return {
          code,
          message,
          userMessage: 'Operation was aborted due to conflict.',
          retryable: true,
          suggestions: [
            'Try the operation again',
            'Check for concurrent modifications',
            'Use transactions for critical operations'
          ]
        };

      case 'out-of-range':
        return {
          code,
          message,
          userMessage: 'Request parameters are out of valid range.',
          retryable: false,
          suggestions: [
            'Check query parameters',
            'Verify document limits',
            'Ensure valid field values'
          ]
        };

      case 'unimplemented':
        return {
          code,
          message,
          userMessage: 'Feature not implemented or not available.',
          retryable: false,
          suggestions: [
            'Check Firestore documentation',
            'Use alternative approach',
            'Contact support if needed'
          ]
        };

      case 'internal':
        return {
          code,
          message,
          userMessage: 'Internal server error. Please try again later.',
          retryable: true,
          suggestions: [
            'Wait a few minutes and try again',
            'Check Firestore service status',
            'Contact support if problem persists'
          ]
        };

      case 'unauthenticated':
        return {
          code,
          message,
          userMessage: 'Authentication required. Please log in.',
          retryable: false,
          suggestions: [
            'Log in to your account',
            'Check authentication token',
            'Refresh the page and try again'
          ]
        };

      case 'invalid-argument':
        return {
          code,
          message,
          userMessage: 'Invalid request parameters.',
          retryable: false,
          suggestions: [
            'Check request parameters',
            'Verify document structure',
            'Ensure valid field types'
          ]
        };

      default:
        return {
          code,
          message,
          userMessage: 'An unexpected error occurred. Please try again.',
          retryable: true,
          suggestions: [
            'Try the operation again',
            'Check your internet connection',
            'Contact support if problem persists'
          ]
        };
    }
  }

  /**
   * Execute Firestore operation with error handling and retry logic
   */
  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        const firestoreError = this.handleError(error);

        console.warn(`Attempt ${attempt}/${maxRetries} failed:`, firestoreError.userMessage);

        // Don't retry if error is not retryable
        if (!firestoreError.retryable) {
          throw error;
        }

        // Don't delay on last attempt
        if (attempt < maxRetries) {
          await this.delay(delayMs * attempt); // Exponential backoff
        }
      }
    }

    // All retries failed
    throw lastError;
  }

  /**
   * Log error with context information
   */
  public logError(error: any, context: string, userId?: string): void {
    const firestoreError = this.handleError(error);
    
    console.error(`🔥 Firestore Error in ${context}:`, {
      code: firestoreError.code,
      message: firestoreError.message,
      userMessage: firestoreError.userMessage,
      userId: userId || 'unknown',
      timestamp: new Date().toISOString(),
      retryable: firestoreError.retryable,
      suggestions: firestoreError.suggestions
    });
  }

  /**
   * Get user-friendly error message for display
   */
  public getUserMessage(error: any): string {
    const firestoreError = this.handleError(error);
    return firestoreError.userMessage;
  }

  /**
   * Check if error is retryable
   */
  public isRetryable(error: any): boolean {
    const firestoreError = this.handleError(error);
    return firestoreError.retryable;
  }

  /**
   * Get suggestions for resolving the error
   */
  public getSuggestions(error: any): string[] {
    const firestoreError = this.handleError(error);
    return firestoreError.suggestions;
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Convenience function for handling Firestore operations
 */
export async function withFirestoreErrorHandling<T>(
  operation: () => Promise<T>,
  context: string,
  userId?: string
): Promise<T> {
  const errorHandler = FirestoreErrorHandler.getInstance();
  
  try {
    return await errorHandler.executeWithRetry(operation);
  } catch (error) {
    errorHandler.logError(error, context, userId);
    throw error;
  }
}

/**
 * Safe Firestore operation wrapper
 */
export async function safeFirestoreOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  context: string = 'Unknown operation'
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const errorHandler = FirestoreErrorHandler.getInstance();
    errorHandler.logError(error, context);
    
    console.warn(`Using fallback value for ${context}`);
    return fallback;
  }
}