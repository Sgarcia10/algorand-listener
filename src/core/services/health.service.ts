import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Logger } from '../../domain/logger/logger.service';
import { HealthDto } from 'src/common/dtos/response/health.dto';
import { IHealthService } from 'src/domain/interfaces/health-service.interface';

@Injectable()
export class HealthService implements IHealthService, OnModuleInit {
  @Inject()
  private readonly logger: Logger;

  onModuleInit() {
    this.logger.setContext(HealthService.name);
  }

  get(): HealthDto {
    return { status: 'UP' };
  }
}
