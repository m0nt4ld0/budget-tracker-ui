<template>
  <div class="bg-gray-100 mx-auto flex flex-wrap items-center justify-center">
    <Navbar class="w-full fixed top-0 left-0 z-50" />
    <main class="w-full max-w-screen-xl items-center justify-between pt-20 p-3 md:pt-28 md:p-4">
      <slot />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "../components/Navbar.vue";

export default defineComponent({
  components: { Navbar },
});
</script>