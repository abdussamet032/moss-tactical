<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">Hoş geldin, {{ user?.email }}</span>
            <button
              @click="handleSignOut"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- İstatistikler -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Toplam Sipariş</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ userStats?.total_orders || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Değerlendirme</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ userStats?.total_reviews || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5L17 8a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h2.5" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Sepet Ürünleri</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ userStats?.cart_items || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white shadow">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Profil Sekmesi -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Profil Bilgileri</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">E-posta</label>
                  <p class="mt-1 text-sm text-gray-900">{{ user?.email }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Ad Soyad</label>
                  <p class="mt-1 text-sm text-gray-900">{{ user?.user_metadata?.full_name || 'Belirtilmemiş' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Telefon</label>
                  <p class="mt-1 text-sm text-gray-900">{{ user?.user_metadata?.phone || 'Belirtilmemiş' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Kayıt Tarihi</label>
                  <p class="mt-1 text-sm text-gray-900">{{ formatDate(user?.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Siparişler Sekmesi -->
          <div v-if="activeTab === 'orders'" class="space-y-4">
            <div v-if="orders.length === 0" class="text-center py-12">
              <div class="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Henüz sipariş yok</h3>
              <p class="text-gray-500">Alışverişe başlamak için ürünleri keşfetmeye başlayın.</p>
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="order in orders" :key="order.id" class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="font-medium text-gray-900">Sipariş #{{ order.id?.slice(-8) }}</h4>
                    <p class="text-sm text-gray-500">{{ formatDate(order.created_at) }}</p>
                  </div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {{ order.status || 'Bekliyor' }}
                  </span>
                </div>
                <p class="text-lg font-semibold text-gray-900">{{ order.total_amount || '0' }} ₺</p>
              </div>
            </div>
          </div>

          <!-- Adresler Sekmesi -->
          <div v-if="activeTab === 'addresses'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">Adreslerim</h3>
              <button
                @click="showAddressForm = true"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Yeni Adres Ekle
              </button>
            </div>

            <div v-if="addresses.length === 0" class="text-center py-12">
              <div class="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Henüz adres yok</h3>
              <p class="text-gray-500">Hızlı teslimat için adreslerinizi ekleyin.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="address in addresses" :key="address.id" class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-gray-900">{{ address.title || 'Adres' }}</h4>
                  <button class="text-red-600 hover:text-red-800 text-sm">Sil</button>
                </div>
                <p class="text-sm text-gray-600">{{ address.address_line_1 }}</p>
                <p class="text-sm text-gray-600">{{ address.city }}, {{ address.postal_code }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Adres Ekleme Modal -->
    <div v-if="showAddressForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Yeni Adres Ekle</h3>
        <form @submit.prevent="addAddress" class="space-y-4">
          <input
            v-model="newAddress.title"
            type="text"
            placeholder="Adres başlığı (Ev, İş vb.)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <textarea
            v-model="newAddress.address_line_1"
            placeholder="Adres"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          ></textarea>
          <div class="grid grid-cols-2 gap-4">
            <input
              v-model="newAddress.city"
              type="text"
              placeholder="Şehir"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              v-model="newAddress.postal_code"
              type="text"
              placeholder="Posta Kodu"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div class="flex space-x-3 pt-4">
            <button
              type="submit"
              class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Kaydet
            </button>
            <button
              type="button"
              @click="showAddressForm = false"
              class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, signOut, supabase } = useAuth()

const activeTab = ref('profile')
const userStats = ref(null)
const orders = ref([])
const addresses = ref([])
const showAddressForm = ref(false)

const newAddress = ref({
  title: '',
  address_line_1: '',
  city: '',
  postal_code: ''
})

const tabs = [
  { id: 'profile', name: 'Profil' },
  { id: 'orders', name: 'Siparişlerim' },
  { id: 'addresses', name: 'Adreslerim' }
]

const formatDate = (dateString: string) => {
  if (!dateString) return 'Belirtilmemiş'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const handleSignOut = async () => {
  try {
    await signOut()
  } catch (error) {
    console.error('Çıkış hatası:', error)
  }
}

const loadUserStats = async () => {
  if (!user.value?.id) return
  
  try {
    const { data, error } = await supabase.rpc('get_user_stats', {
      user_uuid: user.value.id
    })
    
    if (error) throw error
    userStats.value = data
  } catch (error) {
    console.error('İstatistik yüklenirken hata:', error)
  }
}

const loadOrders = async () => {
  if (!user.value?.id) return
  
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    orders.value = data || []
  } catch (error) {
    console.error('Siparişler yüklenirken hata:', error)
  }
}

const loadAddresses = async () => {
  if (!user.value?.id) return
  
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.value.id)
    
    if (error) throw error
    addresses.value = data || []
  } catch (error) {
    console.error('Adresler yüklenirken hata:', error)
  }
}

const addAddress = async () => {
  if (!user.value?.id) return
  
  try {
    const { error } = await supabase
      .from('addresses')
      .insert({
        ...newAddress.value,
        user_id: user.value.id
      })
    
    if (error) throw error
    
    await loadAddresses()
    showAddressForm.value = false
    newAddress.value = {
      title: '',
      address_line_1: '',
      city: '',
      postal_code: ''
    }
  } catch (error) {
    console.error('Adres eklenirken hata:', error)
  }
}

// Veriler için watch
watch(user, (newUser: any) => {
  if (newUser?.id) {
    loadUserStats()
    loadOrders()
    loadAddresses()
  }
}, { immediate: true })

watch(activeTab, (tab: string) => {
  if (tab === 'orders') loadOrders()
  if (tab === 'addresses') loadAddresses()
})
</script> 