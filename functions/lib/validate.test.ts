// functions/lib/validate.test.ts
import { describe, it, expect } from 'vitest';
import { validateContactForm } from './validate';

describe('validateContactForm', () => {
  it('rejects when honeypot is filled', () => {
    const data = new FormData();
    data.set('website', 'http://spambot.com');
    data.set('name', 'Bot');
    data.set('email', 'bot@example.com');
    data.set('message', 'spam');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'bot' });
  });

  it('rejects when name is missing', () => {
    const data = new FormData();
    data.set('email', 'test@example.com');
    data.set('message', 'Hello');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'missing_fields' });
  });

  it('rejects when email is missing', () => {
    const data = new FormData();
    data.set('name', 'Test');
    data.set('message', 'Hello');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'missing_fields' });
  });

  it('rejects when message is missing', () => {
    const data = new FormData();
    data.set('name', 'Test');
    data.set('email', 'test@example.com');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'missing_fields' });
  });

  it('rejects invalid email format', () => {
    const data = new FormData();
    data.set('name', 'Test');
    data.set('email', 'not-an-email');
    data.set('message', 'Hello');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'invalid_email' });
  });

  it('accepts valid input with optional phone', () => {
    const data = new FormData();
    data.set('name', 'Jane Doe');
    data.set('email', 'jane@example.com');
    data.set('phone', '+86-123-4567-8901');
    data.set('message', 'I would like to order fabric samples.');
    expect(validateContactForm(data)).toEqual({
      valid: true,
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+86-123-4567-8901',
      message: 'I would like to order fabric samples.',
    });
  });

  it('accepts valid input without phone', () => {
    const data = new FormData();
    data.set('name', 'John');
    data.set('email', 'john@example.com');
    data.set('message', 'Hi');
    expect(validateContactForm(data)).toEqual({
      valid: true,
      name: 'John',
      email: 'john@example.com',
      phone: '',
      message: 'Hi',
    });
  });
});
