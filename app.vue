<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Set up global meta and SEO
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    {
      name: 'theme-color',
      content: '#3B82F6'
    }
  ]
})

// Global error handling
const handleGlobalError = (error) => {
  console.error('Global error:', error)
  // You can add error reporting service here
}

// Set up global error handler
onErrorCaptured((error) => {
  handleGlobalError(error)
  return false
})
</script>

<style>
/* Global styles will be imported from main.css */
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #9CA3AF;
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background-color: #F3F4F6;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #6B7280;
}
::-webkit-scrollbar-track:hover {
  background-color: #E5E7EB;
}
</style>