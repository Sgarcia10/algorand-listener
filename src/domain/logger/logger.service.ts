import { LoggerService, Scope, Injectable, Logger as NestLogger } from '@nestjs/common';
import { createLogger, Logger as winstonLogger, format, transports } from 'winston';
import * as chalk from 'chalk';
import * as util from 'util';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends NestLogger implements LoggerService {
  private readonly logger: winstonLogger;

  constructor(context = 'Main') {
    super(context, true);
    this.logger = createLogger({
      format: format.combine(format.timestamp(), format.prettyPrint(), format.json(), this.printFormat()),
      transports: [new transports.Console()]
    });
  }

  log(message: string) {
    this.logger.info(util.format(message));
  }
  error(message: any, meta?: any) {
    this.logger.error(util.format(message, meta));
  }
  warn(message: string) {
    this.logger.warning(util.format(message));
  }
  debug(message: string) {
    this.logger.debug(util.format(message));
  }

  verbose(message: string) {
    this.logger.info(util.format(message));
  }

  private printFormat() {
    return format.printf((info) => {
      const color = chalk;
      switch (info.level) {
        case 'info':
          return this.logs(info, { colorLevel: color.blue, colorContext: color.green });
        case 'debug':
          return this.logs(info, { colorLevel: color.white, colorContext: color.green });
        case 'error':
          return this.logs(info, {
            colorLevel: color.red,
            colorContext: color.green,
            colorMessage: color.red
          });
        case 'warn':
          return this.logs(info, { colorLevel: color.yellow, colorContext: color.green });
      }
    });
  }

  private logs(
    info: any,
    {
      colorLevel = (s: string) => s,
      colorTimestamp = (s: string) => s,
      colorContext = (s: string) => s,
      colorMessage = (s: string) => s
    }
  ) {
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'local'
      ? `[${colorLevel(info.level)}] ${colorTimestamp(info.timestamp)} [${colorContext(this.context)}] ${colorMessage(
          info.message
        )}`
      : `[${this.context}] ${info.message}`;
  }

  get stream() {
    return {
      write: (message) => {
        this.logger.info(message.substring(0, message.lastIndexOf('\n')));
      }
    };
  }
}
