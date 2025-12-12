<template>
  <div class="pt-[120px] w-full flex flex-col items-center">
    <div class="w-[85%] max-w-[100vw] flex flex-col gap-6 pb-10">
      <h1 class="text-3xl font-bold text-gray-800 tracking-widest">Following</h1>


      <p
        v-if="!loading && followingIds.length === 0"
        class="text-gray-600 italic text-center pt-20"
      >
        You are not following anyone yet.
      </p>

      <FollowingComponent v-for="uid in followingIds" :key="uid" :userId="uid" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '@/firebase/firebase-client'
import { doc, getDoc } from 'firebase/firestore'
import FollowingComponent from '@/components/FollowingComponent.vue'

const followingIds = ref([])
const loading = ref(true)

onMounted(loadFollowing)

async function loadFollowing() {
  const current = auth.currentUser
  if (!current) return

  const myRef = doc(db, 'Users', current.uid)
  const mySnap = await getDoc(myRef)
  const data = mySnap.data()

  followingIds.value = (data.Following || []).map((ref) => ref)

  loading.value = false
}
</script>
