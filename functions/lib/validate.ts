// functions/lib/validate.ts
type ValidResult = {
  valid: true;
  name: string;
  contact: string;
  message: string;
};

type InvalidResult = {
  valid: false;
  reason: 'bot' | 'missing_fields' | 'field_too_long';
};

export type ValidationResult = ValidResult | InvalidResult;

export function validateContactForm(data: FormData): ValidationResult {
  if (data.get('website')) {
    return { valid: false, reason: 'bot' };
  }

  const name = (data.get('name') as string | null)?.trim() ?? '';
  const contact = (data.get('contact') as string | null)?.trim() ?? '';
  const message = (data.get('message') as string | null)?.trim() ?? '';

  if (!name || !contact || !message) {
    return { valid: false, reason: 'missing_fields' };
  }

  if (name.length > 100 || contact.length > 200 || message.length > 4000) {
    return { valid: false, reason: 'field_too_long' };
  }

  return { valid: true, name, contact, message };
}
