<template>
    <input 
        type="text" 
        :value="modelValue" 
        @input="onInput"
        placeholder="Buscar..." 
        class="border p-2 rounded-md w-full" 
    />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  methods: {
    onInput(event: Event) {
      const target = event.target as HTMLInputElement;
      this.$emit('update:modelValue', target.value);
    }
  }
});
</script>