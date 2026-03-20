<template>
  <Layout>
    <h1 
      class="text-xl md:text-2xl font-bold mb-4"
    >
      Hola, <strong class="text-xl md:text-2xl font-bold text-indigo-400 mb-4">{{ userStore.nombre }}</strong>
    </h1>

    <FormCargarGasto />

    <div class="pt-8 md:pt-10 p-2 md:p-4 overflow-x-auto">
        <h2 class="text-lg md:text-xl font-bold text-indigo-400 mb-4">Tus últimos gastos</h2>
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

    <GastosPorCategoriaChart class="mt-6" />

    <Filters
      :categorias="categoriaStore.categorias"
      @update:selected="filtrarPorCategorias"
    />

    <div class="pt-8 md:pt-10 p-2 md:p-4 overflow-x-auto">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
          <h2 class="text-lg md:text-xl font-bold text-indigo-400">Todos tus gastos</h2>
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600 whitespace-nowrap">Ítems por página:</label>
            <select
              v-model.number="pageSize"
              @change="changePageSize"
              class="rounded-md bg-white border border-gray-400/20 px-3 py-1.5 text-gray-900 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>
        <CustomTable 
          :headers="['Fecha', 'Concepto', 'Importe', 'Categoría']"
          :cols="['fecha', 'concepto', 'importe', 'categoria']"
          :rows="filtrados"
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
        <Pagination
          :currentPage="store.page"
          :totalPages="store.totalPages"
          @change-page="changePage"
        />
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
import GastosPorCategoriaChart from "../components/GastosPorCategoriaChart.vue";
import { authApi } from "../api/api";
import Filters from "../components/Filters.vue";
import Layout from "@/views/Layout.vue";
import { useUserStore } from "@/stores/useUserStore";
import FormCargarGasto from "../components/FormCargarGasto.vue";

export default defineComponent({
  components: { CustomTable, Pagination, GastosPorCategoriaChart, Filters, Layout, FormCargarGasto },
  setup() {
    const store = useGastoStore();
    const categoriaStore = useCategoriaStore();
    const userStore = useUserStore();

    const categoriasSeleccionadas = ref<number[]>([]);
    const pageSize = ref<number>(10);

    const filtrados = computed(() => {
      if (!categoriasSeleccionadas.value.length) return store.gastos;
      return store.gastos.filter((g) =>
        categoriasSeleccionadas.value.includes(g.categoria.id)
      );
    });

    // Primera tabla: siempre los primeros 5 del listado actual
    const ultimos5 = computed(() => store.gastos.slice(0, 5));

    const filtrarPorCategorias = (ids: number[]) => {
      categoriasSeleccionadas.value = ids;
    };

    const gasto = reactive<GastoDto>({
      concepto: "",
      importe: 0.0,
      fecha: new Date().toISOString().split("T")[0],
      categoria: { id: 0, categoria: "" },
    });

    const login = async () => {
      try {
        const response = await authApi.login({ username: "mmontaldo" });
        if (response && typeof response === "string") {
          localStorage.setItem("token", response);
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    };

    const changePage = (page: number) => {
      if (page < 0 || page >= store.totalPages) return;
      store.page = page;
      store.fetchGastos();
    };

    const changePageSize = async () => {
      store.size = pageSize.value;
      store.page = 0;
      await store.fetchGastos();
    };

    onMounted(async () => {
      await login();
      store.size = pageSize.value;
      await store.fetchGastos();
      await categoriaStore.fetchCategorias();
    });

    return { 
      store, 
      categoriaStore, 
      userStore,
      changePage,
      changePageSize,
      formatARS, 
      formatDate, 
      login, 
      filtrados,
      ultimos5,
      filtrarPorCategorias,
      pageSize,
    };
  },
});
</script>