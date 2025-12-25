<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" 
           alt="Budget Tracker" 
           class="mx-auto h-10 w-auto" />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Iniciar sesión</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form 
        @submit.prevent="handleLogin" 
        class="space-y-6">
        <div>
          <label 
            for="username" 
            class="block text-sm/6 font-medium text-gray-100">Usuario</label>
          <div class="mt-2">
            <input
              id="username"
              type="text"
              name="username"
              required
              autocomplete="username"
              v-model="username"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <!-- Botón de login -->
        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Ingresar
          </button>
        </div>

        <!-- Mensaje de error -->
        <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-400">
        ¿No tenés una cuenta?
        <a href="#" class="font-semibold text-indigo-400 hover:text-indigo-300">Registrate</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { authApi } from "@/api/api";
import router from "@/router/router";
import { useUserStore } from "@/stores/useUserStore";

export default defineComponent({
  setup() {
    const username = ref("");
    const error = ref("");
    const userStore = useUserStore();

  const handleLogin = async () => {
    error.value = "";

    try {
      const authResponse = await authApi.login({
        username: username.value,
      });

      userStore.login(authResponse);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.response?.data?.message) {
        error.value = err.response.data.message;
      } else if (err.message) {
        error.value = err.message;
      } else {
        error.value = "Error al iniciar sesión";
      }
    }
  };

    return {
      username,
      error,
      handleLogin,
      userStore,
    };
  },
});
</script>
