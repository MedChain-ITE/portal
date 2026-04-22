import BaseService from '../BaseService.js'

let instance = null
class AdminLogService extends BaseService {
  constructor() {
    super('hospital')
  }

  static getInstance() {
    if (!instance) {
      instance = new AdminLogService()
    }
    return instance
  }


  async index(payload = {}) {
    const filteredParams = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value != null),
    )
    const queryParams = new URLSearchParams(filteredParams).toString()

    return await this._get(`${this._prefix}/generate`, {})
  }

  //getPatient by input token (post)
  async get(req) {
    return await this._post(`${this._prefix}/get-patient`, req)
  }


}

export default AdminLogService
