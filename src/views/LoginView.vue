<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img src="/assets/images/icons8-budget-94.png" 
           alt="Budget Tracker" 
           class="mx-auto h-25 w-auto" />
    </div>

  <Transition name="slide-fade-left">
    <section 
      v-if="!showLoginForm"  
      class="bg-neutral-primary">
        <div class="py-8 px-4 mx-auto max-w-screen-2xl text-center lg:py-16">
            <h1 class="mb-6 text-4xl font-bold text-indigo-400 tracking-tighter text-heading md:text-5xl lg:text-6xl">Budget Tracker</h1>
            <p class="mb-8 text-base font-normal text-body md:text-xl">Cuida tu salud financiera</p>
            <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 md:space-x-4">
                <button 
                  type="button" 
                  @click="showLoginForm = true"
                  class="inline-flex items-center justify-center bg-indigo-500 text-white hover:bg-indigo-600 box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium rounded-base text-base px-5 py-3 focus:outline-none">
                    Iniciar sesión
                    <svg 
                      class="w-4 h-4 ms-1.5 -me-0.5" 
                      aria-hidden="true" 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      fill="none" 
                      viewBox="0 0 24 24">
                      <path 
                        stroke="currentColor" 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M19 12H5m14 0-4 4m4-4-4-4"/>
                    </svg>
                </button>
                <button 
                  type="button" 
                  class="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-base px-5 py-3 focus:outline-none">
                    Registrarse
                </button>
            </div>
        </div>
    </section>
</Transition>

<Transition>
    <div 
      v-if="showLoginForm"
      class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form 
        @submit.prevent="handleLogin" 
        class="space-y-6">
        <div>
          <label 
            for="username" 
            class="block text-sm/6 font-medium text-body">Usuario</label>
          <div class="mt-2">
            <input
              id="username"
              type="text"
              name="username"
              required
              autocomplete="username"
              v-model="username"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-indigo-400 outline-2 -outline-offset-2 outline-black/9 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Ingresar
          </button>
          <button
            type="button"
            class="text-sm text-indigo-400 hover:underline mb-4"
            @click="showLoginForm = false"
          >
            ← Volver
          </button>
        </div>

        <p 
          v-if="error" 
          class="text-red-500 text-center">{{ error }}</p>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-400">
        ¿No tenés una cuenta?
        <a href="#" class="font-semibold text-indigo-400 hover:text-indigo-300">Registrate</a>
      </p>
    </div>
    </Transition>
  </div>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { authApi } from "@/api/api";
import router from "@/router/router";
import { useUserStore } from "@/stores/useUserStore";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  components: {
    Footer,
  },
  setup() {
    const username = ref("");
    const error = ref("");
    const userStore = useUserStore();

  const showLoginForm = ref(false)

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
      showLoginForm,
    };
  },
});
</script>
<style lang="css" scoped>
  .slide-fade-left-enter-active,
  .slide-fade-left-leave-active {
    transition: all 0.4s ease;
  }

  .slide-fade-left-enter-from {
    opacity: 0;
    transform: translateX(40px);
  }

  .slide-fade-left-enter-to {
    opacity: 1;
    transform: translateX(0);
  }

  .slide-fade-left-leave-from {
    opacity: 1;
    transform: translateX(0);
  }

  .slide-fade-left-leave-to {
    opacity: 0;
    transform: translateX(-40px);
  }
</style>