<template>
  <div class="w-[100%] rounded-xl px-4 h-fit border border-[var(--color-border)]">
    <div class="flex gap-4 items-stretch w-full ">
      <div class="w-70  flex flex-col items-center justify-center py-4 pr-4 border-r border-[var(--color-border)]">
        <img :src="user.Image || defaultProfile" class="w-50 h-50 rounded-full object-cover" />

        <p class="font-bold text-2xl text-gray-800 text-center select-none pt-10 pb-3">
          {{ user.FirstName }} {{ user.LastName }}
        </p>

        <button
          @click="toggleFollow"
          class="mt-2 py-1 w-full"
          :class="following ? 'button-outline' : 'button-solid'"
        >
          {{ following ? 'Following' : 'Follow' }}
        </button>
      </div>

      <div class="flex-1 overflow-x-auto whitespace-nowrap p-3">
        <div class="flex gap-4">
          <ItemComponent
            v-for="item in items"
            :key="item.id"
            :id="item.id"
            :title="item.Title"
            :price="item.Price"
            :image="item.Images?.[0] || ''"
            :seller="item.Seller"
            :likeCount="item.Likes"
            :sellType="item.SellType === 0 ? 'Sell' : item.SellType === 1 ? 'Trade' : 'Sell/Trade'"
            class="shrink-0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { doc, getDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/firebase-client'
import ItemComponent from './ItemComponent.vue'
import defaultProfile from '@/assets/defaultProfile.jpg'

const props = defineProps({
  userId: { type: String, required: true },
})

const user = ref({})
const items = ref([])
const following = ref(false)
const loggedInUid = auth.currentUser?.uid || null

onMounted(loadData)

async function loadData() {
  const userRef = doc(db, 'Users', props.userId)
  const userSnap = await getDoc(userRef)

  user.value = userSnap.data() || {}

  const myRef = doc(db, 'Users', loggedInUid)
  const mySnap = await getDoc(myRef)
  following.value = mySnap.data().Following?.includes(props.userId)

  const itemsRef = collection(db, 'Items')
  const q = query(itemsRef, where('Seller', '==', userRef))
  const itemSnap = await getDocs(q)
  items.value = itemSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

async function toggleFollow() {
  const myRef = doc(db, 'Users', loggedInUid)
  const theirRef = doc(db, 'Users', props.userId)

  const mySnap = await getDoc(myRef)
  const myData = mySnap.data()

  let updated = myData.Following || []

  if (!following.value) updated.push(props.userId)
  else updated = updated.filter((id) => id !== props.userId)

  following.value = !following.value

  await updateDoc(myRef, { Following: updated })
}
</script>
