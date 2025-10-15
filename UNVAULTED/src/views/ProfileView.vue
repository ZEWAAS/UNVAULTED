<template>
    <nav
        class="fixed top-[15vh] left-1/2 transform -translate-x-1/2 w-[90%] max-w-[100vw] bg-white/60 backdrop-blur-md flex items-center px-6 py-3 gap-4"
    >
        
    <img :src="props.user.image" alt="Profile Icon" class="profile-icon size-60 rounded-full aspect-square" />
    <div class="flex flex-col gap-10">
    <div class="flex flex-col">
            <p class="font-bold text-xl tracking-widest text-gray-800 select-none">{{ props.user.name }}</p>
            <p class="tracking-widest text-gray-800 select-none">{{ props.user.reviews }}&nbsp;Reviews</p>
        </div>
    <div class="flex flex-col gap-2">
    <p class="font-bold tracking-widest text-gray-800 select-none">About:</p>     
    <div class="grid grid-cols-[auto_auto] gap-1 ">
            <img src="@/assets/location.png" class="size-5"></img>
            <p class="tracking-widest text-gray-800 select-none">{{ props.user.street }}</p>
            <img src="@/assets/follower.png" class="size-5"></img>
            <p class="tracking-widest text-gray-800 select-none">{{ props.user.followers }}</p>
            <img src="@/assets/verification.png" class="size-5"></img>
            <p class="tracking-widest text-gray-800 select-none">{{ props.user.verification_status }}</p>
        </div>
    </div>
    </div>
    </nav>
</template>

<script setup>

const props = defineProps({
    user: {
        type: Object,
        required: true,
        default: () => ({
            name: 'Max Verstappen',
            reviews: [{rating: 5, text: 'Great seller! Fast shipping and item as described.',user:"asdkjl3ujhnbkjl"}],
            street: 'GEO LOCATION',
            followers: ["asdlkfjlsnlhjl","asdflkjbnelkjhl"],
            verified: true,
            image: 'https://tse3.mm.bing.net/th/id/OIP.vcjzhWLCN7-VOC95HeBsJAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
        })
    }
})

</script>