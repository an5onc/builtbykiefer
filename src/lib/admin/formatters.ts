export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function invoiceTotal(lineItems: { quantity: number; unitPrice: number }[]): number {
  return lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function timeEntryHours(clockIn: string, clockOut: string | null): number {
  const end = clockOut ? new Date(clockOut) : new Date();
  const start = new Date(clockIn);
  return Math.max(0, (end.getTime() - start.getTime()) / 1000 / 60 / 60);
}

export function formatHours(hours: number): string {
  return `${hours.toFixed(1)} hrs`;
}
