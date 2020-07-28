import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HealthModule } from 'src/app/modules/health.module';
import { HealthService } from 'src/core/services/health.service';
import { HealthController } from 'src/app/controllers/health.controller';
import { ConfigModule } from 'src/config/config.module';
import { LoggerModule } from 'src/domain/logger/logger.module';
import { HealthDto } from 'src/common/dtos/response/health.dto';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  const health: HealthDto = { status: 'UP' };
  const healthService = {
    get: () => health
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      imports: [HealthModule, ConfigModule, LoggerModule],
      providers: [HealthService]
    })
      .overrideProvider(HealthService)
      .useValue(healthService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    const expectedHealth: HealthDto = { status: 'UP' };
    return request(app.getHttpServer()).get('/health').expect(200).expect(expectedHealth);
  });

  afterAll(async () => {
    await app.close();
  });
});
