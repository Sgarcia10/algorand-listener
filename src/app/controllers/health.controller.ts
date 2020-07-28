import { Controller, Get, Inject } from '@nestjs/common';
import { HealthService } from '../../core/services/health.service';
import { Logger } from '../../domain/logger/logger.service';
import { IHealth } from 'src/api/health.interface';
import { Routes } from '../../common/routes/routes';
import { HealthDto } from 'src/common/dtos/response/health.dto';
import { IHealthService } from 'src/domain/interfaces/health-service.interface';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

@ApiTags(Routes.health)
@Controller(Routes.health)
export class HealthController implements IHealth {
  @Inject()
  private logger: Logger;
  constructor(@Inject(HealthService) private service: IHealthService) {}

  @Get()
  @ApiOkResponse({
    type: HealthDto
  })
  get(): HealthDto {
    return this.service.get();
  }
}
