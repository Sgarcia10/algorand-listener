import { IHealthService } from 'src/domain/interfaces/health-service.interface';
import { HealthService } from '../services/health.service';
import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { HealthDto } from 'src/common/dtos/response/health.dto';

describe('HealthService', () => {
  let healthService: IHealthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [HealthService, Logger, ConfigService]
    }).compile();
    healthService = module.get<IHealthService>(HealthService);
  });

  describe('get', () => {
    it('should return health', () => {
      const result: HealthDto = { status: 'UP' };

      expect(healthService.get()).toMatchObject(result);
    });
  });
});
