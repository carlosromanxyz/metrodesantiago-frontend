/**
 * Logging utility that can be configured for different environments
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

interface LoggerConfig {
  level: LogLevel;
  enabled: boolean;
  prefix?: string;
}

class Logger {
  private config: LoggerConfig;

  constructor(config: LoggerConfig) {
    this.config = config;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled && level >= this.config.level;
  }

  private formatMessage(level: string, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const prefix = this.config.prefix ? `[${this.config.prefix}]` : '';
    const formattedMessage = `${timestamp} ${prefix} [${level}] ${message}`;
    
    if (args.length > 0) {
      console.log(formattedMessage, ...args);
    } else {
      console.log(formattedMessage);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.formatMessage('DEBUG', message, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.formatMessage('INFO', message, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.formatMessage('WARN', message, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.formatMessage('ERROR', message, ...args);
    }
  }
}

// Create default logger instance
const createLogger = (): Logger => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';
  
  // Enable logging in development and test environments
  const enabled = isDevelopment || isTest;
  
  // Set log level based on environment
  let level = LogLevel.INFO;
  if (isDevelopment) {
    level = LogLevel.DEBUG;
  } else if (isTest) {
    level = LogLevel.WARN;
  } else {
    level = LogLevel.NONE; // Production - no logging
  }

  return new Logger({
    enabled,
    level,
    prefix: 'MetroSantiago'
  });
};

// Export default logger instance
export const logger = createLogger();

// Export Logger class for custom instances
export { Logger };