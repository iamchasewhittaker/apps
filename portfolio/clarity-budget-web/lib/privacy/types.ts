export type PrivacyCardState =
  | "OPEN"
  | "PAUSED"
  | "CLOSED"
  | "PENDING_ACTIVATION"
  | "PENDING_FULFILLMENT";

export type PrivacyCardType =
  | "SINGLE_USE"
  | "MERCHANT_LOCKED"
  | "UNLOCKED"
  | "PHYSICAL"
  | "VIRTUAL";

export type PrivacyTxStatus =
  | "PENDING"
  | "APPROVED"
  | "SETTLED"
  | "DECLINED"
  | "VOIDED"
  | "REVERSED";

export interface PrivacyMerchant {
  descriptor?: string;
  city?: string;
  state?: string;
  country?: string;
  mcc?: string;
  acceptor_id?: string;
}

export interface PrivacyCardRef {
  token: string;
  memo?: string;
  last_four?: string;
  type?: PrivacyCardType;
}

export interface PrivacyCard {
  token: string;
  memo?: string;
  state: PrivacyCardState;
  type: PrivacyCardType;
  last_four?: string;
  spend_limit?: number;
  spend_limit_duration?: string;
  created?: string;
}

export interface PrivacyTransaction {
  token: string;
  status: PrivacyTxStatus;
  amount: number;
  created: string;
  settled?: string | null;
  card: PrivacyCardRef;
  merchant: PrivacyMerchant;
  result?: string;
  authorization_amount?: number;
  settled_amount?: number;
  events?: unknown[];
}

export interface PrivacyPage<T> {
  data: T[];
  page: number;
  total_pages: number;
  total_entries: number;
}
