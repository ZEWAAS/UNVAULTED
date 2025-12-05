<template>
  <div class="w-full mx-auto p-6 bg-white rounded-2xl border border-gray-200 flex flex-col gap-10">
    <h1 class="text-4xl font-extrabold text-gray-900">Add New Item</h1>

    <div class="flex flex-col md:flex-row gap-8">
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
          
          <div class="flex-1 rounded-xl" :class="item.trade ? 'border border-gray-300' : ''">
            <button
            @click="toggleTrade"
            :class="item.trade ? 'button-solid' : 'button-outline'"
            class="flex-1 w-full py-2"
          >
            Trade
          </button>

            <div
              class="transition-all overflow-hidden px-2 py-2"
              :style="{
                height: item.trade ? '84px' : '0px',
                padding: item.trade ? '8px' : '0px 8px',
                opacity: item.trade ? '1' : '0',
              }"
            >
              <label class="text-gray-700 font-semibold">Value (€)</label>
              <input
                v-model="item.value"
                type="number"
                min="0"
                :disabled="!item.trade"
                class="w-full border border-gray-300 rounded-xl px-3 py-2 mt-1 transition disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter approx. value"
              />
            </div>
          </div>
          
        </div>
      </div>
      <p v-if="errorMessage" class="text-red-500 font-semibold">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-green-600 font-semibold">{{ successMessage }}</p>

      <div class="flex gap-4 mt-6">
        <button @click="saveItem" :disabled="loading" class="flex-1 button-solid py-3">
          {{ loading ? 'Saving...' : 'Save Item' }}
        </button>
        <button @click="cancel" class="flex-1 button-outline py-3">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { addDoc, doc, collection } from 'firebase/firestore'
import { auth, db } from '@/firebase/firebase-client'
import { useRouter } from 'vue-router'

import { uploadMultipleFiles } from '@/scripts/cloudinary'

const router = useRouter()


// ------------------------
// STATE
// ------------------------
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const item = ref({
  title: '',
  description: '',
  price: null,
  value: null,
  sell: true,
  trade: false,
})

const previewImages = ref([])
const rawFiles = ref([])

// ------------------------
// IMAGE HANDLING
// ------------------------
function handleImageUpload(e) {
  const files = Array.from(e.target.files)
  
  files.forEach((file) => {
    rawFiles.value.push(file)

    const reader = new FileReader()
    reader.onload = (ev) => {
      previewImages.value.push(ev.target.result)
    }
    reader.readAsDataURL(file)
  })
}

function removeImage(index) {
  previewImages.value.splice(index, 1)
  rawFiles.value.splice(index, 1)
}

// ------------------------
// TOGGLES
// ------------------------
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

// ------------------------
// SAVE ITEM
// ------------------------
async function saveItem() {
  errorMessage.value = ''
  successMessage.value = ''

  // VALIDATION
  if (!item.value.title.trim()) {
    errorMessage.value = 'Name cannot be empty.'
    return
  }

  if (!item.value.description.trim()) {
    errorMessage.value = 'Description cannot be empty.'
    return
  }

  if (item.value.sell && (!item.value.price || item.value.price <= 0)) {
    errorMessage.value = 'Price must be greater than 0.'
    return
  }

  if (rawFiles.value.length === 0) {
    errorMessage.value = 'Please upload at least one image.'
    return
  }

  loading.value = true

  try {
    const currentUser = auth.currentUser
    const userRef = doc(db, 'Users', currentUser.uid)

    const images = await uploadMultipleFiles(rawFiles.value, "items")

    const docRef = await addDoc(collection(db, 'Items'), {
      Likes: 0,
      Price: item.value.price,
      Value: item.value.value,
      Cover: images[0],
      Images: images,
      SellType: item.value.sell && item.value.trade ? 2 : item.value.sell ? 0 : 1,
      Seller: userRef,
      Title: item.value.title,
      Description: item.value.description,
      available: true,
      createdAt: new Date(),
    })

    successMessage.value = 'Item successfully added!'

    // Redirect to user profile after short delay
    setTimeout(() => {
      router.push(`/profile/${currentUser.uid}`)
    }, 800)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Could not save item. Please try again.'
  }

  loading.value = false
}

function cancel() {
  router.back()
}
</script>
