<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useUserStore } from "@/stores/useUserStore";
import { PowerIcon } from "@heroicons/vue/24/outline";

export default defineComponent({
  name: "Navbar",
  components: { PowerIcon },
  setup() {
    const userStore = useUserStore();
    const dropdownOpen = ref(false);

    const isAuthenticated = computed(() => !!userStore.nombre);

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };

    const logout = () => {
      userStore.logout();
      window.location.href = "/login";
    };

    return {
      userStore,
      isAuthenticated,
      dropdownOpen,
      toggleDropdown,
      logout,
    };
  },
});
</script>

<template>
  <nav class="bg-indigo-600 fixed w-full z-20 top-0 border-b border-indigo-500">
    <div class="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between p-4">

      <a 
        href="/" 
        class="flex items-center space-x-1"
      >
        <img 
          src="/assets/images/icons8-budget-94.png" 
          alt="Budget Tracker" 
          class="h-10 w-auto" 
        />
        <span 
          class="text-xl font-semibold text-white"
        >
          Budget Tracker
        </span>
      </a>

      <div class="flex items-center space-x-3">
        <div v-if="isAuthenticated" class="relative">
          <button
            @click="toggleDropdown"
            type="button"
            class="flex items-center p-1 rounded-full bg-indigo-500 hover:bg-indigo-400 focus:ring-2 focus:ring-indigo-300"
          >
            <img
              :src="userStore.imagenUrl || '/default-avatar.png'"
              alt="Avatar"
              class="w-8 h-8 rounded-full"
            />
          </button>

          <div
            v-show="dropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-indigo-50/10 backdrop-blur-sm border border-indigo-400/30 rounded-md shadow-lg"
          >
            <div class="px-4 py-3 border-b border-indigo-400/30 text-indigo-500">
              <span class="block font-medium">Hola, <strong>{{ userStore.nombre }}</strong></span>
              <span class="block text-sm truncate">{{ userStore.email || 'usuario@email.com' }}</span>
            </div>
            <ul class="p-2 text-sm text-indigo-500 font-medium">
              <li>
                <router-link to="/dashboard" class="flex items-center w-full p-2 hover:bg-indigo-500/30 rounded">
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link to="/categorias" class="flex items-center w-full p-2 hover:bg-indigo-500/30 rounded">
                  Categorías
                </router-link>
              </li>
              <li>
                <button
                  @click="logout"
                  class="flex items-center w-full p-2 hover:bg-red-500/50 hover:text-white rounded text-red-500/100"
                >
                  <PowerIcon class="w-5 h-5 mr-2 text-red-500/100" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex items-center p-2 text-white rounded-lg md:hidden hover:bg-indigo-500/30 focus:ring-2 focus:ring-indigo-300"
        aria-controls="navbar-user"
        aria-expanded="false"
      >
        <span class="sr-only">Open main menu</span>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

    </div>
  </nav>
</template>

<style scoped>
[ v-cloak ] { display: none; }
</style>
