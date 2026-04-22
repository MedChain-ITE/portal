import { defineStore } from 'pinia'
import HospitalGenerateService from '~/services/Hospital/HospitalGenerateService.js'

export const useHospitalGenerateStore = defineStore('admin_logs', () => {
  const hospitalGenerateService = HospitalGenerateService.getInstance()

  const index = async (params) => {
    try {
      const { data } = await hospitalGenerateService.index(params)
      return data
    } catch (error) {
      ElMessage.error(error.message || 'Get Log failed')
      throw new Error(`Get Log failed: ${error.message || 'Unknown error'}`)
    }
  }

  //getPatient (get)
  const get = async (payload) => {
    try {
      const { data } = await hospitalGenerateService.get(payload)
      return data
    } catch (error) {
      ElMessage.error(error.message || 'Get Patient failed')
      throw new Error(`Get Patient failed: ${error.message || 'Unknown error'}`)
    }
  }

  return {
    index,
    get
  }
})
