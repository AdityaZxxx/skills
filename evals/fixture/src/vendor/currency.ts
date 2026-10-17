// Vendored from @acme/currency@4.2.0 (internal registry). Do not edit.
export function formatCurrency(cents: number, currency: string): string {
  const symbols: Record<string, string> = { usd: "$", eur: "\u20AC" };
  const symbol = symbols[currency] ?? currency.toUpperCase() + " ";
  return `${symbol}${(cents / 100).toFixed(2)}`;
}
