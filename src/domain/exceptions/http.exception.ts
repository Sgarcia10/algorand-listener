import { HttpException, HttpStatus } from '@nestjs/common';

interface HttpDomainExceptionOptions {
  message: string;
  status?: number;
  code?: number;
  error?: any;
}

export class HttpDomainException extends HttpException {
  code: number;
  error: any;

  constructor({ status = HttpStatus.BAD_REQUEST, ...options }: HttpDomainExceptionOptions) {
    super(options.message, status);
    this.code = options.code;
    this.error = options.error;
  }

  getCode(): number {
    return this.code;
  }

  getError(): any {
    return this.error;
  }

  getBody(): Record<string, any> {
    return { message: this.message, code: this.code, error: this.error };
  }
}
