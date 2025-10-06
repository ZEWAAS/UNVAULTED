<template>
  <nav
    class="fixed top-[2vh] left-1/2 -translate-x-1/2 w-[85%] max-w-[100vw] z-50 rounded-xl border border-[var(--color-border)] glass flex items-center justify-between px-6 py-3 transition-[border-color,background-color,backdrop-filter] duration-200"
  >
    <div class="grid grid-cols-3 gap-10 items-center">
<span
  class="text-2xl tracking-widest select-none font-weight-900 text-[var(--color-gold)]"
  style="text-shadow:
    0 0 1.5px rgba(255,255,255,1),
    0 0 6px rgba(255,255,255,0.95),
    0 0 14px rgba(255,255,255,0.8),
    0 0 26px rgba(255,255,255,0.6),
    0 0 40px rgba(255,255,255,0.45),
    0 0 64px rgba(255,255,255,0.3),
    0 1px 0 rgba(0,0,0,0.18)">
  UNVAULTED
</span>
      <div class="flex gap-4">
        <a href="#" class="group relative transition-colors hover:font-semibold">
          <span>Main</span>
          <i
            class="pointer-events-none absolute left-0 -bottom-1 h-[2px] w-0 bg-[var(--color-accent)] transition-all duration-200 group-hover:w-full"
            aria-hidden="true"
          ></i>
        </a>
        <a href="#" class="group relative text-gray-700 transition-colors hover:font-semibold">
          <span>Trending</span>
          <i
            class="pointer-events-none absolute left-0 -bottom-1 h-[2px] w-0 bg-[var(--color-accent)] transition-all duration-200 group-hover:w-full"
            aria-hidden="true"
          ></i>
        </a>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <input
        type="text"
        placeholder="Search..."
        class="rounded-full px-4 py-1.5 border border-[var(--color-border)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white w-72"
      />

      <div class="relative">
        <button
          @click="toggleDropdown"
          @keydown="onTriggerKeydown"
          class="rounded-full transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-haspopup="menu"
          :aria-expanded="dropdown ? 'true' : 'false'"
          :aria-controls="menuId"
          type="button"
        >
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.vcjzhWLCN7-VOC95HeBsJAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
            class="size-14 rounded-full shadow-sm hover:shadow-md transition-shadow duration-150"
            alt="profile"
          />
        </button>

        <transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-120 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="dropdown"
            :id="menuId"
            class="absolute top-22 -right-6 rounded-xl  bg-white/60 backdrop-blur-md border border-[var(--color-border)] w-50 z-50 animate-in fade-in overflow-hidden"
            role="menu"
            aria-label="Profile menu"
            @keydown="onMenuKeydown"
          >
            <ul class="divide-y divide-[var(--color-border)]">
              <li v-for="(item, idx) in items" :key="item.label">
                <a
                  :href="item.href"
                  ref="setItemRef"
                  class="group flex items-center gap-3 ps-4 pe-3 min-h-[3em] transition-colors  duration-150 ease-out hover:bg-[var(--color-accent)]/10 focus:bg-[var(--color-accent)]/15 focus:outline-none active:scale-[0.99] transition-transform"
                  role="menuitem"
                  tabindex="-1"
                >
                  <div class="w-2"></div>

                  <component
                    :is="item.icon"
                    class="size-5 shrink-0 text-gray-700 transition-colors duration-150 group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]"
                  />
                  <span
                    class="text-[15px] leading-[1em] text-gray-900 transition-colors duration-150"
                  >
                    {{ item.label }}
                  </span>

                  <span
                    class="ms-auto opacity-0 group-hover:opacity-100 transition-opacity duration-50 text-[var(--color-accent)]"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>
              </li>

              <li class="border-t border-[var(--color-border)]">
                <a
                  href="#"
                  ref="setItemRef"
                  class="group flex items-center gap-3 ps-4 pe-3 min-h-[3em] bg-[var(--color-red)] text-white hover:bg-[var(--color-red)]/50 transition-colors duration-150 ease-out focus:outline-none focus:bg-[var(--color-red)]/10 active:scale-[0.99]"
                  role="menuitem"
                  tabindex="-1"
                >
                  <div class="w-2"></div>
                  <LogoutIcon class="size-5 text-white shrink-0" />
                  <span class="text-[15px] leading-[1em]">Sign Out</span>
                </a>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, h } from 'vue'

const dropdown = ref(false)
const menuId = 'profile-menu'


function toggleDropdown() {
  dropdown.value = !dropdown.value;
}


function handleClickOutside(e: MouseEvent) {
  const nav = (e.target as HTMLElement).closest('nav')
  if (!nav) dropdown.value = false
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})

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
        d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9',
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
</script>

<style scoped>

nav.glass::before {
  content: "";
  position: absolute;
  inset: 0;
    background-color: rgb(255 255 255 / 0.6); /* bg-white/60 */

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 0;            /* sits under content */
  border-radius: inherit; 
}

nav.glass > * {
  z-index: 1;
}
</style>