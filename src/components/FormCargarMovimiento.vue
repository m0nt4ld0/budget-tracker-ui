<template>
  <div :class="[
    'bg-gray-100 rounded-md shadow mb-4 transition-all duration-500',
    visible ? 'p-4 w-full' : 'p-2 w-auto inline-flex'
  ]">

    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <component :is="PlusCircleIcon" class="w-6 h-6 text-indigo-500" />
        <h2 class="text-lg font-bold whitespace-nowrap">Cargar movimiento</h2>
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
      <div v-if="visible" class="mt-3">
        <form @submit.prevent="crear" class="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-2">
          
          <!-- Selector EGRESO / INGRESO -->
          <div class="flex rounded-full overflow-hidden border border-gray-300 mt-2 w-full md:w-auto">
            <button
              type="button"
              @click="movimiento.tipoMovimiento = 'EGRESO'"
              :class="[
                'flex-1 px-4 py-2 text-sm font-medium transition',
                movimiento.tipoMovimiento === 'EGRESO'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              ]"
            >
              Egreso
            </button>
            <button
              type="button"
              @click="movimiento.tipoMovimiento = 'INGRESO'"
              :class="[
                'flex-1 px-4 py-2 text-sm font-medium transition',
                movimiento.tipoMovimiento === 'INGRESO'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              ]"
            >
              Ingreso
            </button>
          </div>

          <input
            v-model="movimiento.concepto"
            type="text"
            placeholder="Concepto"
            class="w-full md:w-auto mt-2 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
          <input
            v-model.number="movimiento.importe"
            type="number"
            step="0.01"
            placeholder="Importe"
            class="w-full md:w-auto mt-2 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
          <input
            v-model="movimiento.fecha"
            type="date"
            class="w-full md:w-auto mt-2 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
          <select
            v-model.number="movimiento.categoria.id"
            class="w-full md:w-auto mt-2 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          >
            <option disabled :value="0">Seleccioná una categoría</option>
            <option
              v-for="cat in categoriasFiltradas"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.categoria }}
            </option>
          </select>
          <button
            type="submit"
            :class="[
              'w-full md:w-auto text-white focus:ring-4 shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none mt-2 md:mt-0',
              movimiento.tipoMovimiento === 'INGRESO'
                ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500/20'
                : 'bg-red-500 hover:bg-red-600 focus:ring-red-500/20'
            ]"
          >
            Registrar {{ movimiento.tipoMovimiento === 'INGRESO' ? 'ingreso' : 'egreso' }}
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
import { defineComponent, reactive, ref, computed, watch, onMounted } from "vue";
import { useGastoStore } from "../stores/useGastoStore";
import { useCategoriaStore } from "../stores/useCategoriaStore";
import type { MovimientoDto, TipoMovimiento } from "../types/types";
import { PlusCircleIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import AppModal, { type ModalType } from "./AppModal.vue";
import { movimientoApi } from "../api/api";

export default defineComponent({
  name: "FormCargarGasto",
  components: { AppModal },
  setup() {
    const store = useGastoStore();
    const categoriaStore = useCategoriaStore();

    const visible = ref(false);
    const animating = ref(false);

    onMounted(async () => {
      await categoriaStore.fetchCategorias();
    });

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

    const movimiento = reactive<MovimientoDto>({
      concepto: "",
      importe: 0,
      fecha: new Date().toISOString().split("T")[0],
      categoria: { id: 0, categoria: "", icono: "question-mark-circle" },
      tipoMovimiento: "EGRESO", // default
    });

    // Filtra categorías según el tipo seleccionado
    const categoriasFiltradas = computed(() => {
      console.log("filtrando por:", movimiento.tipoMovimiento);
      console.log("todas las cats:", categoriaStore.categorias.map(c => ({ id: c.id, nombre: c.categoria, tipo: c.tipoMovimiento })));
      return categoriaStore.categorias.filter(
        cat => cat.tipoMovimiento === movimiento.tipoMovimiento
      );
    });

    const resetForm = () => {
      movimiento.concepto = "";
      movimiento.importe = 0;
      movimiento.fecha = new Date().toISOString().split("T")[0];
      movimiento.categoria.id = 0;
    };

    const crear = async () => {
      if (!movimiento.concepto || movimiento.importe <= 0 || movimiento.categoria.id <= 0) return;

      try {
        await movimientoApi.crearMovimiento({ ...movimiento });
        resetForm();

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");

        await Promise.all([
          store.fetchGastos(),
          store.fetchTotalesPorCategoria(`${year}-${month}-01`, `${year}-${month}-31`),
        ]);

        mostrarModal("info", "Movimiento registrado", `El ${movimiento.tipoMovimiento === 'INGRESO' ? 'ingreso' : 'egreso'} se registró correctamente.`);

      } catch (error: any) {
        const mensaje = error?.response?.data?.message ?? "Ocurrió un error inesperado.";
        mostrarModal("error", "No se pudo registrar el movimiento", mensaje);
      }
    };

    watch(() => categoriaStore.categorias, (cats) => {
      console.log("categorias:", cats);
    }, { immediate: true });

    return {
      movimiento,
      categoriaStore,
      categoriasFiltradas,
      crear,
      visible,
      toggle,
      animating,
      PlusCircleIcon,
      ChevronDownIcon,
      XMarkIcon,
      modal,
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