import { track } from "@vercel/analytics";

// Only predefined event names: never include form values, contact details or messages.
type ConversionEvent = "Project opened" | "WhatsApp clicked" | "Service selected" | "Contact request accepted";

export function trackConversion(event: ConversionEvent) {
  if (process.env.NEXT_PUBLIC_ENABLE_CONVERSION_ANALYTICS !== "true") return;
  if (process.env.NODE_ENV !== "production") return;
  try {
    track(event);
  } catch {
    // Analytics must never interrupt navigation or change the outcome of a submission.
  }
}
