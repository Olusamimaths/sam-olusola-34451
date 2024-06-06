import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
// import Sentry from 'winston-transport-sentry-node'; -- Can be used in real application
import { winstonOptions } from './winston-config';
const { combine, timestamp, label, prettyPrint, splat } = winston.format;

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor(name: string) {
    /**
     * In a real application,
     * we would want to use Sentry to log errors in production.
     */
    const sentryTransportOptions = {
      sentry: {
        dsn: process.env.SENTRY_DSN_KEY,
      },
      level: 'info',
    };

    this.logger = winston.createLogger({
      format: combine(
        label({ label: name }),
        timestamp(),
        prettyPrint(),
        splat(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File(winstonOptions.file),
        // new Sentry(sentryTransportOptions), => Can be used in real application
      ],
      exitOnError: false,
    });
  }
  private shouldLog = process.env.NODE_ENV !== 'test';

  private wrapCall(fn: winston.LeveledLogMethod, message: any) {
    this.shouldLog && fn(message);
  }

  log(message: any) {
    this.shouldLog && this.logger.log('info', message);
  }

  info(message: any) {
    this.wrapCall(this.logger.info, message);
  }

  error(message: any) {
    this.wrapCall(this.logger.error, message);
  }

  warn(message: any) {
    this.wrapCall(this.logger.warn, message);
  }

  debug(message: any) {
    this.wrapCall(this.logger.debug, message);
  }
}
