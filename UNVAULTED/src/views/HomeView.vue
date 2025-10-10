<script setup>
import ItemComponent from '../components/ItemComponent.vue';
import FilterMenu from '../components/FilterMenu.vue'
</script>

<template>
  <main>
    <div class="h-30"></div>
    <div class="flex flex-row w-full px-[7.5%] gap-5">
      <FilterMenu></FilterMenu>
      <div class="grid justify-end grid-cols-[repeat(auto-fit,minmax(15rem,max-content))] gap-4 w-full">
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
        <ItemComponent />
      </div>
    </div>
  </main>
</template>

<style scoped>
main{
  height: 100vh;
  width: 100vw;
}
</style>