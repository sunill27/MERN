export interface OrderData {
  phoneNumber: string;
  shippingAddress: string;
  totalAmount: number;
  paymentDetails: {
    paymentMethod: PaymentMethod;
    paymentStatus?: PaymentStatus; // ? makes it optional
    pidx?: string;
  };
  items: OrderDetails[];
}

export interface OrderDetails {
  quantity: number;
  productId: string;
}

export enum PaymentMethod {
  COD = "cod",
  KHALTI = "khalti",
  ESEWA = "eSewa,",
}

export enum PaymentStatus {
  unpaid = "unpaid",
  paid = "paid",
}

export interface KhaltiResponse {
  pidx: string;
  payment_url: string;
  expires_at: Date | string;
  expires_in: number;
  user_fee: number;
}

export interface TransactionVerificationResponse {
  pidx: string;
  total_amount: number;
  status: TransactionStatus;
  transaction_id: string;
  fee: number;
  refunded: boolean;
}

export enum TransactionStatus {
  COMPLETED = "Completed",
  PENDING = "Pending",
  INITIALIZED = "Initialized",
  REFUNDED = "Refunded",
}

export enum OrderStatus {
  PENDING = "pending",
  CANCELLED = "cancelled",
  DELIVERED = "delivered",
  ONTHEWAY = "ontheway",
  PREPARATION = "preparation",
}
