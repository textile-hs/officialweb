// functions/lib/validate.test.ts
import { describe, it, expect } from 'vitest';
import { validateContactForm } from './validate';

describe('validateContactForm', () => {
  it('rejects when honeypot is filled', () => {
    const data = new FormData();
    data.set('website', 'http://spambot.com');
    data.set('name', 'Bot');
    data.set('contact', 'bot@example.com');
    data.set('message', 'spam');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'bot' });
  });

  it('rejects when name is missing', () => {
    const data = new FormData();
    data.set('contact', 'WeChat: abc123');
    data.set('message', 'Hello');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'missing_fields' });
  });

  it('rejects when contact is missing', () => {
    const data = new FormData();
    data.set('name', 'Test');
    data.set('message', 'Hello');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'missing_fields' });
  });

  it('rejects when message is missing', () => {
    const data = new FormData();
    data.set('name', 'Test');
    data.set('contact', '+86 180 2275 6346');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'missing_fields' });
  });

  it('rejects whitespace-only name', () => {
    const data = new FormData();
    data.set('name', '   ');
    data.set('contact', '+86 180 2275 6346');
    data.set('message', 'Hello');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'missing_fields' });
  });

  it('rejects whitespace-only contact', () => {
    const data = new FormData();
    data.set('name', 'Test');
    data.set('contact', '   ');
    data.set('message', 'Hello');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'missing_fields' });
  });

  it('accepts phone number as contact method', () => {
    const data = new FormData();
    data.set('name', 'Jane Doe');
    data.set('contact', '+86 180 2275 6346');
    data.set('message', 'I would like to order fabric samples.');
    expect(validateContactForm(data)).toEqual({
      valid: true,
      name: 'Jane Doe',
      contact: '+86 180 2275 6346',
      message: 'I would like to order fabric samples.',
    });
  });

  it('accepts email address as contact method', () => {
    const data = new FormData();
    data.set('name', 'John');
    data.set('contact', 'john@example.com');
    data.set('message', 'Hi');
    expect(validateContactForm(data)).toEqual({
      valid: true,
      name: 'John',
      contact: 'john@example.com',
      message: 'Hi',
    });
  });
});
