<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import Navigation from '../components/Navigation.vue'

const authStore = useAuthStore()
const stats = ref({
  products: 0,
  orders: 0
})

const fetchStats = async () => {
  try {
    const productsRes = await axios.get('http://127.0.0.1:8000/api/products', {
        headers: { Authorization: `Bearer ${authStore.token}` }
    })
    stats.value.products = productsRes.data.length

    const ordersRes = await axios.get('http://127.0.0.1:8000/api/orders', {
        headers: { Authorization: `Bearer ${authStore.token}` }
    })
    stats.value.orders = ordersRes.data.length
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
    <Navigation />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p class="text-gray-600">Welcome back! Here's an overview of your business.</p>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <!-- Products Card -->
        <div class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative p-8">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-4">
                <div class="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Products</p>
                  <p class="text-4xl font-bold text-gray-900 mt-1">{{ stats.products }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>Active inventory</span>
            </div>
          </div>
        </div>

        <!-- Orders Card -->
        <div class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative p-8">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-4">
                <div class="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Orders</p>
                  <p class="text-4xl font-bold text-gray-900 mt-1">{{ stats.orders }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <span>All time orders</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-10">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <router-link
            to="/products"
            class="group flex items-center space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-indigo-200"
          >
            <div class="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Add Product</h3>
              <p class="text-sm text-gray-500">Create a new product</p>
            </div>
          </router-link>

          <router-link
            to="/orders"
            class="group flex items-center space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-purple-200"
          >
            <div class="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Create Order</h3>
              <p class="text-sm text-gray-500">Place a new order</p>
            </div>
          </router-link>

          <router-link
            to="/products"
            class="group flex items-center space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-gray-300"
          >
            <div class="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">View Products</h3>
              <p class="text-sm text-gray-500">Manage inventory</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
