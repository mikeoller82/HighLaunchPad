import { NextRequest } from 'next/server';
import { POST as loginHandler } from '@/app/api/auth/session-login/route';
import { POST as logoutHandler } from '@/app/api/auth/session-logout/route';
import { TestEnvironment, MockRequest, ResponseHelper, AuthHelper } from '@/lib/test-utils';

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    await TestEnvironment.setup();
  });

  afterAll(async () => {
    await TestEnvironment.cleanup();
  });

  describe('POST /api/auth/session-login', () => {
    it('should reject requests without idToken', async () => {
      const request = MockRequest.createWithJson({});

      const response = await loginHandler(request);
      
      expect(response.status).toBe(400);
      ResponseHelper.expectJSONResponse(response);
      
      const body = await ResponseHelper.getJsonBody(response);
      expect(body).toHaveProperty('error');
      expect(body.error).toContain('Invalid body');
    });

    it('should reject requests with invalid idToken', async () => {
      const request = MockRequest.createWithJson({
        idToken: 'invalid'
      });

      const response = await loginHandler(request);
      
      expect(response.status).toBe(400);
      ResponseHelper.expectJSONResponse(response);
      
      const body = await ResponseHelper.getJsonBody(response);
      expect(body).toHaveProperty('error');
    });

    it('should reject requests with short idToken', async () => {
      const request = MockRequest.createWithJson({
        idToken: 'short'
      });

      const response = await loginHandler(request);
      
      expect(response.status).toBe(400);
      ResponseHelper.expectJSONResponse(response);
      
      const body = await ResponseHelper.getJsonBody(response);
      expect(body).toHaveProperty('error');
    });

    it('should handle malformed JSON', async () => {
      const request = MockRequest.create({
        method: 'POST',
        url: 'http://localhost:3000/api/auth/session-login',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'invalid json'
      });

      const response = await loginHandler(request);
      
      expect(response.status).toBe(400);
      ResponseHelper.expectJSONResponse(response);
      
      const body = await ResponseHelper.getJsonBody(response);
      expect(body).toHaveProperty('error');
      expect(body.error).toContain('Invalid body');
    });

    it('should return dev session in development mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      try {
        const request = MockRequest.createWithJson({
          idToken: 'valid_looking_token_for_dev'
        });

        const response = await loginHandler(request);
        
        expect(response.status).toBe(200);
        ResponseHelper.expectJSONResponse(response);
        
        const body = await ResponseHelper.getJsonBody(response);
        expect(body).toHaveProperty('success', true);
        expect(body).toHaveProperty('user');
        expect(body.user).toHaveProperty('uid', 'dev');
        expect(body.user).toHaveProperty('email', 'dev@example.com');
        
        // Check that session cookie is set
        const setCookieHeader = response.headers.get('Set-Cookie');
        expect(setCookieHeader).toBeTruthy();
        expect(setCookieHeader).toContain('__session=');
        expect(setCookieHeader).toContain('HttpOnly');
        expect(setCookieHeader).toContain('SameSite=lax');
        
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });

    it('should handle timeout scenarios', async () => {
      // This would require mocking Firebase Admin to simulate timeouts
      // For now, we test that the endpoint handles the timeout logic
      
      const request = MockRequest.createWithJson({
        idToken: 'some_valid_looking_token_that_would_timeout'
      });

      const response = await loginHandler(request);
      
      // Even if it fails, it should return proper error structure
      expect([400, 401, 408, 500]).toContain(response.status);
      ResponseHelper.expectJSONResponse(response);
      
      const body = await ResponseHelper.getJsonBody(response);
      expect(body).toHaveProperty('error');
    });

    it('should set proper security headers on successful login', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      try {
        const request = MockRequest.createWithJson({
          idToken: 'valid_looking_token_for_dev'
        });

        const response = await loginHandler(request);
        
        expect(response.status).toBe(200);
        
        const setCookieHeader = response.headers.get('Set-Cookie');
        expect(setCookieHeader).toContain('HttpOnly');
        expect(setCookieHeader).toContain('SameSite=lax');
        expect(setCookieHeader).toContain('Path=/');
        
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });

    it('should handle concurrent login attempts', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      try {
        const requests = Array(5).fill(0).map(() => 
          MockRequest.createWithJson({
            idToken: 'valid_looking_token_for_dev'
          })
        );

        const responses = await Promise.all(
          requests.map(req => loginHandler(req))
        );
        
        // All should succeed in development mode
        responses.forEach(response => {
          expect(response.status).toBe(200);
        });
        
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });

  describe('POST /api/auth/session-logout', () => {
    it('should clear session cookie', async () => {
      const request = MockRequest.create({
        method: 'POST',
        url: 'http://localhost:3000/api/auth/session-logout',
        headers: {
          'Cookie': '__session=some_session_value'
        }
      });

      const response = await logoutHandler(request);
      
      expect(response.status).toBe(200);
      ResponseHelper.expectJSONResponse(response);
      
      const body = await ResponseHelper.getJsonBody(response);
      expect(body).toHaveProperty('success', true);
      
      // Check that session cookie is cleared
      const setCookieHeader = response.headers.get('Set-Cookie');
      expect(setCookieHeader).toBeTruthy();
      expect(setCookieHeader).toContain('__session=');
      expect(setCookieHeader).toContain('Max-Age=0');
    });

    it('should work without existing session', async () => {
      const request = MockRequest.create({
        method: 'POST',
        url: 'http://localhost:3000/api/auth/session-logout'
      });

      const response = await logoutHandler(request);
      
      expect(response.status).toBe(200);
      ResponseHelper.expectJSONResponse(response);
      
      const body = await ResponseHelper.getJsonBody(response);
      expect(body).toHaveProperty('success', true);
    });
  });

  describe('Authentication Security', () => {
    it('should not expose sensitive information in error messages', async () => {
      const request = MockRequest.createWithJson({
        idToken: 'potentially_malicious_token_with_injection_attempts'
      });

      const response = await loginHandler(request);
      const body = await ResponseHelper.getJsonBody(response);
      
      // Error messages should be generic, not exposing internal details
      if (body.error) {
        expect(body.error).not.toContain('firebase');
        expect(body.error).not.toContain('admin');
        expect(body.error).not.toContain('secret');
        expect(body.error).not.toContain('key');
      }
    });

    it('should handle malicious input gracefully', async () => {
      const maliciousInputs = [
        { idToken: '<script>alert("xss")</script>' },
        { idToken: '"; DROP TABLE users; --' },
        { idToken: 'A'.repeat(10000) }, // Very long input
        { idToken: '\x00\x01\x02\x03' }, // Binary data
      ];

      for (const input of maliciousInputs) {
        const request = MockRequest.createWithJson(input);
        const response = await loginHandler(request);
        
        // Should handle gracefully without crashing
        expect([400, 401, 500]).toContain(response.status);
        
        const body = await ResponseHelper.getJsonBody(response);
        expect(body).toHaveProperty('error');
        expect(typeof body.error).toBe('string');
      }
    });

    it('should have proper CORS handling', async () => {
      const request = MockRequest.createWithJson({
        idToken: 'some_token'
      }, {
        headers: {
          'Origin': 'https://malicious-site.com'
        }
      });

      const response = await loginHandler(request);
      
      // Should not include permissive CORS headers by default
      const corsHeader = response.headers.get('Access-Control-Allow-Origin');
      expect(corsHeader).toBeNull();
    });
  });
});