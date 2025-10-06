<script setup>
import ItemComponent from '../components/ItemComponent.vue';
</script>

<template>
  <main>
    <div class="spacer h-30"></div>
    <div class="flex max-w-[70vw] justify-center mx-auto">
      <ItemComponent />
    </div>
  </main>
</template>

<style scoped>
main{
  height: 100vh;
  width: 100vw;
}
</style>