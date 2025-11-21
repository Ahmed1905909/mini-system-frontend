<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import Navigation from '../components/Navigation.vue'

const authStore = useAuthStore()
const products = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const form = ref({
  id: null,
  name: '',
  description: '',
  price: '',
  stock: ''
})

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/products', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    products.value = response.data
  } catch (e) {
    console.error(e)
  }
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = { id: null, name: '', description: '', price: '', stock: '' }
  showModal.value = true
}

const openEditModal = (product) => {
  isEditing.value = true
  form.value = { ...product }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveProduct = async () => {
  try {
    const headers = { Authorization: `Bearer ${authStore.token}` }
    if (isEditing.value) {
      await axios.put(`http://127.0.0.1:8000/api/products/${form.value.id}`, form.value, { headers })
    } else {
      await axios.post('http://127.0.0.1:8000/api/products', form.value, { headers })
    }
    closeModal()
    fetchProducts()
  } catch (e) {
    console.error('Error details:', e.response?.data)
    const errorMsg = e.response?.data?.message || e.response?.data?.error || 'Failed to save product'
    alert(errorMsg)
  }
}

const deleteProduct = async (id) => {
  if (!confirm('Are you sure?')) return
  try {
    await axios.delete(`http://127.0.0.1:8000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    fetchProducts()
  } catch (e) {
    console.error(e)
    alert('Failed to delete product')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
    <Navigation />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-2">
            Products
          </h1>
          <p class="text-gray-600">Manage your product inventory</p>
        </div>
        <button 
          @click="openCreateModal" 
          class="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Product</span>
        </button>
      </div>

      <!-- Products Grid/Table -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="product in products" 
                :key="product.id" 
                class="hover:bg-gray-50 transition-colors duration-150"
                :class="{'bg-red-50/50': product.out_of_stock}"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-semibold text-gray-900">{{ product.name }}</div>
                      <div v-if="product.description" class="text-sm text-gray-500 truncate max-w-xs">{{ product.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">${{ parseFloat(product.price).toFixed(2) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ product.stock }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    v-if="product.out_of_stock" 
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800"
                  >
                    Out of Stock
                  </span>
                  <span 
                    v-else-if="product.stock < 10" 
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800"
                  >
                    Low Stock
                  </span>
                  <span 
                    v-else 
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"
                  >
                    In Stock
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-3">
                    <button 
                      @click="openEditModal(product)" 
                      class="inline-flex items-center px-3 py-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button 
                      @click="deleteProduct(product.id)" 
                      class="inline-flex items-center px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p class="text-gray-500 text-lg font-medium">No products yet</p>
                    <p class="text-gray-400 text-sm mt-1">Get started by adding your first product</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed z-50 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay - transparent -->
          <div class="fixed inset-0 bg-transparent z-40" @click="closeModal"></div>
          
          <!-- Modal panel -->
          <div class="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50 border border-gray-200" @click.stop>
            <div class="bg-white px-6 pt-6 pb-4 sm:p-8">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-gray-900">
                  {{ isEditing ? 'Edit Product' : 'Add New Product' }}
                </h3>
                <button 
                  @click="closeModal" 
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form @submit.prevent="saveProduct" class="space-y-5">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                  <input 
                    v-model="form.name" 
                    type="text" 
                    required 
                    placeholder="Enter product name"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" 
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea 
                    v-model="form.description" 
                    rows="3"
                    placeholder="Enter product description"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  ></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                    <input 
                      v-model="form.price" 
                      type="number" 
                      step="0.01" 
                      required 
                      placeholder="0.00"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" 
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                    <input 
                      v-model="form.stock" 
                      type="number" 
                      required 
                      placeholder="0"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" 
                    />
                  </div>
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    @click="closeModal" 
                    class="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {{ isEditing ? 'Update' : 'Create' }} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.modal-enter-active {
  transition: opacity 0.3s ease;
}

.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
