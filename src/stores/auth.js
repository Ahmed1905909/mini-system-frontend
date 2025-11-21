import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
    }),
    actions: {
        async login(email, password) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/auth/login', { email, password })
                console.log('Login response:', response.data)
                this.token = response.data.access_token
                localStorage.setItem('token', this.token)
                console.log('Token saved:', this.token)
                await this.fetchUser()
            } catch (error) {
                console.error('Login error:', error.response?.data)
                throw error
            }
        },
        async register(name, email, password) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/auth/register', { name, email, password })
                console.log('Register response:', response.data)
                this.token = response.data.authorization.token
                localStorage.setItem('token', this.token)
                console.log('Token saved:', this.token)
                this.user = response.data.user
            } catch (error) {
                console.error('Register error:', error.response?.data)
                throw error
            }
        },
        async fetchUser() {
            if (!this.token) return
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/auth/me', {
                    headers: { Authorization: `Bearer ${this.token}` }
                })
                this.user = response.data
            } catch (error) {
                this.logout()
            }
        },
        logout() {
            this.token = null
            this.user = null
            localStorage.removeItem('token')
        }
    }
})
