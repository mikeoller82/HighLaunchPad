import winston from 'winston';

// Log levels based on RFC 5424
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(logColors);

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

// Base format for all loggers
const baseFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Development format with colors and pretty printing
const developmentFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.simple(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Production format with structured data
const productionFormat = winston.format.combine(
  baseFormat,
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
);

// Create the logger instance
export const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  levels: logLevels,
  format: isDevelopment ? developmentFormat : productionFormat,
  defaultMeta: {
    service: 'highlaunchpad-api',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      silent: isTest, // Silence logs during testing
      level: isDevelopment ? 'debug' : 'info',
    }),
  ],
});

// Add file transports for production
if (!isDevelopment && !isTest) {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Create context-aware logger factory
interface LogContext {
  userId?: string;
  requestId?: string;
  operation?: string;
  component?: string;
  [key: string]: any;
}

export function createLogger(context: LogContext) {
  return {
    error: (message: string, meta?: any) => 
      logger.error(message, { ...context, ...meta }),
    warn: (message: string, meta?: any) => 
      logger.warn(message, { ...context, ...meta }),
    info: (message: string, meta?: any) => 
      logger.info(message, { ...context, ...meta }),
    http: (message: string, meta?: any) => 
      logger.http(message, { ...context, ...meta }),
    debug: (message: string, meta?: any) => 
      logger.debug(message, { ...context, ...meta }),
  };
}

// Request logger middleware for API routes
export function logRequest(req: any, operation: string) {
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const userId = req.headers['authorization'] ? 'authenticated' : 'anonymous';
  
  return createLogger({
    requestId,
    userId,
    operation,
    component: 'api',
    method: req.method,
    url: req.url,
  });
}

// Firebase operations logger
export function logFirebaseOperation(operation: string, meta?: any) {
  return createLogger({
    component: 'firebase',
    operation,
    ...meta,
  });
}

// AI operations logger
export function logAIOperation(operation: string, meta?: any) {
  return createLogger({
    component: 'ai',
    operation,
    ...meta,
  });
}

// Security events logger
export function logSecurityEvent(event: string, meta?: any) {
  return createLogger({
    component: 'security',
    event,
    severity: 'high',
    ...meta,
  });
}

// Performance monitoring logger
export function logPerformance(operation: string, duration: number, meta?: any) {
  return createLogger({
    component: 'performance',
    operation,
    duration,
    ...meta,
  });
}

export default logger;