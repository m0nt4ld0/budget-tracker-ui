<template>
  <div class="bg-gray-100 p-4 rounded-md shadow mb-4 relative">
    <!-- Título con icono -->
    <div class="flex items-center gap-2 mb-3">
      <component :is="AdjustmentsHorizontalIcon" class="w-6 h-6 text-indigo-500" />
      <h2 class="text-lg font-bold">Filtros</h2>
    </div>

    <!-- Contenido filtrable -->
    <transition name="fade-slide">
      <div v-if="visible" class="flex flex-wrap gap-2 mb-12">
        <span
          v-for="cat in categorias"
          :key="cat.id"
          @click="toggleCategoria(cat.id)"
          :class="[
            'cursor-pointer px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 transition',
            selected.includes(cat.id)
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          <!-- Icono de la categoría -->
          <component :is="heroIcons[cat.icono] ?? defaultIcon" class="w-4 h-4" />
          {{ cat.categoria }}
        </span>
      </div>
    </transition>

    <!-- Botón toggle -->
    <button
      @click="toggle"
      class="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-transform"
    >
      <component
        :is="visible ? ChevronUpIcon : ChevronDownIcon"
        class="w-6 h-6 transform transition-transform duration-500"
        :class="{'rotate-360': animating, 'rotate-180': !visible && animating}"
      />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ChevronUpIcon, ChevronDownIcon, AdjustmentsHorizontalIcon } from "@heroicons/vue/24/solid";
import { heroIcons, defaultIcon, type HeroIconName } from "@/icons/heroIcons";

export default defineComponent({
  name: "Filters",
  props: {
    categorias: {
      type: Array as () => { id: number; categoria: string; icono: HeroIconName }[],
      required: true,
    },
  },
  emits: ["update:selected"],
  setup(_, { emit }) {
    const visible = ref(true);
    const selected = ref<number[]>([]);
    const animating = ref(false);

    const toggle = () => {
      animating.value = true;
      setTimeout(() => {
        visible.value = !visible.value;
        animating.value = false;
      }, 500);
    };

    const toggleCategoria = (id: number) => {
      if (selected.value.includes(id)) {
        selected.value = selected.value.filter((i) => i !== id);
      } else {
        selected.value.push(id);
      }
      emit("update:selected", selected.value);
    };

    return {
      visible,
      toggle,
      selected,
      toggleCategoria,
      animating,
      ChevronUpIcon,
      ChevronDownIcon,
      AdjustmentsHorizontalIcon,
      heroIcons,
      defaultIcon,
    };
  },
});
</script>

<style scoped>
@keyframes rotate360 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.rotate-360 {
  animation: rotate360 0.5s ease-in-out;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
