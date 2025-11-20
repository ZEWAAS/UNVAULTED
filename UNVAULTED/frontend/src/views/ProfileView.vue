<template>
  <div
    class="fixed top-[15vh] left-1/2 transform -translate-x-1/2 w-[85%] max-w-[100vw] bg-white/60 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center shadow-md"
  >

    <div v-if="loading" class="text-center text-gray-700">Loading...</div>
    <div v-else class="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
      <img
        :src="profileImage"
        alt="Profile Picture"
        class="profile-icon w-40 h-40 rounded-full object-cover"
      />
      <div class="flex flex-col gap-6 text-center md:text-left">
        <div>
          <p class="font-bold text-2xl tracking-widest text-gray-800 select-none">
            {{ user.FirstName + ' ' + user.LastName }}
          </p>
          <p class="tracking-widest text-gray-800 select-none">
            {{ user.Reviews.length }} Reviews
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <p class="font-bold tracking-widest text-gray-800 select-none">
            About:
          </p>
          <div class="grid grid-cols-[auto_auto] gap-1 justify-center md:justify-start">
            <img src="@/assets/location.png" class="size-5" />
            <p class="tracking-widest text-gray-800 select-none">
              {{ user.Street || "No data" }}
            </p>
            <img src="@/assets/follower.png" class="size-5" />
            <p class="tracking-widest text-gray-800 select-none">
              {{ user.Followers }} Followers
            </p>
            <img src="@/assets/verification.png" class="size-5" />
            <p class="tracking-widest text-gray-800 select-none">
              {{ user.Verified ? "Verified" : "Not Verified" }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-8 border-b border-gray-300 pt-10 w-full" v-if="!loading">
      <button
        @click="activeTab = 'products'"
        :class="[ 
          'pb-2 font-semibold tracking-wide transition-colors',
          activeTab === 'products'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:text-blue-600'
        ]"
      >
        Products
      </button>
      <button
        @click="activeTab = 'reviews'"
        :class="[ 
          'pb-2 font-semibold tracking-wide transition-colors',
          activeTab === 'reviews'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:text-blue-600'
        ]"
      >
        Reviews
      </button>
    </div>

    <div class="mt-6 w-full text-center md:text-left" v-if="!loading">

      <div v-if="activeTab === 'products'">
        <div v-if="user.Items.length > 0" class="grid md:grid-cols-2 gap-6">
          <div
            v-for="(product, index) in user.Items"
            :key="index"
            class="p-4 bg-white/80 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <p class="font-semibold text-lg text-gray-800">{{ product.name }}</p>
            <p class="text-gray-600">{{ product.description }}</p>
            <p class="text-sm text-gray-500 mt-1">Price: {{ product.price }} €</p>
          </div>
        </div>
        <p v-else class="text-gray-700 italic">No products yet.</p>
      </div>

      <div v-else>
        <div v-if="user.Reviews.length > 0" class="flex flex-col gap-4">
          <div
            v-for="(review, index) in user.Reviews"
            :key="index"
            class="bg-white/80 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div class="flex justify-between items-center mb-2">
              <p class="font-semibold text-gray-800">{{ review.author }}</p>
              <p class="text-yellow-500">{{ '★'.repeat(review.rating) }}</p>
            </div>
            <p class="text-gray-700">{{ review.comment }}</p>
          </div>
        </div>
        <p v-else class="text-gray-700 italic">No reviews yet.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { auth, db } from '@/firebase/firebase-client'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import defaultProfile from '@/assets/defaultProfile.png'

const router = useRouter()

const user = ref(null)
const loading = ref(true)

const activeTab = ref('reviews')

const profileImage = computed(() => {
  return user.value?.Image && user.value.Image.trim() !== ""
    ? user.value.Image
    : defaultProfile
})

onMounted(async () => {
  const currentUser = auth.currentUser

  if (!currentUser) {
    router.push("/login")
    return
  }

  const userRef = doc(db, "Users", currentUser.uid)
  const snap = await getDoc(userRef)

  if (!snap.exists()) {
    console.error("User does not exist in Firestore")
    return
  }

  user.value = snap.data()
  loading.value = false
})
</script>
