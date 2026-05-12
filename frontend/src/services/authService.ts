import api from '../utils/api'
import { API_ENDPOINTS } from '../utils/constants'

// TODO: Implement AuthService class with authentication methods
class AuthService {
  async login(email: string, password: string) {
    // TODO: Implement login API call
  }

  async register(userData: {
    name: string
    email: string
    password: string
    role: string
  }) {
    // TODO: Implement register API call
  }

  async getProfile() {
    // TODO: Implement get profile API call
  }

  async updateProfile(userData: any) {
    // TODO: Implement update profile API call
  }
}

export default new AuthService()