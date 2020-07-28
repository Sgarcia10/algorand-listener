import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/domain/schemas/transaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionModel } from 'src/domain/models/transaction.model';

@Injectable()
export class AlgodRepository {
  constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>) {}

  findByTxId(txId: string): Promise<Transaction> {
    return this.transactionModel.findOne({ txId }).exec();
  }

  save(tx: TransactionModel): Promise<Transaction> {
    return this.transactionModel.create(tx);
  }
}
