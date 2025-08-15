import { env } from '@/lib/env-validation';

// OpenAPI 3.0 specification for HighLaunchPad API
export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'HighLaunchPad API',
    description: 'Enterprise API for HighLaunchPad platform - AI-powered business automation and social media management',
    version: env.APP_VERSION || '1.0.0',
    contact: {
      name: 'HighLaunchPad Support',
      email: 'support@highlaunchpad.com',
    },
    license: {
      name: 'Proprietary',
    },
  },
  servers: [
    {
      url: env.NODE_ENV === 'production' 
        ? 'https://api.highlaunchpad.com' 
        : 'http://localhost:3000',
      description: env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
    },
  ],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health Check',
        description: 'Comprehensive health check including service status and system metrics',
        operationId: 'getHealth',
        tags: ['Health & Monitoring'],
        responses: {
          200: {
            description: 'Service is healthy or degraded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthStatus' }
              }
            }
          },
          503: {
            description: 'Service is unhealthy',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthStatus' }
              }
            }
          }
        }
      }
    },
    '/api/health/ready': {
      get: {
        summary: 'Readiness Check',
        description: 'Kubernetes readiness probe - returns 200 if service can accept traffic',
        operationId: 'getReadiness',
        tags: ['Health & Monitoring'],
        responses: {
          200: {
            description: 'Service is ready to accept traffic',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReadinessStatus' }
              }
            }
          },
          503: {
            description: 'Service is not ready',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReadinessStatus' }
              }
            }
          }
        }
      }
    },
    '/api/health/live': {
      get: {
        summary: 'Liveness Check',
        description: 'Kubernetes liveness probe - returns 200 if service is alive',
        operationId: 'getLiveness',
        tags: ['Health & Monitoring'],
        responses: {
          200: {
            description: 'Service is alive',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LivenessStatus' }
              }
            }
          },
          503: {
            description: 'Service is not alive',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LivenessStatus' }
              }
            }
          }
        }
      }
    },
    '/api/auth/session-login': {
      post: {
        summary: 'Create User Session',
        description: 'Authenticate user with Firebase ID token and create session cookie',
        operationId: 'createSession',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Session created successfully',
            headers: {
              'Set-Cookie': {
                description: 'Session cookie',
                schema: { type: 'string' }
              }
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' }
              }
            }
          },
          400: {
            description: 'Invalid request body or token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          401: {
            description: 'Authentication failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          408: {
            description: 'Request timeout',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/auth/session-logout': {
      post: {
        summary: 'Destroy User Session',
        description: 'Logout user and clear session cookie',
        operationId: 'destroySession',
        tags: ['Authentication'],
        responses: {
          200: {
            description: 'Session destroyed successfully',
            headers: {
              'Set-Cookie': {
                description: 'Cleared session cookie',
                schema: { type: 'string' }
              }
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LogoutResponse' }
              }
            }
          }
        }
      }
    },
    '/api/ai/generate-email': {
      post: {
        summary: 'Generate Email Content',
        description: 'Generate AI-powered email content based on prompt and context',
        operationId: 'generateEmail',
        tags: ['AI Content Generation'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EmailGenerationRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Email content generated successfully',
            headers: {
              'X-RateLimit-Limit': { schema: { type: 'integer' } },
              'X-RateLimit-Remaining': { schema: { type: 'integer' } },
              'X-RateLimit-Reset': { schema: { type: 'integer' } }
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EmailGenerationResponse' }
              }
            }
          },
          400: {
            description: 'Invalid request parameters',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          401: {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          429: {
            description: 'Rate limit exceeded',
            headers: {
              'Retry-After': { schema: { type: 'integer' } }
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RateLimitResponse' }
              }
            }
          }
        }
      }
    },
    '/api/stripe/create-customer': {
      post: {
        summary: 'Create Stripe Customer',
        description: 'Create or retrieve Stripe customer for authenticated user',
        operationId: 'createStripeCustomer',
        tags: ['Payments'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Customer created or retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CustomerResponse' }
              }
            }
          },
          401: {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          500: {
            description: 'Failed to create customer',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      HealthStatus: {
        type: 'object',
        required: ['status', 'timestamp', 'version', 'environment', 'uptime', 'services', 'system'],
        properties: {
          status: {
            type: 'string',
            enum: ['healthy', 'degraded', 'unhealthy'],
            description: 'Overall health status'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'ISO timestamp of health check'
          },
          version: {
            type: 'string',
            description: 'Application version'
          },
          environment: {
            type: 'string',
            description: 'Runtime environment'
          },
          uptime: {
            type: 'integer',
            description: 'Service uptime in milliseconds'
          },
          services: {
            type: 'object',
            properties: {
              firebase: { $ref: '#/components/schemas/ServiceHealth' },
              stripe: { $ref: '#/components/schemas/ServiceHealth' },
              database: { $ref: '#/components/schemas/ServiceHealth' }
            }
          },
          system: {
            type: 'object',
            properties: {
              nodeVersion: { type: 'string' },
              platform: { type: 'string' },
              memory: {
                type: 'object',
                properties: {
                  used: { type: 'integer' },
                  free: { type: 'integer' },
                  total: { type: 'integer' },
                  percentage: { type: 'integer' }
                }
              },
              cpu: {
                type: 'object',
                properties: {
                  loadAverage: {
                    type: 'array',
                    items: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      },
      ServiceHealth: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['up', 'down', 'degraded']
          },
          responseTime: {
            type: 'integer',
            description: 'Response time in milliseconds'
          },
          error: {
            type: 'string',
            description: 'Error message if status is down'
          },
          details: {
            type: 'object',
            description: 'Additional service-specific details'
          }
        }
      },
      ReadinessStatus: {
        type: 'object',
        required: ['ready', 'timestamp'],
        properties: {
          ready: {
            type: 'boolean',
            description: 'Whether service is ready to accept traffic'
          },
          timestamp: {
            type: 'string',
            format: 'date-time'
          },
          environment: {
            type: 'string',
            description: 'Runtime environment (only when ready)'
          },
          error: {
            type: 'string',
            description: 'Error description (only when not ready)'
          }
        }
      },
      LivenessStatus: {
        type: 'object',
        required: ['alive', 'timestamp'],
        properties: {
          alive: {
            type: 'boolean',
            description: 'Whether service is alive'
          },
          timestamp: {
            type: 'string',
            format: 'date-time'
          },
          uptime: {
            type: 'number',
            description: 'Process uptime in seconds (only when alive)'
          },
          pid: {
            type: 'integer',
            description: 'Process ID (only when alive)'
          },
          error: {
            type: 'string',
            description: 'Error description (only when not alive)'
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['idToken'],
        properties: {
          idToken: {
            type: 'string',
            minLength: 10,
            description: 'Firebase ID token'
          }
        }
      },
      LoginResponse: {
        type: 'object',
        required: ['success', 'user'],
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          user: {
            type: 'object',
            properties: {
              uid: { type: 'string' },
              email: { type: 'string', format: 'email' }
            }
          }
        }
      },
      LogoutResponse: {
        type: 'object',
        required: ['success'],
        properties: {
          success: {
            type: 'boolean',
            example: true
          }
        }
      },
      EmailGenerationRequest: {
        type: 'object',
        required: ['prompt'],
        properties: {
          prompt: {
            type: 'string',
            description: 'Email generation prompt'
          },
          tone: {
            type: 'string',
            enum: ['professional', 'casual', 'friendly', 'formal'],
            default: 'professional'
          },
          length: {
            type: 'string',
            enum: ['short', 'medium', 'long'],
            default: 'medium'
          },
          context: {
            type: 'object',
            description: 'Additional context for email generation'
          }
        }
      },
      EmailGenerationResponse: {
        type: 'object',
        required: ['success', 'content'],
        properties: {
          success: {
            type: 'boolean'
          },
          content: {
            type: 'object',
            properties: {
              subject: { type: 'string' },
              body: { type: 'string' },
              tone: { type: 'string' },
              length: { type: 'string' }
            }
          }
        }
      },
      CustomerResponse: {
        type: 'object',
        required: ['customerId'],
        properties: {
          customerId: {
            type: 'string',
            description: 'Stripe customer ID'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'string',
            description: 'Error message'
          },
          details: {
            type: 'string',
            description: 'Additional error details'
          },
          code: {
            type: 'string',
            description: 'Error code'
          }
        }
      },
      RateLimitResponse: {
        type: 'object',
        required: ['error', 'retryAfter'],
        properties: {
          error: {
            type: 'string',
            example: 'Too Many Requests'
          },
          message: {
            type: 'string'
          },
          retryAfter: {
            type: 'integer',
            description: 'Seconds until next request allowed'
          }
        }
      }
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Firebase ID token'
      }
    }
  },
  tags: [
    {
      name: 'Health & Monitoring',
      description: 'Service health checks and monitoring endpoints'
    },
    {
      name: 'Authentication',
      description: 'User authentication and session management'
    },
    {
      name: 'AI Content Generation',
      description: 'AI-powered content generation endpoints'
    },
    {
      name: 'Payments',
      description: 'Payment processing with Stripe'
    }
  ]
};

export default openApiSpec;