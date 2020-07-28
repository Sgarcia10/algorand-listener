export class TransactionPendingResponse {
  'confirmed-round': number;
  'pool-error': string;
  txn: {
    sig: string;
    txn: {
      amt: number;
      fee: number;
      fv: number;
      gen: string;
      gh: string;
      lv: number;
      note: string;
      rcv: string;
      snd: string;
      type: string;
    };
  };
}
