<template>
  <Layout>
    <h1 class="text-xl md:text-2xl font-bold mb-6">Preferencias</h1>

    <!-- SECCIÓN CATEGORÍAS -->
    <section class="mb-8">

      <!-- Header colapsable -->
      <div :class="[
        'bg-gray-100 rounded-md shadow mb-4 transition-all duration-500',
        categoriaVisible ? 'p-4 w-full' : 'p-2 w-auto inline-flex'
      ]">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <component :is="TagIcon" class="w-6 h-6 text-indigo-500" />
            <h2 class="text-lg font-bold whitespace-nowrap">Crear categoría</h2>
          </div>
          <button @click="toggleCategoria" class="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-transform">
            <component
              :is="categoriaVisible ? XMarkIcon : ChevronDownIcon"
              class="w-6 h-6"
              :class="{ 'rotate-360': animatingCategoria }"
            />
          </button>
        </div>

        <transition name="fade-slide">
          <div v-if="categoriaVisible" class="mt-4">
            <form @submit.prevent="crearCategoria" class="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-2 mb-4">
              <input
                v-model="nuevaCategoria.categoria"
                type="text"
                placeholder="Nombre de la categoría"
                class="w-full md:w-48 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
              <select
                v-model="nuevaCategoria.tipoMovimiento"
                class="w-full md:w-36 rounded-md bg-white border border-gray-400/20 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="EGRESO">Egreso</option>
                <option value="INGRESO">Ingreso</option>
              </select>
              <!-- Inicio selector -->
                <Listbox v-model="nuevaCategoria.icono" v-slot="{ open }">
                  <div class="relative w-full md:w-48">

                    <!-- Botón -->
                    <ListboxButton
                      class="w-full rounded-md bg-white border border-gray-400/20 px-3 py-2 flex items-center justify-between
                            focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <div class="flex items-center gap-2 truncate">
                        <component
                          :is="heroIcons[nuevaCategoria.icono] ?? defaultIcon"
                          class="w-5 h-5 text-indigo-500 shrink-0"
                        />
                        <span class="truncate">{{ nuevaCategoria.icono }}</span>
                      </div>

                      <!-- Flecha -->
                      <ChevronDownIcon
                        class="w-5 h-5 text-gray-400 transition-transform"
                        :class="{ 'rotate-180': open }"
                      />
                    </ListboxButton>

                    <!-- Opciones con transición -->
                    <transition
                      enter-active-class="transition duration-200 ease-out"
                      enter-from-class="opacity-0 scale-95"
                      enter-to-class="opacity-100 scale-100"
                      leave-active-class="transition duration-150 ease-in"
                      leave-from-class="opacity-100 scale-100"
                      leave-to-class="opacity-0 scale-95"
                    >
                      <ListboxOptions
                        v-if="open"
                        class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none"
                      >
                        <ListboxOption
                          v-for="option in iconOptions"
                          :key="option.value"
                          :value="option.value"
                          v-slot="{ active, selected }"
                        >
                          <li
                            :class="[
                              'flex items-center gap-2 px-3 py-2 cursor-pointer transition',
                              active ? 'bg-indigo-100' : '',
                              selected ? 'font-medium text-indigo-600' : 'text-gray-700'
                            ]"
                          >
                            <component
                              :is="heroIcons[option.value] ?? defaultIcon"
                              class="w-5 h-5 text-indigo-500"
                            />

                            <span class="flex-1 truncate">{{ option.label }}</span>

                            <CheckIcon
                              v-if="selected"
                              class="w-4 h-4 text-indigo-500"
                            />
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>

                  </div>
                </Listbox>
              <!-- Fin selector-->
              <button type="submit" class="w-full md:w-auto text-white bg-indigo-500 hover:bg-indigo-600 font-medium rounded-full text-sm px-4 py-2.5">
                Crear
              </button>
            </form>
          </div>
        </transition>
      </div>

      <!-- Tabla de categorías -->
      <div class="bg-white rounded-md shadow overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th class="px-4 py-3">Ícono</th>
              <th class="px-4 py-3">Nombre</th>
              <th class="px-4 py-3">Tipo</th>
              <th class="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in categoriaStore.categorias" :key="cat.id" class="border-b hover:bg-gray-50">
              <td class="px-4 py-3">
                <component :is="heroIcons[cat.icono] ?? defaultIcon" class="w-5 h-5 text-indigo-500" />
              </td>
              <td class="px-4 py-3">
                <span v-if="editandoCategoria?.id !== cat.id">{{ cat.categoria }}</span>
                <input
                  v-else
                  v-model="editandoCategoria.categoria"
                  class="rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:border-indigo-500"
                />
              </td>
              <td class="px-4 py-3">
                <span :class="cat.tipoMovimiento === 'INGRESO' ? 'text-indigo-600' : 'text-red-500'" class="text-xs font-medium uppercase">
                  {{ cat.tipoMovimiento }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <template v-if="editandoCategoria?.id === cat.id">
                    <button @click="guardarCategoria" class="p-1.5 rounded-full hover:bg-green-100 text-green-600">
                      <component :is="CheckIcon" class="w-4 h-4" />
                    </button>
                    <button @click="editandoCategoria = null" class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                      <component :is="XMarkIcon" class="w-4 h-4" />
                    </button>
                  </template>
                  <template v-else>
                    <button @click="iniciarEdicionCategoria(cat)" class="p-1.5 rounded-full hover:bg-indigo-100 text-indigo-500">
                      <component :is="PencilIcon" class="w-4 h-4" />
                    </button>
                    <button @click="confirmarEliminarCategoria(cat)" class="p-1.5 rounded-full hover:bg-red-100 text-red-500">
                      <component :is="TrashIcon" class="w-4 h-4" />
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Modal confirmación eliminar -->
    <AppModal
      v-model="modal.visible"
      :type="modal.type"
      :titulo="modal.titulo"
      :mensaje="modal.mensaje"
      @confirm="onModalConfirm"
    />

  </Layout>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from "vue";
import { useCategoriaStore } from "@/stores/useCategoriaStore";
import { useMonedaStore } from "@/stores/useMonedaStore";
import { useUserStore } from "@/stores/useUserStore";
import { categoriaApi, monedaApi } from "@/api/api";
import type { CategoriaDto, MonedaDto } from "@/types/types";
import { heroIcons, defaultIcon } from "@/icons/heroIcons";
import Layout from "@/views/Layout.vue";
import AppModal, { type ModalType } from "@/components/AppModal.vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import {
  TagIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/solid";

export default defineComponent({
  name: "PreferencesView",
  components: { Layout, AppModal, Listbox, ListboxButton, ListboxOptions, ListboxOption },
  setup() {
    const categoriaStore = useCategoriaStore();
    const userStore = useUserStore();

    // — Toggle categorías —
    const categoriaVisible = ref(false);
    const animatingCategoria = ref(false);
    const toggleCategoria = () => {
      animatingCategoria.value = true;
      setTimeout(() => {
        categoriaVisible.value = !categoriaVisible.value;
        animatingCategoria.value = false;
      }, 300);
    };

    // — Modal —
    const modal = reactive({
      visible: false,
      type: "confirm" as ModalType,
      titulo: "",
      mensaje: "",
      onConfirm: null as (() => void) | null,
    });

    const onModalConfirm = (resultado: boolean) => {
      if (resultado && modal.onConfirm) modal.onConfirm();
    };

    // — Categorías —
    const nuevaCategoria = reactive<Partial<CategoriaDto>>({
      categoria: "",
      tipoMovimiento: "EGRESO",
      icono: "shopping-cart",
    });

    const editandoCategoria = ref<CategoriaDto | null>(null);

    const iconOptions = Object.keys(heroIcons).map(key => ({
      label: key,
      value: key,
    }));

    const crearCategoria = async () => {
      if (!nuevaCategoria.categoria) return;
      await categoriaApi.crearCategoria({
        ...nuevaCategoria,
        id: 0,
        usuarioId: userStore.id,
      } as any);
      nuevaCategoria.categoria = "";
      await categoriaStore.fetchCategorias();
    };

    const iniciarEdicionCategoria = (cat: CategoriaDto) => {
      editandoCategoria.value = { ...cat };
    };

    const guardarCategoria = async () => {
      if (!editandoCategoria.value) return;
      await categoriaApi.editarCategoria(editandoCategoria.value.id, editandoCategoria.value);
      editandoCategoria.value = null;
      await categoriaStore.fetchCategorias();
    };

    const confirmarEliminarCategoria = (cat: CategoriaDto) => {
      modal.titulo = "Eliminar categoría";
      modal.mensaje = `¿Estás segura de que querés eliminar "${cat.categoria}"? Esta acción no se puede deshacer.`;
      modal.type = "confirm";
      modal.onConfirm = async () => {
        await categoriaApi.eliminarCategoria(cat.id);
        await categoriaStore.fetchCategorias();
      };
      modal.visible = true;
    };

    onMounted(async () => {
      await Promise.all([
        categoriaStore.fetchCategorias(),
      ]);
    });

    return {
      categoriaStore,
      categoriaVisible,
      animatingCategoria,
      toggleCategoria,
      nuevaCategoria,
      editandoCategoria,
      crearCategoria,
      iniciarEdicionCategoria,
      guardarCategoria,
      confirmarEliminarCategoria,
      modal,
      onModalConfirm,
      heroIcons,
      defaultIcon,
      iconOptions,
      TagIcon,
      CurrencyDollarIcon,
      PencilIcon,
      TrashIcon,
      CheckIcon,
      XMarkIcon,
      ChevronDownIcon,
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
  transition: all 0.4s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>