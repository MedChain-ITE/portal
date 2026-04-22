<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminHospitalManagementStore } from '~/store/admin/admin_hospital_management.js'

definePageMeta({
  layout: 'admin',
})

const router = useRouter()
const Store = useAdminHospitalManagementStore()
const { store } = Store

// ================= FORM =================
const formRef = ref()

const form = ref({
  name: '',
  address: '',
  phone: '',
  image: null,

  license_number: '',
  license_issue_date: '',
  license_expiry_date: '',
  license_issuing_authority: '',
  license_document: null,
})

// ================= VALIDATION =================
const rules = {
  name: [{ required: true, message: 'Hospital name required', trigger: 'blur' }],
  address: [{ required: true, message: 'Address required', trigger: 'blur' }],
  phone: [{ required: true, message: 'Phone required', trigger: 'blur' }],
}

// ================= IMAGE =================
const imagePreview = ref(null)
const licensePreview = ref(null)

const handleImageChange = (file) => {
  form.value.image = file.raw
  imagePreview.value = URL.createObjectURL(file.raw)
}

const handleLicenseChange = (file) => {
  form.value.license_document = file.raw
  licensePreview.value = URL.createObjectURL(file.raw)
}

// ================= BUILD FORM DATA =================
const buildFormData = () => {
  const payload = new FormData()

  Object.keys(form.value).forEach((key) => {
    let value = form.value[key]

    if (
      (key === 'license_issue_date' || key === 'license_expiry_date') &&
      value
    ) {
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

      ElNotification({
        title: 'Success',
        message: 'Hospital created successfully',
        type: 'success',
      })

      router.push('/admin/hospital-management')

    } catch (error) {
      console.error(error)
      ElNotification({
        title: 'Error',
        message: 'Failed to create hospital',
        type: 'error',
      })
    }
  })
}

// ================= ACTIONS =================
const cancel = () => router.back()
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Create Hospital</h1>
      <el-button @click="cancel">Back</el-button>
    </div>

    <el-card>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="200px">

        <!-- BASIC INFO -->
        <el-form-item label="Hospital Name" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="Address" prop="address">
          <el-input v-model="form.address" />
        </el-form-item>

        <el-form-item label="Phone" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>

        <el-form-item label="Hospital Image">
          <el-upload :auto-upload="false" :on-change="handleImageChange" :limit="1">
            <el-button>Select Image</el-button>
          </el-upload>

          <img v-if="imagePreview" :src="imagePreview" class="w-24 h-24 mt-3 rounded" />
        </el-form-item>

        <el-divider>License Information</el-divider>

        <!-- LICENSE -->
        <el-form-item label="License Number">
          <el-input v-model="form.license_number" />
        </el-form-item>

        <el-form-item label="Issue Date">
          <el-date-picker v-model="form.license_issue_date" type="date" style="width: 100%" />
        </el-form-item>

        <el-form-item label="Expiry Date">
          <el-date-picker v-model="form.license_expiry_date" type="date" style="width: 100%" />
        </el-form-item>

        <el-form-item label="Issuing Authority">
          <el-input v-model="form.license_issuing_authority" />
        </el-form-item>

        <el-form-item label="License Document">
          <el-upload :auto-upload="false" :on-change="handleLicenseChange" :limit="1">
            <el-button>Select Document</el-button>
          </el-upload>

          <img v-if="licensePreview" :src="licensePreview" class="w-32 mt-3 rounded" />
        </el-form-item>

        <!-- ACTION -->
        <el-form-item>
          <el-button type="primary" @click="submitForm">
            Create Hospital
          </el-button>
          <el-button @click="cancel">Cancel</el-button>
        </el-form-item>

      </el-form>
    </el-card>

  </div>
</template>
