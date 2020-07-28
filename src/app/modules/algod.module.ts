import { Module, HttpModule } from '@nestjs/common';
import { AlgodService } from 'src/core/services/algod.service';
import { AlgodClient } from 'src/client/algod.client';
import { TransactionSchema, Transaction } from 'src/domain/schemas/transaction.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database.module';
import { AlgodRepository } from 'src/core/repository/algod.repository';
@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }])
  ],
  providers: [AlgodService, AlgodClient, AlgodRepository]
})
export class AlgodModule {}
