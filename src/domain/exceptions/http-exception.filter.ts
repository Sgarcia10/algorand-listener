import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { HttpDomainException } from './http.exception';

@Catch(HttpDomainException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpDomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getBody();

    response.status(status).json({
      ...body
    });
  }
}
