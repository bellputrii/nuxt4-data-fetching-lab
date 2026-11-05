// app/composables/useApiFetch.ts
import type { UseFetchOptions } from 'nuxt/app';

export function useApiFetch<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  const token = useCookie('auth_token');

  const defaults: UseFetchOptions<T> = {
    headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
    onResponseError({ response }) {
      if (response.status === 401) {
        console.warn('Unauthorized access');
      }
    },
  };

  return useFetch<T>(url, { ...defaults, ...options });
}