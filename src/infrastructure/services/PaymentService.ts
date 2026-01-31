// Payment Service
// Servicio para gestión de pagos y suscripciones premium

import { HttpClient } from './HttpClient';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
}

export interface PaymentIntent {
  clientSecret: string;
  subscriptionId: string;
}

export interface SubscriptionStatus {
  active: boolean;
  plan: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export class PaymentService {
  private http: HttpClient;
  private paymentEndpoint = '/api/payments';

  constructor() {
    this.http = new HttpClient();
  }

  /**
   * Obtiene los planes disponibles
   */
  async getPlans(): Promise<SubscriptionPlan[]> {
    return await this.http.get<SubscriptionPlan[]>(`${this.paymentEndpoint}/plans`);
  }

  /**
   * Crea una intención de pago para suscripción
   */
  async createSubscription(planId: string): Promise<PaymentIntent> {
    return await this.http.post<PaymentIntent>(`${this.paymentEndpoint}/subscribe`, { planId });
  }

  /**
   * Obtiene el estado de la suscripción actual
   */
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    return await this.http.get<SubscriptionStatus>(`${this.paymentEndpoint}/subscription/status`);
  }

  /**
   * Cancela la suscripción (no se renueva)
   */
  async cancelSubscription(): Promise<{ success: boolean }> {
    return await this.http.post(`${this.paymentEndpoint}/subscription/cancel`, {});
  }

  /**
   * Reactiva una suscripción cancelada
   */
  async reactivateSubscription(): Promise<{ success: boolean }> {
    return await this.http.post(`${this.paymentEndpoint}/subscription/reactivate`, {});
  }

  /**
   * Actualiza el método de pago
   */
  async updatePaymentMethod(paymentMethodId: string): Promise<{ success: boolean }> {
    return await this.http.post(`${this.paymentEndpoint}/payment-method`, { paymentMethodId });
  }

  /**
   * Obtiene el historial de facturas
   */
  async getInvoices(): Promise<Array<{
    id: string;
    amount: number;
    status: string;
    date: Date;
    invoiceUrl: string;
  }>> {
    return await this.http.get(`${this.paymentEndpoint}/invoices`);
  }

  /**
   * Crea un portal de cliente de Stripe
   */
  async createCustomerPortal(): Promise<{ url: string }> {
    return await this.http.post<{ url: string }>(`${this.paymentEndpoint}/portal`, {});
  }
}
