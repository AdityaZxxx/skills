import { formatCurrency } from "../vendor/currency";

export function formatMoney(cents: number, currency: string): string {
  return formatCurrency(cents, currency);
}

export function parseMoney(input: string): number {
  const n = Number(input.replace(/[^0-9.]/g, ""));
  return Math.round(n * 100);
}
