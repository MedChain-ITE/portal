<script setup>
import { ref, computed, onMounted } from 'vue'
import { View, Search, Check, Close, User } from '@element-plus/icons-vue'
import { useAdminPatientManagementStore } from '~/store/admin/admin_patient_management.js'

definePageMeta({
  layout: 'admin',
})

const store = useAdminPatientManagementStore()
const { index, status: updateUserStatus } = store

// ================= STATE =================
const users = ref([])
const loading = ref(false)

const currentPage = ref(1)
const perPage = ref(10)
const total = ref(0)

const searchQuery = ref('')

const detailModalVisible = ref(false)
const selectedUser = ref(null)

// ================= FETCH =================
const fetchUsers = async (page = 1) => {
  loading.value = true
  try {
    const res = await index({
      page,
      per_page: perPage.value,
      search: searchQuery.value
    })

    const data = res.data

    console.log('Fetched users:', data)

    users.value = data
    currentPage.value = data.current_page
    perPage.value = data.per_page
    total.value = data.total

  } catch (e) {
    console.error(e)
    ElNotification({
      title: 'Error',
      message: 'Failed to fetch users',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

// ================= STATUS =================
const getStatus = (status) => {
  return status === 1
    ? { text: 'Active', type: 'success' }
    : { text: 'Inactive', type: 'danger' }
}

const confirmStatusChange = (user) => {
  const isActive = user.status === 1
  const action = isActive ? 'Deactivate' : 'Activate'

  ElMessageBox.confirm(
    `Are you sure you want to ${action.toLowerCase()} this account?`,
    `${action} Account`,
    {
      confirmButtonText: action,
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(() => {
    updateStatus(user.id, isActive ? 0 : 1)
  })
}

const updateStatus = async (id, status) => {
  try {
    const { value: password } = await ElMessageBox.prompt(
      'Enter your password to confirm',
      'Confirmation',
      {
        inputType: 'password',
        inputPattern: /\S+/,
        inputErrorMessage: 'Password is required',
      }
    )

    await updateUserStatus(id, { status, password })

    ElNotification({
      title: 'Success',
      message: 'Status updated',
      type: 'success',
    })

    fetchUsers(currentPage.value)

  } catch (e) {
    ElNotification({
      title: 'Error',
      message: 'Update failed',
      type: 'error',
    })
  }
}

// ================= SUMMARY =================
const summary = computed(() => {
  const active = users.value.filter(u => u.status === 1).length
  const inactive = users.value.filter(u => u.status !== 1).length

  return {
    active,
    inactive,
    total: users.value.length
  }
})

// ================= ACTIONS =================
const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchUsers(page)
}

const showDetails = (user) => {
  selectedUser.value = user
  detailModalVisible.value = true
}

// ================= INIT =================
onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="p-6">

    <!-- HEADER -->
    <div class="flex justify-between mb-6 items-center">
      <h1 class="text-2xl font-bold">Patient Management</h1>

      <div class="flex items-center gap-3">
        <!-- Create Button -->
        <el-button
          type="primary"
          icon="Plus"
          @click="navigateTo('/admin/patient-management/create')"
        >
          Create Patient
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
    <div class="grid grid-cols-3 gap-4 mb-6">
      <el-card>
        <div class="flex justify-between">
          <span>Active</span>
          <strong>{{ summary.active }}</strong>
        </div>
      </el-card>

      <el-card>
        <div class="flex justify-between">
          <span>Inactive</span>
          <strong>{{ summary.inactive }}</strong>
        </div>
      </el-card>

      <el-card>
        <div class="flex justify-between">
          <span>Total</span>
          <strong>{{ summary.total }}</strong>
        </div>
      </el-card>
    </div>

    <!-- TABLE -->
    <el-card>
      <el-table :data="users" v-loading="loading">

        <el-table-column prop="id" label="ID" width="80" />

        <el-table-column label="Name">
          <template #default="{ row }">
            {{ row.first_name }} {{ row.last_name }}
          </template>
        </el-table-column>

        <el-table-column prop="phone" label="Phone" />

        <el-table-column prop="nid" label="NID" />

        <el-table-column label="Status">
          <template #default="{ row }">
            <el-tag :type="getStatus(row.status).type">
              {{ getStatus(row.status).text }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="140">
          <template #default="{ row }">
            <el-button
              size="small"
              :icon="View"
              circle
              @click="showDetails(row)"
            />

            <el-button
              size="small"
              :icon="row.status === 1 ? Close : Check"
              :type="row.status === 1 ? 'danger' : 'success'"
              circle
              @click="confirmStatusChange(row)"
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
    <el-dialog v-model="detailModalVisible" title="User Details" width="500px">
      <div v-if="selectedUser">
        <p><strong>Name:</strong> {{ selectedUser.first_name }} {{ selectedUser.last_name }}</p>
        <p><strong>Phone:</strong> {{ selectedUser.phone }}</p>
        <p><strong>NID:</strong> {{ selectedUser.nid }}</p>
        <p><strong>Status:</strong> {{ getStatus(selectedUser.status).text }}</p>
      </div>

      <template #footer>
        <el-button @click="detailModalVisible = false">Close</el-button>
      </template>
    </el-dialog>

  </div>
</template>
