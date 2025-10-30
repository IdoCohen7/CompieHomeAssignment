<script setup>
import { ref } from "vue";
import Header from "./components/Header.vue";
import PictureGrid from "./components/PictureGrid.vue";

const searchQuery = ref("");
</script>

<template>
  <router-view></router-view>
</template>

<style>
.app {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1rem;
}

main {
  margin-top: 2rem;
}
</style>
