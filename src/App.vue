<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-blue-600 text-white p-4">
      <nav class="flex space-x-4">
        <router-link to="/gastos" class="hover:underline">Gastos</router-link>
        <router-link to="/categorias" class="hover:underline">Categorías</router-link>
      </nav>
    </header>

    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
export default {
  name: "Budget Tracker",
};
</script>

<style>
</style>
