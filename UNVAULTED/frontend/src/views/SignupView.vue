<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700">
    <div class="scene">
      <div
        class="card"
        :class="{ 'is-flipped': !isLogin }"
      >
        <!-- FRONT (Login) -->
        <div class="card__face card__face--front">
          <h2 class="text-3xl font-bold text-sky-400 mb-6">Login</h2>

          <form @submit.prevent="handleLogin" class="w-full">
            <input v-model="formLogin.username" type="text" placeholder="Username" class="input" />
            <p v-if="loginErrors.username" class="text-red-400 text-sm mb-2">{{ loginErrors.username }}</p>

            <div class="relative">
              <input v-model="formLogin.password" :type="showPassword ? 'text' : 'password'" placeholder="Password" class="input" />
              <button type="button" @click.prevent="showPassword = !showPassword" class="absolute right-3 top-3 text-gray-400 hover:text-white">
                <i :class="showPassword ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-outline'"></i>
              </button>
            </div>

            <p v-if="loginErrors.password" class="text-red-400 text-sm mb-2">{{ loginErrors.password }}</p>

            <button type="submit" class="w-full mt-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-md font-semibold transition">Login</button>
          </form>

          <p class="text-gray-400 mt-4">
            No account?
            <span @click="isLogin = false" class="text-sky-400 cursor-pointer hover:underline">Sign up</span>
          </p>
        </div>

        <!-- BACK (Signup) -->
        <div class="card__face card__face--back">
          <h2 class="text-3xl font-bold text-sky-400 mb-6">Sign Up</h2>

          <form @submit.prevent="handleSignup" class="w-full">
            <input v-model="formSignup.username" type="text" placeholder="Username" class="input" />
            <p v-if="signupErrors.username" class="text-red-400 text-sm mb-2">{{ signupErrors.username }}</p>

            <input v-model="formSignup.email" type="email" placeholder="Email" class="input" />
            <p v-if="signupErrors.email" class="text-red-400 text-sm mb-2">{{ signupErrors.email }}</p>

            <input v-model="formSignup.password" type="password" placeholder="Password" class="input" />
            <p v-if="signupErrors.password" class="text-red-400 text-sm mb-2">{{ signupErrors.password }}</p>

            <button type="submit" class="w-full mt-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-md font-semibold transition">Sign Up</button>
          </form>

          <p class="text-gray-400 mt-4">
            Already have an account?
            <span @click="isLogin = true" class="text-sky-400 cursor-pointer hover:underline">Login</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isLogin = ref(true);
const showPassword = ref(false);

const formLogin = ref({ username: "", password: "" });
const formSignup = ref({ username: "", email: "", password: "" });
const loginErrors = ref({});
const signupErrors = ref({});

function handleLogin() {
  console.log("Login:", formLogin.value);
}
function handleSignup() {
  console.log("Signup:", formSignup.value);
}
</script>

<style scoped>
/* Scene / Perspective */
.scene {
  width: 24rem; /* w-96 */
  height: 30rem; /* ungefähr dein h-[480px] */
  perspective: 1200px;
  border-radius: 1rem;
  overflow: visible;
  position: relative;
}

/* Card that flips */
.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.7s;
  border-radius: 1rem;
  background: #0f1724; /* dunkel */
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

/* Flip when not login */
.card.is-flipped {
  transform: rotateY(180deg);
}

/* Faces */
.card__face {
  position: absolute;
  inset: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden; /* Safari */
  border-radius: 1rem;
  transform-origin: center;
}

/* Front shows normally */
.card__face--front {
  transform: rotateY(0deg);
  pointer-events: auto; /* default */
}

/* Back is rotated so when parent rotates it faces front */
.card__face--back {
  transform: rotateY(180deg);
  pointer-events: none; /* nicht klickbar solange versteckt */
}

/* Wenn Karte geflippt ist, soll die Back-Face klickbar und Front nicht */
.card.is-flipped .card__face--back {
  pointer-events: auto;
}
.card.is-flipped .card__face--front {
  pointer-events: none;
}

/* Kleine Utility-Klasse für Inputs (ersetzt deine langen Tailwind-Klassen) */
.input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: #0f1724cc; /* leicht transparenteres Feld */
  color: white;
  border-radius: 0.5rem;
  outline: none;
  border: none;
}

/* Kleines Styling für Buttons etc. kannst du weiterhin mit Tailwind machen */
</style>
