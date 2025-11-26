<template>
  <div class="h-30"></div>

  <div v-if="isNew" class="flex flex-col w-full px-[7.5%]">
    <ItemDetailAdd />
  </div>

  <div v-else class="flex flex-col gap-5">
    <div class="flex flex-row w-full px-[7.5%] gap-5">
      <ItemDetail
        title="Max Verstappen Suit SUIT SUIT SUIT SUIT SUIT SUIT SUITSUI TUSI TUSITU SITU SITU SITU SIUT SIUT SITU"
        price="12342"
        description="Lorem ipsum dolor aolsdkhfj ajkdsghskjldgh sdkjlfghasd lökf hafkljawehflöadshgsldkfh aökshf klasdfh kalsdfhaskl dfhaksld"
        :seller="{
          name: 'Maximus Verstappus',
          verified: true,
          image:
            'https://tse3.mm.bing.net/th/id/OIP.vcjzhWLCN7-VOC95HeBsJAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        }"
        :images="[
          'https://picsum.photos/600/400?random=1',
          'https://picsum.photos/600/400?random=2',
          'https://picsum.photos/600/400?random=6',
          'https://picsum.photos/600/400?random=4',
          'https://picsum.photos/600/400?random=5',
          'https://picsum.photos/600/400?random=3',
        ]"
      />
    </div>

    <div class="flex flex-row w-full px-[7.5%] gap-5" id="chat-section">
      <ItemChat :is-seller="false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ItemDetail from '../components/ItemDetail.vue'
import ItemDetailAdd from '../components/ItemAdd.vue'
import ItemChat from '../components/ItemChat.vue'
import { computed } from 'vue'

const route = useRoute()

const isNew = computed(() => route.path === '/items/new')
</script>
