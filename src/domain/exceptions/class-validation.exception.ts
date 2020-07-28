import { ValidationError } from 'class-validator';
import { HttpDomainException } from './http.exception';

export class ClassValidationException extends HttpDomainException {
  constructor(errors: ValidationError[]) {
    const message = 'invalid params';
    const error = {
      validators: errors.map((e) => e.constraints)
    };
    super({ message, error });
  }
}
