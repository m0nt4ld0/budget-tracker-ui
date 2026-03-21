<template>
  <Layout>
    <h1 
      class="text-xl md:text-2xl font-bold mb-4"
    >
      Hola, <strong class="text-xl md:text-2xl font-bold text-indigo-400 mb-4">{{ userStore.nombre }}</strong>
    </h1>

    <FormCargarGasto />
    <GastosPorCategoria class="mt-6" />

      <div class="pt-8 md:pt-10 p-2 md:p-4 overflow-x-auto">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg md:text-xl font-bold text-indigo-400 mb-4">Tus últimos gastos</h2>
            <a href="/gastos" class="text-indigo-400 text-xs uppercase tracking-wide mb-3 hover:text-indigo-500">Ver todos ></a>
          </div>
        <CustomTable 
          :headers="['Fecha', 'Concepto', 'Importe', 'Categoría']"
          :cols="['fecha', 'concepto', 'importe', 'categoria']"
          :rows="ultimos5"
        >
          <template #fecha="{ row }">
            {{ formatDate(row.fecha) }}
          </template>
          <template #importe="{ row }">
            {{ formatARS(row.importe) }}
          </template>
          <template #categoria="{ row }">
            {{ row.categoria.categoria }}
          </template>
        </CustomTable>
    </div>

  </Layout>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, computed, ref } from "vue";
import { useGastoStore } from "../stores/useGastoStore";
import { useCategoriaStore } from "../stores/useCategoriaStore";
import type { GastoDto } from "../types/types";
import CustomTable from "../components/CustomTable.vue";
import Pagination from "../components/Pagination.vue";
import { formatARS, formatDate } from "../composables/useUtils";
import GastosPorCategoria from "../components/GastosPorCategoria.vue";
import Layout from "@/views/Layout.vue";
import { useUserStore } from "@/stores/useUserStore";
import FormCargarGasto from "../components/FormCargarGasto.vue";

export default defineComponent({
  components: { CustomTable, Pagination,  Layout, FormCargarGasto, GastosPorCategoria },
  setup() {
    const store = useGastoStore();
    const categoriaStore = useCategoriaStore();
    const userStore = useUserStore();

    const filtrados = computed(() => {
      return store.gastos;
    });

    const ultimos5 = computed(() => store.gastos.slice(0, 5));

    const gasto = reactive<GastoDto>({
      concepto: "",
      importe: 0.0,
      fecha: new Date().toISOString().split("T")[0],
      categoria: { id: 0, categoria: "" },
    });

    const changePage = (page: number) => {
      if (page < 0 || page >= store.totalPages) return;
      store.page = page;
      store.fetchGastos();
    };

    onMounted(async () => {
      await store.fetchGastos();
      await categoriaStore.fetchCategorias();
    });

    return { 
      store, 
      categoriaStore, 
      userStore,
      changePage,
      formatARS, 
      formatDate, 
      filtrados,
      ultimos5,
    };
  },
});
</script>