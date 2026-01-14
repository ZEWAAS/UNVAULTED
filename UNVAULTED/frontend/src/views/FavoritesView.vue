<script setup>
import { ref, onMounted } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/firebase-client'
import ItemComponent from '../components/ItemComponent.vue'
import { i } from 'vite/dist/node/chunks/moduleRunnerTransport'

const items = ref([])
const itemsResolvedMap = ref({})

const loading = ref(false)
const allLoaded = ref(false)

/* ---------------- LOAD FAVORITES ---------------- */

async function loadFavorites() {
  loading.value = true

  const user = auth.currentUser
  if (!user) {
    loading.value = false
    return
  }

  try {
    const userSnap = await getDoc(doc(db, 'Users', user.uid))

    const favorites = userSnap.data().Favorites || []

    if (!favorites.length) {
      allLoaded.value = true
      loading.value = false
      return
    }
    // --- resolve item references ---
    const docs = await Promise.all(
      favorites.map(async (itemRef) => {
        const snap = await getDoc(itemRef)
        return snap.exists() ? { id: snap.id, ...snap.data() } : null
      }),
    )

    items.value = docs.filter(Boolean)

    itemsResolvedMap.value = {}
    items.value.forEach((item) => {
      itemsResolvedMap.value[item.id] = item
    })

    allLoaded.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFavorites()
})
</script>

<template>
  <main>
    <div class="h-30"></div>
    <div class="flex flex-col w-full px-[7.5%] gap-5">
      <p class="text-3xl font-bold">Your Favorites</p>
      <div class="flex flex-col w-full gap-4">
        <div
          class="grid justify-start grid-cols-[repeat(auto-fit,minmax(15rem,max-content))] gap-4 w-full"
        >
          <ItemComponent
            v-for="item in items"
            :key="item.id"
            :id="item.id"
            :title="item.Title"
            :price="item.Price"
            :image="
              item.Images && item.Images.length > 0 ? item.Images[0] : 'https://placehold.co/400'
            "
            :seller="item.seller"
            :likeCount="item.Likes || 0"
            :sellType="item.sellTypeString"
            :distance="100"
          />
        </div>
        <label v-if="allLoaded" class="text-center text-gray-500">You have reached the end.</label>
        <div ref="loadTrigger" class="w-full h-10 flex justify-center items-center">
          <div
            v-if="loading"
            class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"
          ></div>
        </div>
      </div>
    </div>
  </main>
</template>
