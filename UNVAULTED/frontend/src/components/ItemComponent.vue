<template>
  <div
    class="container flex flex-col w-60 p-2 border border-[var(--color-border)] rounded-xl gap-2 hover:scale-104 hover:shadow-lg transition duration-200 cursor-pointer"
    @click="goToItemPage"
  >
    <div class="img-container relative h-72 w-full">
      <div class="product-overlay absolute inset-0 z-10">
        <!-- Sell Type -->
        <div
          class="sell-type absolute top-2 right-2 border border-[var(--color-border)]/40 rounded-full px-1.5 py-0.5 w-fit text-[8px] text-white backdrop-blur-md bg-black/20"
        >
          <span class="mix-blend-difference">{{ localSellType }}</span>
        </div>

        <!-- Seller -->
        <div
          class="seller hover hover:scale-110 transition w-fit group absolute flex flex-row items-center gap-1 bottom-2 left-2 border border-[var(--color-border)]/40 rounded-full p-[1px] hover:pr-2 max-w-30 text-xs text-white backdrop-blur-md bg-black/20"
          @click.stop="goToSellerPage"
        >
          <img :src="userImage" class="h-8 w-8 rounded-full aspect-square" />
          <p class="hidden group-hover:block text-gray-100 text-xs truncate">
            {{ userName }}
          </p>
        </div>

        <!-- Like Button -->
        <div
          class="like-count absolute bottom-2 right-2 flex flex-row items-center gap-1 px-2 py-1 border border-[var(--color-border)]/40 rounded-full bg-black/20 backdrop-blur-md hover hover:scale-110 transition w-fit cursor-pointer"
          @click.stop="toggleLike"
        >
          <svg
            width="16px"
            height="16px"
            viewBox="-2 -2 20 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            :stroke="isLiked ? '#ff0000' : '#ffffff'"
          >
            <path
              d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z"
              :fill="isLiked ? '#ff0000' : '#ffffff'"
            />
          </svg>

          <p class="text-xs text-gray-100">{{ localLikeCount }}</p>
        </div>
      </div>

      <img
        :src="localImage"
        class="rounded-xl overflow-hidden h-full w-full object-cover border border-[var(--color-border)]"
        alt="product image"
      />
    </div>

    <div class="flex flex-col description-container">
      <span class="text-2xl font-bold line-clamp-2 h-16">{{ localTitle }}</span>
      <div class="flex flex-row justify-between">
        <span class="text-md text-gray-600">{{ localPrice }}€</span>
        <span class="text-md text-gray-600">{{ localDistance }} km</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { auth, db } from '@/firebase/firebase-client'

// Props
const props = defineProps({
  id: String,
  title: String,
  price: Number,
  image: String,
  sellType: String,
  seller: Object,
  likeCount: Number,
  distance: Number,
})

const localId = ref(props.id)
const localTitle = ref(props.title)
const localPrice = ref(props.price)
const localImage = ref(props.image)
const localSellType = ref(props.sellType)
const localDistance = ref(props.distance)
const localLikeCount = ref(props.likeCount)

const router = useRouter()

const userName = ref('Username')
const userImage = ref('')
const isLiked = ref(false)

onMounted(async () => {
  if (props.seller) {
    const snap = await getDoc(props.seller)
    if (snap.exists()) {
      const data = snap.data()
      userName.value = `${data.FirstName} ${data.LastName}`
      userImage.value = data.Image || '../assets/defaultProfile.jpg'
    }
  }

  const current = auth.currentUser
  if (!current) return

  const userRef = doc(db, 'Users', current.uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    const favs = userSnap.data().Favorites || []
    isLiked.value = favs.some((f) => f.id === props.id)
  }
})

async function toggleLike() {
  const user = auth.currentUser
  if (!user) return

  const userRef = doc(db, 'Users', user.uid)
  const itemRef = doc(db, 'Items', props.id)

  if (isLiked.value) {
    isLiked.value = false
    localLikeCount.value--

    await updateDoc(itemRef, { Likes: localLikeCount.value })
    await updateDoc(userRef, {
      Favorites: arrayRemove(itemRef),
    })
  } else {
    isLiked.value = true
    localLikeCount.value++

    await updateDoc(itemRef, { Likes: localLikeCount.value })
    await updateDoc(userRef, {
      Favorites: arrayUnion(itemRef),
    })
  }
}

function goToItemPage() {
  router.push({ name: 'items', params: { id: localId.value } })
}

function goToSellerPage() {
  if (!props.seller) return
  router.push({ name: 'user', params: { id: props.seller.id } })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
