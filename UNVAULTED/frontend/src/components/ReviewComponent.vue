<template>
  <div class="border border-[var(--color-border)] rounded-xl p-2">
    <div class="flex items-center gap-3 cursor-pointer" @click="goToProfile">
      <img :src="userImage" class="w-14 h-14 rounded-full object-cover" />
      <div class="flex flex-col justify-between h-14 w-full">
        <div class="flex items-center justify-between w-full">
          <p class="font-semibold text-2xl text-gray-900">{{ userName }}</p>
          <p class="text-gray-600 text-sm">
            {{
              createdAt
                ? createdAt.toDate().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : ''
            }}
          </p>
        </div>
        <div class="flex">
          <span
            v-for="n in 5"
            :key="n"
            class="text-xl"
            :class="n <= rating ? 'text-yellow-500' : 'text-gray-300'"
          >
            ★
          </span>
        </div>
      </div>
    </div>

    <p class="text-gray-700 whitespace-pre-line px-4 py-2">{{ text }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDoc } from 'firebase/firestore'
import defaultProfile from '@/assets/defaultProfile.jpg'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    validator: (value) => value >= 1 && value <= 5,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Object,
    required: false,
    default: '',
  },
})

const router = useRouter()
const userName = ref('Loading Username')
const userImage = ref(defaultProfile)

onMounted(async () => {
  if (props.user) {
    try {
      const snap = await getDoc(props.user)
      if (snap.exists()) {
        const data = snap.data()
        userName.value = `${data.FirstName} ${data.LastName}`
        userImage.value = data.Image || defaultProfile
      } else {
        userName.value = 'Unknown'
      }
    } catch (e) {
      console.error('Failed to load user:', e)
      userName.value = 'Unknown'
    }
  }
})

const goToProfile = () => {
  if (!props.user) return
  const userId = props.user.id
  router.push(`/profile/${userId}`)
}
</script>

<style scoped></style>
