<script setup>
import { useAuthStore } from '~/store/auth.js'

definePageMeta({
  layout: 'admin',
})

const authStore = useAuthStore()
const { logout } = authStore

const userLogout = async () => {
  // try {
  //   await logout()
  //   navigateTo('/login')
  // } catch (error) {
  //   ElMessage.error('Logout failed. Please try again.')
  // }
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4"
  >
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6">
      <h1 class="text-2xl font-bold text-center text-gray-800">Admin Dashboard</h1>
      <p class="text-center text-gray-600">Welcome to the admin dashboard. Here you can manage your application.</p>
    </div>
  </div>
</template>

<style scoped>
/* You can add custom styles here if needed */
</style>
