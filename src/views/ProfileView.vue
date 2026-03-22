<template>
  <Layout>
    <div class="max-w-lg mx-auto">

      <h1 class="text-xl md:text-2xl font-bold mb-6">Mi perfil</h1>

      <div class="bg-white rounded-xl shadow p-6 flex flex-col gap-6">

        <div class="flex flex-col items-center gap-3">
          <img
            :src="avatarUrl"
            alt="Foto de perfil"
            class="w-24 h-24 rounded-full object-cover border-4 border-indigo-200"
          />
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-600 mb-1">URL de foto de perfil</label>
            <input
              v-model="form.imagenUrl"
              type="text"
              placeholder="https://..."
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
            />
          </div>
        </div>

        <hr class="border-gray-200" />

        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Nombre completo</label>
            <input
              v-model="form.nombre"
              type="text"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Usuario</label>
            <input
              v-model="form.usuario"
              type="text"
              disabled
              class="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-400 outline-none cursor-not-allowed"
            />
            <p class="text-xs text-gray-400 mt-1">El usuario no puede modificarse</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>
        </div>

        <hr class="border-gray-200" />

        <div class="flex flex-col gap-4">
          <h2 class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Cambiar contraseña</h2>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Nueva contraseña</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Dejá vacío para no cambiarla"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Confirmar contraseña</label>
            <input
              v-model="confirmarPassword"
              type="password"
              placeholder="Repetí la nueva contraseña"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
            <p v-if="passwordMismatch" class="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
          </div>
        </div>

        <button
          @click="guardar"
          :disabled="passwordMismatch"
          class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-full py-2.5 transition"
        >
          Guardar cambios
        </button>

      </div>
    </div>

    <AppModal
      v-model="modal.visible"
      :type="modal.type"
      :titulo="modal.titulo"
      :mensaje="modal.mensaje"
    />
  </Layout>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from "vue";
import { useUserStore } from "@/stores/useUserStore";
import { usuarioApi } from "@/api/api";
import Layout from "@/views/Layout.vue";
import AppModal, { type ModalType } from "@/components/AppModal.vue";

const DEFAULT_AVATAR = "/assets/images/icons8-budget-94.png";

export default defineComponent({
  name: "ProfileView",
  components: { Layout, AppModal },
  setup() {
    const userStore = useUserStore();

    const form = reactive({
      nombre: userStore.nombre,
      usuario: userStore.username,
      email: userStore.email ?? "",
      imagenUrl: userStore.imagenUrl ?? "",
      password: "",
    });

    const confirmarPassword = ref("");

    const avatarUrl = computed(() =>
      form.imagenUrl?.trim() ? form.imagenUrl : DEFAULT_AVATAR
    );

    const passwordMismatch = computed(() =>
      form.password.length > 0 && form.password !== confirmarPassword.value
    );

    const modal = reactive({
      visible: false,
      type: "info" as ModalType,
      titulo: "",
      mensaje: "",
    });

    const guardar = async () => {
      if (passwordMismatch.value) return;

      try {
        const payload: any = {
          id: userStore.id,
          nombre: form.nombre,
          email: form.email,
          imagenUrl: form.imagenUrl || null,
        };

        if (form.password) {
          payload.password = form.password;
        }

        const res = await usuarioApi.update(payload);

        userStore.login({
          id: res.id,
          username: res.usuario,
          token: userStore.token,
          nombre: res.nombre,
          imagenUrl: res.imagenUrl ?? "",
          activo: res.activo,
        });

        form.password = "";
        confirmarPassword.value = "";

        modal.type = "info";
        modal.titulo = "Perfil actualizado";
        modal.mensaje = "Tus datos se guardaron correctamente.";
        modal.visible = true;

      } catch (error: any) {
        modal.type = "error";
        modal.titulo = "Error al guardar";
        modal.mensaje = error?.response?.data?.message ?? "Ocurrió un error inesperado.";
        modal.visible = true;
      }
    };

    return {
      form,
      confirmarPassword,
      avatarUrl,
      passwordMismatch,
      guardar,
      modal,
    };
  },
});
</script>