<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-300 to-gray-100">
    <div class="scene">
      <div class="card" :class="{ 'is-flipped': !isLogin }">

        <!-- LOGIN -->
        <div class="card__face card__face--front">
          <h2 class="text-3xl font-bold text-sky-600 mb-6">Login</h2>

          <form @submit.prevent="handleLogin" class="w-full">
            <input v-model="formLogin.email" type="email" placeholder="Email" class="input" />
            <p v-if="loginErrors.email" class="text-red-400 text-sm mb-2">{{ loginErrors.email }}</p>

            <div class="relative">
              <input v-model="formLogin.password" :type="showPasswordLogin ? 'text' : 'password'" placeholder="Password" class="input" />
              <button type="button" @click.prevent="showPasswordLogin = !showPasswordLogin" class="absolute right-3 top-3 text-gray-400 hover:text-white">
                <i :class="showPasswordLogin ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-outline'"></i>
              </button>
            </div>

            <p v-if="loginErrors.password" class="text-red-400 text-sm mb-2">{{ loginErrors.password }}</p>
            <p v-if="loginErrors.general" class="text-red-400 text-sm mb-2">{{ loginErrors.general }}</p>

            <button type="submit" class="w-full mt-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-md font-semibold transition">Login</button>
          </form>

          <p class="text-gray-400 mt-4">
            No account?
            <span @click="isLogin = false" class="text-sky-500 cursor-pointer hover:underline">Sign up</span>
          </p>
        </div>

        <!-- SIGNUP -->
        <div class="card__face card__face--back">
          <h2 class="text-3xl font-bold text-sky-500 mb-6">Sign Up</h2>

          <form @submit.prevent="handleSignup" class="w-full">
            <input v-model="formSignup.firstname" type="text" placeholder="First name" class="input" />
            <p v-if="signupErrors.firstname" class="text-red-400 text-sm mb-2">{{ signupErrors.firstname }}</p>

            <input v-model="formSignup.lastname" type="text" placeholder="Last name" class="input" />
            <p v-if="signupErrors.lastname" class="text-red-400 text-sm mb-2">{{ signupErrors.lastname }}</p>

            <input v-model="formSignup.email" type="email" placeholder="Email" class="input" />
            <p v-if="signupErrors.email" class="text-red-400 text-sm mb-2">{{ signupErrors.email }}</p>

            <div class="relative">
              <input v-model="formSignup.password" :type="showPasswordSignup ? 'text' : 'password'" placeholder="Password" class="input" />
              <button type="button" @click.prevent="showPasswordSignup = !showPasswordSignup" class="absolute right-3 top-3 text-gray-400 hover:text-white">
                <i :class="showPasswordSignup ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-outline'"></i>
              </button>
            </div>

            <p v-if="signupErrors.password" class="text-red-400 text-sm mb-2">{{ signupErrors.password }}</p>
            <p v-if="signupErrors.general" class="text-red-400 text-sm mb-2">{{ signupErrors.general }}</p>

            <button type="submit" class="w-full mt-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-md font-semibold transition">Sign Up</button>
          </form>

          <p class="text-gray-400 mt-4">
            Already have an account?
            <span @click="isLogin = true" class="text-sky-500 cursor-pointer hover:underline">Login</span>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth, db } from "@/firebase/firebase-client.js";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";

const router = useRouter();

const isLogin = ref(true);
const showPasswordLogin = ref(false);
const showPasswordSignup = ref(false);

const formLogin = ref({ email: "", password: "" });
const formSignup = ref({ firstname: "", lastname: "", email: "", password: "" });

const loginErrors = ref({});
const signupErrors = ref({});

async function handleLogin() {
  loginErrors.value = {};

  if (!formLogin.value.email) loginErrors.value.email = "Email required";
  if (!formLogin.value.password) loginErrors.value.password = "Password required";
  if (Object.keys(loginErrors.value).length > 0) return;

  try {
    const userCred = await signInWithEmailAndPassword(auth, formLogin.value.email, formLogin.value.password);
    await userCred.user.reload();

    if (!userCred.user.emailVerified) {
      await signOut(auth);
      loginErrors.value.general = "Please verify your email before logging in.";
      return;
    }

    await updateDoc(doc(db, "Users", userCred.user.uid), { Verified: true });

    router.push("/profile");
  } catch (err) {
    loginErrors.value.general = "Invalid login credentials";
    console.error(err);
  }
}

async function handleSignup() {
  signupErrors.value = {};

  if (!formSignup.value.firstname) signupErrors.value.firstname = "First name required";
  if (!formSignup.value.lastname) signupErrors.value.lastname = "Last name required";
  if (!formSignup.value.email) signupErrors.value.email = "Email required";
  if (!formSignup.value.password) signupErrors.value.password = "Password required";
  if (Object.keys(signupErrors.value).length > 0) return;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, formSignup.value.email, formSignup.value.password);

    await sendEmailVerification(userCred.user);

    await setDoc(doc(db, "Users", userCred.user.uid), {
      Email: formSignup.value.email,
      FirstName: formSignup.value.firstname,
      LastName: formSignup.value.lastname,
      CreatedAt: new Date(),
      Verified: false,
      Followers: 0,
      Image: "",
      Items: [],
      Reviews: []
    });

    signupErrors.value.general = "Verification email sent.";

    isLogin.value = true;
  } catch (err) {
    signupErrors.value.general = "Account could not be created";
    console.error(err);
  }
}
</script>

<style scoped>
.scene {
  width: 24rem;
  height: 27rem;
  perspective: 1200px;
  border-radius: 1rem;
}
.card {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.7s;
  border-radius: 1rem;
  background: #242b37;
}
.card.is-flipped {
  transform: rotateY(180deg);
}
.card__face {
  position: absolute;
  inset: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
}
.card__face--back {
  transform: rotateY(180deg);
}
.input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: #242b37;
  color: white;
  border-radius: 0.5rem;
  outline: none;
  border: none;
}
</style>
