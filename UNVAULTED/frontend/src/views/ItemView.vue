<template>
  <div class="h-30"></div>

  <div v-if="isNew" class="flex flex-col w-full px-[7.5%]">
    <ItemDetailAdd />
  </div>

  <div v-else class="flex flex-col gap-5">
    <!-- Loading State -->
    <div v-if="loading" class="w-full h-96 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>

    <!-- Content -->
    <div v-else-if="itemData && sellerData" class="flex flex-col gap-5">
      <div class="flex flex-row w-full px-[7.5%] gap-5">
        <ItemDetail
          :title="itemData.Title"
          :price="itemData.Price"
          :description="itemData.Description"
          :images="itemData.Images"
          :seller="sellerData"
          :allow-buy="allowBuy"
          :allow-trade="allowTrade"
        />
      </div>

      <div class="flex flex-row w-full px-[7.5%] gap-5" id="chat-section">
        <ItemChat 
            :product-id="route.params.id" 
            :sellers="[sellerData]" 
            :is-seller="isSeller"
        />
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else class="w-full text-center py-10 text-gray-500">
      Item not found or failed to load.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { auth, db } from '@/firebase/firebase-client'
import { doc, getDoc } from 'firebase/firestore'
import ItemDetail from '../components/ItemDetail.vue'
import ItemDetailAdd from '../components/ItemAdd.vue'
import ItemChat from '../components/ItemChat.vue'

const route = useRoute()
const docId = route.params.id

const isNew = computed(() => route.path === '/items/new')

const loading = ref(true)
const itemData = ref(null)
const sellerData = ref(null)

const isSeller = computed(() => {
    if (!itemData.value || !auth.currentUser) return false
    return itemData.value.Seller?.id === auth.currentUser.uid
})

const allowBuy = computed(() => {
    if (!itemData.value) return false
    const type = itemData.value.SellType
    return (type === 0 || type === 2)
})

const allowTrade = computed(() => {
    if (!itemData.value) return false
    const type = itemData.value.SellType
    return (type === 1 || type === 2)
})

onMounted(async () => {
    if (isNew.value) {
        loading.value = false
        return
    }

    try {
        const itemSnap = await getDoc(doc(db, 'Items', docId))
        if (!itemSnap.exists()) {
            console.error("Item not found")
            loading.value = false
            return
        }
        itemData.value = itemSnap.data()
        
        if (itemData.value.Seller) {
             const sellerSnap = await getDoc(itemData.value.Seller)
             if (sellerSnap.exists()) {
                 const s = sellerSnap.data()
                 sellerData.value = {
                     ...s,
                     name: `${s.FirstName} ${s.LastName}`,
                     // Ensure image fallback
                     image: s.image || 'https://via.placeholder.com/100',
                     verified: s.verified || false
                 }
             }
        }
    } catch (e) {
        console.error("Error loading item:", e)
    } finally {
        loading.value = false
    }
})
</script>
