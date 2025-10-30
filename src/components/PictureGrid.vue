<script setup>
import { ref, onMounted, watch, computed } from "vue";
import PictureCard from "./PictureCard.vue";
import ProgressSpinner from "primevue/progressspinner";

const props = defineProps({
  searchQuery: String,
});

const pictures = ref([]);
const loading = ref(true);
const showMetadata = ref(false);

const fetchPictures = async () => {
  loading.value = true;
  try {
    const response = await fetch("http://localhost:3000/api/pictures");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    pictures.value = data;
  } catch (error) {
    console.error("Error fetching pictures:", error);
    pictures.value = [];
  } finally {
    loading.value = false;
  }
};

const filteredPictures = computed(() => {
  if (!props.searchQuery) return pictures.value;

  const searchLower = props.searchQuery.toLowerCase();
  return pictures.value.filter(
    (picture) =>
      picture.title.toLowerCase().includes(searchLower) ||
      picture.artist.toLowerCase().includes(searchLower)
  );
});

onMounted(() => {
  fetchPictures();
});

// Watch for changes in searchQuery
watch(
  () => props.searchQuery,
  () => {
    // No need to fetch again, we'll filter the existing pictures
  }
);
</script>

<template>
  <div class="picture-grid">
    <div v-if="loading" class="loading">
      <ProgressSpinner />
    </div>
    <div v-else-if="filteredPictures.length === 0" class="no-results">
      <p>No pictures found</p>
    </div>
    <div v-else class="grid">
      <PictureCard
        v-for="picture in filteredPictures"
        :key="picture.id"
        :picture="picture"
      />
    </div>
  </div>
</template>

<style scoped>
.picture-grid {
  padding: 2rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.no-results {
  text-align: center;
  color: #666;
  padding: 2rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
}
</style>
