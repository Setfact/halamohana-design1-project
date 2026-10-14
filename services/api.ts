const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) throw new Error('API base URL is not configured');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? 'We could not load this content.');
  }

  return payload.data;
}

export const contentApi = {
  home: <T>() => request<T>('/home'),
  about: <T>() => request<T>('/about'),
  projects: <T>() => request<T>('/projects'),
  project: <T>(slug: string) => request<T>(`/projects/${slug}`),
  gallery: <T>(category?: string) => request<T>(`/gallery${category ? `?category=${category}` : ''}`),
  news: <T>(query = '') => request<T>(`/news${query}`),
  careers: <T>() => request<T>('/careers'),
  contact: <T>() => request<T>('/contact'),
  sendMessage: <T>(body: { name: string; phone: string; email: string; message: string }) =>
    request<T>('/contact-message', { method: 'POST', body: JSON.stringify(body) }),
};
