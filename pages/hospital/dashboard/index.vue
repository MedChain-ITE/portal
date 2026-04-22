<script setup>
import { ref } from 'vue'
import {
  Document,
  List,
  Money,
  Timer,
  CircleCheck,
  Calendar,
  TrendCharts,
  DocumentRemove,
} from '@element-plus/icons-vue'

definePageMeta({
  layout: 'hospital',
  middleware: ['authenticated', 'dashboard-redirect-global'],
})

import { useDashboardStore } from '~/store/dashboard.js'

const now = new Date()

const { value: user } = useCookie('user')
const apiResponse = ref({})
const loading = ref(false)

const dashboardStore = useDashboardStore()
const { getDashboard } = dashboardStore

const fetchData = async (page = 1) => {
  loading.value = true
  try {
    const response = await getDashboard({ page: page })
    apiResponse.value = response
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl font-bold">System Dashboard</h1>
    <p class="text-gray-500">Overview of system statistics</p>
  </div>

  <!-- Summary Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

    <!-- Patients -->
    <el-card shadow="hover">
      <div class="flex items-center">
        <el-icon class="text-blue-500 text-xl mr-3">
          <User />
        </el-icon>
        <div>
          <p class="text-sm text-gray-500">Total Patients</p>
          <p class="text-2xl font-bold">
            {{ apiResponse.total_patients || 0 }}
          </p>
        </div>
      </div>
    </el-card>

    <!-- Hospitals -->
    <el-card shadow="hover">
      <div class="flex items-center">
        <el-icon class="text-green-500 text-xl mr-3">
          <OfficeBuilding />
        </el-icon>
        <div>
          <p class="text-sm text-gray-500">Total Hospitals</p>
          <p class="text-2xl font-bold">
            {{ apiResponse.total_hospitals || 0 }}
          </p>
        </div>
      </div>
    </el-card>

    <!-- Admins -->
    <el-card shadow="hover">
      <div class="flex items-center">
        <el-icon class="text-purple-500 text-xl mr-3">
          <Avatar />
        </el-icon>
        <div>
          <p class="text-sm text-gray-500">Total Admins</p>
          <p class="text-2xl font-bold">
            {{ apiResponse.total_admins || 0 }}
          </p>
        </div>
      </div>
    </el-card>
  </div>

  <!-- Graph Data Section -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

    <!-- Patient Graph -->
    <el-card shadow="hover">
      <h2 class="font-bold mb-4">Patient Growth</h2>

      <el-table
        :data="apiResponse.patient_graph_data || []"
        style="width: 100%"
      >
        <el-table-column prop="date" label="Date" />
        <el-table-column prop="count" label="Patients" />
      </el-table>

      <el-empty
        v-if="!apiResponse.patient_graph_data?.length"
        description="No data"
      />
    </el-card>

    <!-- Hospital Graph -->
    <el-card shadow="hover">
      <h2 class="font-bold mb-4">Hospital Growth</h2>

      <el-table
        :data="apiResponse.hospital_graph_data || []"
        style="width: 100%"
      >
        <el-table-column prop="date" label="Date" />
        <el-table-column prop="count" label="Hospitals" />
      </el-table>

      <el-empty
        v-if="!apiResponse.hospital_graph_data?.length"
        description="No data"
      />
    </el-card>

  </div>
</template>

<style scoped></style>
