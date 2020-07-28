import { Module, forwardRef, Global } from '@nestjs/common';
import { Logger } from './logger.service';
import { ConfigModule } from '../../config/config.module';

@Global()
@Module({
  imports: [forwardRef(() => ConfigModule)],
  providers: [Logger],
  exports: [Logger]
})
export class LoggerModule {}
