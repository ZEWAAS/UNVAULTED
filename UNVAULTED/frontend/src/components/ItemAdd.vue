<template>
  <div class="w-full mx-auto p-6 bg-white rounded-2xl border border-gray-200 flex flex-col gap-10">
    <h1 class="text-4xl font-extrabold text-gray-900">Add New Item</h1>

    <!-- IMAGE UPLOAD -->
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Image Upload Input -->
      <div class="flex flex-col md:w-1/3 gap-3">
        <label class="text-gray-700 font-semibold">Upload Images</label>

        <input
          type="file"
          accept="image/*"
          multiple
          @change="handleImageUpload"
          class="border border-gray-300 rounded-xl px-4 py-2"
        />

        <p class="text-xs text-gray-400">
          Upload up to 10 images. First image will be the cover photo.
        </p>
      </div>

      <!-- Image Preview -->
      <div class="flex flex-row md:w-2/3 gap-4 overflow-x-auto">
        <div
          v-for="(img, i) in previewImages"
          :key="i"
          class="relative w-32 h-32 rounded-xl overflow-hidden border shadow-sm"
        >
          <img :src="img" class="w-full h-full object-cover" />

          <button
            @click="removeImage(i)"
            class="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full text-xs"
          >
            ✕
          </button>
        </div>

        <div
          v-if="previewImages.length === 0"
          class="flex items-center justify-center w-full text-gray-400 italic"
        >
          No images uploaded
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-8">
      <!-- ITEM TITLE -->
      <div>
        <label class="text-gray-700 font-semibold">Item Title</label>
        <input
          v-model="item.title"
          type="text"
          class="w-full border border-gray-300 rounded-xl px-4 py-2 mt-1"
          placeholder="e.g. Vintage Leather Jacket"
        />
      </div>

      <div>
        <label class="text-gray-700 font-semibold">Description</label>
        <textarea
          v-model="item.description"
          class="w-full border border-gray-300 rounded-xl px-4 py-2 mt-1"
          rows="5"
          placeholder="Describe your item..."
        ></textarea>
      </div>

      <div class="flex flex-col gap-3">
        <label class="text-gray-700 font-semibold">Listing Type: {{ type }}</label>

        <div class="flex items-start gap-3 px-4 py-4 w-full border border-gray-300 rounded-xl">
          <div class="flex-1 rounded-xl" :class="item.sell ? 'border border-gray-300' : ''">
            <button
              @click="toggleSell"
              :class="item.sell ? 'button-solid' : 'button-outline'"
              class="flex-1 w-full py-2"
            >
              Sell
            </button>

            <div
              class="transition-all overflow-hidden px-2 py-2"
              :style="{
                height: item.sell ? '84px' : '0px',
                padding: item.sell ? '8px' : '0px 8px',
                opacity: item.sell ? '1' : '0',
              }"
            >
              <label class="text-gray-700 font-semibold">Price (€)</label>
              <input
                v-model="item.price"
                type="number"
                min="0"
                :disabled="!item.sell"
                class="w-full border border-gray-300 rounded-xl px-3 py-2 mt-1 transition disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter price"
              />
            </div>
          </div>
          <button
            @click="toggleTrade"
            :class="item.trade ? 'button-solid' : 'button-outline'"
            class="flex-1 py-2"
          >
            Trade
          </button>
        </div>
      </div>

      <div class="flex gap-4 mt-6">
        <button @click="saveItem" class="flex-1 button-solid py-3">Save Item</button>

        <button @click="cancel" class="flex-1 button-outline py-3">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const item = ref({
  title: '',
  description: '',
  price: null,
  sell: true,
  trade: false,
  sellType: 0, // "sell" | "trade" | "both"
})

const previewImages = ref([])

function handleImageUpload(e) {
  const files = Array.from(e.target.files)
  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      previewImages.value.push(ev.target.result)
    }
    reader.readAsDataURL(file)
  })
}

function removeImage(index) {
  previewImages.value.splice(index, 1)
}

function toggleSell() {
  if (!item.value.sell && !item.value.trade) {
    item.value.sell = true
    return
  }
  item.value.sell = !item.value.sell

  if (!item.value.sell && !item.value.trade) item.value.trade = true
}

function toggleTrade() {
  if (!item.value.sell && !item.value.trade) {
    item.value.trade = true
    return
  }
  item.value.trade = !item.value.trade

  if (!item.value.sell && !item.value.trade) item.value.sell = true
}

const type = computed(() => {
  if (item.value.sell && item.value.trade) return 'Sell & Trade'
  if (item.value.sell) return 'Sell'
  return 'Trade'
})

function saveItem() {
  const payload = {
    ...item.value,
    images: previewImages.value,
  }

  console.log('Saving item:', payload)
}

function cancel() {
  alert('Cancelled')
}
</script>
