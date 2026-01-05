<template>
  <div class="w-full mx-auto mt-8 flex gap-4">
    <!-- SELLER CHAT LIST -->
    <div
      v-if="isSeller"
      class="w-60 bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 p-2 flex flex-col gap-2 max-h-[80vh] min-h-[20vh] overflow-y-auto"
    >
      <p v-if="chats.length == 0" class="w-100% text-center py-4">No Chats Yet</p>
      <div
        v-for="chat in chats"
        :key="chat.id"
        @click="openChat(chat.id)"
        :class="[
          'flex flex-col gap-1 p-2 rounded-lg cursor-pointer',
          chat.id === activeChatId ? 'bg-blue-100' : 'hover:bg-gray-100',
        ]"
      >
        <div class="flex items-center gap-2">
          <img
            :src="chat.participantData?.Image || defaultProfile"
            class="w-10 h-10 rounded-full object-cover"
          />
          <div class="flex flex-col">
            <p class="truncate text-xl">
              {{ chat.participantData?.FirstName }} {{ chat.participantData?.LastName }}
            </p>
            <p v-if="chat.offer?.price">{{ chat.offer.price }}</p>
            <p v-else-if="chat.offer?.item">{{ chat.offer.item }}</p>
            <p v-else>No Offers Yet</p>
          </div>
        </div>

        <p
          v-if="chat.offer?.price || chat.offer?.item"
          class="text-xs text-gray-500 truncate pl-12"
        >
          Offer:
          <span v-if="chat.offer.price">€{{ chat.offer.price }}</span>
          <span v-if="chat.offer.item">Item trade</span>
        </p>
      </div>
    </div>

    <div
      class="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
    >
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img
            :src="chatHeaderUser?.Image || defaultProfile"
            class="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div>
            <h2 class="font-semibold text-gray-900">
              {{ chatHeaderName }}
            </h2>
            <p class="text-sm text-gray-500">Chat about this item</p>
          </div>
        </div>

        <button
          v-if="!isSeller && !chatExists"
          @click="startChat"
          class="w-[10rem] py-3 button-outline"
        >
          Start Chat
        </button>
      </div>
      <div class="relative">
        <div
          v-if="activeChatOffer"
          class="absolute top-2 left-2 w-fit bg-white border border-gray-200 rounded-xl shadow-xl text-sm z-10"
        >
          <p
            class="font-semibold rounded-t-xl pb-2 px-3 pt-3 text-2xl bg-[var(--color-gold)] text-white border-b border-gray-200"
          >
            Current Offer
          </p>
          <div class="flex flex-row items-center">
            <p class="px-2">Price:</p>

            <p class="text-xl p-2" v-if="activeChatOffer.price">€{{ activeChatOffer.price }}</p>
          </div>
          <div class="flex flex-row items-center">
            <p class="px-2">Price:</p>
            <p class="text-xl p-2" v-if="activeChatOffer.price">€{{ activeChatOffer.price }}</p>
          </div>
          <p v-if="activeChatOffer.item">Item trade</p>

          <button
            v-if="isSeller && !activeChatOffer.accepted"
            @click="acceptOffer"
            class="mt-2 text-xs button-solid"
          >
            Accept Offer
          </button>

          <p v-if="activeChatOffer.accepted" class="text-green-600 text-xs mt-1">Accepted</p>
        </div>
      </div>

      <!-- MESSAGES -->
      <div
        v-if="chatExists"
        ref="chatContainer"
        class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 max-h-[60vh] min-h-[40vh]"
      >
        <div v-for="(msg, i) in messages" :key="msg.id">
          <!-- DAY SEPARATOR -->
          <div v-if="isNewDay(i)" class="text-center text-xs text-gray-400 my-4">
            {{ formatDay(msg.createdAt) }}
          </div>

          <div
            class="flex gap-1"
            :class="msg.sender === currentUserId ? 'justify-end' : 'justify-start'"
          >
            <div
              class="relative px-4 py-2 min-w-[5rem] rounded-2xl max-w-[60%] shadow-sm max-w-[calc(100%-15rem)] text-balance break-all"
              :class="
                msg.sender === currentUserId
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              "
            >
              {{ msg.text }}

              <!-- TIME -->
            </div>
            <span class="lottom-1 right-2 text-[10px] text-gray-300">
              {{ formatTime(msg.createdAt) }}
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="chatExists && !isSeller && allowBuy"
        class="p-3 border-t border-gray-200 bg-white flex gap-2"
      >
        <input
          v-model="offerPrice"
          type="number"
          placeholder="€ Offer"
          class="flex-1 border rounded-lg px-3 py-1 text-sm"
        />
        <button @click="updateOffer" class="button-outline text-sm">Update Offer</button>
      </div>

      <!-- MESSAGE INPUT -->
      <div v-if="chatExists" class="border-t border-gray-200 bg-white p-4 flex items-center gap-3">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type a message..."
          class="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 outline-none"
        />
        <button
          @click="sendMessage"
          class="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { auth, db } from '@/firebase/firebase-client'
import defaultProfile from '@/assets/defaultProfile.jpg'

const props = defineProps({
  productId: String,
  sellerData: Object,
  isSeller: Boolean,
  allowBuy: Boolean,
  allowTrade: Boolean,
})

const currentUserId = auth.currentUser.uid
const chats = ref([])
const messages = ref([])
const activeChatId = ref(null)
const activeChat = ref(null)
const newMessage = ref('')
const offerPrice = ref('')
const chatContainer = ref(null)

const chatExists = ref(false)

const chatHeaderUser = computed(() =>
  props.isSeller ? activeChat.value?.participantData : props.sellerData,
)

const chatHeaderName = computed(() =>
  chatHeaderUser.value ? `${chatHeaderUser.value.FirstName} ${chatHeaderUser.value.LastName}` : '',
)

const activeChatOffer = computed(() => activeChat.value?.offer || null)

function isNewDay(i) {
  if (i === 0) return true
  const a = messages.value[i - 1].createdAt?.toDate()
  const b = messages.value[i].createdAt?.toDate()
  return a?.toDateString() !== b?.toDateString()
}

function formatDay(ts) {
  return ts?.toDate().toLocaleDateString()
}

function formatTime(ts) {
  return ts?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function loadChats() {
  const q = query(collection(db, 'Chats'), where('item', '==', doc(db, 'Items', props.productId)))

  onSnapshot(q, async (snap) => {
    chats.value = await Promise.all(
      snap.docs.map(async (d) => {
        const data = d.data()
        const userSnap = await getDoc(data.participant)
        return {
          id: d.id,
          ...data,
          participantData: userSnap.data(),
        }
      }),
    )

    if (props.isSeller && chats.value.length && !activeChatId.value) {
      openChat(chats.value[0].id)
    } else if (!props.isSeller) {
      const own = chats.value.find((c) => c.participant.id === currentUserId)
      if (own && !activeChatId.value) {
        openChat(own.id)
      }
    }
  })
}

function openChat(id) {
  activeChatId.value = id
  activeChat.value = chats.value.find((c) => c.id === id)
  chatExists.value = true

  onSnapshot(
    query(collection(db, 'Chats', id, 'Messages'), orderBy('createdAt', 'asc')),
    (snap) => {
      messages.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      nextTick(() => {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      })
    },
  )
}
async function startChat() {
  const itemRef = doc(db, 'Items', props.productId)
  const participantRef = doc(db, 'Users', currentUserId)

  const q = query(
    collection(db, 'Chats'),
    where('item', '==', itemRef),
    where('participant', '==', participantRef),
  )

  const snapshot = await getDocs(q)

  // If chat already exists, open it
  if (!snapshot.empty) {
    openChat(snapshot.docs[0].id)
    return
  }

  // Otherwise create it
  const refChat = await addDoc(collection(db, 'Chats'), {
    item: itemRef,
    participant: participantRef,
    offer: {},
    createdAt: serverTimestamp(),
  })

  openChat(refChat.id)
}

async function sendMessage() {
  if (!newMessage.value) return
  await addDoc(collection(db, 'Chats', activeChatId.value, 'Messages'), {
    text: newMessage.value,
    sender: currentUserId,
    createdAt: serverTimestamp(),
  })
  newMessage.value = ''
}

async function updateOffer() {
  await updateDoc(doc(db, 'Chats', activeChatId.value), {
    offer: {
      price: offerPrice.value,
      accepted: false,
    },
  })
}

async function acceptOffer() {
  await updateDoc(doc(db, 'Chats', activeChatId.value), {
    'offer.accepted': true,
  })
}

onMounted(loadChats)
</script>
