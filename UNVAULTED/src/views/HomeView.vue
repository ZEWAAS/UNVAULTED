<script setup>
import ItemComponent from '../components/ItemComponent.vue';
import FilterMenu from '../components/FilterMenu.vue'
</script>

<template>
  <main>
    <div class="spacer h-30 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[100vw]"></div>

              <FilterMenu></FilterMenu>
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