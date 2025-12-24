<template>
    <table class="table-auto border-collapse border mt-4 w-full">
      <thead>
        <tr>
          <th 
            class="border px-2 py-1" 
            v-for="header in headers" 
            :key="header">
              {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="row in rows" 
          :key="row.id" 
          class="odd:bg-white even:bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <td 
            class="border px-2 py-1" 
            v-for="col in cols" 
            :key="col"
          >
            <slot :name="col" :row="row">
              {{ row[col] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
</template>
<script setup lang="ts">
type Row = Record<string, any>;

defineProps<{
  headers: string[];
  cols: string[];
  rows: Row[];
}>();
</script>