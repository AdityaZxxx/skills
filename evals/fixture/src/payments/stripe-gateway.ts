// Thin wrapper over the Stripe HTTP API. Real network calls live here.
export class StripeGateway {
  constructor(private apiKey: string) {}

  async charge(amountCents: number, cardToken: string): Promise<boolean> {
    // POST /v1/charges with this.apiKey (simulated)
    return amountCents > 0 && cardToken.length > 0;
  }

  async refund(amountCents: number, orderId: string): Promise<boolean> {
    // POST /v1/refunds with this.apiKey (simulated)
    return amountCents > 0 && orderId.length > 0;
  }
}
