<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ItemComponent from '../components/ItemComponent.vue';
import FilterMenu from '../components/FilterMenu.vue';
import { db } from '@/firebase/firebase-client';
import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';

const items = ref([]);
const lastVisible = ref(null);
const loading = ref(false);
const allLoaded = ref(false);
const observer = ref(null);
const loadTrigger = ref(null);

const fetchItems = async () => {
  if (loading.value || allLoaded.value) return;

  loading.value = true;
  try {
    let q = query(
      collection(db, 'Items'),
      orderBy('Likes', 'desc'),
      limit(20)
    );

    if (lastVisible.value) {
      q = query(
        collection(db, 'Items'),
        orderBy('Likes', 'desc'),
        startAfter(lastVisible.value),
        limit(20)
      );
    }

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      allLoaded.value = true;
    } else {
      lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1];
      const newItems = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          sellTypeString: getSellTypeString(data.SellType)
        };
      });
      items.value.push(...newItems);
      if (querySnapshot.docs.length < 20) {
        allLoaded.value = true;
      }
    }
  } catch (error) {
    console.error("Error fetching items:", error);
  } finally {
    loading.value = false;
  }
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
  await fetchItems();

  // Setup Intersection Observer for infinite scroll
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
      <FilterMenu />
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
        </div>x
      </div>
    </div>
  </main>
</template>
