<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Categorías</h1>

    <!-- Formulario -->
    <form @submit.prevent="crear">
      <input v-model="categoria.categoria" type="text" placeholder="Nombre de la categoría" class="border p-2 mr-2"/>
      <button type="submit" class="bg-blue-500 text-white p-2">Crear</button>
    </form>

    <!-- Tabla -->
    <table class="table-auto border-collapse border mt-4 w-full">
      <thead>
        <tr>
          <th class="border px-2 py-1">ID</th>
          <th class="border px-2 py-1">Nombre</th>
          <th class="border px-2 py-1">Activo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in store.categorias" :key="cat.id">
          <td class="border px-2 py-1">{{ cat.id }}</td>
          <td class="border px-2 py-1">{{ cat.categoria }}</td>
          <td class="border px-2 py-1">{{ cat.activo ? "Sí" : "No" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { useCategoriaStore } from "../stores/categoriaStore";
import type { CategoriaDto } from "../types/types";

export default defineComponent({
  setup() {
    const store = useCategoriaStore();

    const categoria = reactive<CategoriaDto>({
      categoria: "",
    });

    const crear = async () => {
      if (!categoria.categoria) return;
      await store.crearCategoria({ ...categoria });
      categoria.categoria = "";
    };

    onMounted(() => store.fetchCategorias());

    return { store, categoria, crear };
  },
});
</script>
