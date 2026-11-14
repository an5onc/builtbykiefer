// Server-side delivery routing shared by both website form handlers.
// Public contact and manual recovery links continue to use businessContact.email.
export const websiteNotificationRecipients = Object.freeze([
  "info@kbuiltco.com",
  "lauren@kbuiltco.com",
  "mark@kbuiltco.com",
] as const);
