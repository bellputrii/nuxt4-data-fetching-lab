// app/stores/product.ts
import { defineStore } from 'pinia';
import type { Product } from '~/models/product';

export const useProductStore = defineStore('product', () => {
  const selectedProduct = ref<Product | null>(null);
  const isModalOpen = ref(false);

  function openDetail(product: Product) {
    selectedProduct.value = product;
    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
    selectedProduct.value = null;
  }

  return {
    selectedProduct,
    isModalOpen,
    openDetail,
    closeModal,
  };
});