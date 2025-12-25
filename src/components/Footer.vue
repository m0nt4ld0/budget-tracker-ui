<template>
  <footer
    class="m-4 rounded-xl border border-gray-300/40 bg-neutral-primary-soft shadow-md"
  >
    <div class="mx-auto max-w-screen-xl px-6 py-6 md:py-8">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center space-x-3">
        </div>

        <ul
          class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-body"
        >
          <li>
            <a href="#" class="hover:text-indigo-400">About</a>
          </li>
          <li>
            <a href="#" class="hover:text-indigo-400">Privacy Policy</a>
          </li>
          <li>
            <a href="#" class="hover:text-indigo-400">Licensing</a>
          </li>
          <li>
            <a
              href="https://github.com/m0nt4ld0"
              class="hover:text-indigo-400"
              target="_blank"
            >
              Github
            </a>
          </li>
        </ul>
      </div>

      <div class="mt-4 text-sm text-body">
        <a
          href="https://icons8.com/icon/YCjbVoOxUsfY/money-box"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-indigo-400"
        >
          Budget
        </a>
        icon by
        <a
          href="https://icons8.com"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-indigo-400"
        >
          Icons8
        </a>
      </div>

      <hr class="my-6 border border-gray-300/40" />

      <span class="block text-sm text-body sm:text-center ">
        © 2025 Budget Tracker by
        <a
          href="https://www.github.com/m0nt4ld0"
          class="hover:underline"
          target="_blank"
        >
          Mariela Montaldo
        </a>.
        All Rights Reserved.
      </span>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>
