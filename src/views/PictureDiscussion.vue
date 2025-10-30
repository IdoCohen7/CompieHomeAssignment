<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import ChatSection from "../components/ChatSection.vue";

const route = useRoute();
const picture = ref(null);

onMounted(async () => {
  await fetchPicture();
});

const fetchPicture = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/pictures/${route.params.id}`
    );
    if (!response.ok) throw new Error("Failed to fetch picture");
    picture.value = await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

// Removed message handling as it's now in ChatSection component
</script>

<template>
  <div class="discussion-page" v-if="picture">
    <div class="content-container">
      <div class="picture-section">
        <div class="picture-section-title">
          <h1>{{ picture.title }}</h1>
          <h2>by {{ picture.artist }}</h2>
        </div>

        <img :src="picture.imageUrl" :alt="picture.title" />
        <p class="description">{{ picture.description }}</p>
      </div>

      <ChatSection :pictureId="route.params.id" />
    </div>
  </div>
</template>

<style scoped>
.discussion-page {
  padding: 2rem;
  max-width: 1440px;
  margin: 0 auto;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  min-height: calc(100vh - 150px);
  align-items: start;
}

.content-container :deep(.chat-section) {
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  height: 100%;
}

.picture-section {
  padding: 1rem;
}

.picture-section img {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
  margin: 1rem 0;
}

.picture-section h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: inline;
  padding-right: 20px;
}

.picture-section h2 {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: inline;
}

@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
  }

  .content-container :deep(.chat-section) {
    position: static;
    height: 500px;
    max-height: none;
  }
}
</style>
