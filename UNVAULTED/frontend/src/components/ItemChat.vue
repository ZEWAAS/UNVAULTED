<template>
  <div class="w-full mx-auto mt-8 flex gap-4">
    <!-- OWNER: vertical chat list -->
    <div
      v-if="isSeller"
      class="w-60 bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 p-2 flex flex-col gap-2 max-h-[80vh] overflow-y-auto"
    >
      <div
        v-for="chat in chats"
        :key="chat.id"
        @click="openChat(chat.id)"
        :class="[
          'flex items-center gap-2 p-2 rounded-lg cursor-pointer',
          chat.id === activeChatId ? 'bg-blue-100' : 'hover:bg-gray-100',
        ]"
      >
        <img
          :src="chat.participantData?.Image || defaultProfile"
          class="w-10 h-10 rounded-full object-cover"
        />
        <p class="truncate font-semibold">
          {{ chat.participantData?.FirstName }} {{ chat.participantData?.LastName }}
        </p>
      </div>
    </div>

    <!-- MAIN CHAT VIEW -->
    <div
      class="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
    >
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img
            :src="activeChatParticipant?.Image || defaultProfile"
            alt="User"
            class="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div>
            <h2 class="font-semibold text-gray-900">{{ activeChatParticipantName }}</h2>
            <p class="text-sm text-gray-500">Chat about this item</p>
          </div>
        </div>

        <!-- START CHAT BUTTON for non-sellers -->
        <button
          v-if="!isSeller && !chatExists"
          @click="startChat()"
          class="w-[10rem] py-3 button-outline"
        >
          Start Chat
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50" ref="chatContainer">
        <div v-if="messages.length === 0" class="flex justify-center mt-10">
          <p class="text-gray-400 italic text-sm">No messages yet</p>
        </div>

        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex"
          :class="{
            'justify-end': msg.sender === currentUserId,
            'justify-start': msg.sender !== currentUserId,
          }"
        >
          <div
            class="px-4 py-2 rounded-2xl max-w-[60%] shadow-sm"
            :class="
              msg.sender === currentUserId
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-800'
            "
          >
            {{ msg.text }}
          </div>
        </div>
      </div>

      <!-- MESSAGE INPUT -->
      <div class="border-t border-gray-200 bg-white p-4 flex items-center gap-3 sticky bottom-0">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type a message..."
          class="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          @click="sendMessage"
          class="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { auth, db } from '@/firebase/firebase-client'
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'

import defaultProfile from '@/assets/defaultProfile.jpg'

const props = defineProps({
  productId: { type: String, required: true },
  sellerData: { type: Object, required: true },
  isSeller: { type: Boolean, default: false },
})

const currentUserId = auth.currentUser?.uid || null
const newMessage = ref('')
const messages = ref([])
const chats = ref([])
const chatContainer = ref(null)
const activeChatId = ref(null)
const activeChatParticipant = ref(null)
const chatExists = ref(false)

const activeChatParticipantName = computed(() => {
  if (!activeChatParticipant.value) return ''
  return activeChatParticipant.value.FirstName + ' ' + activeChatParticipant.value.LastName
})

// --- LOAD OWNER VIEW CHATS ---
async function loadChats() {
  const chatsRef = collection(db, 'Chats')
  const q = query(chatsRef, where('item', '==', doc(db, 'Items', props.productId)))
  const snapshot = await getDocs(q)
  chats.value = await Promise.all(
    snapshot.docs.map(async (d) => {
      const chatData = d.data()
      const participantSnap = await getDoc(chatData.participant)
      return { id: d.id, ...chatData, participantData: participantSnap.data() }
    }),
  )

  if (props.isSeller && chats.value.length > 0) {
    openChat(chats.value[0].id)
  } else if (!props.isSeller) {
    chatExists.value = chats.value.some((c) => c.participant.id === currentUserId)
    if (chatExists.value) {
      const existing = chats.value.find((c) => c.participant.id === currentUserId)
      openChat(existing.id)
    }
  }
}

// --- OPEN CHAT ---
function openChat(chatId) {
  activeChatId.value = chatId
  const chat = chats.value.find((c) => c.id === chatId)
  activeChatParticipant.value = chat.participantData
  messages.value = []

  const messagesRef = collection(db, 'Chats', chatId, 'Messages')
  onSnapshot(messagesRef, (snap) => {
    messages.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    nextTick(() => {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    })
  })
}

// --- START CHAT ---
async function startChat() {
  if (chatExists.value) return

  const chatRef = await addDoc(collection(db, 'Chats'), {
    item: doc(db, 'Items', props.productId),
    participant: doc(db, 'Users', currentUserId),
    createdAt: serverTimestamp(),
  })

  chats.value.push({
    id: chatRef.id,
    participantData: { FirstName: 'You', LastName: '', Image: '' },
  })
  chatExists.value = true
  openChat(chatRef.id)
}

// --- SEND MESSAGE ---
async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text || !activeChatId.value) return

  await addDoc(collection(db, 'Chats', activeChatId.value, 'Messages'), {
    text,
    sender: currentUserId,
    createdAt: serverTimestamp(),
  })
  newMessage.value = ''
}
onMounted(loadChats)
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}
</style>
