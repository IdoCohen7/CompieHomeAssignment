<script setup>
import { ref, watch } from "vue";
import InputText from "primevue/inputtext";

const searchQuery = ref("");
const emit = defineEmits(["search"]);

let debounceTimer;

watch(searchQuery, (newValue) => {
  // Clear previous timer
  clearTimeout(debounceTimer);

  // Set new timer
  debounceTimer = setTimeout(() => {
    emit("search", newValue);
  }, 300); // 300ms debounce delay
});
</script>

<template>
  <header class="header-container">
    <div class="search-container">
      <span class="p-input-icon-left search-wrapper">
        <i class="pi pi-search" />
        <InputText
          v-model="searchQuery"
          placeholder="What are you looking for?"
          class="p-inputtext-lg search-input"
        />
      </span>
    </div>
  </header>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.search-container {
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: center;
}

.search-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
}

:deep(.search-input) {
  width: 100%;
  height: 38px;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  font-size: 0.95rem;
  border-radius: 20px;
  border: 1px solid #dfe2e7;
  transition: all 0.2s ease;
  background-color: #f8f9fa;
}

:deep(.search-input:focus) {
  background-color: #fff;
  border-color: var(--primary-color, #6366f1);
  box-shadow: 0 0 0 1px var(--primary-color, #6366f1);
}

:deep(.p-input-icon-left) {
  position: relative;
  display: inline-block;
  width: 100%;
}

:deep(.p-input-icon-left i) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0.875rem;
  color: #6b7280;
  font-size: 0.9rem;
  z-index: 1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-container {
    padding: 1rem;
  }

  :deep(.search-input) {
    height: 40px;
    font-size: 0.875rem;
  }
}
</style>
