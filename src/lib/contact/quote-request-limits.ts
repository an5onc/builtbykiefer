// Keep native form limits, server validation and request deadlines aligned.
export const quoteFieldLimits = {
  name: { min: 2, max: 120 },
  email: { max: 160 },
  phone: { min: 7, max: 60 },
  projectType: { min: 2, max: 120 },
  location: { min: 2, max: 160 },
  budget: { min: 1, max: 120 },
  timeline: { min: 1, max: 120 },
  message: { min: 10, max: 2500 },
  company: { max: 120 },
} as const;

export const QUOTE_MAX_BODY_BYTES = 32 * 1024;
export const QUOTE_EMAIL_TIMEOUT_MS = 10_000;
export const QUOTE_SUBMIT_TIMEOUT_MS = 15_000;
