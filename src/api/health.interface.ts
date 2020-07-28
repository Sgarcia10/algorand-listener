import { HealthDto } from 'src/common/dtos/response/health.dto';

export interface IHealth {
  get(): HealthDto;
}
