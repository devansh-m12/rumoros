type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export const log = (message: string, level: LogLevel = 'info', meta?: any) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  
  switch (level) {
    case 'error':
      console.error(logMessage, meta || '');
      break;
    case 'warn':
      console.warn(logMessage, meta || '');
      break;
    case 'debug':
      console.debug(logMessage, meta || '');
      break;
    default:
      console.log(logMessage, meta || '');
  }
}; 