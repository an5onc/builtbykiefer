export function getTrimmedValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function parseNonNegativeMoney(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

export function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}
