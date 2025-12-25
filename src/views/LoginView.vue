<template>
  <div class="min-h-screen flex flex-col justify-between px-6 py-12 lg:px-8">
    <div class="relative overflow-hidden flex-grow">
      <div class="flex justify-center mb-6">
        <img
          src="/assets/images/icons8-budget-94.png"
          alt="Budget Tracker"
          class="h-20 w-auto"
        />
      </div>
      
      <Transition name="slide-fade-left" mode="out-in">
        <section
          v-if="authStep === 'hero'"
          key="hero"
          class="bg-neutral-primary flex flex-col justify-center min-h-full"
        >
          <div class="py-8 px-4 mx-auto max-w-screen-2xl text-center">
            <h1
              class="mb-6 text-4xl font-bold text-indigo-400 tracking-tighter md:text-5xl lg:text-6xl"
            >
              Budget Tracker
            </h1>
            <div class="mb-8 h-8 overflow-hidden">
              <Transition name="phrase" mode="out-in">
                <p
                  :key="currentPhrase"
                  class="text-base text-body md:text-xl"
                >
                  {{ currentPhrase }}
                </p>
              </Transition>
            </div>

            <div
              class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 md:space-x-4"
            >
              <button
                type="button"
                @click="authStep = 'login'"
                class="inline-flex items-center justify-center bg-indigo-500 text-white hover:bg-indigo-600 px-5 py-3 rounded-base font-medium"
              >
                Iniciar sesión
              </button>

              <button
                type="button"
                @click="authStep = 'register'"
                class="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-base px-5 py-3 focus:outline-none"
              >
                Registrarse
              </button>
            </div>
          </div>
        </section>
      </Transition>

      <Transition 
        name="slide-fade-left" 
        mode="out-in">
        <div
          v-if="authStep === 'login'"
          key="login"
          class="absolute inset-0 flex justify-center items-center"
        >
          <div class="sm:w-full sm:max-w-sm">
            <form 
              @submit.prevent="handleLogin" 
              class="space-y-6">
              <h3 class="text-center text-2xl font-bold text-indigo-400 mb-6">
                Qué bueno verte de nuevo
              </h3>

              <div>
                <label class="block text-sm font-medium text-body">
                  Usuario
                </label>
                <input
                  v-model="username"
                  required
                  autocomplete="username"
                  class="
                    mt-2 block w-full rounded-md
                    bg-white
                    border border-gray-400/20
                    px-3 py-2
                    text-gray-900
                    focus:border-indigo-500
                    focus:ring-2 focus:ring-indigo-500/20
                    outline-none
                  "
                />
              </div>

              <button
                type="submit"
                class="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-2 rounded-md font-semibold"
              >
                Ingresar
              </button>

              <button
                type="button"
                class="text-sm text-indigo-400 hover:underline"
                @click="authStep = 'hero'"
              >
                ← Volver
              </button>

              <p class="text-center text-sm text-gray-400">
                ¿No tenés una cuenta?
                <a
                  href="#"
                  class="font-semibold text-indigo-400 hover:text-indigo-300"
                  @click.prevent="authStep = 'register'"
                >
                  Registrate
                </a>
                <br>
                - o -
                <br>
                ¿Tenés problemas para entrar?
                <a
                  href="#"
                  class="font-semibold text-indigo-400 hover:text-indigo-300"
                  @click.prevent="authStep = 'register'"
                >
                  Hacé clic acá
                </a>
              </p>

              <p v-if="error" class="text-red-500 text-center">
                {{ error }}
              </p>
            </form>
          </div>
        </div>
      </Transition>

      <Transition name="slide-fade-left" mode="out-in">
        <div
          v-if="authStep === 'register'"
          key="register"
          class="absolute inset-0 flex justify-center items-center"
        >
          <div class="sm:w-full sm:max-w-sm">
            <form 
              @submit.prevent="handleRegister" 
              class="space-y-6">
              <h3 class="text-center text-2xl font-bold text-indigo-400 mb-6">
                Sumate a nuestra comunidad
              </h3>

              <div>
                <label class="block text-sm font-medium text-body">
                  Nombre completo
                </label>
                <input
                  v-model="fullName"
                  required
                  autocomplete="name"
                  class="
                    mt-2 block w-full rounded-md
                    bg-white
                    border border-gray-400/20
                    px-3 py-2
                    text-gray-900
                    focus:border-indigo-500
                    focus:ring-2 focus:ring-indigo-500/20
                    outline-none
                  "
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-body">
                  Usuario
                </label>
                <input
                  v-model="username"
                  required
                  autocomplete="username"
                  class="
                    mt-2 block w-full rounded-md
                    bg-white
                    border border-gray-400/20
                    px-3 py-2
                    text-gray-900
                    focus:border-indigo-500
                    focus:ring-2 focus:ring-indigo-500/20
                    outline-none
                  "
                />
              </div>

              <button
                type="submit"
                class="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-2 rounded-md font-semibold"
              >
                Registrarse
              </button>

              <button
                type="button"
                class="text-sm text-indigo-400 hover:underline"
                @click="authStep = 'hero'"
              >
                ← Volver
              </button>

              <p class="text-center text-sm text-gray-400">
                ¿Ya tenés una cuenta?
                <a
                  href="#"
                  class="font-semibold text-indigo-400 hover:text-indigo-300"
                  @click.prevent="authStep = 'login'"
                >
                  Entrá acá
                </a>
              </p>

              <p v-if="error" class="text-red-500 text-center">
                {{ error }}
              </p>
            </form>
          </div>
        </div>
      </Transition>
    </div>

    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { authApi } from "@/api/api";
import router from "@/router/router";
import { useUserStore } from "@/stores/useUserStore";
import Footer from "@/components/Footer.vue";
import { onMounted, onUnmounted, computed } from "vue";

export default defineComponent({
  name: "LoginView",
  components: { Footer },
  setup() {
    const username = ref("");
    const fullName = ref("");
    const error = ref("");
    const authStep = ref<"hero" | "login" | "register">("hero");

    const phrases = [
      "Cuida tu salud financiera",
      "Ordena tus finanzas",
      "Te ayuda a controlar tus gastos",
    ];

    const phraseIndex = ref(0);

    const currentPhrase = computed(() => phrases[phraseIndex.value]);

let interval: number;

    onMounted(() => {
      interval = window.setInterval(() => {
        phraseIndex.value = (phraseIndex.value + 1) % phrases.length;
      }, 2000); // 2 segundos
    });

    onUnmounted(() => {
      clearInterval(interval);
    });

    const userStore = useUserStore();

    const handleLogin = async () => {
      error.value = "";
      try {
        const res = await authApi.login({ username: username.value });
        userStore.login(res);
        router.push("/dashboard");
      } catch (err: any) {
        error.value =
          err.response?.data?.message ||
          err.message ||
          "Error al iniciar sesión";
      }
    };

    const handleRegister = async () => {
      error.value = "";
      try {
        const res = await authApi.register({
          name: fullName.value,
          username: username.value,
        });
        userStore.login(res);
        router.push("/dashboard");
      } catch (err: any) {
        error.value =
          err.response?.data?.message ||
          err.message ||
          "Error al registrarse";
      }
    };

    return {
      username,
      fullName,
      error,
      authStep,
      handleLogin,
      handleRegister,
      currentPhrase,
    };
  },
});
</script>

<style scoped>
.slide-fade-left-enter-active,
.slide-fade-left-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-left-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.slide-fade-left-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.perspective {
  perspective: 800px;
}

.phrase-enter-active,
.phrase-leave-active {
  transition: all 0.35s ease;
}

.phrase-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.phrase-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.phrase-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.phrase-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

</style>
