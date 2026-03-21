<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
    
    <!-- Izquierda: gráfico -->
    <GastosPorCategoriaChart />

    <!-- Derecha: métricas -->
    <div class="bg-white p-6 rounded shadow flex flex-col justify-center gap-6">

      <!-- Total del mes -->
      <div>
        <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Gastaste este mes</p>
        <p class="text-3xl font-bold text-indigo-600">{{ formatARS(animatedTotal) }}</p>
      </div>

      <!-- Top 3 -->
      <div>
        <p class="text-sm text-gray-500 uppercase tracking-wide mb-3">Tus 3 mayores gastos este mes</p>
        <div v-if="top3.length === 0" class="text-gray-400 text-sm">
          Sin datos este mes
        </div>
        <div
          v-for="(item, index) in top3"
          :key="item.categoria"
          class="flex items-baseline justify-between mb-2"
        >
          <div class="flex items-center gap-2">
            <span class="text-gray-400 text-sm w-4">{{ index + 1 }}°</span>
            <component
              :is="item.icono"
              class="w-5 h-5 text-indigo-400 shrink-0"
            />
            <span :class="labelClass(index)">{{ item.categoria }}</span>
          </div>
          <span :class="labelClass(index)" class="font-semibold text-indigo-500">
            {{ formatARS(top3Totals[index]) }}
          </span>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useGastoStore } from "@/stores/useGastoStore";
import { useCategoriaStore } from "@/stores/useCategoriaStore";
import { formatARS } from "@/composables/useUtils";
import { heroIcons, defaultIcon } from "@/icons/heroIcons";
import GastosPorCategoriaChart from "./GastosPorCategoriaChart.vue";
import { useCountUp } from "@/composables/useCountUp";

export default defineComponent({
  name: "GastosPorCategoria",
  components: { GastosPorCategoriaChart },
  setup() {
    const store = useGastoStore();
    const categoriaStore = useCategoriaStore();

    const totalMes = computed(() =>
      Object.values(store.totalesPorCategoria).reduce((acc, val) => acc + val, 0)
    );

    const top3 = computed(() =>
      Object.entries(store.totalesPorCategoria)
        .map(([nombreCategoria, total]) => {
          const cat = categoriaStore.categorias.find(c => c.categoria === nombreCategoria);
          return {
            categoria: nombreCategoria,
            total,
            icono: cat?.icono ? (heroIcons[cat.icono] ?? defaultIcon) : defaultIcon,
          };
        })
        .sort((a, b) => b.total - a.total)
        .slice(0, 3)
    );

    const animatedTotal = useCountUp(() => totalMes.value);

    const top3Totals = [
      useCountUp(computed(() => top3.value[0]?.total ?? 0)),
      useCountUp(computed(() => top3.value[1]?.total ?? 0)),
      useCountUp(computed(() => top3.value[2]?.total ?? 0)),
    ];

    const labelClass = (index: number) => {
      const sizes = ["text-2xl font-bold", "text-xl font-semibold", "text-lg font-medium"];
      return sizes[index] ?? "text-base";
    };

    return {
      top3,
      labelClass,
      formatARS,
      animatedTotal: computed(() => animatedTotal.value),
      top3Totals: computed(() => top3Totals.map(t => t.value)),
    };
  },
});
</script>