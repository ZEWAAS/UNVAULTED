<script setup>
import { ref, onMounted } from 'vue';
import ItemComponent from '../components/ItemComponent.vue';
import FilterMenu from '../components/FilterMenu.vue';

const items = ref([]);

const getPopularProducts = async () => {
  const productData = await fetch('https://fakerapi.it/api/v2/products?_quantity=20');
  const json = await productData.json();
  return json.data;
};

const getRandomImage = () => {
  return `https://picsum.photos/200/300?random=${Math.floor(Math.random()*10000)}`;
}

onMounted(async () => {
  items.value = await getPopularProducts();
});
</script>

<template>
  <main>
    <div class="h-30"></div>
    <div class="flex flex-row w-full px-[7.5%] gap-5">
      <FilterMenu />
      <div class="grid justify-end grid-cols-[repeat(auto-fit,minmax(15rem,max-content))] gap-4 w-full">
        <ItemComponent
          v-for="(item, index) in items"
          :key="index"
          :title="item.name"
          :price="item.price"
          :image="getRandomImage()"
          :sellerName="item.upc"
          :likeCount="Math.floor(Math.random() * 1000)"
          :sellType="Math.round(Math.random()) == 1 ? 'Trade' : 'Trade/Buy'"
          :is-liked="Math.round(Math.random()) == 1 ? false : true"
        />
      </div>
    </div>
  </main>
</template>
