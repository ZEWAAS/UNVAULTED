<template>
  <nav
    class="fixed top-[2vh] left-1/2 transform -translate-x-1/2 w-[85%] max-w-[100vw] z-50 rounded-xl border border-[var(--color-border)] bg-white/60 backdrop-blur-md flex items-center justify-between px-6 py-3"
  >
    <div class="grid grid-cols-3 gap-10">
      <span class="font-bold text-xl tracking-widest text-gray-800 select-none">UNVAULTED</span>

      <div class="flex gap-4">
        <a href="#" class="hover:font-semibold transition">Main</a>
        <a href="#" class="text-gray-700 hover:font-semibold transition">Trending</a>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <input
        type="text"
        placeholder="Search..."
        class="rounded-full px-4 py-1.5 border border-[var(--color-border)] transition w-72"
      />

      <div class="flex justify-center">
        <button @click="toggleDropdown" class="focus:outline-none">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.vcjzhWLCN7-VOC95HeBsJAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
            class="size-14 rounded-full aspect-square"
            alt="profile"
          />
        </button>

        <transition name="fade">
          <div
            v-if="dropdown"
            class="absolute top-22 right-0 bg-white/60 backdrop-blur-md rounded-xl border border-[var(--color-border)] w-50 z-50 mt-2 animate-in fade-in overflow-hidden"
          >
            <div class="w-72 overflow-hidden" role="menu">
              <ul class="divide-y divide-[var(--color-border)]">
                <li v-for="item in items" :key="item.label">
                  <a
                    :href="item.href"
                    class="flex items-center gap-3 py-0 min-h-[3em] transition-colors duration-150 hover:bg-[var(--color-accent)]/50 hover:text-white"
                  >
                    <div class="spacer w-1"></div>
                    <component
                      :is="item.icon"
                      class="size-5 shrink-0 transition-colors duration-150 text-gray-700 group-hover:text-white"
                    />
                    <span class="text-[15px] leading-[1em] transition-colors duration-150">
                      {{ item.label }}
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    class="flex items-center gap-3 px-5 py-0 min-h-[3em] text-white bg-rose-400 hover:bg-rose-500"
                  >
                    <div class="spacer w-1"></div>

                    <LogoutIcon class="size-5 text-white shrink-0" />
                    <span class="text-[15px] leading-[1em]" style="color: white">Sign Out</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const dropdown = ref(false)
function toggleDropdown() {
  dropdown.value = !dropdown.value
}
function handleClickOutside(e) {
  if (!e.target.closest('nav')) dropdown.value = false
}

import { h } from 'vue'

const HistoryIcon = (props: any) =>
  h(
    'svg',
    {
      ...props,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 1.75,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true',
    },
    [
      h('path', { d: 'M3 3v5h5' }),
      h('path', { d: 'M3.05 13A9 9 0 1 0 7 4.6' }),
      h('path', { d: 'M12 7v5l4 2' }),
    ],
  )

const OffersIcon = (props: any) =>
  h(
    'svg',
    {
      ...props,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 1.75,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true',
    },
    [
      h('path', { d: 'M2 12a10 10 0 1 0 20 0A10 10 0 0 0 2 12Z' }),
      h('path', { d: 'M8 12l2 2 6-6' }),
    ],
  )

const ProfileIcon = (props: any) =>
  h(
    'svg',
    {
      ...props,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 1.75,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true',
    },
    [h('path', { d: 'M20 21a8 8 0 1 0-16 0' }), h('circle', { cx: 12, cy: 7, r: 4 })],
  )

const SettingsIcon = (props: any) =>
  h(
    'svg',
    {
      ...props,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 1.75,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true',
    },
    [
      h('circle', { cx: 12, cy: 12, r: 3 }),
      h('path', {
        d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9',
      }),
    ],
  )

const LogoutIcon = (props: any) =>
  h(
    'svg',
    {
      ...props,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 1.75,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true',
    },
    [
      h('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
      h('path', { d: 'M16 17l5-5-5-5' }),
      h('path', { d: 'M21 12H9' }),
    ],
  )

const items = [
  { label: 'History', href: '#', icon: HistoryIcon },
  { label: 'Your Offers', href: '#', icon: OffersIcon },
  { label: 'Your Profile', href: '#', icon: ProfileIcon },
  { label: 'Settings', href: '#', icon: SettingsIcon },
]

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
