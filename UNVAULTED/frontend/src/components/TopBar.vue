<template>
  <nav
    class="fixed top-[2vh] left-1/2 -translate-x-1/2 w-[85%] max-w-[100vw] z-50 rounded-xl border border-[var(--color-border)] glass bg-white/60 flex items-center justify-between px-6 py-3 transition-[border-color,background-color,backdrop-filter] duration-200"
  >
    <div class="grid grid-cols-3 gap-10 items-center">
      <router-link to="/">
        <span
          class="text-2xl tracking-widest select-none font-weight-900 text-[var(--color-gold)]"
          style="
            text-shadow:
              0 0 1.5px rgba(255, 255, 255, 1),
              0 0 6px rgba(255, 255, 255, 0.95),
              0 0 14px rgba(255, 255, 255, 0.8),
              0 0 26px rgba(255, 255, 255, 0.6),
              0 0 40px rgba(255, 255, 255, 0.45),
              0 0 64px rgba(255, 255, 255, 0.3),
              0 1px 0 rgba(0, 0, 0, 0.18);
          "
        >
          UNVAULTED
        </span>
      </router-link>
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
      <button v-if="currentUser" @click="addItem" class="w-[10rem] button-outline py-1">
        Add Item
      </button>

      <div class="relative flex" v-if="currentUser">
        <button
          @click="toggleDropdown"
          class="rounded-full transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-haspopup="menu"
          :aria-expanded="dropdown ? 'true' : 'false'"
          :aria-controls="menuId"
          type="button"
        >
          <img
            :src="profileImage"
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
            class="absolute top-22 -right-6 rounded-xl bg-white/60 backdrop-blur-md border border-[var(--color-border)] w-50 z-50 animate-in fade-in overflow-hidden"
            role="menu"
            aria-label="Profile menu"
          >
            <ul class="divide-y divide-[var(--color-border)]">
              <li v-for="(item, idx) in items" :key="item.label">
                <router-link
                  v-if="item.to"
                  :to="item.to"
                  class="group flex items-center gap-3 ps-4 pe-3 min-h-[3em] transition-colors duration-150 ease-out hover:bg-[var(--color-accent)]/10 focus:bg-[var(--color-accent)]/15 focus:outline-none active:scale-[0.99] transition-transform"
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
                </router-link>
              </li>
              <li class="border-t border-[var(--color-border)]">
                <a
                  @click="handleLogout"
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
import { ref, onMounted, onBeforeUnmount, h, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase/firebase-client.js'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const dropdown = ref(false)
const menuId = 'profile-menu'
const router = useRouter()
const currentUser = ref(null)
import defaultProfile from '@/assets/defaultProfile.jpg'
const profileImage = ref(defaultProfile)

function toggleDropdown() {
  if (!currentUser.value) return
  dropdown.value = !dropdown.value
}

function handleClickOutside(e: MouseEvent) {
  const nav = (e.target as HTMLElement).closest('nav')
  if (!nav) dropdown.value = false
}

async function handleLogout() {
  try {
    await signOut(auth)
    dropdown.value = false
    router.push('/signup')
  } catch (err) {
    console.error('Logout failed', err)
  }
}

onAuthStateChanged(auth, async (user) => {
  currentUser.value = user

  if (user) {
    const userRef = doc(db, 'Users', user.uid)
    const snap = await getDoc(userRef)

    if (snap.exists()) {
      profileImage.value = snap.data().Image || defaultProfile
    }
  } else {
    profileImage.value = defaultProfile
  }
})

onMounted(() => window.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => window.removeEventListener('click', handleClickOutside))
function addItem() {
  router.push('/items/new')
}
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
    },
    [h('path', { d: 'M20 21a8 8 0 1 0-16 0' }), h('circle', { cx: 12, cy: 7, r: 4 })],
  )
const FollowingIcon = (props) =>
  h(
    'svg',
    {
      ...props,
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      stroke: '#000000',
      'stroke-width': 1,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    [
      h('path', {
        d: 'M16.719 19.7519L16.0785 14.6279C15.8908 13.1266 14.6146 12 13.1017 12H12H10.8983C9.38538 12 8.10917 13.1266 7.92151 14.6279L7.28101 19.7519C7.1318 20.9456 8.06257 22 9.26556 22H12H14.7344C15.9374 22 16.8682 20.9456 16.719 19.7519Z',
      }),
      h('circle', { cx: 12, cy: 5, r: 3 }),
      h('circle', { cx: 4, cy: 9, r: 2 }),
      h('circle', { cx: 20, cy: 9, r: 2 }),
      h('path', {
        d: 'M4 14H3.69425C2.71658 14 1.8822 14.7068 1.72147 15.6712L1.38813 17.6712C1.18496 18.8903 2.12504 20 3.36092 20H7',
      }),
      h('path', {
        d: 'M20 14H20.3057C21.2834 14 22.1178 14.7068 22.2785 15.6712L22.6119 17.6712C22.815 18.8903 21.8751 20 20.6392 20C19.4775 20 18.0952 20 17 20',
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
    },
    [
      h('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
      h('path', { d: 'M16 17l5-5-5-5' }),
      h('path', { d: 'M21 12H9' }),
    ],
  )

const items = computed(() => [
  { label: 'History', to: '/', icon: HistoryIcon },
  { label: 'Favorites', to: '/favorites', icon: OffersIcon },

  { label: 'Following', to: '/following', icon: FollowingIcon },
  {
    label: 'Your Profile',
    to: currentUser.value ? `/profile/${currentUser.value.uid}` : '/profile',
    icon: ProfileIcon,
  },
])
</script>
