<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Categorías</h1>

    <!-- Formulario -->
    <form @submit.prevent="crear">
      <input v-model="categoria.categoria" type="text" placeholder="Nombre de la categoría" class="border p-2 mr-2"/>
      <button type="submit" class="bg-blue-500 text-white p-2">Crear</button>
    </form>

    <!-- Tabla -->
    <CustomTable 
      :headers="['ID', 'Nombre']" 
      :cols="['id', 'categoria']" 
      :rows="store.categorias" >
    </CustomTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { useCategoriaStore } from "../stores/useCategoriaStore";
import CustomTable from "../components/CustomTable.vue";
import type { CategoriaDto } from "../types/types";

export default defineComponent({
  components: {
    CustomTable
  },
  setup() {
    const store = useCategoriaStore();

    const categoria = reactive<Omit<CategoriaDto, 'id'>>({
      categoria: "",
      activo: false
    });

    const crear = async () => {
      if (!categoria.categoria) return;
      await store.crearCategoria({ ...categoria, id: 0 } as CategoriaDto);
      categoria.categoria = "";
      categoria.activo = true;
    };

    onMounted(() => store.fetchCategorias());

    return { store, categoria, crear };
  },
});
</script>
