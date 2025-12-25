<script lang="ts">
import { defineComponent, computed } from "vue";
import { useUserStore } from "@/stores/useUserStore";

export default defineComponent({
  name: "BudgetTracker",
  setup() {
    const userStore = useUserStore();

    const isAuthenticated = computed(() => {return !!userStore.nombre});

    const logout = () => {
      userStore.logout();
      window.location.href = "/login";
    };

    return {
      userStore,
      logout,
      isAuthenticated,
    };
  },
});
</script>
<template>
  <div class="bg-gray-100">
    <header class="bg-blue-600 text-white p-4 flex justify-between items-center">

      <nav
        v-if="isAuthenticated"
        class="flex space-x-4"
      >
        <router-link
          to="/dashboard"
          class="hover:underline"
        >
          Gastos
        </router-link>

        <router-link
          to="/categorias"
          class="hover:underline"
        >
          Categorías
        </router-link>
      </nav>

      <div class="flex items-center space-x-3">
        <img
          v-if="isAuthenticated"
          :src="userStore.imagenUrl || '/default-avatar.png'"
          alt="Avatar"
          class="w-8 h-8 rounded-full"
        />

        <span v-if="isAuthenticated">
          {{ userStore.nombre }}
        </span>

        <button
          v-if="isAuthenticated"
          @click="logout"
          class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm"
        >
          Logout
        </button>
      </div>

    </header>
  </div>
</template>

