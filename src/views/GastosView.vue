<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Gastos</h1>

    <!-- Formulario -->
    <div class="">
      <form @submit.prevent="crear">
        <input v-model="gasto.concepto" type="text" placeholder="Concepto" class="border p-2 mr-2"/>
        <input v-model.number="gasto.importe" type="number" placeholder="Importe" class="border p-2 mr-2"/>
        <input v-model="gasto.fecha" type="date" class="border p-2 mr-2"/>
        <select v-model.number="gasto.categoria.id" class="border p-2 mr-2">
          <option v-for="cat in categoriaStore.categorias" :key="cat.id" :value="cat.id">
            {{ cat.categoria }}
          </option>
        </select>
        <button type="submit" class="bg-blue-500 text-white p-2">Crear</button>
      </form>
    </div>

    <!-- Tabla -->
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

  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { useGastoStore } from "../stores/gastoStore";
import { useCategoriaStore } from "../stores/categoriaStore";
import type { GastoDto } from "../types/types";
import CustomTable from "../components/CustomTable.vue";
import Pagination from "../components/Pagination.vue";
import { formatARS, formatDate } from "../composables/useUtils";

export default defineComponent({
  components: { CustomTable, Pagination },
  setup() {
    const store = useGastoStore();
    const categoriaStore = useCategoriaStore();

    const gasto = reactive<GastoDto>({
      concepto: "",
      importe: 0,
      fecha: new Date().toISOString().split("T")[0] || "",
      categoria: { id: 0, categoria: "" },
    });

    const crear = async () => {
      if (!gasto.concepto || gasto.importe <= 0 || gasto.categoria.id <= 0) return;
      await store.crearGasto({ ...gasto });
      gasto.concepto = "";
      gasto.importe = 0;
      gasto.fecha = new Date().toISOString().split("T")[0] || "";
      gasto.categoria.id = 0;
      await store.fetchGastos();
    };

    const changePage = (page: number) => {
      if (page < 0 || page >= store.totalPages) return;
      store.page = page;
      store.fetchGastos();
    };

    onMounted(() => {
      store.fetchGastos();
      categoriaStore.fetchCategorias();
    });

    return { store, categoriaStore, gasto, crear, changePage, formatARS, formatDate };
  },
});
</script>
