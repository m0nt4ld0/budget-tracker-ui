<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- Fondo grisado -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="type === 'confirm' ? null : cerrar()"
        />

        <!-- Modal -->
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 z-10">

          <!-- Ícono + Título -->
          <div class="flex items-center gap-3 mb-4">
            <component :is="iconoActual" :class="['w-7 h-7', colorIcono]" />
            <h3 class="text-lg font-bold text-gray-800">{{ titulo }}</h3>
          </div>

          <!-- Mensaje -->
          <p class="text-gray-600 mb-6">{{ mensaje }}</p>

          <!-- Botones -->
          <div class="flex justify-end gap-3">
            <!-- Confirm: Sí/No -->
            <template v-if="type === 'confirm'">
              <button
                @click="cerrar(false)"
                class="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                No
              </button>
              <button
                @click="cerrar(true)"
                class="px-4 py-2 rounded-full text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Sí
              </button>
            </template>

            <!-- Info / Warning / Error: solo Aceptar -->
            <template v-else>
              <button
                @click="cerrar()"
                class="px-4 py-2 rounded-full text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Aceptar
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/vue/24/outline";

export type ModalType = "info" | "warning" | "error" | "confirm";

export default defineComponent({
  name: "AppModal",
  props: {
    modelValue: { type: Boolean, required: true },
    type: { type: String as () => ModalType, default: "info" },
    titulo: { type: String, default: "" },
    mensaje: { type: String, default: "" },
  },
  emits: ["update:modelValue", "confirm"],
  setup(props, { emit }) {
    const iconoActual = computed(() => ({
      info: InformationCircleIcon,
      warning: ExclamationTriangleIcon,
      error: XCircleIcon,
      confirm: QuestionMarkCircleIcon,
    }[props.type]));

    const colorIcono = computed(() => ({
      info: "text-indigo-500",
      warning: "text-yellow-500",
      error: "text-red-500",
      confirm: "text-indigo-500",
    }[props.type]));

    const cerrar = (resultado?: boolean) => {
      emit("update:modelValue", false);
      if (resultado !== undefined) emit("confirm", resultado);
    };

    return { iconoActual, colorIcono, cerrar };
  },
});
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>