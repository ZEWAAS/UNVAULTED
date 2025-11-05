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
          class="flex items-center justify-between gap-3 rounded-full border border-gray-200 px-1 py-1 pr-8 shadow-sm"
        >
          <div class="flex items-center gap-3">
            <img :src="seller.image" class="w-14 h-14 rounded-full object-cover" />
            <div class="w-100 flex flex-col justify-between h-14">
              <div class="flex items-center gap-1">
                <p class="font-semibold text-2xl text-gray-900">{{ seller.name }}</p>
                <svg
                  v-if="seller.verified"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#2563eb"
                  class="flex items-center max-h-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2.25a.75.75 0 0 1 .684.452l1.497 3.267 3.553.512a.75.75 0 0 1 .416 1.28l-2.57 2.507.606 3.54a.75.75 0 0 1-1.088.791L12 13.347l-3.178 1.672a.75.75 0 0 1-1.088-.79l.606-3.541-2.57-2.507a.75.75 0 0 1 .416-1.28l3.553-.512 1.497-3.267A.75.75 0 0 1 12 2.25Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <p class="text-x text-gray-500">⭐⭐⭐⭐⭐ 253 ratings</p>
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
            v-if="allowBuy"
            @click="buyItem"
            class="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow"
          >
            Make Offer
          </button>

          <button
            v-if="allowTrade"
            @click="tradeItem"
            class="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold text-lg hover:bg-blue-50 transition"
          >
            Trade Item
          </button>

          <p
            v-if="!allowBuy && !allowTrade"
            class="text-center w-full text-gray-500 italic mt-3"
          >
            No options available
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
      image: 'https://via.placeholder.com/100',
    }),
  },
  allowBuy: { type: Boolean, default: true },
  allowTrade: { type: Boolean, default: true },
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
</script>
