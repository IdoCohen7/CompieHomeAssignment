<script setup>
import { ref } from "vue";
import Header from "../components/Header.vue";
import PictureGrid from "../components/PictureGrid.vue";

const searchQuery = ref("");
</script>

<template>
  <div class="app">
    <Header @search="searchQuery = $event" />
    <main>
      <PictureGrid :searchQuery="searchQuery" />
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1rem;
}

main {
  margin-top: 2rem;
}
</style>
