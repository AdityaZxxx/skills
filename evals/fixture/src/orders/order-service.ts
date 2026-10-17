import { StripeGateway } from "../payments/stripe-gateway";
import { formatMoney } from "../utils/money";

export interface Order {
  id: string;
  customerEmail: string;
  items: { sku: string; quantity: number; unitPriceCents: number }[];
  totalCents: number;
  isPaid: boolean;
  isShipped: boolean;
  isCancelled: boolean;
  isRefunded: boolean;
  refundedCents: number;
  auditLog: string[];
}

export class OrderService {
  private gateway = new StripeGateway("sk_live_placeholder");

  async checkout(order: Order, cardToken: string): Promise<void> {
    if (order.isPaid) throw new Error("already paid");
    if (order.isCancelled) throw new Error("order is cancelled");
    if (order.items.length === 0) throw new Error("empty cart");
    if (order.totalCents <= 0) throw new Error("bad total");
    const ok = await this.gateway.charge(order.totalCents, cardToken);
    if (!ok) throw new Error("charge failed");
    order.isPaid = true;
    order.auditLog.push(`charged ${formatMoney(order.totalCents, "usd")}`);
  }

  async cancel(order: Order): Promise<void> {
    if (!order.isPaid) throw new Error("not paid");
    if (order.isShipped) throw new Error("already shipped");
    order.isCancelled = true;
    order.auditLog.push("cancelled");
  }

  ship(order: Order, tracking: string): void {
    if (!order.isPaid) throw new Error("not paid");
    if (order.isCancelled) throw new Error("order is cancelled");
    order.isShipped = true;
    order.auditLog.push(`shipped ${tracking}`);
  }
}
