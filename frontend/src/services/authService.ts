import api from '../utils/api'

class AuthService {
  async login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password })
    return res.data
  }

  async register(userData: { name: string; email: string; password: string; role: string }) {
    const res = await api.post('/auth/register', userData)
    return res.data
  }

  async getProfile() {
    const res = await api.get('/auth/profile')
    return res.data
  }
}

export default new AuthService()
