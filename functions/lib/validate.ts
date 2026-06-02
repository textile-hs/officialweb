// functions/lib/validate.ts
type ValidResult = {
  valid: true;
  name: string;
  email: string;
  phone: string;
  message: string;
};

type InvalidResult = {
  valid: false;
  reason: 'bot' | 'missing_fields' | 'invalid_email';
};

export type ValidationResult = ValidResult | InvalidResult;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(data: FormData): ValidationResult {
  if (data.get('website')) {
    return { valid: false, reason: 'bot' };
  }

  const name = (data.get('name') as string | null)?.trim() ?? '';
  const email = (data.get('email') as string | null)?.trim() ?? '';
  const phone = (data.get('phone') as string | null)?.trim() ?? '';
  const message = (data.get('message') as string | null)?.trim() ?? '';

  if (!name || !email || !message) {
    return { valid: false, reason: 'missing_fields' };
  }

  if (!EMAIL_RE.test(email)) {
    return { valid: false, reason: 'invalid_email' };
  }

  return { valid: true, name, email, phone, message };
}
