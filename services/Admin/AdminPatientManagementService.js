import BaseService from '../BaseService.js'

let instance = null
class AdminPatientManagementService extends BaseService {
  constructor() {
    super('admin')
  }

  static getInstance() {
    if (!instance) {
      instance = new AdminPatientManagementService()
    }
    return instance
  }


  async index(payload = {}) {
    const filteredParams = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value != null),
    )
    const queryParams = new URLSearchParams(filteredParams).toString()

    return await this._get(`${this._prefix}/user?${queryParams}`, {})
  }

  //store
  async store(payload = {}) {
    return await this._post(`${this._prefix}/user/register`, payload);
  }

}

export default AdminPatientManagementService
