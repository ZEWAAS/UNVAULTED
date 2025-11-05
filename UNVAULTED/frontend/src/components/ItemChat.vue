<template>
  <div class="w-full mx-auto mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Chat Header -->
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img
          :src="seller.image"
          alt="Seller"
          class="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
        <div>
          <h2 class="font-semibold text-gray-900">{{ seller.name }}</h2>
          <p class="text-sm text-gray-500">Chat about this item</p>
        </div>
      </div>
    </div>

    <!-- Chat Messages -->
    <div ref="chatContainer" class="h-[28rem] overflow-y-auto p-6 space-y-4 bg-gray-50">
      <!-- System Message -->
      <div v-if="messages.length === 0" class="flex justify-center mt-10">
        <p class="text-gray-400 italic text-sm">Start chat by sending a message</p>
      </div>

      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="flex"
        :class="{
          'justify-end': msg.type === 'user',
          'justify-start': msg.type === 'seller',
          'justify-center': msg.type === 'system',
        }"
      >
        <!-- System messages -->
        <div
          v-if="msg.type === 'system'"
          class="text-center text-gray-400 text-xs italic px-4 py-1"
        >
          {{ msg.text }}
        </div>

        <!-- User message -->
        <div
          v-else-if="msg.type === 'user'"
          class="bg-blue-600 text-white px-4 py-2 rounded-2xl max-w-[60%] shadow-sm"
        >
          {{ msg.text }}
        </div>

        <!-- Seller message -->
        <div
          v-else-if="msg.type === 'seller'"
          class="bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-2xl max-w-[60%] shadow-sm"
        >
          {{ msg.text }}
        </div>
      </div>
    </div>

 <div
      class="flex flex-col gap-3 p-4 bg-white border-t border-gray-200 sticky bottom-0"
    >
      <!-- Offer Options -->
      <div class="flex flex-col md:flex-row gap-3">
        <!-- Suggest Price -->
        <div class="flex items-center border border-gray-300 rounded-xl px-4 py-2 flex-1">
          <span class="text-gray-400 mr-2">€</span>
          <input
            v-model="offerPrice"
            type="number"
            min="1"
            class="w-full text-sm outline-none"
            placeholder="Suggest a price"
          />
        </div>

        <!-- Offer Item -->
        <div class="flex items-center border border-gray-300 rounded-xl px-4 py-2 flex-1">
          <input
            v-model="offerItem"
            type="text"
            class="w-full text-sm outline-none"
            placeholder="Offer one of your items"
          />
        </div>

        <!-- Send Offer -->
        <button
          @click="sendOffer"
          class="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Send Offer
        </button>
      </div>

      <!-- Normal Chat Input -->
      <div class="flex gap-3 mt-2">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type a message..."
          class="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="sendMessage"
          class="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>

    <!-- Chat Input -->
    <div
      class="border-t border-gray-200 bg-white p-4 flex items-center gap-3 sticky bottom-0"
    >
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
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'

const props = defineProps({
  productId: { type: [String, Number], required: true },
  seller: {
    type: Object,
    default: () => ({
      name: 'Unknown Seller',
      image: 'https://via.placeholder.com/100',
    }),
  },
})

const messages = ref([]) // no initial system message to keep it clean
const newMessage = ref('')
const chatContainer = ref(null)

function sendMessage() {
  const text = newMessage.value.trim()
  if (!text) return

  // Add user message
  messages.value.push({ type: 'user', text })

  // Simulate system or seller reply (demo)
  setTimeout(() => {
    if (messages.value.length === 1) {
      messages.value.push({
        type: 'system',
        text: 'Seller has been notified of your message.',
      })
    } else {
      messages.value.push({
        type: 'seller',
        text: `Thanks for your message! I'll reply soon.`,
      })
    }
  }, 1200)

  newMessage.value = ''

  // Auto scroll
  nextTick(() => {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  })
}

watch(messages, () => {
  nextTick(() => {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  })
})
</script>

<style scoped>
/* Smooth scrollbar and transitions */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}
</style>
