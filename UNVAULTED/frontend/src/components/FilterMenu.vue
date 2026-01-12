<template>
  <aside class="w-72 select-none h-fit">
    <div
      class="flex flex-col rounded-2xl border border-[var(--color-border)] bg-white/60 overflow-hidden"
    >
      <div class="py-1 flex items-center gap-3 pe-3 min-h-[3em]">
          <div class="w-2"></div>
          <img src="../assets/filter.svg" class="size-5 text-white shrink-0" />
          <span class="text-[15px] leading-[1em]">Filters</span>
          <div class="flex-grow"></div>
          <button @click="resetFilters" class="text-xs text-blue-500 hover:text-blue-700">Reset</button>
      </div>

      <div class="px-4 py-3 space-y-5 gap-2 flex flex-col">
        <!-- Sort By -->
        <div>
            <span class="text-sm text-gray-700 block mb-2">Sort By</span>
            <select v-model="sortBy" class="w-full text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="popular">Popular</option>
                <option value="new">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
            </select>
        </div>

        <!-- Price -->
        <div class="flex flex-col gap-0.5">
          <span class="text-sm text-gray-700 block mb-2">Price Range (€)</span>
          <div class="flex items-center gap-2">
            <input 
                v-model="priceMin" 
                type="number" 
                placeholder="Min" 
                class="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span class="text-gray-400">-</span>
            <input 
                v-model="priceMax" 
                type="number" 
                placeholder="Max" 
                class="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Distance -->
        <div class="flex flex-col gap-0.5">
          <span class="text-sm text-gray-700 block mb-2">Max Distance (km)</span>
          <input 
              v-model="distance" 
              type="number" 
              placeholder="Distance (km)" 
              class="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <!-- Rating -->
        <div class="flex flex-col gap-0.5">
          <span class="text-sm text-gray-700 block mb-2">Min Rating (1-5)</span>
             <input 
                v-model="rating" 
                type="number" 
                placeholder="Stars (1-5)" 
                min=1
                max=5
                class="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>

        <!-- Views -->
        <div class="flex flex-col gap-0.5">
          <span class="text-sm text-gray-700 block mb-2">Likes</span>
          <div class="flex items-center gap-2">
            <input 
                v-model="viewsMin" 
                type="number" 
                placeholder="Min" 
                class="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span class="text-gray-400">-</span>
            <input 
                v-model="viewsMax" 
                type="number" 
                placeholder="Max" 
                class="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits(['change'])

const sortBy = ref('popular')
const priceMin = ref(null)
const priceMax = ref(null)
const distance = ref(null)
const rating = ref(null)
const viewsMin = ref(null)
const viewsMax = ref(null)
const selectedCategories = ref<string[]>([])

const toggleCategory = (category: string) => {
    if (selectedCategories.value.includes(category)) {
        selectedCategories.value = selectedCategories.value.filter(c => c !== category)
    } else {
        selectedCategories.value.push(category)
    }
}

const resetFilters = () => {
    sortBy.value = 'popular'
    priceMin.value = null
    priceMax.value = null
    distance.value = null
    rating.value = null
    viewsMin.value = null
    viewsMax.value = null
    selectedCategories.value = []
}


let timeout: NodeJS.Timeout

const emitChange = () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        emit('change', {
            sortBy: sortBy.value,
            priceMin: priceMin.value,
            priceMax: priceMax.value,
            maxSellerDistance: distance.value,
            minRating: rating.value,
            viewsMin: viewsMin.value,
            viewsMax: viewsMax.value,
            categories: selectedCategories.value
        })
    }, 500)
}

watch([sortBy, priceMin, priceMax, distance, rating, viewsMin, viewsMax, selectedCategories], emitChange, { deep: true })
</script>