export interface AccountResponse {
  address: string;
  amount: number;
  'amount-without-pending-rewards': number;
  assets: [];
  'created-assets': [];
  'pending-rewards': number;
  'reward-base': number;
  rewards: number;
  round: number;
  status: string;
}
