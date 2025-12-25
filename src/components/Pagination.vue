<template>
  <div class="flex justify-center mt-4 space-x-1">
    <button
      @click="$emit('change-page', currentPage - 1)"
      :disabled="currentPage === 0"
      class="px-3 py-1 border rounded disabled:opacity-50"
    >
      Anterior
    </button>

    <button
      v-for="n in pages"
      :key="n"
      @click="$emit('change-page', n - 1)" 
      :class="{
        'bg-indigo-500 hover:bg-indigo-600 text-white rounded-base font-medium': currentPage === n - 1,
        'border': currentPage !== n - 1,
      }"
      class="px-3 py-1 rounded"
    >
      {{ n }}
    </button>

    <button
      @click="$emit('change-page', currentPage + 1)"
      :disabled="currentPage === totalPages - 1"
      class="px-3 py-1 border rounded disabled:opacity-50"
    >
      Siguiente
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "Pagination",
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const pages = computed(() => Array.from({ length: props.totalPages }, (_, i) => i + 1));
    return { pages };
  },
});
</script>
