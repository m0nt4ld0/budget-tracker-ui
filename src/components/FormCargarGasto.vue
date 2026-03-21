<template>
  <div :class="[
    'bg-gray-100 rounded-md shadow mb-4 transition-all duration-500',
    visible ? 'p-4 w-full' : 'p-2 w-auto inline-flex'
  ]">

  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-2">
      <component :is="PlusCircleIcon" class="w-6 h-6 text-indigo-500" />
      <h2 class="text-lg font-bold whitespace-nowrap">Cargar gasto</h2>
    </div>
    <button
      @click="toggle"
      class="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-transform"
    >
      <component
        :is="visible ? XMarkIcon : ChevronDownIcon"
        class="w-6 h-6 transform transition-transform duration-500"
        :class="{ 'rotate-360': animating }"
      />
    </button>
  </div>

  <transition name="fade-slide">
    <div v-if="visible" class="mb-12">
      <form @submit.prevent="crear" class="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-2">
        <input
          v-model="gasto.concepto"
            type="text"
            placeholder="Concepto"
            class="w-full md:w-auto mt-2 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
          <input
            v-model.number="gasto.importe"
            type="number"
            step="0.01"
            placeholder="Importe"
            class="w-full md:w-auto mt-2 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
          <input
            v-model="gasto.fecha"
            type="date"
            class="w-full md:w-auto mt-2 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
          <select
            v-model.number="gasto.categoria.id"
            class="w-full md:w-auto mt-2 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          >
            <option disabled :value="0">Seleccioná una categoría</option>
            <option
              v-for="cat in categoriaStore.categorias"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.categoria }}
            </option>
          </select>
          <button
            type="submit"
            class="w-full md:w-auto text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500/20 shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none mt-2 md:mt-0"
          >
            Crear
          </button>
        </form>
      </div>
    </transition>
    <AppModal
      v-model="modal.visible"
      :type="modal.type"
      :titulo="modal.titulo"
      :mensaje="modal.mensaje"
      />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useGastoStore } from "../stores/useGastoStore";
import { useCategoriaStore } from "../stores/useCategoriaStore";
import type { GastoDto } from "../types/types";
import { PlusCircleIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import AppModal, { type ModalType } from "./AppModal.vue"; 

export default defineComponent({
  name: "FormCargarGasto",
  components: {
    AppModal,
  },
  setup() {
    const store = useGastoStore();
    const categoriaStore = useCategoriaStore();

    const visible = ref(false);
    const animating = ref(true);

    const toggle = () => {
      animating.value = true;
      setTimeout(() => {
        visible.value = !visible.value;
        animating.value = false;
      }, 500);
    };

    const modal = reactive({
      visible: false,
      type: "info" as ModalType,
      titulo: "",
      mensaje: "",
    });

    const mostrarModal = (type: ModalType, titulo: string, mensaje: string) => {
      modal.type = type;
      modal.titulo = titulo;
      modal.mensaje = mensaje;
      modal.visible = true;
    };

    const gasto = reactive<GastoDto>({
      concepto: "",
      importe: 0.0,
      fecha: new Date().toISOString().split("T")[0],
      categoria: { id: 0, categoria: "", icono: "question-mark-circle" },
    });

    const crear = async () => {
      if (!gasto.concepto || gasto.importe <= 0 || gasto.categoria.id <= 0) return;

      try {
        await store.crearGasto({ ...gasto });
        gasto.concepto = "";
        gasto.importe = 0;
        gasto.fecha = new Date().toISOString().split("T")[0];
        gasto.categoria.id = 0;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");

        await Promise.all([
          store.fetchGastos(),
          store.fetchTotalesPorCategoria(`${year}-${month}-01`, `${year}-${month}-31`),
        ]);

        mostrarModal("info", "Gasto creado", "El gasto se registró correctamente.");

      } catch (error: any) {
        const mensaje = error?.response?.data?.message ?? "Ocurrió un error inesperado.";
        mostrarModal("error", "No se pudo crear el gasto", mensaje);
      }
    };

    return {
      gasto,
      categoriaStore,
      crear,
      visible,
      toggle,
      animating,
      PlusCircleIcon,
      ChevronDownIcon,
      XMarkIcon,
      modal,
      mostrarModal,
    };
  },
});
</script>

<style scoped>
@keyframes rotate360 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.rotate-360 {
  animation: rotate360 0.5s ease-in-out;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>