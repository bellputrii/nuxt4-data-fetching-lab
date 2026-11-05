// server/api/app/products.ts
import type { ProductResponse } from '~/models/product';

// server/api/app/products.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const q = (query.q as string) || '';
  const limit = (query.limit as string) || '8';
  const skip = (query.skip as string) || '0';

  const baseUrl = 'https://dummyjson.com';
  const targetUrl = q
    ? `${baseUrl}/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
    : `${baseUrl}/products?limit=${limit}&skip=${skip}`;

  try {
    const data = await $fetch(targetUrl);
    return data;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Gagal mengambil data dari API DummyJSON',
    });
  }
});