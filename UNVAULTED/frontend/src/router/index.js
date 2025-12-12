import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'
import { auth } from '@/firebase/firebase-client.js'
import { onAuthStateChanged } from 'firebase/auth'

// --- Globaler User State ---
export const currentUser = ref(undefined) // undefined = noch nicht geladen

// --- Auth State Listener ---
onAuthStateChanged(auth, (user) => {
  currentUser.value = user
})

// --- Routes ---
const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/about', name: 'about', component: () => import('../views/ProfileView.vue') },
  { path: '/profile/:id', name: 'profile', component: () => import('../views/ProfileView.vue') },
  { path: '/signup', name: 'signup', component: () => import('../views/SignupView.vue') },
  { path: '/following', name: 'following', component: () => import('../views/FollowingView.vue') },
  { path: '/items/:id', name: 'items', component: () => import('../views/ItemView.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (currentUser.value === undefined) {
    await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, () => {
        unsubscribe()
        resolve()
      })
    })
  }

  const publicPages = ['/signup']
  const authRequired = !publicPages.includes(to.path)

  if (currentUser.value && to.path === '/signup') {
    next(`/profile/${currentUser.value.uid}`)
  } else if (authRequired && !currentUser.value) {
    next('/signup')
  } else {
    next()
  }
})

export default router
