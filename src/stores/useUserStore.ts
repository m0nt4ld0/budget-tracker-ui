import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    token: '',
  }),
  actions: {
    login(username: string, token: string) {
      this.username = username
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
    },
    logout() {
      this.username = ''
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    },
    loadFromStorage() {
      const token = localStorage.getItem('token')
      const username = localStorage.getItem('username')
      if (token && username) {
        this.token = token
        this.username = username
      }
    }
  }
})
