export type SchedulingRequest = {
  engagementId: string;
  name: string;
  email: string;
  notes?: string;
};
export interface SchedulingProvider {
  getAvailability(engagementId: string): Promise<string[]>;
  createBooking(
    request: SchedulingRequest,
  ): Promise<{ externalId: string; status: "pending" | "confirmed" }>;
}
export type PaymentRequest = {
  productId: string;
  amount: number;
  currency: string;
  customerEmail: string;
};
export interface PaymentProvider {
  createCheckout(
    request: PaymentRequest,
  ): Promise<{ checkoutUrl: string; externalId: string }>;
}
export interface CommerceProvider {
  getAvailability(
    productId: string,
  ): Promise<"available" | "unavailable" | "interest">;
  registerInterest(productId: string, email: string): Promise<void>;
}
export interface MapProvider {
  renderToken(): Promise<string | undefined>;
}
export const providersConfigured = {
  scheduling: false,
  payment: false,
  commerce: false,
  map: false,
} as const;
