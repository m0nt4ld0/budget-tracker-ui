<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar class="w-full fixed top-0 left-0 z-50" />

    <main class="pt-28 p-4">
      <h1 class="text-xl font-bold mb-4">Categorías</h1>

      <form @submit.prevent="crear" class="flex flex-wrap items-center gap-2 mb-6">
        <input 
          v-model="categoria.categoria" 
          type="text" 
          placeholder="Nombre de la categoría" 
          class="mt-2 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
        />
        <button 
          type="submit" 
          class="text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500/20 shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none"
        >
          Crear
        </button>
      </form>

      <CustomTable
        :headers="['ID', 'Icono', 'Nombre']"
        :cols="['id', 'icono', 'categoria']"
        :rows="store.categorias"
      >
        <template #icono="{ row }">
          <component
            :is="heroIcons[row.icono as keyof typeof heroIcons] ?? defaultIcon"
            class="w-5 h-5 text-indigo-500"
          />
        </template>
      </CustomTable>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { useCategoriaStore } from "../stores/useCategoriaStore";
import CustomTable from "../components/CustomTable.vue";
import type { CategoriaDto } from "../types/types";
import { heroIcons, defaultIcon } from "@/icons/heroIcons";
import Navbar from "../components/Navbar.vue";

export default defineComponent({
  name: "CategoriasView",
  components: {
    CustomTable,
    Navbar,
  },
  setup() {
    const store = useCategoriaStore();

    const categoria = reactive<Omit<CategoriaDto, 'id'>>({
      categoria: "",
      icono: defaultIcon,
      activo: false
    });

    const crear = async () => {
      if (!categoria.categoria) return;
      await store.crearCategoria({ ...categoria, id: 0 } as CategoriaDto);
      categoria.categoria = "";
      categoria.activo = true;
      await store.fetchCategorias();
    };

    onMounted(() => store.fetchCategorias());

    return { store, categoria, crear, heroIcons, defaultIcon };
  },
});
</script>
