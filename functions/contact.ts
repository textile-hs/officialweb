// functions/contact.ts
import { createMimeMessage } from 'mimetext/browser';
import { validateContactForm } from './lib/validate';

interface Env {
  SEND_EMAIL?: SendEmail;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const headers = { 'Content-Type': 'application/json' };

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return new Response(JSON.stringify({ success: false }), { status: 400, headers });
  }

  const result = validateContactForm(data);

  if (!result.valid) {
    if (result.reason === 'bot') {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }
    return new Response(JSON.stringify({ success: false, reason: result.reason }), { status: 422, headers });
  }

  const { name, email, phone, message } = result;

  const msg = createMimeMessage();
  msg.setSender({ name: 'Hongshang Website', addr: 'noreply@hongstex.shop' });
  msg.setRecipient('inquiry@hongstex.shop');
  msg.setSubject(`New enquiry from ${name}`);
  msg.addMessage({
    contentType: 'text/plain',
    data: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'N/A'}`,
      '',
      `Message:`,
      message,
    ].join('\n'),
  });

  if (env.SEND_EMAIL) {
    try {
      const { EmailMessage } = await import('cloudflare:email' as string) as {
        EmailMessage: new (from: string, to: string, raw: string) => unknown;
      };
      const emailMessage = new EmailMessage(
        'noreply@hongstex.shop',
        'inquiry@hongstex.shop',
        msg.asRaw(),
      );
      await env.SEND_EMAIL.send(emailMessage as EmailMessage);
    } catch (err) {
      console.error('Email send failed:', err);
      return new Response(JSON.stringify({ success: false }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
};
