<script setup lang="ts">
import { computed, onMounted } from "vue";
import ApexCharts from "vue3-apexcharts";
import { useGastoStore } from "../stores/useGastoStore";

const store = useGastoStore();

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");

const fechaDesde = `${year}-${month}-01`;
const fechaHasta = `${year}-${month}-31`;

onMounted(async () => {
  await store.fetchTotalesPorCategoria(fechaDesde, fechaHasta);
});

const labels = computed(() =>
  Object.keys(store.totalesPorCategoria)
);

const series = computed(() =>
  Object.values(store.totalesPorCategoria)
);

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
