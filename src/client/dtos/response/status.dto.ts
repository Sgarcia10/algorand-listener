export class StatusResponse {
  'catchpoint': string;
  'catchpoint-acquired-blocks': number;
  'catchpoint-processed-accounts': number;
  'catchpoint-total-accounts': number;
  'catchpoint-total-blocks': number;
  'catchup-time': number;
  'last-catchpoint': string;
  'last-round': number;
  'last-version': string;
  'next-version': string;
  'next-version-round': number;
  'next-version-supported': boolean;
  'stopped-at-unsupported-round': boolean;
  'time-since-last-round': number;
}
