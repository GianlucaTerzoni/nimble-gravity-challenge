const DEFAULT_BASE_URL =
  'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net';

const BASE_URL = (import.meta.env.VITE_BASE_URL as string) || DEFAULT_BASE_URL;

type RequestOptions = RequestInit & {
  json?: unknown;
};

function joinUrl(baseUrl: string, path: string) {
  const base = baseUrl.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

function hasMessage(x: unknown): x is { message: string } {
  return (
    typeof x === 'object' &&
    x !== null &&
    'message' in x &&
    typeof (x as { message?: unknown }).message === 'string'
  );
}

async function parseResponse(res: Response): Promise<unknown> {
  const contentType = res.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    // Si el body está vacío, res.json() puede fallar. 
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  const text = await res.text();
  if (!text) return null;

  // Intentamos parsear por si vino JSON como texto
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = joinUrl(BASE_URL, path);

  const { json, headers, ...rest } = options;

  const res = await fetch(url, {
    ...rest,
    headers: {
      ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(headers || {}),
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    const message =
      (hasMessage(data) && data.message) ||
      (typeof data === 'object' &&
        data !== null &&
        'error' in data &&
        typeof (data as { error?: unknown }).error === 'string' &&
        (data as { error: string }).error) ||
      (typeof data === 'object' &&
        data !== null &&
        'detail' in data &&
        typeof (data as { detail?: unknown }).detail === 'string' &&
        (data as { detail: string }).detail) ||
      (typeof data === 'string' ? data : null) ||
      (data ? JSON.stringify(data) : null) ||
      `HTTP ${res.status}`;

    throw new Error(message);
  
  }

  return data as T;
}