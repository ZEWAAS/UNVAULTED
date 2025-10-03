<template>
  <div class="container flex flex-col w-60 p-2 border border-[var(--color-border)] rounded-xl gap-2">
    <div class="img-container relative h-72 w-full"> <!-- use a valid height -->
      <div class="product-overlay absolute inset-0 z-10"> <!-- ensure overlay is on top -->
        <div class="sell-type absolute top-2 right-2 border border-[var(--color-border)]/40 rounded-full px-1.5 py-0.5 w-fit text-[8px] text-white backdrop-blur-md bg-white/10">
          {{ sellType }}
        </div>
        <div class="seller group absolute flex flex-row items-center gap-1 bottom-2 left-2 border border-[var(--color-border)]/40 rounded-full p-[1px] hover:pr-2 w-fit text-xs text-white backdrop-blur-md bg-white/10">
          <img :src="sellerImage" class="h-8 w-8 rounded-full aspect-square" />
          <p class="hidden group-hover:block text-gray-100 text-xs">{{ sellerName }}</p>
        </div>
        <div class="like-count absolute bottom-2 right-2 flex flex-row items-center gap-1 px-2 py-1 border border-[var(--color-border)]/40 rounded-full bg-white/10 backdrop-blur-md">
          <span class="i-lucide-heart size-5"></span>
          <p class="text-xs text-gray-100">{{ likeCount }}</p>
        </div>
      </div>

      <img
        :src="image"
        class="rounded-xl overflow-hidden h-full w-full object-cover border border-[var(--color-border)]"
        alt="product image"
      />
    </div>

    <div class="flex flex-col description-container gap-1">
      <p class="text-2xl font-bold">{{ title }}</p>
      <p class="text-md text-gray-600">{{ price }}€</p>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'


const props = defineProps({
    title: {
        type: String,
        required: true,
        default: 'Title'
    },
    price: {
        type: Number,
        required: true,
        default: 10000
    },
    image: {
        type: URL,
        required: true,
        default: 'https://img.redbull.com/images/c_crop,x_759,y_0,h_5464,w_8196/c_fill,w_1950,h_1219/q_auto,f_jpg/redbullcom/2022/5/5/sor22gddafi4ribmje9p/max-verstappen-header'
    },
    sellType: {
        type: String,
        required: true,
        default: 'Trade/Buy'
    },
    sellerImage: {
        type: URL,
        required: true,
        default: 'https://tse3.mm.bing.net/th/id/OIP.vcjzhWLCN7-VOC95HeBsJAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    sellerName: {
        type: String,
        required: true,
        default: 'Username'
    },
    likeCount: {
        type: Number,
        required: true,
        default: 0
    }
})

const dropdown = ref(false)
function toggleDropdown() {
  dropdown.value = !dropdown.value
}
function handleClickOutside(e) {
  if (!e.target.closest('nav')) dropdown.value = false
}
onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
