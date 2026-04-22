<script setup>
import { ref, computed, onMounted } from 'vue'
import { View, Search } from '@element-plus/icons-vue'
import { useAdminHospitalManagementStore } from '~/store/admin/admin_hospital_management.js'

definePageMeta({
  layout: 'admin',
})

const store = useAdminHospitalManagementStore()
const { index } = store

// ================= STATE =================
const hospitals = ref([])
const loading = ref(false)

const currentPage = ref(1)
const perPage = ref(10)
const total = ref(0)

const searchQuery = ref('')

const detailModalVisible = ref(false)
const selectedHospital = ref(null)

// ================= FETCH =================
const fetchHospitals = async (page = 1) => {
  loading.value = true
  try {
    const res = await index({
      page,
      per_page: perPage.value,
      search: searchQuery.value
    })

    const data = res.data

    // 🔥 IMPORTANT CHANGE
    hospitals.value = data
    currentPage.value = data.current_page
    perPage.value = data.per_page
    total.value = data.total

  } catch (e) {
    console.error(e)
    ElNotification({
      title: 'Error',
      message: 'Failed to fetch hospitals',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

// ================= SUMMARY =================
const summary = computed(() => {
  return {
    total: hospitals.value.length
  }
})

// ================= ACTIONS =================
const handleSearch = () => {
  currentPage.value = 1
  fetchHospitals()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchHospitals(page)
}

const showDetails = (hospital) => {
  selectedHospital.value = hospital
  detailModalVisible.value = true
}

// ================= INIT =================
onMounted(() => {
  fetchHospitals()
})
</script>

<template>
  <div class="p-6">

    <!-- HEADER -->
    <div class="flex justify-between mb-6 items-center">
      <h1 class="text-2xl font-bold">Hospital Management</h1>

      <div class="flex items-center gap-3">
        <!-- Create Button -->
        <el-button
          type="primary"
          icon="Plus"
          @click="navigateTo('/admin/hospital-management/create')"
        >
          Create Hospital
        </el-button>

        <!-- Search -->
        <el-input
          v-model="searchQuery"
          placeholder="Search phone..."
          clearable
          @keyup.enter="handleSearch"
          @clear="handleSearch"
          style="width: 250px"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
      </div>
    </div>

    <!-- SUMMARY -->
    <div class="grid grid-cols-1 mb-6">
      <el-card>
        <div class="flex justify-between">
          <span>Total Hospitals</span>
          <strong>{{ summary.total }}</strong>
        </div>
      </el-card>
    </div>

    <!-- TABLE -->
    <el-card>
      <el-table :data="hospitals" v-loading="loading">

        <el-table-column prop="id" label="ID" width="80" />

        <el-table-column prop="name" label="Hospital Name" />

        <el-table-column prop="phone" label="Phone" />

        <el-table-column prop="address" label="Address" />

        <el-table-column label="License Number">
          <template #default="{ row }">
            {{ row.license?.license_number || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="Expiry Date">
          <template #default="{ row }">
            {{ row.license?.expiry_date || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="120">
          <template #default="{ row }">
            <el-button
              size="small"
              :icon="View"
              circle
              @click="showDetails(row)"
            />
          </template>
        </el-table-column>

      </el-table>

      <!-- PAGINATION -->
      <div class="flex justify-center mt-6">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="perPage"
          :total="total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- MODAL -->
    <el-dialog v-model="detailModalVisible" title="Hospital Details" width="500px">
      <div v-if="selectedHospital">

        <p><strong>Name:</strong> {{ selectedHospital.name }}</p>
        <p><strong>Phone:</strong> {{ selectedHospital.phone }}</p>
        <p><strong>Address:</strong> {{ selectedHospital.address }}</p>
        <p><strong>MedChain ID:</strong> {{ selectedHospital.medchain_id }}</p>

        <hr class="my-3" />

        <p><strong>License Number:</strong> {{ selectedHospital.license?.license_number }}</p>
        <p><strong>Issue Date:</strong> {{ selectedHospital.license?.issue_date }}</p>
        <p><strong>Expiry Date:</strong> {{ selectedHospital.license?.expiry_date }}</p>
        <p><strong>Authority:</strong> {{ selectedHospital.license?.issuing_authority }}</p>

      </div>

      <template #footer>
        <el-button @click="detailModalVisible = false">Close</el-button>
      </template>
    </el-dialog>

  </div>
</template>
