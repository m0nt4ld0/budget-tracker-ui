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
    :headers="['ID', 'Icono', 'Nombre']"
    :cols="['id', 'icono', 'categoria']"
    :rows="store.categorias"
  >
    <template #icono="{ row }">
      <component
        :is="heroIcons[row.icono as keyof typeof heroIcons] ?? defaultIcon"
        class="w-5 h-5 text-gray-600"
      />
    </template>
  </CustomTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { useCategoriaStore } from "../stores/useCategoriaStore";
import CustomTable from "../components/CustomTable.vue";
import type { CategoriaDto } from "../types/types";
import { heroIcons, defaultIcon } from "@/icons/heroIcons"


export default defineComponent({
  components: {
    CustomTable
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
    };

    onMounted(() => store.fetchCategorias());

    return { store, categoria, crear, heroIcons, defaultIcon };
  },
});
</script>
