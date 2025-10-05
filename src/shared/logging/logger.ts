import pino from 'pino';
import { Config } from '../../config';

const cfg = Config.get();
const pretty = process.env.PRETTY_LOGS
  ? process.env.PRETTY_LOGS !== '0'
  : process.stdout.isTTY; // terminal interactiva

export const logger = pino({
  level: cfg.LOG_LEVEL, // 'trace'|'debug'|'info'|'warn'|'error'|'fatal'
  redact: {
    paths: [
      'password',
      '*.password',
      'req.headers.authorization',
      'headers.authorization',
      'body.password'
    ],
    remove: true,
  },
  ...(pretty ? { transport: { target: 'pino-pretty', options: { singleLine: true, colorize: true } } } : {}),
});

