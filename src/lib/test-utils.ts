import { NextRequest, NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Test environment setup utilities
export class TestEnvironment {
  private static testCollectionPrefix = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  private static createdCollections: string[] = [];
  
  // Setup test environment
  static async setup() {
    // Set test environment
    process.env.NODE_ENV = 'test';
    
    // Initialize Firebase for testing
    try {
      const app = getAdminApp();
      const db = getFirestore(app);
      return db;
    } catch (error) {
      console.error('Failed to setup test environment:', error);
      throw error;
    }
  }
  
  // Cleanup test environment
  static async cleanup() {
    try {
      const app = getAdminApp();
      const db = getFirestore(app);
      
      // Delete all test collections
      for (const collectionName of this.createdCollections) {
        const collection = db.collection(collectionName);
        const snapshot = await collection.get();
        
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
      }
      
      this.createdCollections = [];
    } catch (error) {
      console.error('Failed to cleanup test environment:', error);
    }
  }
  
  // Create a test collection name
  static createTestCollection(baseName: string): string {
    const collectionName = `${this.testCollectionPrefix}_${baseName}`;
    this.createdCollections.push(collectionName);
    return collectionName;
  }
  
  // Create test user data
  static createTestUser(overrides: any = {}) {
    return {
      uid: `test_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: `test_${Date.now()}@example.com`,
      displayName: 'Test User',
      createdAt: new Date(),
      ...overrides
    };
  }
  
  // Create test workspace data
  static createTestWorkspace(userId: string, overrides: any = {}) {
    return {
      id: `test_workspace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Test Workspace',
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }
}

// Mock request factory
export class MockRequest {
  static create(options: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: any;
    searchParams?: URLSearchParams;
  } = {}): NextRequest {
    const {
      method = 'GET',
      url = 'http://localhost:3000/api/test',
      headers = {},
      body = null,
      searchParams = new URLSearchParams()
    } = options;
    
    const request = new NextRequest(url, {
      method,
      headers: new Headers(headers),
      body: body ? JSON.stringify(body) : null,
    });
    
    // Add search params if provided
    if (searchParams.toString()) {
      const urlWithParams = new URL(url);
      urlWithParams.search = searchParams.toString();
      return new NextRequest(urlWithParams.toString(), {
        method,
        headers: new Headers(headers),
        body: body ? JSON.stringify(body) : null,
      });
    }
    
    return request;
  }
  
  // Create authenticated request with Bearer token
  static createAuthenticated(token: string, options: any = {}): NextRequest {
    return this.create({
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  }
  
  // Create request with JSON body
  static createWithJson(body: any, options: any = {}): NextRequest {
    return this.create({
      ...options,
      method: options.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body
    });
  }
}

// Response testing utilities
export class ResponseHelper {
  static async getJsonBody(response: NextResponse): Promise<any> {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${text}`);
    }
  }
  
  static expectStatus(response: NextResponse, expectedStatus: number) {
    if (response.status !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
    }
  }
  
  static expectJSONResponse(response: NextResponse) {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON response, got content-type: ${contentType}`);
    }
  }
  
  static expectHeaders(response: NextResponse, headers: Record<string, string>) {
    for (const [key, value] of Object.entries(headers)) {
      const actualValue = response.headers.get(key);
      if (actualValue !== value) {
        throw new Error(`Expected header ${key}: ${value}, got: ${actualValue}`);
      }
    }
  }
}

// Database testing utilities
export class DatabaseHelper {
  static async createTestDocument(collection: string, data: any, id?: string) {
    const app = getAdminApp();
    const db = getFirestore(app);
    
    const docRef = id ? db.collection(collection).doc(id) : db.collection(collection).doc();
    await docRef.set({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return docRef.id;
  }
  
  static async getTestDocument(collection: string, id: string) {
    const app = getAdminApp();
    const db = getFirestore(app);
    
    const doc = await db.collection(collection).doc(id).get();
    return doc.exists ? doc.data() : null;
  }
  
  static async deleteTestDocument(collection: string, id: string) {
    const app = getAdminApp();
    const db = getFirestore(app);
    
    await db.collection(collection).doc(id).delete();
  }
  
  static async clearTestCollection(collection: string) {
    const app = getAdminApp();
    const db = getFirestore(app);
    
    const snapshot = await db.collection(collection).get();
    const batch = db.batch();
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  }
}

// Authentication testing utilities
export class AuthHelper {
  static createMockToken(payload: any = {}) {
    // In real tests, you'd use a proper JWT library
    // This is a simple mock for demonstration
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const body = Buffer.from(JSON.stringify({
      uid: 'test_user_123',
      email: 'test@example.com',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      ...payload
    })).toString('base64');
    const signature = 'mock_signature';
    
    return `${header}.${body}.${signature}`;
  }
  
  static extractTokenPayload(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      return JSON.parse(Buffer.from(parts[1], 'base64').toString());
    } catch (error) {
      throw new Error('Failed to parse token payload');
    }
  }
}

// API testing helpers
export class APITestHelper {
  static async testEndpoint(
    handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
    request: NextRequest,
    expectations: {
      status?: number;
      headers?: Record<string, string>;
      bodyContains?: string[];
      bodyEquals?: any;
    } = {}
  ) {
    const response = await handler(request, {});
    
    // Test status
    if (expectations.status !== undefined) {
      ResponseHelper.expectStatus(response, expectations.status);
    }
    
    // Test headers
    if (expectations.headers) {
      ResponseHelper.expectHeaders(response, expectations.headers);
    }
    
    // Test body content
    if (expectations.bodyContains || expectations.bodyEquals) {
      ResponseHelper.expectJSONResponse(response);
      const body = await ResponseHelper.getJsonBody(response);
      
      if (expectations.bodyEquals) {
        expect(body).toEqual(expectations.bodyEquals);
      }
      
      if (expectations.bodyContains) {
        const bodyString = JSON.stringify(body);
        for (const content of expectations.bodyContains) {
          if (!bodyString.includes(content)) {
            throw new Error(`Response body does not contain: ${content}`);
          }
        }
      }
    }
    
    return response;
  }
}

// Performance testing utilities
export class PerformanceHelper {
  static async measureEndpointPerformance(
    handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
    request: NextRequest,
    iterations = 10
  ) {
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      await handler(request, {});
      const end = Date.now();
      times.push(end - start);
    }
    
    const average = times.reduce((sum, time) => sum + time, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    
    return {
      average,
      min,
      max,
      times,
      iterations
    };
  }
}

const testUtils = {
  TestEnvironment,
  MockRequest,
  ResponseHelper,
  DatabaseHelper,
  AuthHelper,
  APITestHelper,
  PerformanceHelper
};

export default testUtils;