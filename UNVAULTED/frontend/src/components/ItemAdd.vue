<template>
  <div
    class="w-full mx-auto p-6 bg-white rounded-2xl border border-gray-200 flex flex-col md:flex-row gap-8"
  >
    <!-- Left: Image Gallery -->
    <div class="flex flex-row md:w-2/3 gap-4">
      <!-- Thumbnails (Draggable) -->
      <div class="flex flex-col gap-3 pr-3 mt-2 max-h-[32rem] overflow-y-auto w-32 shrink-0">
        <!-- Add more button (small) -->
        <div 
            @click="triggerFileInput"
            class="w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition text-gray-400"
        >
            <span class="text-2xl">+</span>
        </div>
        <draggable
          v-model="images"
          item-key="id"
          class="flex flex-col gap-3 min-h-[100px]"
          ghost-class="opacity-50"
        >
          <template #item="{ element, index }">
            <div class="relative group cursor-grab active:cursor-grabbing">
              <img
                :src="element.preview"
                class="w-full aspect-square object-cover rounded-xl border-2 transition"
                :class="index === 0 ? 'border-blue-500' : 'border-transparent'"
              />
              <button
                @click.stop="removeImage(index)"
                class="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          </template>
        </draggable>
      </div>

      <!-- Main Image / Upload Area -->
      <div 
        class="relative w-full h-[32rem] overflow-hidden rounded-xl border-2 border-gray-100 bg-gray-50 flex items-center justify-center group"
      >
        <!-- Overlay for Drag & Drop -->
        <div 
            v-if="isDragging"
            class="absolute inset-0 z-50 bg-blue-500/10 backdrop-blur-sm border-2 border-blue-500 rounded-xl flex items-center justify-center pointer-events-none"
        >
            <div class="bg-white px-6 py-3 rounded-full shadow-lg text-blue-600 font-semibold">
                Drop images here
            </div>
        </div>

        <!-- Display Main Image -->
        <img
          v-if="images.length > 0"
          :src="images[0].preview"
          alt="Main Product Image"
          class="w-full h-full object-cover rounded-xl"
          draggable="false"
        />

        <!-- Upload Placeholder -->
        <div 
            v-else
            @click="triggerFileInput"
            class="flex flex-col items-center justify-center gap-4 cursor-pointer text-gray-400 hover:text-gray-600 transition"
        >
            <div class="p-4 bg-white rounded-full shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
            </div>
            <p class="font-medium">Click or drag images here</p>
        </div>

        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleImageUpload"
        />
      </div>
    </div>

    <!-- Right: Info -->
    <div class="flex flex-col justify-between md:w-1/2 gap-12 pt-2">
      <!-- Title + Seller -->
        <div class="flex flex-col gap-5">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { addDoc, doc, collection } from 'firebase/firestore'
import { auth, db } from '@/firebase/firebase-client'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'

import { uploadMultipleFiles } from '@/scripts/cloudinary'

const router = useRouter()

// ------------------------
// STATE
// ------------------------
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isDragging = ref(false)
const fileInput = ref(null)

const item = ref({
  title: '',
  description: '',
  price: null,
  value: null,
  sell: true,
  trade: false,
})

// Array of objects: { id: string, file: File, preview: string }
const images = ref([])

// ------------------------
// IMAGE HANDLING
// ------------------------
function triggerFileInput() {
  fileInput.value.click()
}

function processFiles(fileList) {
  Array.from(fileList).forEach((file) => {
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      images.value.push({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        file: file,
        preview: ev.target.result
      })
    }
    reader.readAsDataURL(file)
  })
}

function handleImageUpload(e) {
  processFiles(e.target.files)
  // Reset input so same files can be selected again if needed
  e.target.value = ''
}

function removeImage(index) {
  images.value.splice(index, 1)
}

// ------------------------
// GLOBAL DRAG & DROP
// ------------------------
let dragCounter = 0

function onDragEnter(e) {
  e.preventDefault()
  // Check if dragging files
  if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
    dragCounter++
    isDragging.value = true
  }
}

function onDragLeave(e) {
  e.preventDefault()
  if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
    dragCounter--
    if (dragCounter === 0) {
      isDragging.value = false
    }
  }
}

function onDragOver(e) {
  e.preventDefault()
  // Necessary to allow dropping
}

function onDrop(e) {
  e.preventDefault()
  // Reset
  dragCounter = 0
  isDragging.value = false

  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    processFiles(e.dataTransfer.files)
  }
}

onMounted(() => {
  window.addEventListener('dragenter', onDragEnter)
  window.addEventListener('dragleave', onDragLeave)
  window.addEventListener('dragover', onDragOver)
  window.addEventListener('drop', onDrop)
})

onUnmounted(() => {
  window.removeEventListener('dragenter', onDragEnter)
  window.removeEventListener('dragleave', onDragLeave)
  window.removeEventListener('dragover', onDragOver)
  window.removeEventListener('drop', onDrop)
})


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

  if (images.value.length === 0) {
    errorMessage.value = 'Please upload at least one image.'
    return
  }

  loading.value = true

  try {
    const currentUser = auth.currentUser
    const userRef = doc(db, 'Users', currentUser.uid)

    // Extract raw files from the sorted images array
    const filesToUpload = images.value.map(img => img.file)

    const uploadedUrls = await uploadMultipleFiles(filesToUpload, "items")

    const docRef = await addDoc(collection(db, 'Items'), {
      Likes: 0,
      Price: item.value.price,
      Value: item.value.value,
      Cover: uploadedUrls[0], // First image is cover
      Images: uploadedUrls,
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
      router.push(`/profile`)
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
