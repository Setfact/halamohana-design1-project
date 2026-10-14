const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, '') ?? '';

export type ApiEnvelope<T = undefined> = {
  code?: number;
  message?: string;
  data?: T;
  meta?: MetaPagination;
};

export type MetaPagination = {
  page?: number;
  limit?: number;
  total?: number;
};

export type Banner = {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type AboutUs = {
  id: number;
  title: string;
  description: string;
  vision: string;
  mission: string;
  image_url?: string;
};

export type ContactPayload = {
  sender_name: string;
  sender_email: string;
  subject?: string;
  message: string;
};

export class ApiError extends Error {
  constructor(message: string, public readonly status = 502) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}, timeout = 3000): Promise<ApiEnvelope<T>> {
  if (!API_BASE_URL) throw new ApiError('API base URL is not configured', 503);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      cache: init.cache ?? 'no-store',
      headers: { Accept: 'application/json', ...init.headers },
      signal: controller.signal,
    });

    let payload: ApiEnvelope<T>;
    try {
      payload = (await response.json()) as ApiEnvelope<T>;
    } catch {
      throw new ApiError('The API returned an invalid response', response.status || 502);
    }

    const payloadFailed = typeof payload.code === 'number' && (payload.code < 200 || payload.code >= 300);
    if (!response.ok || payloadFailed) {
      throw new ApiError(payload.message ?? 'The API request failed', response.status || payload.code || 502);
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('The API request timed out', 504);
    }
    throw new ApiError('The API is unavailable', 502);
  } finally {
    clearTimeout(timer);
  }
}

export async function getBanners(): Promise<Banner[]> {
  const payload = await request<Banner[]>('/banners');
  if (!Array.isArray(payload.data)) throw new ApiError('The banners response is invalid');

  return payload.data
    .filter((banner) => banner?.is_active && typeof banner.image_url === 'string' && banner.image_url.length > 0)
    .sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0));
}

export async function getAbout(): Promise<AboutUs> {
  const payload = await request<AboutUs>('/about');
  if (!payload.data || typeof payload.data !== 'object') throw new ApiError('The about response is invalid');
  return payload.data;
}

export async function sendContactMessage(body: ContactPayload): Promise<ApiEnvelope> {
  return request('/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }, 10000);
}

export function missionItems(value?: string): string[] {
  if (!value?.trim()) return [];
  return value
    .split(/\r?\n/)
    .map((item) => item.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
    .filter(Boolean);
}
