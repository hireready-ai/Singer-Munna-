/**
 * Client-side admin API caller that automatically passes Authorization bearer token
 * and handles authentication / error states consistently.
 */
export async function adminApi(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as any || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      alert('आपका एडमिन सत्र समाप्त हो गया है। कृपया दोबारा लॉगिन करें। (Session expired, please login again)');
      window.location.href = '/admin/login';
    }
    throw new Error('Unauthorized');
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }

  return data;
}

