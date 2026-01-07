<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ItemComponent from '../components/ItemComponent.vue';
import FilterMenu from '../components/FilterMenu.vue';
import { search } from '@/scripts/search.js';
const route = useRoute();

const items = ref([]);
const loading = ref(false);
const allLoaded = ref(false);
const observer = ref(null);
const loadTrigger = ref(null);
const currentPage = ref(1);
const currentFilters = ref({"sortBy": "popular"});

const fetchItems = async () => {
  if (loading.value || allLoaded.value) return;

  loading.value = true;
  try {
    const filters = { 
        ...currentFilters.value, 
        page: currentPage.value, 
        limit: 20 
    };
    
    const searchQuery = route.query.q || "";
    const newItems = await search(searchQuery, filters); 
    
    if (newItems.length < 20) {
      allLoaded.value = true;
    }
    
    const processedItems = newItems.map(item => ({
        ...item,
        sellTypeString: getSellTypeString(item.SellType)
    }));

    items.value.push(...processedItems);
    currentPage.value++;
    
  } catch (error) {
    console.error("Error fetching items:", error);
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = (filters) => {
    currentFilters.value = filters;
    items.value = [];
    currentPage.value = 1;
    allLoaded.value = false;
    fetchItems();
};

const getSellTypeString = (type) => {
  switch (type) {
    case 0: return 'Buy';
    case 1: return 'Trade';
    case 2: return 'Buy/Trade';
    default: return 'Unknown';
  }
};

onMounted(async () => {
  fetchItems();

  observer.value = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      fetchItems();
    }
  }, {
    root: null,
    threshold: 0.1
  });

  if (loadTrigger.value) {
    observer.value.observe(loadTrigger.value);
  }
});



watch(() => route.query.q, () => {
  items.value = [];
  currentPage.value = 1;
  allLoaded.value = false;
  fetchItems();
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<template>
  <main>
    <div class="h-30"></div>
    <div class="flex flex-row w-full px-[7.5%] gap-5">
      <FilterMenu @change="handleFilterChange" />
      <div class="flex flex-col w-full gap-4">
        <div class="grid justify-end grid-cols-[repeat(auto-fit,minmax(15rem,max-content))] gap-4 w-full">
          <ItemComponent
            v-for="item in items"
            :key="item.id"
            :id="item.id"
            :title="item.Title"
            :price="item.Price"
            :image="item.Images && item.Images.length > 0 ? item.Images[0] : 'https://placehold.co/400'"
            :seller="item.Seller"
            :likeCount="item.Likes || 0"
            :sellType="item.sellTypeString"
            :distance="100" 
          />
        </div>
        <label v-if="allLoaded" class="text-center text-gray-500">You have reached the end.</label>
        <div ref="loadTrigger" class="w-full h-10 flex justify-center items-center">
            <div v-if="loading" class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      </div>
    </div>
  </main>
</template>
