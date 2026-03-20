<template>
  <Layout>
    <h1 class="text-xl md:text-2xl font-bold mb-4">Tus gastos</h1>

    <div>
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
            <option 
              v-for="cat in categoriaStore.categorias" 
              :key="cat.id" 
              :value="cat.id">
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

      <!-- Primera tabla: siempre 5 items fijos -->
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


export default defineComponent({
  components: { CustomTable, Pagination, GastosPorCategoriaChart, Filters, Layout },
  setup() {
    const store = useGastoStore();
    const categoriaStore = useCategoriaStore();

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
    
    const crear = async () => {
      if (!gasto.concepto || gasto.importe <= 0 || gasto.categoria.id <= 0) return;
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
        store.fetchTotalesPorCategoria(`${year}-${month}-01`, `${year}-${month}-31`)
      ]);
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
      gasto, 
      crear, 
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