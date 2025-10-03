<script setup>
import { RouterLink, RouterView } from 'vue-router'
import TopBar from './components/TopBar.vue'
</script>

<template>
  <div class="app-layout">
    <header>
      <TopBar />
    </header>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  flex-shrink: 0;
}

.content {
  flex: 1;
  overflow-y: auto;
}
</style>