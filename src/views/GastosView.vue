<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar class="w-full fixed top-0 left-0 z-50" />

    <main class="pt-28 p-4">
      <h1 class="text-xl font-bold mb-4">Tus gastos</h1>

      <div>
        <form @submit.prevent="crear" class="flex flex-wrap items-center gap-2">
          <input 
            v-model="gasto.concepto" 
            type="text" 
            placeholder="Concepto" 
            class="mt-2 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
          <input 
            v-model.number="gasto.importe" 
            type="number" 
            placeholder="Importe" 
            class="mt-2 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
          <input 
            v-model="gasto.fecha" 
            type="date" 
            class="mt-2 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
          <select 
            v-model.number="gasto.categoria.id" 
            class="mt-2 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
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
            class="text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500/20 shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none"
          >
            Crear
          </button>
        </form>
      </div>

      <GastosPorCategoriaChart class="mt-6" />

      <CustomTable 
        :headers="['ID', 'Fecha', 'Concepto', 'Importe', 'Categoría']"
        :cols="['id', 'fecha', 'concepto', 'importe', 'categoria']"
        :rows="store.gastos"
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
    </main>
  </div>
</template>


<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { useGastoStore } from "../stores/useGastoStore";
import { useCategoriaStore } from "../stores/useCategoriaStore";
import type { GastoDto } from "../types/types";
import CustomTable from "../components/CustomTable.vue";
import Pagination from "../components/Pagination.vue";
import { formatARS, formatDate } from "../composables/useUtils";
import GastosPorCategoriaChart from "../components/GastosPorCategoriaChart.vue";
import { authApi, gastoApi, categoriaApi } from "../api/api";
import Navbar from "../components/Navbar.vue";

export default defineComponent({
  components: { CustomTable, Pagination, GastosPorCategoriaChart, Navbar },
  setup() {
    const store = useGastoStore();
    const categoriaStore = useCategoriaStore();

    const gasto = reactive<GastoDto>({
      concepto: "",
      importe: 0,
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
      await store.fetchGastos();
    };

    const changePage = (page: number) => {
      if (page < 0 || page >= store.totalPages) return;
      store.page = page;
      store.fetchGastos();
    };

    onMounted(async () => {
      await login();
      await store.fetchGastos();
      await categoriaStore.fetchCategorias();
    });

    return { store, categoriaStore, gasto, crear, changePage, formatARS, formatDate, login };
  },
});
</script>
