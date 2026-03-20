<template>
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
</template>
<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useGastoStore } from "../stores/useGastoStore";
import { useCategoriaStore } from "../stores/useCategoriaStore";
import type { GastoDto } from "../types/types";     

export default defineComponent({
    name: "FormCargarGasto",
    setup() {
      const store = useGastoStore();
      const categoriaStore = useCategoriaStore();
      const gasto = reactive<GastoDto>({
        concepto: "",
        importe: 0.0,
        fecha: new Date().toISOString().split("T")[0],
        categoria: { id: 0, categoria: ""},
      });

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
        return {
            gasto,
            categoriaStore,
            crear,
        };
    }
});
</script>