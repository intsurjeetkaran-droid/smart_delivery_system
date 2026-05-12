import api from '../utils/api'

class NotificationService {
  async send(data: { email: string; subject: string; message: string }) {
    const res = await api.post('/notifications/send', data)
    return res.data
  }
}

export default new NotificationService()
