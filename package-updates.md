# Required Package Updates for Enterprise Features

Add these dependencies to your package.json:

## Production Dependencies
```bash
npm install winston
```

## Development Dependencies  
```bash
npm install --save-dev @types/jest jest supertest @types/supertest
```

## Updated package.json sections:

### Add to dependencies:
```json
"winston": "^3.11.0"
```

### Add to devDependencies:
```json
"@types/jest": "^29.5.8",
"jest": "^29.7.0", 
"supertest": "^6.3.3",
"@types/supertest": "^2.0.16"
```

### Add to scripts:
```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage",
"migrate": "npx tsx src/scripts/migrate.ts",
"migrate:rollback": "npx tsx src/scripts/migrate.ts --rollback",
"migrate:status": "npx tsx src/scripts/migrate.ts --status",
"lint:enterprise": "next lint && npm run test"
```

### Add jest configuration:
```json
"jest": {
  "preset": "ts-jest",
  "testEnvironment": "node",
  "roots": ["<rootDir>/src"],
  "testMatch": ["**/__tests__/**/*.test.ts"],
  "collectCoverageFrom": [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/__tests__/**"
  ]
}
```

## Directory Structure Created:
```
src/
├── lib/
│   ├── logger.ts                 # ✅ Structured logging system
│   ├── env-validation.ts         # ✅ Environment variable validation  
│   ├── rate-limiter.ts          # ✅ Rate limiting middleware
│   ├── test-utils.ts            # ✅ Testing utilities
│   ├── migrations/
│   │   ├── migration-system.ts  # ✅ Database migration system
│   │   └── example-migrations.ts # ✅ Example migrations
│   └── api-docs/
│       └── openapi-spec.ts       # ✅ OpenAPI documentation
├── app/api/
│   ├── docs/route.ts            # ✅ API documentation endpoint
│   └── health/
│       ├── route.ts             # ✅ Health check endpoint
│       ├── ready/route.ts       # ✅ Readiness probe
│       └── live/route.ts        # ✅ Liveness probe
└── __tests__/api/
    ├── health.test.ts           # ✅ Health endpoint tests
    └── auth.test.ts             # ✅ Authentication tests
```