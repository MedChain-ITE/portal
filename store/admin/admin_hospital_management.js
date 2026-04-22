import { defineStore } from 'pinia'
import AdminHospitalManagementService from '~/services/Admin/AdminHospitalManagementService.js'

export const useAdminHospitalManagementStore = defineStore('admin_user_managements', () => {
  const requestLoan = ref({})
  const adminPatientManagementService = AdminHospitalManagementService.getInstance()

  const index = async (params) => {
    try {
      const { data } = await adminPatientManagementService.index(params)
      requestLoan.value = data || {}
      return data
    } catch (error) {
      ElMessage.error(error.message || 'Get Loan failed')
      throw new Error(`Get Loan failed: ${error.message || 'Unknown error'}`)
    }
  }

  //store
  const store = async (payload) => {
    try {
      const { data } = await adminPatientManagementService.store(payload)
      requestLoan.value = data || {}
      return data
    } catch (error) {
      ElMessage.error(error.message || 'Get Loan failed')
      throw new Error(`Get Loan failed: ${error.message || 'Unknown error'}`)
    }
  }

  return {
    RequestLoan: computed(() => requestLoan.value),
    index,
    store
  }
})
