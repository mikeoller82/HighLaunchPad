import { NextRequest } from 'next/server';
import { GET as healthHandler } from '@/app/api/health/route';
import { GET as readyHandler } from '@/app/api/health/ready/route';
import { GET as liveHandler } from '@/app/api/health/live/route';
import { TestEnvironment, MockRequest, ResponseHelper, APITestHelper } from '@/lib/test-utils';

describe('Health Check Endpoints', () => {
  beforeAll(async () => {
    await TestEnvironment.setup();
  });

  afterAll(async () => {
    await TestEnvironment.cleanup();
  });

  describe('/api/health', () => {
    it('should return health status with all service checks', async () => {
      const request = MockRequest.create({
        url: 'http://localhost:3000/api/health'
      });

      const response = await healthHandler(request);
      
      expect(response.status).toBe(200);
      ResponseHelper.expectJSONResponse(response);
      
      const body = await ResponseHelper.getJsonBody(response);
      
      // Check required fields
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('timestamp');
      expect(body).toHaveProperty('version');
      expect(body).toHaveProperty('environment');
      expect(body).toHaveProperty('uptime');
      expect(body).toHaveProperty('services');
      expect(body).toHaveProperty('system');
      
      // Check status is valid
      expect(['healthy', 'degraded', 'unhealthy']).toContain(body.status);
      
      // Check services structure
      expect(body.services).toHaveProperty('firebase');
      expect(body.services).toHaveProperty('stripe');
      expect(body.services).toHaveProperty('database');
      
      // Check system info
      expect(body.system).toHaveProperty('nodeVersion');
      expect(body.system).toHaveProperty('platform');
      expect(body.system).toHaveProperty('memory');
      expect(body.system).toHaveProperty('cpu');
    });

    it('should include cache-control headers', async () => {
      const request = MockRequest.create({
        url: 'http://localhost:3000/api/health'
      });

      const response = await healthHandler(request);
      
      ResponseHelper.expectHeaders(response, {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
    });

    it('should handle errors gracefully', async () => {
      // Mock a scenario where Firebase is unavailable
      // This would require dependency injection or mocking
      // For now, we test that the endpoint doesn't crash
      
      const request = MockRequest.create({
        url: 'http://localhost:3000/api/health'
      });

      const response = await healthHandler(request);
      
      // Should not crash and should return valid JSON
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
      
      const body = await ResponseHelper.getJsonBody(response);
      expect(body).toHaveProperty('status');
    });
  });

  describe('/api/health/ready', () => {
    it('should return readiness status', async () => {
      const request = MockRequest.create({
        url: 'http://localhost:3000/api/health/ready'
      });

      const response = await readyHandler(request);
      
      // Should return either 200 (ready) or 503 (not ready)
      expect([200, 503]).toContain(response.status);
      ResponseHelper.expectJSONResponse(response);
      
      const body = await ResponseHelper.getJsonBody(response);
      
      expect(body).toHaveProperty('ready');
      expect(body).toHaveProperty('timestamp');
      expect(typeof body.ready).toBe('boolean');
      
      if (body.ready) {
        expect(body).toHaveProperty('environment');
      } else {
        expect(body).toHaveProperty('error');
      }
    });

    it('should be lightweight and fast', async () => {
      const request = MockRequest.create({
        url: 'http://localhost:3000/api/health/ready'
      });

      const start = Date.now();
      await readyHandler(request);
      const duration = Date.now() - start;
      
      // Readiness check should be very fast (under 1 second)
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('/api/health/live', () => {
    it('should return liveness status', async () => {
      const request = MockRequest.create({
        url: 'http://localhost:3000/api/health/live'
      });

      const response = await liveHandler(request);
      
      // Should return either 200 (alive) or 503 (not alive)
      expect([200, 503]).toContain(response.status);
      ResponseHelper.expectJSONResponse(response);
      
      const body = await ResponseHelper.getJsonBody(response);
      
      expect(body).toHaveProperty('alive');
      expect(body).toHaveProperty('timestamp');
      expect(typeof body.alive).toBe('boolean');
      
      if (body.alive) {
        expect(body).toHaveProperty('uptime');
        expect(body).toHaveProperty('pid');
      } else {
        expect(body).toHaveProperty('error');
      }
    });

    it('should be extremely fast', async () => {
      const request = MockRequest.create({
        url: 'http://localhost:3000/api/health/live'
      });

      const start = Date.now();
      await liveHandler(request);
      const duration = Date.now() - start;
      
      // Liveness check should be extremely fast (under 100ms)
      expect(duration).toBeLessThan(100);
    });

    it('should perform basic JavaScript operations', async () => {
      const request = MockRequest.create({
        url: 'http://localhost:3000/api/health/live'
      });

      const response = await liveHandler(request);
      const body = await ResponseHelper.getJsonBody(response);
      
      // If the test passes and we get a response, basic JS operations are working
      expect(body.alive).toBe(true);
    });
  });

  describe('Health Check Performance', () => {
    it('should complete health checks within reasonable time', async () => {
      const request = MockRequest.create({
        url: 'http://localhost:3000/api/health'
      });

      const start = Date.now();
      const response = await healthHandler(request);
      const duration = Date.now() - start;
      
      // Full health check should complete within 5 seconds
      expect(duration).toBeLessThan(5000);
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });
});