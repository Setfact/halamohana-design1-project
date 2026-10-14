import { ApiError, sendContactMessage } from '@/services/api';

type IncomingContact = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  message?: unknown;
};

export async function POST(request: Request) {
  let body: IncomingContact;
  try {
    body = (await request.json()) as IncomingContact;
  } catch {
    return Response.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name || !phone || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
    return Response.json({ message: 'Please complete all required fields.' }, { status: 400 });
  }

  try {
    const result = await sendContactMessage({
      sender_name: name,
      sender_email: email,
      subject: 'Website Inquiry',
      message: `Phone: ${phone}\n\n${message}`,
    });
    return Response.json({ message: result.message ?? 'Message sent successfully.' });
  } catch (error) {
    const status = error instanceof ApiError && error.status >= 400 && error.status < 600 ? error.status : 502;
    return Response.json({ message: 'We could not send your message.' }, { status });
  }
}
