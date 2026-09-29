/**
 * Payment, Order & Subscription API service.
 */

import { apiClient } from "@/lib/api-client";

export interface Order {
  id: string;
  patient_id: string;
  program_id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
  idempotency_key?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  patient_id: string;
  amount: number;
  currency: string;
  provider: string;
  provider_payment_id?: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  created_at: string;
}

export interface Subscription {
  id: string;
  patient_id: string;
  order_id: string;
  program_id?: string;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE";
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderPayload {
  program_id: string;
  idempotency_key?: string;
}

export interface CreatePaymentPayload {
  order_id: string;
  provider?: string;
}

export interface VerifyPaymentPayload {
  payment_id: string;
  provider_payment_id: string;
  signature?: string;
}

export const paymentService = {
  /** Create a new order */
  createOrder: (payload: CreateOrderPayload) =>
    apiClient.post<Order>("/api/v1/orders", payload),

  /** Get patient's order history */
  getMyOrders: () =>
    apiClient.get<Order[]>("/api/v1/orders/me"),

  /** Create payment session */
  createPayment: (payload: CreatePaymentPayload) =>
    apiClient.post<{
      payment: Payment;
      checkout_url?: string;
      session_id?: string;
    }>("/api/v1/payments/create", payload),

  /** Server-side verify payment */
  verifyPayment: (payload: VerifyPaymentPayload) =>
    apiClient.post<Payment>("/api/v1/payments/verify", payload),

  /** Get payment history */
  getPaymentHistory: () =>
    apiClient.get<Payment[]>("/api/v1/payments/history"),

  /** Get active subscriptions */
  getMySubscriptions: () =>
    apiClient.get<Subscription[]>("/api/v1/subscriptions/me"),

  /** Cancel a subscription */
  cancelSubscription: (subscriptionId: string) =>
    apiClient.post<Subscription>("/api/v1/subscriptions/cancel", {
      subscription_id: subscriptionId,
    }),
};
