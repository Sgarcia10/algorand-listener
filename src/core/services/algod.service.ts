import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Logger } from '../../domain/logger/logger.service';
import { AlgodClient } from 'src/client/algod.client';
import { AccountResponse } from 'src/common/dtos/response/account.dto';
import { ConfigService } from 'src/config/config.service';
import * as algosdk from 'algosdk';
import { Accounts } from 'src/domain/constants/accounts.constant';
import { TransactionParams } from 'src/domain/models/transactionParams.model';
import { CreateTransactionRequest } from 'src/common/dtos/request/createTransaction.dto';
import { TransactionParamsResponse } from 'src/client/dtos/response/transactionParams.dto';
import { CreateTransactionResponse } from 'src/common/dtos/response/tx.dto';
import { AlgodRepository } from '../repository/algod.repository';
import * as util from 'util';
import { TransactionModel } from 'src/domain/models/transaction.model';
import { AccountTransactionsPendingResponse } from 'src/client/dtos/response/accountTransactionsPending.dto';

@Injectable()
export class AlgodService implements OnModuleInit {
  @Inject()
  private readonly logger: Logger;

  constructor(
    private algodClient: AlgodClient,
    private configService: ConfigService,
    private algodRepository: AlgodRepository
  ) {}

  async onModuleInit() {
    this.logger.setContext(AlgodService.name);
    await this.listen();
  }

  async listen() {
    this.logger.log('Listening init...');
    const status = (await this.algodClient.getStatus()).data;
    let lastRound = status['last-round'];
    while (true) {
      try {
        const secret2 = this.configService.get(Accounts['account2'].mnemonic_env);
        const account2 = algosdk.mnemonicToSecretKey(secret2);
        const addr2 = account2.addr;
        const pendigTx = (await this.algodClient.getAccountPendingTransactions(addr2)).data;
        this.logger.log(
          util.format('%d pending transactions after block: %d', pendigTx['total-transactions'], lastRound)
        );
        lastRound++;
        const transactions: Array<TransactionModel> = this.mapTransactions(pendigTx, lastRound);
        await this.algodClient.getStatusAfterBlock(lastRound);
        if (pendigTx['total-transactions'] > 0) {
          await this.saveTransactions(transactions);
          await this.closeAccount();
        }
      } catch (error) {
        this.logger.error(error);
        break;
      }
    }
  }

  async saveTransactions(txs: Array<TransactionModel>) {
    for (const tx of txs) {
      const pendingInfo = (await this.algodClient.getPendingTransaction(tx.txId)).data;
      if (pendingInfo['confirmed-round'] && pendingInfo['confirmed-round'] > 0) {
        tx.block = pendingInfo['confirmed-round'];
        await this.saveTransaction(tx);
        this.logger.log(util.format('Transaction saved: %s', tx.txId));
      }
    }
  }

  async saveTransaction(tx: TransactionModel) {
    const transaction = await this.algodRepository.findByTxId(tx.txId);
    if (!transaction) {
      this.algodRepository.save(tx);
    }
  }

  async closeAccount(): Promise<CreateTransactionResponse> {
    const mnemonic2 = this.configService.get(Accounts['account2'].mnemonic_env);
    const mnemonic3 = this.configService.get(Accounts['account3'].mnemonic_env);
    const account2 = algosdk.mnemonicToSecretKey(mnemonic2);
    const account3 = algosdk.mnemonicToSecretKey(mnemonic3);
    const addr2 = account2.addr;
    const addr3 = account3.addr;
    const params = await this.getTransactionParams();
    const paramsCamel: TransactionParams = {
      flatFee: true,
      fee: 1000,
      firstRound: params['last-round'],
      lastRound: params['last-round'] + 1000,
      genesisID: params['genesis-id'],
      genesisHash: params['genesis-hash']
    };
    const note = algosdk.encodeObj('SG test');

    const txn = algosdk.makePaymentTxnWithSuggestedParams(addr2, undefined, undefined, addr3, note, paramsCamel);
    const signedTxn = txn.signTxn(account2.sk);
    const tx = (await this.algodClient.createTransaction(signedTxn)).data;
    await this.waitForConfirmation(tx.txId);
    this.logger.log(util.format('Account closed: %s', addr2));
    return tx;
  }

  async getTransactionParams(): Promise<TransactionParamsResponse> {
    return (await this.algodClient.getTransactionParams()).data;
  }

  async waitForConfirmation(txId: string): Promise<void> {
    const status = (await this.algodClient.getStatus()).data;
    let lastRound = status['last-round'];
    let tries = 0;
    while (tries < 5) {
      const pendingInfo = (await this.algodClient.getPendingTransaction(txId)).data;
      if (pendingInfo['confirmed-round'] && pendingInfo['confirmed-round'] > 0) {
        break;
      }
      lastRound++;
      tries++;
      await this.algodClient.getStatusAfterBlock(lastRound);
    }
  }

  mapTransactions(pendigTx: AccountTransactionsPendingResponse, lastRound: number): TransactionModel[] {
    return pendigTx['top-transactions'].map((tx) => {
      const paramsCamel: TransactionParams = {
        flatFee: true,
        fee: tx.txn.fee,
        firstRound: tx.txn.fv,
        lastRound: tx.txn.lv,
        genesisID: tx.txn.gen,
        genesisHash: tx.txn.gh
      };
      const txn = algosdk.makePaymentTxnWithSuggestedParams(
        tx.txn.snd,
        tx.txn.rcv,
        tx.txn.amt,
        undefined,
        tx.txn.note ?? new Uint8Array(Buffer.from(tx.txn.note, 'base64')),
        paramsCamel
      );

      const txId = txn.txID().toString();

      return { amount: tx.txn.amt, block: lastRound, txId: txId };
    });
  }
}
