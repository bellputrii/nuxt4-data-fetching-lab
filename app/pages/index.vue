<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
}

interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const search = ref('');
const page = ref(1);
const pageLimit = 8;
const selectedProduct = ref<Product | null>(null);
const isModalOpen = ref(false);

const skip = computed(() => (page.value - 1) * pageLimit);

const apiUrl = computed(() => {
  const queryParam = search.value ? `/search?q=${encodeURIComponent(search.value)}&` : '?';
  return `https://dummyjson.com/products${queryParam}limit=${pageLimit}&skip=${skip.value}`;
});

const { data: response, pending, error, refresh } = await useFetch<ProductResponse>(apiUrl, {
  watch: [search, page],
});

const products = computed(() => response.value?.products || []);
const totalData = computed(() => response.value?.total || 0);
const totalPages = computed(() => Math.ceil(totalData.value / pageLimit));

const openDetail = (product: Product) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedProduct.value = null;
};

watch(search, () => {
  page.value = 1;
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8 font-sans">
    <div class="max-w-6xl mx-auto space-y-6">

      <!-- HEADER BAR -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-teal-600 text-white rounded-xl shadow-sm">
            <span class="text-xl">📦</span>
          </div>
          <div>
            <h1 class="text-xl font-bold text-slate-900 tracking-tight">Katalog Inventory Dashboard</h1>
            <p class="text-xs text-slate-500">Nuxt 4 Data Fetching Lab • Integrasi Public API DummyJSON</p>
          </div>
        </div>

        <button
          @click="() => refresh()"
          :disabled="pending"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
        >
          <span :class="{ 'animate-spin': pending }">🔄</span>
          <span>{{ pending ? 'Memuat...' : 'Refresh Data' }}</span>
        </button>
      </header>

      <!-- FILTER & SEARCH BAR -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div class="relative w-full sm:w-96">
          <input
            v-model="search"
            type="text"
            placeholder="Cari produk (misal: phone, laptop, watch)..."
            class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-600 transition"
          />
          <span class="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>

        <div class="flex items-center gap-3 text-xs text-slate-600 font-mono">
          <span class="px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
            Total Data: <strong class="text-teal-700 font-bold">{{ totalData }}</strong> Produk
          </span>
        </div>
      </div>

      <!-- ERROR STATE -->
      <div v-if="error" class="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-3">
        <span class="text-base">⚠️</span>
        <div>
          <p class="font-bold">Gagal Mengambil Data Produk</p>
          <p class="text-rose-600 mt-0.5">{{ error.message }}</p>
        </div>
      </div>

      <!-- DATA TABLE CARD -->
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        
        <!-- LOADING SKELETON -->
        <div v-if="pending" class="p-6 space-y-3">
          <div v-for="i in 5" :key="i" class="h-10 bg-slate-100 animate-pulse rounded-lg w-full"></div>
        </div>

        <!-- TABLE content -->
        <div v-else-if="products.length > 0" class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <th class="p-4 w-16">ID</th>
                <th class="p-4">Produk</th>
                <th class="p-4">Kategori</th>
                <th class="p-4">Harga</th>
                <th class="p-4">Stok</th>
                <th class="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs">
              <tr v-for="item in products" :key="item.id" class="hover:bg-slate-50/80 transition-colors">
                <td class="p-4 font-mono font-semibold text-slate-500">#{{ item.id }}</td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <img
                      :src="item.thumbnail"
                      :alt="item.title"
                      class="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-slate-50 flex-shrink-0"
                    />
                    <div>
                      <p class="font-bold text-slate-900">{{ item.title }}</p>
                      <p class="text-[11px] text-slate-500 line-clamp-1 max-w-xs">{{ item.description }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <span class="px-2.5 py-1 text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200 rounded-full capitalize">
                    {{ item.category }}
                  </span>
                </td>
                <td class="p-4 font-bold text-slate-900 text-sm">
                  ${{ item.price }}
                </td>
                <td class="p-4">
                  <span
                    :class="item.stock > 20 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'"
                    class="px-2.5 py-1 text-[10px] font-semibold border rounded-full"
                  >
                    {{ item.stock }} unit
                  </span>
                </td>
                <td class="p-4 text-right">
                  <button
                    @click="openDetail(item)"
                    class="px-3 py-1.5 bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 rounded-lg text-xs font-semibold transition-all border border-slate-200 shadow-2xs"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- EMPTY STATE -->
        <div v-else class="text-center py-12 text-slate-500 text-xs space-y-2">
          <p class="text-2xl">🔎</p>
          <p class="font-semibold text-slate-800">Produk Tidak Ditemukan</p>
          <p class="text-slate-500">Tidak ada data yang cocok dengan kata kunci "{{ search }}".</p>
        </div>

        <!-- PAGINATION BAR -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
          <p>
            Menampilkan Halaman <strong class="text-slate-900">{{ page }}</strong> dari <strong class="text-slate-900">{{ totalPages || 1 }}</strong>
          </p>

          <div class="flex items-center gap-2">
            <button
              @click="page--"
              :disabled="page <= 1"
              class="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 font-semibold disabled:opacity-40 transition shadow-2xs"
            >
              &larr; Prev
            </button>
            <span class="font-mono text-teal-700 font-bold px-2">{{ page }}</span>
            <button
              @click="page++"
              :disabled="page >= totalPages"
              class="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 font-semibold disabled:opacity-40 transition shadow-2xs"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL DETAIL PRODUK -->
      <div v-if="isModalOpen && selectedProduct" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <div class="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
          <div class="flex justify-between items-start border-b border-slate-100 pb-3">
            <div>
              <span class="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-wider">Detail Produk #{{ selectedProduct.id }}</span>
              <h3 class="text-base font-bold text-slate-900 mt-0.5">{{ selectedProduct.title }}</h3>
            </div>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-700 text-sm font-bold p-1">✕</button>
          </div>

          <div class="flex gap-4 items-center">
            <img
              :src="selectedProduct.thumbnail"
              :alt="selectedProduct.title"
              class="w-24 h-24 object-cover rounded-xl border border-slate-200 bg-slate-50 shrink-0"
            />
            <div class="space-y-1.5 text-xs">
              <p class="text-slate-600 leading-relaxed">{{ selectedProduct.description }}</p>
              <div class="flex items-center gap-2 pt-1">
                <span class="text-base font-extrabold text-teal-700">${{ selectedProduct.price }}</span>
                <span class="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-semibold text-[10px]">⭐ {{ selectedProduct.rating }}</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end border-t border-slate-100 pt-4">
            <button @click="closeModal" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition">
              Tutup
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>