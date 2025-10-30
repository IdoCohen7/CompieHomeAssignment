<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  picture: {
    type: Object,
    required: true,
  },
});

const showMetadata = ref(false);

const navigateToDiscussion = () => {
  router.push(`/picture/${props.picture.id}`);
};
</script>

<template>
  <div class="picture-card" @click="navigateToDiscussion">
    <div class="image-container">
      <img
        :src="picture.imageUrl"
        :alt="picture.title"
        @mouseover="showMetadata = true"
        @mouseleave="showMetadata = false"
      />
      <div v-if="showMetadata" class="metadata">
        <p>Resolution: {{ picture.metadata.resolution }}</p>
        <p>Size: {{ picture.metadata.size }}</p>
        <p>Year: {{ picture.metadata.year }}</p>
      </div>
    </div>
    <div class="content">
      <h3>{{ picture.title }}</h3>
      <p class="artist">By {{ picture.artist }}</p>
      <p class="description">{{ picture.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.picture-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.picture-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.image-container {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 Aspect Ratio */
  overflow: hidden;
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.metadata {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  font-size: 0.9rem;
}

.content {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.artist {
  color: #666;
  font-style: italic;
  margin: 0;
}

.description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
  flex-grow: 1;
}
</style>
