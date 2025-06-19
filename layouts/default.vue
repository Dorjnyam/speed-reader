<template>
  <div class="min-h-screen">
    <slot />
  </div>
</template>

<script setup>
// This layout is now minimal and doesn't interfere with the main page
// All header and dark mode functionality has been moved to index.vue
</script>

<style>
/* Global styles that should apply to the entire application */
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Ensure dark mode classes work properly */
.dark {
  color-scheme: dark;
}
</style>