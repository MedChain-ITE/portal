<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminPatientManagementStore } from '~/store/admin/admin_patient_management.js'
import QRCode from 'qrcode'

definePageMeta({
  layout: 'admin',
})

const router = useRouter()
const Store = useAdminPatientManagementStore()
const { store } = Store

// ================= FORM =================
const formRef = ref()

const form = ref({
  first_name: '',
  last_name: '',
  nid: '',
  gender: '',
  height: '',
  weight: '',
  birth_date: '',
  phone: '',
  place_of_birth: '',
  emergency_name: '',
  emergency_relationship: '',
  emergency_contact: '',
  image: null,
})

// ================= VALIDATION =================
const rules = {
  first_name: [{ required: true, message: 'First name required', trigger: 'blur' }],
  last_name: [{ required: true, message: 'Last name required', trigger: 'blur' }],
  gender: [{ required: true, message: 'Gender required', trigger: 'change' }],
  phone: [{ required: true, message: 'Phone required', trigger: 'blur' }],
  nid: [{ required: true, message: 'NID required', trigger: 'blur' }],
}

// ================= IMAGE =================
const preview = ref(null)

const handleImageChange = (file) => {
  form.value.image = file.raw
  preview.value = URL.createObjectURL(file.raw)
}

// ================= RESULT =================
const resultDialogVisible = ref(false)
const createdResult = ref(null)
const qrCodeUrl = ref('')

// ================= QR FIX (IMPORTANT) =================
watch(createdResult, async (val) => {
  if (val?.claim_token) {
    try {
      qrCodeUrl.value = await QRCode.toDataURL(val.claim_token)
    } catch (err) {
      console.error('QR error:', err)
    }
  }
})

// ================= BUILD FORM DATA =================
const buildFormData = () => {
  const payload = new FormData()

  Object.keys(form.value).forEach((key) => {
    let value = form.value[key]

    if (key === 'birth_date' && value) {
      value = new Date(value).toISOString().split('T')[0]
    }

    if (value !== null && value !== '') {
      payload.append(key, value)
    }
  })

  return payload
}

// ================= SUBMIT =================
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      const payload = buildFormData()

      const res = await store(payload)

      console.log('Create response:', res)
      // ⚠️ IMPORTANT: adjust depending on your API
      createdResult.value = res

      resultDialogVisible.value = true

      ElNotification({
        title: 'Success',
        message: 'Patient created successfully',
        type: 'success',
      })

    } catch (error) {
      console.error(error)
      ElNotification({
        title: 'Error',
        message: 'Failed to create patient',
        type: 'error',
      })
    }
  })
}

// ================= ACTIONS =================
const cancel = () => router.back()
const goToList = () => router.push('/admin/patient')

const copyToken = (token) => {
  navigator.clipboard.writeText(token)
  ElNotification({
    title: 'Copied',
    message: 'Token copied',
    type: 'success',
  })
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Create Patient</h1>
      <el-button @click="cancel">Back</el-button>
    </div>

    <!-- FORM -->
    <el-card>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="180px">

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="First Name" prop="first_name">
              <el-input v-model="form.first_name" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Last Name" prop="last_name">
              <el-input v-model="form.last_name" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Gender" prop="gender">
          <el-select v-model="form.gender">
            <el-option label="Male" value="male" />
            <el-option label="Female" value="female" />
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Height (cm)">
              <el-input v-model="form.height" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Weight (kg)">
              <el-input v-model="form.weight" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Birth Date">
          <el-date-picker v-model="form.birth_date" type="date" style="width: 100%" />
        </el-form-item>

        <el-form-item label="NID" prop="nid">
          <el-input v-model="form.nid" />
        </el-form-item>

        <el-form-item label="Phone" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>

        <el-form-item label="Place of Birth">
          <el-input v-model="form.place_of_birth" />
        </el-form-item>

        <el-divider>Emergency Contact</el-divider>

        <el-form-item label="Name">
          <el-input v-model="form.emergency_name" />
        </el-form-item>

        <el-form-item label="Relationship">
          <el-input v-model="form.emergency_relationship" />
        </el-form-item>

        <el-form-item label="Contact">
          <el-input v-model="form.emergency_contact" />
        </el-form-item>

        <el-form-item label="Profile Image">
          <el-upload :auto-upload="false" :on-change="handleImageChange" :limit="1">
            <el-button>Select Image</el-button>
          </el-upload>

          <img v-if="preview" :src="preview" class="w-24 h-24 rounded-full mt-3" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">
            Create Patient
          </el-button>
          <el-button @click="cancel">Cancel</el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <!-- RESULT DIALOG -->
    <el-dialog
      v-model="resultDialogVisible"
      title="Patient Created"
      width="500px"
      :close-on-click-modal="false"
    >
      <div v-if="createdResult" class="text-center">

        <el-alert
          title="Scan this QR code"
          type="warning"
          show-icon
          class="mb-4"
        />

        <!-- QR DISPLAY (FIXED) -->
        <div class="flex justify-center mb-4">
          <img
            v-if="qrCodeUrl"
            :src="qrCodeUrl"
            alt="QR Code"
            class="w-48 h-48 border rounded-lg"
          />

          <div v-else class="text-gray-400 text-sm">
            Generating QR...
          </div>
        </div>

        <!-- TOKEN -->
        <div class="mb-4">
          <p class="text-xs text-gray-500">Claim Token</p>
          <div class="flex justify-between items-center bg-gray-100 p-2 rounded">
            <span class="text-xs break-all">
              {{ createdResult.claim_token }}
            </span>
            <el-button size="small" @click="copyToken(createdResult.claim_token)">
              Copy
            </el-button>
          </div>
        </div>

        <el-divider />

        <!-- USER -->
        <div class="text-sm text-left space-y-2">
          <p><b>Name:</b> {{ createdResult.user.first_name }} {{ createdResult.user.last_name }}</p>
          <p><b>Phone:</b> {{ createdResult.user.phone }}</p>
          <p><b>NID:</b> {{ createdResult.user.nid }}</p>
          <p><b>Status:</b> {{ Active }}</p>
          <p><b>Expires In:</b> {{ createdResult.expires_in }} seconds</p>
        </div>

      </div>

      <template #footer>
        <el-button @click="resultDialogVisible = false">Close</el-button>
        <el-button type="primary" @click="goToList">Go to List</el-button>
      </template>
    </el-dialog>

  </div>
</template>
