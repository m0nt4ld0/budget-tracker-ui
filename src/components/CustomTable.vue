<template>
  <div
    class="
      relative overflow-x-auto
      bg-neutral-primary-soft
      shadow-xs
      rounded-base
      border border-gray-300/40
      mt-4
    "
  >
    <table class="w-full text-sm text-left text-body">

      <thead class="text-sm font-medium text-white bg-indigo-500">
        <tr>
          <th
            v-for="(header, index) in headers"
            :key="header"
            scope="col"
            :class="[
              'px-6 py-3',
              index === 0 ? 'rounded-tl-lg' : '',
              index === headers.length - 1 ? 'rounded-tr-lg' : ''
            ]"
          >
            {{ header }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="row in rows"
          :key="row.id"
          class="
            bg-neutral-primary
            border-b border-gray-300/30
            hover:bg-indigo-50/40
            transition-colors
          "
        >
          <td
            v-for="col in cols"
            :key="col"
            class="px-6 py-4"
          >
            <slot :name="col" :row="row">
              <span class="text-body">
                {{ row[col] }}
              </span>
            </slot>
          </td>
        </tr>

        <tr v-if="rows.length === 0">
          <td
            :colspan="cols.length"
            class="px-6 py-6 text-center text-gray-400"
          >
            No hay datos para mostrar
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
type Row = Record<string, any>;

defineProps<{
  headers: string[];
  cols: string[];
  rows: Row[];
}>();
</script>
