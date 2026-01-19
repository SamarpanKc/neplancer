/**
 * Authenticated fetch wrapper
 * Automatically includes credentials (cookies) with every request
 */
export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const options: RequestInit = {
    ...init,
    credentials: 'include', // Always include cookies for auth
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  };

  return fetch(input, options);
}

/**
 * Helper to make authenticated API calls with JSON
 */
export async function apiCall<T = any>(
  endpoint: string,
  options?: Omit<RequestInit, 'body'> & { body?: any }
): Promise<T> {
  const { body, ...rest } = options || {};
  
  const response = await authFetch(endpoint, {
    ...rest,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}
