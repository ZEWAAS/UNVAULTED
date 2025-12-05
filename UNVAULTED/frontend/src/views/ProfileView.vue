<template>
  <div class="pt-[120px] w-full flex justify-center">
    <div class="w-[85%] max-w-[100vw] bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-md">
      <div class="absolute top-4 right-6" v-if="isOwnProfile">
        <button @click="toggleEdit" class="px-4 py-1 button-solid">
          {{ editMode ? 'Save' : 'Edit Profile' }}
        </button>
      </div>
      <div v-if="loading" class="text-center text-gray-700">Loading...</div>
      <div v-else class="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
        <div class="relative w-40 h-40">
          <!-- Normal view -->
          <img
            v-if="!editMode"
            :src="user.Image || defaultProfile"
            class="w-40 h-40 rounded-full object-cover"
          />

          <!-- Edit mode -->
          <label
            v-else
            class="w-40 h-40 rounded-full overflow-hidden cursor-pointer border border-gray-300 flex items-center justify-center bg-gray-100"
          >
            <img
              v-if="newProfileImage || user.Image"
              :src="newProfileImage || user.Image"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-sm text-gray-600">Upload Image</span>

            <input type="file" accept="image/*" class="hidden" @change="handleProfileImage" />
          </label>
        </div>

        <div class="flex flex-col gap-6 text-center md:text-left">
          <div>
            <div class="font-bold text-2xl tracking-widest text-gray-800">
              <div v-if="editMode" class="flex gap-2">
                <input
                  v-model="editFirstName"
                  class="border p-1 rounded-lg bg-white/80 w-32"
                  placeholder="First Name"
                />
                <input
                  v-model="editLastName"
                  class="border p-1 rounded-lg bg-white/80 w-32"
                  placeholder="Last Name"
                />
              </div>
              <p v-else class="select-none">{{ user.FirstName }} {{ user.LastName }}</p>
            </div>
            <div class="flex gap-1">
              <span
                v-for="n in 5"
                :key="n"
                class="text-2xl"
                :class="n <= rating ? 'text-yellow-400' : 'text-gray-300'"
              >
                ★
              </span>
            </div>
            <p class="tracking-widest text-gray-800 text-sm select-none">
              {{ user.Reviews.length }} {{ user.Reviews.length == 1 ? 'Review' : 'Reviews' }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <p class="font-bold tracking-widest text-gray-800 select-none">About:</p>
            <div class="grid grid-cols-[auto_auto] gap-1 justify-center md:justify-start">
              <img src="@/assets/location.png" class="size-5" />
              <p class="tracking-widest text-gray-800 select-none">
                {{ user.Street || 'No data' }}
              </p>
              <img src="@/assets/follower.png" class="size-5" />
              <p class="tracking-widest text-gray-800 select-none">
                {{ user.Followers }} Followers
              </p>
              <img src="@/assets/verification.png" class="size-5" />
              <p class="tracking-widest text-gray-800 select-none">
                {{ user.Verified ? 'Verified' : 'Not Verified' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-8 border-b border-gray-300 pt-10 w-full" v-if="!loading">
        <button
          @click="activeTab = 'products'"
          :class="[
            'pb-2 font-semibold tracking-wide transition-colors',
            activeTab === 'products'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600',
          ]"
        >
          Products
        </button>
        <button
          @click="activeTab = 'reviews'"
          :class="[
            'pb-2 font-semibold tracking-wide transition-colors',
            activeTab === 'reviews'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600',
          ]"
        >
          Reviews
        </button>
      </div>

      <div class="mt-6 w-full text-center md:text-left" v-if="!loading">
        <div v-if="activeTab === 'products'">
          <div v-if="items.length > 0" class="w-full overflow-x-auto whitespace-nowrap py-4">
            <div class="flex gap-4">
              <ItemComponent
                v-for="item in items"
                :key="item.id"
                :title="item.Title"
                :price="item.Price"
                :image="item.Images?.[0] || ''"
                :seller="item.Seller"
                :likeCount="item.Likes"
                :sellType="
                  item.SellType === 0 ? 'Sell' : item.SellType === 1 ? 'Trade' : 'Sell/Trade'
                "
                :is-liked="false"
                class="shrink-0"
              />
            </div>
          </div>

          <p v-else class="text-gray-700 h-[30vh] pt-[15vh] italic text-center">No products yet.</p>
        </div>

        <div v-else>
          <div class="reviews-wrapper py-4">
            <div
              v-if="!isOwnProfile"
              class="review-card leave-review hover:scale-101 hover:shadow-lg transition duration-200"
            >
              <h1
                class="font-semibold text-2xl pl-[1rem] py-3 text-gray-800 border-b border-[var(--color-border)]"
              >
                {{ userAlreadyReviewed ? 'Edit Your Review' : 'Leave a Review' }}
              </h1>

              <div class="p-[1rem]">
                <textarea
                  v-model="newReviewText"
                  placeholder="Write your review..."
                  class="border rounded-lg p-2 w-full text-gray-700"
                  rows="3"
                ></textarea>

                <div class="flex gap-1 items-center my-2 pb-1">
                  <p class="pr-2">Rating:</p>
                  <span
                    v-for="n in 5"
                    :key="n"
                    @click="newReviewRating = n"
                    class="text-2xl cursor-pointer"
                    :class="n <= newReviewRating ? 'text-yellow-400' : 'text-gray-300'"
                  >
                    ★
                  </span>
                </div>

                <div class="flex gap-2">
                  <button @click="saveReview" class="py-2 button-solid w-full">
                    {{ userAlreadyReviewed ? 'Save Review' : 'Submit Review' }}
                  </button>

                  <button
                    v-if="userAlreadyReviewed"
                    @click="deleteReview"
                    class="py-2 px-3 w-15 button-solid"
                    style="background: var(--color-red); border-color: var(--color-red)"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#ffffff"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M10 11V17"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M14 11V17"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M4 7H20"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <p v-if="user.Reviews.length === 0" class="text-gray-700 italic text-center">
              No reviews yet.
            </p>

            <ReviewComponent
              v-for="(review, index) in user.Reviews"
              :key="index"
              :text="review.Text"
              :rating="review.Rating"
              :user="review.User"
              :createdAt="review.createdAt"
              :class="[
                'review-card transition duration-200 hover:scale-104',
                review.User?.id === loggedInUid
                  ? 'shadow-[0_1px_10px_var(--color-gold)]'
                  : 'hover:shadow-lg',
              ]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth, db } from '@/firebase/firebase-client'
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import { uploadSingleFile } from '@/scripts/cloudinary'

import ItemComponent from '../components/ItemComponent.vue'
import ReviewComponent from '@/components/ReviewComponent.vue'
import defaultProfile from '@/assets/defaultProfile.jpg'

const router = useRouter()
const route = useRoute()

const user = ref(null)
const items = ref([])
const loading = ref(true)

const editMode = ref(false)
const editFirstName = ref('')
const editLastName = ref('')

const rating = ref(0)
const activeTab = ref('products')

const newReviewRating = ref(0)
const newReviewText = ref('')

const loggedInUid = ref(null)
const profileUid = ref(null)

const newProfileImage = ref(null)

const isOwnProfile = computed(() => loggedInUid.value === profileUid.value)

const userAlreadyReviewed = computed(() => {
  if (!user.value || !loggedInUid.value) return false
  return user.value.Reviews.some((r) => r.User.id === loggedInUid.value)
})

const existingReview = computed(() => {
  if (!userAlreadyReviewed.value) return null
  return user.value.Reviews.find((r) => r.User.id === loggedInUid.value)
})

const profileImage = computed(() => {
  return user.value?.Image?.trim() ? user.value.Image : defaultProfile
})

const loadProfile = async () => {
  loading.value = true

  const currentUser = auth.currentUser
  if (!currentUser) {
    router.push('/login')
    return
  }

  loggedInUid.value = currentUser.uid
  profileUid.value = route.params.id || currentUser.uid

  const profileRef = doc(db, 'Users', profileUid.value)
  const snap = await getDoc(profileRef)

  user.value = snap.data()
  user.value.id = profileUid.value

  const itemsRef = collection(db, 'Items')
  const q = query(itemsRef, where('Seller', '==', profileRef))
  const itemSnap = await getDocs(q)
  items.value = itemSnap.docs.map((d) => ({ id: d.id, ...d.data() }))

  if (user.value.Reviews.length > 0) {
    const total = user.value.Reviews.reduce((s, r) => s + r.Rating, 0)
    rating.value = Math.round(total / user.value.Reviews.length)
  } else {
    rating.value = 0
  }

  if (userAlreadyReviewed.value) {
    newReviewText.value = existingReview.value.Text
    newReviewRating.value = existingReview.value.Rating
  } else {
    newReviewText.value = ''
    newReviewRating.value = 0
  }

  loading.value = false
}

const toggleEdit = async () => {
  if (!isOwnProfile.value) return

  if (!editMode.value) {
    editFirstName.value = user.value.FirstName
    editLastName.value = user.value.LastName
    editMode.value = true
    return
  }

  const userRef = doc(db, 'Users', loggedInUid.value)
  await updateDoc(userRef, {
    FirstName: editFirstName.value,
    LastName: editLastName.value,
    ...(newProfileImage.value && { Image: newProfileImage.value }),
  })

  user.value.FirstName = editFirstName.value
  user.value.LastName = editLastName.value
  editMode.value = false
}

const saveReview = async () => {
  const profileRef = doc(db, 'Users', profileUid.value)

  const updatedReviews = user.value.Reviews.filter((r) => r.User.id !== loggedInUid.value)

  updatedReviews.push({
    Text: newReviewText.value,
    Rating: newReviewRating.value,
    User: doc(db, 'Users', loggedInUid.value),
    createdAt: Timestamp.now(),
  })

  await updateDoc(profileRef, { Reviews: updatedReviews })

  user.value.Reviews = updatedReviews
}

const deleteReview = async () => {
  const profileRef = doc(db, 'Users', profileUid.value)

  const remaining = user.value.Reviews.filter((r) => r.User.id !== loggedInUid.value)

  await updateDoc(profileRef, { Reviews: remaining })
  user.value.Reviews = remaining

  newReviewRating.value = 0
  newReviewText.value = ''
}

onMounted(loadProfile)

// Watch route param to reload profile when navigating to other profile
watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await loadProfile()
    }
  },
)

//Profile Image Handling
const handleProfileImage = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  try {
    const url = await uploadSingleFile(file, 'profile_pictures')
    newProfileImage.value = url
    user.value.Image = url
  } catch (err) {
    console.error('Upload failed:', err)
    alert('Upload failed!')
  }
}
</script>

<style scoped>
.reviews-wrapper {
  column-count: 3;
  column-gap: 1rem;
  padding-right: 10px;
}

.review-card {
  break-inside: avoid;
  margin-bottom: 1rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  display: inline-block;
  width: 100%;
}

.leave-review {
  background: white;
}
@media (max-width: 768px) {
  .reviews-wrapper {
    column-count: 1;
  }
}
</style>
