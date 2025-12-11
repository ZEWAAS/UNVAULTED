<template>
  <div
    class="container flex flex-col w-60 p-2 border border-[var(--color-border)] rounded-xl gap-2 hover:scale-104 hover:shadow-lg transition duration-200 cursor-pointer"
    @click="goToItemPage"
  >
    <div class="img-container relative h-72 w-full">
      <div class="product-overlay absolute inset-0 z-10">
        <div
          class="sell-type absolute top-2 right-2 border border-[var(--color-border)]/40 rounded-full px-1.5 py-0.5 w-fit text-[8px] text-white backdrop-blur-md bg-black/20"
        >
          <span class="mix-blend-difference">{{ sellType }}</span>
        </div>

        <div
          class="seller group absolute flex flex-row items-center gap-1 bottom-2 left-2 border border-[var(--color-border)]/40 rounded-full p-[1px] hover:pr-2 w-fit max-w-30 text-xs text-white backdrop-blur-md bg-black/20"
        >
          <img :src="userImage" class="h-8 w-8 rounded-full aspect-square" />
          <p class="hidden group-hover:block text-gray-100 text-xs truncate">
            {{ userName }}
          </p>
        </div>

        <div
          class="like-count absolute bottom-2 right-2 flex flex-row items-center gap-1 px-2 py-1 border border-[var(--color-border)]/40 rounded-full bg-black/20 backdrop-blur-md"
        >
          <span class="i-lucide-heart size-5">
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
              ></path>
            </svg>
          </span>
          <p class="text-xs text-gray-100">{{ likeCount }}</p>
        </div>
      </div>

      <img
        :src="image"
        class="rounded-xl overflow-hidden h-full w-full object-cover border border-[var(--color-border)]"
        alt="product image"
      />
    </div>

    <div class="flex flex-col description-container">
      <span class="text-2xl font-bold line-clamp-2 h-16">{{ title }}</span>
      <div class="flex flex-row justify-between">
        <span class="text-md text-gray-600">{{ price }}€</span>
        <span class="text-md text-gray-600">{{ distance }} km</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
const router = useRouter()

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true, default: 'Title' },
  price: { type: Number, required: true, default: 10000 },
  image: {
    type: String,
    required: true,
    default:
      'https://img.redbull.com/images/c_crop,x_759,y_0,h_5464,w_8196/c_fill,w_1950,h_1219/q_auto,f_jpg/redbullcom/2022/5/5/sor22gddafi4ribmje9p/max-verstappen-header',
  },
  sellType: { type: String, required: true, default: 'Trade/Buy' },
  sellerImage: {
    type: String,
    required: true,
    default:
      'https://tse3.mm.bing.net/th/id/OIP.vcjzhWLCN7-VOC95HeBsJAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  seller: { type: Object, required: true },
  likeCount: { type: Number, required: true, default: 0 },
  isLiked: { type: Boolean, required: true, default: true },
  distance: { type: Number, required: true, default: 0 },
})

const userName = ref('Username')
const userImage = ref('')

onMounted(async () => {
  if (props.seller) {
    try {
      const snap = await getDoc(props.seller)
      if (snap.exists()) {
        const data = snap.data()
        userName.value = `${data.FirstName} ${data.LastName}`
        userImage.value = data.Image || '../assets/defaultProfile.jpg'
      } else {
        userName.value = 'Unknown'
      }
    } catch (e) {
      console.error('Failed to load user:', e)
      userName.value = 'Unknown'
    }
  }
})

function goToItemPage() {
  router.push({
    name: 'items',
    params: { id: props.id },
  })
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
