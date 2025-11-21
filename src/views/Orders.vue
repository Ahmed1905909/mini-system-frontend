<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import Navigation from '../components/Navigation.vue'

const authStore = useAuthStore()
const orders = ref([])
const products = ref([])
const selectedOrder = ref(null)
const showViewModal = ref(false)
const showCreateModal = ref(false)

const orderForm = ref({
  address: '',
  phone: '',
  items: []
})

const fetchOrders = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/orders', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    orders.value = response.data
  } catch (e) {
    console.error(e)
  }
}

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/products')
    products.value = response.data.map(p => ({ ...p, selectedQty: 0 }))
  } catch (e) {
    console.error(e)
  }
}

const viewOrder = (order) => {
  selectedOrder.value = order
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedOrder.value = null
}

const openCreateModal = () => {
  orderForm.value = {
    address: '',
    phone: '',
    items: []
  }
  products.value.forEach(p => p.selectedQty = 0)
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const orderTotal = computed(() => {
  return products.value.reduce((total, product) => {
    return total + (product.price * product.selectedQty)
  }, 0).toFixed(2)
})

const createOrder = async () => {
  const selectedItems = products.value
    .filter(p => p.selectedQty > 0)
    .map(p => ({ id: p.id, qty: p.selectedQty }))
  
  if (selectedItems.length === 0) {
    alert('Please select at least one product')
    return
  }
  
  if (!orderForm.value.address || !orderForm.value.phone) {
    alert('Please fill in address and phone number')
    return
  }
  
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/orders', {
      address: orderForm.value.address,
      phone: orderForm.value.phone,
      items: selectedItems
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    
    // Explicitly clear cart (reset all selected quantities)
    products.value.forEach(p => p.selectedQty = 0)
    
    // Reset form
    orderForm.value = {
      address: '',
      phone: '',
      items: []
    }
    
    closeCreateModal()
    fetchOrders()
    fetchProducts() // Refresh to get updated stock
    
    // Show success message with order details
    const orderInfo = response.data
    alert(`Order created successfully!\nOrder #${orderInfo.order_id}\nTotal: $${parseFloat(orderInfo.total).toFixed(2)}\nItems: ${orderInfo.items_count}`)
  } catch (e) {
    console.error(e)
    const errorMsg = e.response?.data?.message || 'Failed to create order'
    alert(errorMsg)
  }
}

onMounted(() => {
  fetchOrders()
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
            Orders
          </h1>
          <p class="text-gray-600">View and manage all your orders</p>
        </div>
        <button 
          @click="openCreateModal" 
          class="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create Order</span>
        </button>
      </div>
      
      <!-- Orders Table -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Address
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total
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
                v-for="order in orders" 
                :key="order.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-semibold text-gray-900">#{{ order.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate">{{ order.address }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">${{ parseFloat(order.total).toFixed(2) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="viewOrder(order)" 
                    class="inline-flex items-center px-4 py-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </td>
              </tr>
              <tr v-if="orders.length === 0">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p class="text-gray-500 text-lg font-medium">No orders yet</p>
                    <p class="text-gray-400 text-sm mt-1">Create your first order to get started</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- View Order Modal -->
    <Transition name="modal">
      <div v-if="showViewModal" class="fixed z-50 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay - transparent -->
          <div class="fixed inset-0 bg-transparent z-40" @click="closeViewModal"></div>
          
          <!-- Modal panel -->
          <div class="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50 border border-gray-200" @click.stop>
            <div class="bg-white px-6 pt-6 pb-4 sm:p-8">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-gray-900">Order Details #{{ selectedOrder?.id }}</h3>
                <button 
                  @click="closeViewModal" 
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="p-4 bg-gray-50 rounded-xl">
                    <p class="text-xs font-semibold text-gray-500 uppercase mb-1">Total</p>
                    <p class="text-2xl font-bold text-gray-900">${{ selectedOrder?.total ? parseFloat(selectedOrder.total).toFixed(2) : '0.00' }}</p>
                  </div>
                  <div class="p-4 bg-gray-50 rounded-xl">
                    <p class="text-xs font-semibold text-gray-500 uppercase mb-1">Status</p>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                      {{ selectedOrder?.status }}
                    </span>
                  </div>
                </div>
                
                <div class="space-y-3 pt-4 border-t border-gray-200">
                  <div>
                    <p class="text-xs font-semibold text-gray-500 uppercase mb-1">Delivery Address</p>
                    <p class="text-sm text-gray-900">{{ selectedOrder?.address }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-500 uppercase mb-1">Phone Number</p>
                    <p class="text-sm text-gray-900">{{ selectedOrder?.phone }}</p>
                  </div>
                </div>
                
                <div class="pt-4 border-t border-gray-200">
                  <h4 class="text-sm font-semibold text-gray-900 mb-3">Order Items</h4>
                  <div class="space-y-2">
                    <div 
                      v-for="item in selectedOrder?.items" 
                      :key="item.id" 
                      class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">
                          {{ item.product ? item.product.name : 'Unknown Product' }}
                        </p>
                        <p class="text-xs text-gray-500">Quantity: {{ item.quantity }}</p>
                      </div>
                      <p class="text-sm font-semibold text-gray-900">
                        ${{ (item.price * item.quantity).toFixed(2) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                @click="closeViewModal" 
                class="w-full sm:w-auto inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-base font-semibold text-white transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Create Order Modal -->
    <Transition name="modal">
      <div v-if="showCreateModal" class="fixed z-50 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay - transparent -->
          <div class="fixed inset-0 bg-transparent z-40" @click="closeCreateModal"></div>
          
          <!-- Modal panel -->
          <div class="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full z-50 border border-gray-200" @click.stop>
            <div class="bg-white px-6 pt-6 pb-4 sm:p-8">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-gray-900">Create New Order</h3>
                <button 
                  @click="closeCreateModal" 
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form @submit.prevent="createOrder" class="space-y-6">
                <!-- Product Selection -->
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 mb-4">Select Products</h4>
                  
                  <!-- Show message if no products available -->
                  <div v-if="products.filter(p => p.stock > 0).length === 0" class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                    <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p class="text-gray-500 font-medium">No products available</p>
                    <p class="text-sm text-gray-400 mt-1">All items are currently out of stock.</p>
                  </div>
                  
                  <!-- Show only in-stock products -->
                  <div v-else class="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div 
                      v-for="product in products.filter(p => p.stock > 0)" 
                      :key="product.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                    >
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <p class="font-semibold text-gray-900">{{ product.name }}</p>
                          <span v-if="product.stock < 10" class="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Only {{ product.stock }} left
                          </span>
                        </div>
                        <p class="text-sm text-gray-500">${{ parseFloat(product.price).toFixed(2) }} • Available: {{ product.stock }}</p>
                      </div>
                      <input 
                        v-model.number="product.selectedQty" 
                        type="number" 
                        min="0" 
                        :max="product.stock"
                        class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-center font-medium"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div class="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-semibold text-gray-700">Order Total:</span>
                      <span class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ${{ orderTotal }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Delivery Information -->
                <div class="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                    <input 
                      v-model="orderForm.address" 
                      type="text" 
                      required 
                      placeholder="Enter delivery address"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" 
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input 
                      v-model="orderForm.phone" 
                      type="tel" 
                      required 
                      placeholder="Enter phone number"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" 
                    />
                  </div>
                </div>

                <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button 
                    type="button" 
                    @click="closeCreateModal" 
                    class="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Place Order
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
