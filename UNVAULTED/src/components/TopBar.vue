<template>
  <nav
    class="fixed top-[2vh] left-1/2 transform -translate-x-1/2 w-[75%] max-w-[100vw] z-50 rounded-xl border border-color-border bg-white/60 backdrop-blur-md flex items-center justify-between px-6 py-3"
    style="border-color: var(--color-border)"
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
        class="rounded-full px-4 py-1.5 border transition w-72"
        style="border-color: var(--asdf)"
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
            class="absolute top-22 right-0 bg-white/60 backdrop-blur-xl rounded-xl border w-56 z-50 mt-2 animate-in fade-in"
            style="border-color: var(--color-border)"
          >
            <div
              class="w-64 rounded-xl border border-[--dropdown] bg-white shadow-md overflow-hidden"
              role="menu"
            >
              <ul class="divide-y divide-[--dropdown]">
                <li>
                  <a href="#" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <span class="i-lucide-history size-5"></span>
                    <span>History</span>
                  </a>
                </li>
                <li>
                  <a href="#" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <span class="i-lucide-handshake size-5"></span>
                    <span>Your Offers</span>
                  </a>
                </li>
                <li>
                  <a href="#" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <span class="i-lucide-user size-5"></span>
                    <span>Your Profile</span>
                  </a>
                </li>
                <li>
                  <a href="#" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <span class="i-lucide-settings size-5"></span>
                    <span>Settings</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="flex items-center gap-3 px-4 py-3 text-white bg-rose-400 hover:bg-rose-500"
                  >
                    <span class="i-lucide-log-out size-5"></span>
                    <span>Sign Out</span>
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

<script setup>
import { ref, onMounted } from 'vue'
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
