<script setup>
import { useAuthStore } from '~/store/auth.js'
import { ref } from 'vue'

definePageMeta({
  layout: 'auth',
  middleware: ['redirect-if-authenticated']
})

useSeoMeta({
  title: 'MedChain | Login',
  description: 'Get approved for fast, secure loans up to $1000 with competitive rates. Apply online in minutes with MedChain.'
})


const authStore = useAuthStore()
const { login } = authStore

const email = ref('')
const password = ref('')

const googleLoginUrl = () => {
  window.location.href = `https://api.jorngka.online/auth/google`
}

const handleLogin = async () => {
  try {
    // await login({ email: email.value, password: password.value })
    navigateTo('/admin/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<template>
  <div class="relative w-full h-screen bg-home flex items-center justify-center">
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <div class="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg animate-slide-up z-10">
      <h1 class="text-3xl font-bold text-center mb-4">Welcome Back Admin</h1>
      <p class="text-center text-gray-500 mb-6">Login to your system</p>
      <div class="flex justify-between items-center mt-1">
        <el-button type="primary" class="w-full h-10 rounded-lg" @click="navigateTo('/admin/dashboard')">Login</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-in-out;
}

.animate-slide-up {
  animation: slide-up 0.5s ease-in-out;
}

.bg-home {
  background: url('@/assets/image/home.png') no-repeat center center;
  background-size: cover;
}
</style>
