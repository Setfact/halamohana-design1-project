'use client';

import { FormEvent, useState } from 'react';

type FormData = { name: string; phone: string; email: string; message: string };
const emptyForm: FormData = { name: '', phone: '', email: '', message: '' };

export function ContactForm() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Partial<FormData> = {};
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.';
    if (!form.phone.trim()) nextErrors.phone = 'Please enter your phone number.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Please enter a valid email address.';
    if (form.message.trim().length < 10) nextErrors.message = 'Please tell us a little more (at least 10 characters).';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus('loading');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (apiUrl) {
        const response = await fetch(`${apiUrl}/contact-message`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        if (!response.ok) throw new Error('Request failed');
      } else {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
      setForm(emptyForm);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  function update(field: keyof FormData, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status !== 'idle') setStatus('idle');
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <label>Name<input value={form.name} onChange={(event) => update('name', event.target.value)} aria-invalid={!!errors.name} placeholder="Your full name" />{errors.name && <small>{errors.name}</small>}</label>
        <label>Phone<input value={form.phone} onChange={(event) => update('phone', event.target.value)} aria-invalid={!!errors.phone} placeholder="+62" />{errors.phone && <small>{errors.phone}</small>}</label>
      </div>
      <label>Email<input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} aria-invalid={!!errors.email} placeholder="name@company.com" />{errors.email && <small>{errors.email}</small>}</label>
      <label>Message<textarea value={form.message} onChange={(event) => update('message', event.target.value)} aria-invalid={!!errors.message} placeholder="How can we help?" rows={6} />{errors.message && <small>{errors.message}</small>}</label>
      <button className="button button-primary" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Sending...' : 'Send message'} <span>↗</span></button>
      <div className={`form-status ${status}`} aria-live="polite">
        {status === 'success' && 'Thank you. Your message has been sent successfully.'}
        {status === 'error' && 'We could not send your message. Please email us directly at info@hallamohana.co.id.'}
      </div>
    </form>
  );
}
