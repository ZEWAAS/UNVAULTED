<template>
  <div
    class="w-full mx-auto p-6 bg-white rounded-2xl border border-gray-200 flex flex-col md:flex-row gap-8"
  >
    <!-- Left: Image Gallery -->
    <div class="flex flex-row md:w-2/3">
      <!-- Thumbnails -->
      <div class="flex flex-col gap-3 pr-3 mt-2 max-h-[32rem] overflow-y-auto">
        <img
          v-for="(img, index) in images"
          :key="index"
          :src="img"
          class="w-30 aspect-square object-cover rounded-xl border-2 cursor-pointer hover:opacity-80 transition"
          :class="selectedImage === index ? 'border-blue-500' : 'border-transparent'"
          @click="selectedImage = index"
        />
      </div>

      <!-- Main Image -->
      <div class="relative w-full h-[32rem] overflow-hidden rounded-xl">
        <img
          :src="images[selectedImage]"
          alt="Product"
          class="w-full h-full object-cover rounded-xl transition duration-300"
        />
        <button
          @click="prevImage"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/30 backdrop-blur-md text-white text-2xl p-5 rounded-full hover:bg-black/50 transition"
        >
          ‹
        </button>
        <button
          @click="nextImage"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/30 backdrop-blur-md text-white text-2xl p-5 rounded-full hover:bg-black/50 transition"
        >
          ›
        </button>
      </div>
    </div>

    <!-- Right: Info -->
    <div class="flex flex-col justify-between md:w-1/2 gap-12 pt-2">
      <!-- Title + Seller -->
      <div class="flex flex-col gap-5">
        <h1 class="text-4xl font-extrabold leading-tight text-gray-900">{{ title }}</h1>

        <div
          class="flex items-center justify-between gap-3 rounded-full border border-gray-200 px-1 py-2 pr-8 shadow-sm hover:scale-102 hover:shadow-md transition duration-200 cursor-pointer"
          @click="goToUserPage"
        >
          <div class="flex items-center gap-3">
            <img :src="seller.image" class="w-14 h-14 rounded-full object-cover" />
            <div class="w-100 flex flex-col justify-between h-14">
              <div class="flex items-center gap-1">
                <p class="font-semibold text-2xl text-gray-900">{{ seller.name }}</p>
                <img v-if="seller.verified" src="@/assets/verification.png" class="size-5" />
              </div>
              <div class="flex flex-row gap-2">
                <div class="flex flex-row">
                  <span
                    v-for="n in 5"
                    :key="n"
                    class="text-2xl"
                    :class="n <= seller.rating ? 'text-yellow-400' : 'text-gray-300'"
                  >
                    ★
                  </span>
                </div>
                <p class="tracking-widest text-gray-800 text-sm pt-1.5">
                  {{ seller.reviews }} {{ seller.reviews == 1 ? 'Review' : 'Reviews' }}
                </p>
              </div>
            </div>
          </div>
          <span class="text-gray-400 text-lg">›</span>
        </div>

        <p class="text-gray-600 text-sm leading-relaxed mt-2">{{ description }}</p>
      </div>

      <div class="flex flex-col gap-5">
        <div class="flex flex-col">
          <span class="text-gray-400 text-sm uppercase tracking-wide">Price</span>
          <p class="text-4xl font-bold text-gray-900 mt-1">{{ price.toLocaleString() }}€</p>
        </div>

        <div class="flex gap-3">
          <button
            v-if="allowBuy && !isItemOwner"
            @click="buyItem"
            class="flex-1 button-solid py-3"
          >
            Make Offer
          </button>

          <button
            v-if="allowTrade && !isItemOwner"
            @click="tradeItem"
            class="flex-1 button-outline py-3"
          >
            Trade Item
          </button>

          <p
            v-if="!allowBuy && !allowTrade && !isItemOwner"
            class="text-center w-full text-gray-500 italic mt-3"
          >
            No options available
          </p>
          <button v-if="isItemOwner" class="flex-1 button-outline py-3" @click="goToEditPage">
            Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { auth } from '../firebase/firebase-client'
import { ref, computed } from 'vue'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, default: 0 },
  images: { type: Array, default: () => [] },
  seller: {
    type: Object,
    default: () => ({
      name: 'Unknown Seller',
      username: 'unknown_user',
      verified: false,
      image: '../src/assets/defaultProfile.jpg',
      rating: 0,
      reviews: 0,

    }),
  },
  allowBuy: { type: Boolean, default: true },
  allowTrade: { type: Boolean, default: true },
  id: { type: String, required: false },
})

const selectedImage = ref(0)

function nextImage() {
  selectedImage.value = (selectedImage.value + 1) % props.images.length
}

function prevImage() {
  selectedImage.value = (selectedImage.value - 1 + props.images.length) % props.images.length
}

function buyItem() {
  scrollToChat()
}

function tradeItem() {
 scrollToChat()
}

function scrollToChat() {
  const chatSection = document.getElementById('chat-section')
  if (chatSection) {
    chatSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const isItemOwner = computed(() => {
  if (!auth.currentUser) return false
  return props.seller.id === auth.currentUser.uid
})

function goToUserPage() {
  router.push({
    name: 'profile',
    params: { id: props.seller.id },
  })
}

function goToEditPage() {
  router.push({
    name: 'item-edit',
    params: { id: route.params.id },
  })
}
</script>
