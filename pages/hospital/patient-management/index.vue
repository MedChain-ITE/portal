<script setup>
import { ref } from 'vue'
import QRCode from 'qrcode'
import { useHospitalGenerateStore } from '~/store/hospital/hospital_generate.js'

definePageMeta({
  layout: 'hospital',
})

const { index, get } = useHospitalGenerateStore()

const token = ref('')
const qrCodeUrl = ref('')
const loading = ref(false)
const patient = ref(null)

// ================= GENERATE QR =================
const generateQR = async () => {
  if (!token.value) return
  qrCodeUrl.value = await QRCode.toDataURL(token.value)
}

// ================= FETCH TOKEN =================
const fetchTokenQR = async () => {
  try {
    loading.value = true

    // reset
    token.value = ''
    qrCodeUrl.value = ''
    patient.value = null

    const res = await index()

    token.value = res.token

    await generateQR()

  } catch (error) {
    console.error(error)
    ElNotification({
      title: 'Error',
      message: 'Failed to generate QR',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}
const copyToken = async () => {
  if (!token.value) return

  try {
    // ✅ Try modern clipboard API
    await navigator.clipboard.writeText(token.value)

    ElNotification({
      title: 'Copied',
      message: 'Token copied to clipboard',
      type: 'success',
    })

  } catch (err) {
    // 🔥 Fallback for older browsers / HTTP
    try {
      const textarea = document.createElement('textarea')
      textarea.value = token.value
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)

      textarea.focus()
      textarea.select()

      document.execCommand('copy')

      document.body.removeChild(textarea)

      ElNotification({
        title: 'Copied',
        message: 'Token copied (fallback)',
        type: 'success',
      })

    } catch (e) {
      console.error('Copy failed:', e)

      ElNotification({
        title: 'Error',
        message: 'Copy failed. Please copy manually.',
        type: 'error',
      })
    }
  }
}
// ================= MANUAL CHECK =================
const checkScan = async () => {
  if (!token.value) return

  try {
    loading.value = true

    const res = await get({ qr_token: token.value })

    if (res) {
      patient.value = res

      ElNotification({
        title: 'Success',
        message: 'Patient scanned successfully',
        type: 'success',
      })
    } else {
      ElNotification({
        title: 'Waiting',
        message: 'Patient has not scanned yet',
        type: 'warning',
      })
    }

  } catch (error) {
    console.error(error)
    ElNotification({
      title: 'Error',
      message: 'Failed to check scan',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <el-card class="w-full max-w-md text-center">

      <!-- ================= BEFORE SCAN ================= -->
      <template v-if="!patient">

        <h1 class="text-xl font-bold mb-2">Patient QR Code</h1>
        <p class="text-gray-500 text-sm mb-4">
          Generate QR → patient scans → click check
        </p>

        <!-- GENERATE -->
        <el-button
          type="primary"
          :loading="loading"
          class="mb-4 w-full"
          @click="fetchTokenQR"
        >
          Generate QR Code
        </el-button>

        <!-- QR -->
        <div class="flex justify-center mb-4">
          <img
            v-if="qrCodeUrl"
            :src="qrCodeUrl"
            class="w-64 h-64 border rounded-lg shadow"
          />
          <div v-else class="text-gray-400">No QR generated</div>
        </div>

        <!-- TOKEN -->
        <div
          v-if="token"
          class="bg-gray-100 p-2 rounded text-xs break-all mb-3"
        >
          {{ token }}
        </div>

        <el-button
          v-if="token"
          size="small"
          class="mb-4"
          @click="copyToken"
        >
          Copy Token
        </el-button>

        <!-- CHECK -->
        <el-button
          v-if="token"
          type="success"
          :loading="loading"
          class="mb-4 w-full"
          @click="checkScan"
        >
          Check Scan
        </el-button>

        <!-- WAITING -->
        <div v-if="token" class="text-yellow-600 text-sm">
          ⏳ Waiting for patient to scan...
        </div>

      </template>

      <!-- ================= AFTER SCAN (SUCCESS STATE) ================= -->
      <template v-else>

        <!-- SUCCESS ICON -->
        <div class="flex justify-center mb-3">
          <div class="w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
            <span class="text-2xl text-green-600">✔</span>
          </div>
        </div>

        <h2 class="text-xl font-bold text-green-600 mb-2">
          Patient Connected
        </h2>

        <p class="text-gray-500 text-sm mb-4">
          QR successfully scanned and approved
        </p>

        <!-- PATIENT CARD -->
        <el-card class="text-left mb-4 shadow-sm">

          <div class="flex items-center gap-3 mb-3">
            <img
              v-if="patient.user?.patient?.image"
              :src="patient.user.patient.image"
              class="w-14 h-14 rounded-full border"
            />
            <div>
              <p class="font-semibold">
                {{ patient.user.patient.first_name }}
                {{ patient.user.patient.last_name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ patient.user.patient.medchain_id }}
              </p>
            </div>
          </div>

          <div class="text-sm space-y-1">
            <p><b>Phone:</b> {{ patient.user.phone }}</p>
            <p><b>NID:</b> {{ patient.user.nid }}</p>
            <p><b>Gender:</b> {{ patient.user.patient.gender }}</p>
            <p><b>Birth:</b> {{ patient.user.patient.birth_date }}</p>
          </div>

        </el-card>

        <!-- APPROVED TIME -->
        <p class="text-xs text-gray-400 mb-4">
          Approved at: {{ patient.approved_at }}
        </p>

        <!-- ACTION -->
        <el-button
          type="primary"
          class="w-full"
          @click="fetchTokenQR"
        >
          Scan Another Patient
        </el-button>

      </template>

    </el-card>
  </div>
</template>
