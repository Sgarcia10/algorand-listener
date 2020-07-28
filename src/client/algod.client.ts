import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from 'src/config/config.service';
import { AccountResponse } from './dtos/response/account.dto';
import { HttpDomainException } from 'src/domain/exceptions/http.exception';
import { TransactionParamsResponse } from './dtos/response/transactionParams.dto';
import { TransactionPendingResponse } from './dtos/response/transactionPending.dto';
import { StatusResponse } from './dtos/response/status.dto';
import { CreateTransactionResponse } from './dtos/response/tx.dto';
import { AccountTransactionsPendingResponse } from './dtos/response/accountTransactionsPending.dto';

@Injectable()
export class AlgodClient {
  private readonly ACCOUNT_PATH = 'v2/accounts/';
  private readonly ACCOUNT_PENDING_TRANSACTIONS_PATH = '/transactions/pending/';
  private readonly TRANSACTIONS_PATH = 'v2/transactions/';
  private readonly TRANSACTIONS_PARAMS_PATH = 'v2/transactions/params/';
  private readonly TRANSACTIONS_PENDING_PATH = 'v2/transactions/pending/';
  private readonly STATUS_PATH = 'v2/status/';
  private readonly STATUS_AFTER_BLOCK_PATH = 'v2/status/wait-for-block-after/';

  constructor(private httpService: HttpService, private configService: ConfigService) {
    this.httpService.axiosRef.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response) {
          throw new HttpDomainException({
            status: 400,
            message: 'algod error',
            error: err.response?.data ?? 'try again later'
          });
        } else if (err.request) throw new HttpDomainException({ status: 400, message: 'bad algod request' });
      }
    );

    this.httpService.axiosRef.interceptors.request.use((config) => {
      config.headers['X-Algo-API-Token'] = this.configService.get('ALGOD_TOKEN');
      config.baseURL = this.configService.get('ALGOD_NODE_URL');
      return config;
    });
  }

  public getAccount(addr: string): Promise<AxiosResponse<AccountResponse>> {
    const url = this.ACCOUNT_PATH + addr;
    return this.httpService.get(url).toPromise();
  }

  public getTransactionParams(): Promise<AxiosResponse<TransactionParamsResponse>> {
    const url = this.TRANSACTIONS_PARAMS_PATH;
    return this.httpService.get(url).toPromise();
  }

  public createTransaction(rawTxn: string): Promise<AxiosResponse<CreateTransactionResponse>> {
    const url = this.TRANSACTIONS_PATH;
    return this.httpService.post(url, rawTxn).toPromise();
  }

  public getStatus(): Promise<AxiosResponse<StatusResponse>> {
    const url = this.STATUS_PATH;
    return this.httpService.get(url).toPromise();
  }

  public getStatusAfterBlock(block: number): Promise<AxiosResponse<StatusResponse>> {
    const url = this.STATUS_AFTER_BLOCK_PATH + block;
    return this.httpService.get(url).toPromise();
  }

  public getPendingTransaction(txId: string): Promise<AxiosResponse<TransactionPendingResponse>> {
    const url = this.TRANSACTIONS_PENDING_PATH + txId;
    return this.httpService.get(url).toPromise();
  }

  public getAccountPendingTransactions(addr: string): Promise<AxiosResponse<AccountTransactionsPendingResponse>> {
    const url = this.ACCOUNT_PATH + addr + this.ACCOUNT_PENDING_TRANSACTIONS_PATH;
    return this.httpService.get(url).toPromise();
  }
}
