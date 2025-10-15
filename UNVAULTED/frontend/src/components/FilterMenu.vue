<template>
  <aside class="w-72 select-none">
    <div
      class="flex flex-col rounded-2xl border border-[var(--color-border)] bg-white/60 overflow-hidden"
    >
      <div class="py-1 flex items-center gap-3 pe-3 min-h-[3em]">
          <div class="w-2"></div>
          <img src="../assets/filter.svg" class="size-5 text-white shrink-0" />
          <span class="text-[15px] leading-[1em]">Filters</span>
      </div>

      <div class="px-4 py-3 space-y-5">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-700">Price Range</span>
            <span class="text-xs text-gray-600">${{ priceRange[0] }}–${{ priceRange[1] }}</span>
          </div>
          <Slider
            v-model="priceRange"
            :min="0"
            :max="100"
            :step="1"
            :tooltip="'always'"
            :range="true"
            class="w-full"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-700">Distance</span>
            <span class="text-xs text-gray-600">{{ distance }} km</span>
          </div>
            <Slider
              v-model="distance"
              :min="0"
              :max="200"
              :step="1"
              :tooltip="'none'"
              class="w-full"
            />
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-700">Seller Rating</span>
            <span class="text-xs text-gray-600 flex items-center gap-1">
              {{ rating }}<span class="i-lucide-star size-3 text-yellow-400"></span>
            </span>
          </div>
            <Slider
              v-model="rating"
              :min="1"
              :max="5"
              :step="1"
              class="w-full"
            />
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-700">Views</span>
            <span class="text-xs text-gray-600">
              {{ viewsRange[0] }}–{{ viewsRange[1] }} <span class="i-lucide-eye size-3 inline-block"></span>
            </span>
          </div>
          <Slider
            v-model="viewsRange"
            :min="0"
            :max="viewsMax"
            :step="10"
            tooltip="none"
            :range="true"
            class="w-full"
          />
        </div>
      </div>

      <div class="py-1 flex items-center gap-2 border-t border-[var(--color-border,#E5E7EB)]">
        <a
          href="#"
          ref="setItemRef"
          class="group flex items-center gap-3 pe-3 min-h-[3em]"
          role="menuitem"
          tabindex="-1"
        >
          <div class="w-2"></div>
          <img src="../assets/filter.svg" class="size-5 text-white shrink-0" />
          <span class="text-[15px] leading-[1em]">Categories</span>
        </a>
      </div>

      <div class="divide-y divide-[var(--color-border,#E5E7EB)]">
        <button class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50">
          <span class="text-sm text-gray-800">Hardware</span>
        </button>
        <button class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50">
          <span class="text-sm text-gray-800">Clothes</span>
          <span class="i-lucide-chevron-right size-4 text-gray-500" />
        </button>
        <button class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50">
          <span class="text-sm text-gray-800">Furniture</span>
          <span class="i-lucide-chevron-right size-4 text-gray-500" />
        </button>
        <button class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50">
          <span class="text-sm text-gray-800">Entertainment</span>
          <span class="i-lucide-chevron-right size-4 text-gray-500" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'

const priceRange = ref([0, 100])
const distance = ref(200)
const rating = ref(5)
const viewsMax = 1500
const viewsRange = ref([0, viewsMax])
</script>

<style scoped>
.vue-slider .vue-slider-dot-tooltip,
.vue-slider .vue-slider-dot-tooltip-inner {
  display: none !important;
}
</style>
