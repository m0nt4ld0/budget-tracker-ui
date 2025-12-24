<script setup lang="ts">
import { computed } from "vue";
import ApexCharts from "vue3-apexcharts";
import { useGastoStore } from "../stores/gastoStore";


const store = useGastoStore();

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

const grouped = computed(() => {
  const map: Record<string, number> = {};

  for (const g of store.gastos) {
    const [year, month, day] = g.fecha.split("-").map(Number);
    const gastoDate = new Date(year, month - 1, day);

    if (
      gastoDate.getFullYear() === currentYear &&
      gastoDate.getMonth() === currentMonth
    ) {
      const categoria = g.categoria.categoria;
      map[categoria] = (map[categoria] ?? 0) + g.importe;
    }
  }

  return map;
});


const labels = computed(() => Object.keys(grouped.value));
const series = computed(() => Object.values(grouped.value));

const chartOptions = computed(() => ({
  labels: labels.value,
  legend: {
    position: "bottom",
  },
  tooltip: {
    y: {
      formatter: (value: number) =>
        new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(value),
    },
  },
}));
</script>

<template>
  <div class="bg-white p-4 rounded shadow">
    <h2 class="text-lg font-semibold mb-4">
      Gastos del mes por categoría
    </h2>

    <div v-if="series.length === 0" class="text-gray-500 text-center">
      No hay gastos cargados este mes
    </div>

    <ApexCharts
      v-else
      type="donut"
      height="300"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
