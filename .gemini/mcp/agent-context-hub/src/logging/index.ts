import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SetLevelRequestSchema } from '@modelcontextprotocol/sdk/types.js';

type LogLevel = 'debug' | 'info' | 'warning' | 'error';

let currentLogLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warning: 2,
  error: 3,
};

export function initLogger(server: Server) {
  // Handle log level changes from MCP client
  server.setRequestHandler(SetLevelRequestSchema, async (request) => {
    currentLogLevel = request.params.level as LogLevel;
    return {};
  });

  function shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
  }

  return {
    info(message: string, metadata?: any) {
      if (shouldLog('info')) {
        server.sendLoggingMessage({
          level: 'info',
          logger: 'agent-context-hub',
          data: message,
          ...metadata,
        });
      }
    },

    error(message: string, metadata?: any) {
      if (shouldLog('error')) {
        server.sendLoggingMessage({
          level: 'error',
          logger: 'agent-context-hub',
           message,
          ...metadata,
        });
      }
    },

    warn(message: string, metadata?: any) {
      if (shouldLog('warning')) {
        server.sendLoggingMessage({
          level: 'warning',
          logger: 'agent-context-hub',
           message,
          ...metadata,
        });
      }
    },

    debug(message: string, metadata?: any) {
      if (shouldLog('debug')) {
        server.sendLoggingMessage({
          level: 'debug',
          logger: 'agent-context-hub',
           message,
          ...metadata,
        });
      }
    },
  };
}

export type Logger = ReturnType<typeof initLogger>;