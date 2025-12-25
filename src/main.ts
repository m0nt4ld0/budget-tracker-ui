import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import { createPinia } from "pinia";
import { useUserStore } from "@/stores/useUserStore";
import './assets/main.css'; 

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const userStore = useUserStore();

try {
  userStore.loadFromStorage();
} catch (error) {
  console.error("Error loading user from storage:", error);
}

app.use(router);
app.mount("#app");