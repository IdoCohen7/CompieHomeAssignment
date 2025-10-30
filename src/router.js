import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import PictureDiscussion from "./views/PictureDiscussion.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/picture/:id",
    name: "PictureDiscussion",
    component: PictureDiscussion,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
