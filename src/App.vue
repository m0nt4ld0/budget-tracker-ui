<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar /> 
    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
  import Navbar from "./components/Navbar.vue";

  export default {
    name: "Budget Tracker",
    components: {
      Navbar,
    },
  };
</script>

<style>
</style>
