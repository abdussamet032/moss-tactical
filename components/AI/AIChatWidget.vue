<!-- context7: ai-chat-widget-modern @mcps=7 -->
<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Modern Chat Trigger Button -->
    <Transition name="chat-trigger">
      <button 
        v-if="!isChatOpen"
        @click="toggleChat"
        class="bg-gradient-to-br from-primary to-primary-hover text-white rounded-2xl w-20 h-20 flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 group relative overflow-hidden backdrop-blur-sm"
        :class="{ 'animate-pulse': hasNewMessage }"
      >
        <!-- Glassmorphism effect -->
        <div class="absolute inset-0 bg-white/10 rounded-2xl"></div>
        
        <ChatBubbleLeftEllipsisIcon class="w-10 h-10 relative z-10 group-hover:scale-110 transition-transform duration-200" />
        
        <!-- Unread badge -->
        <span 
          v-if="unreadCount > 0" 
          class="absolute -top-3 -right-3 bg-accent text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-bounce"
        >
          {{ unreadCount }}
        </span>
        
        <!-- Animated ring -->
        <div class="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-ping"></div>
      </button>
    </Transition>

    <!-- Modern Chat Window -->
    <Transition name="chat-window">
      <div 
        v-if="isChatOpen"
        class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-[420px] h-[600px] flex flex-col overflow-hidden border border-neutral-200/50"
      >
                 <!-- Modern Header -->
         <div class="bg-gradient-to-r from-primary via-primary-hover to-primary text-white p-4 relative overflow-hidden">
          <!-- Animated background pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
          </div>
          
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <CpuChipIcon class="w-7 h-7" />
            </div>
            <div>
                <h3 class="font-bold text-xl">AI Asistan</h3>
                <div class="flex items-center space-x-2 mt-1">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse" v-if="isConnected"></div>
              <p class="text-sm opacity-90" v-if="isConnected">Çevrimiçi</p>
              <p class="text-sm opacity-75" v-else>Bağlanıyor...</p>
                </div>
            </div>
          </div>
          <button 
            @click="toggleChat"
              class="hover:bg-white/20 rounded-2xl p-3 transition-all duration-200 hover:scale-110"
          >
              <XMarkIcon class="w-6 h-6" />
          </button>
          </div>
        </div>

        <!-- Chat Messages with better spacing -->
        <div 
          ref="messagesContainer"
          class="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-neutral-50 to-white"
          style="flex: 2;"
        >
          <!-- Welcome message -->
          <div v-if="chatHistory.length === 0" class="text-center py-8">
            <div class="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <CpuChipIcon class="w-8 h-8 text-primary" />
            </div>
            <h4 class="text-lg font-semibold text-neutral-800 mb-2">Merhaba! 👋</h4>
            <p class="text-neutral-600 text-sm leading-relaxed">
              Size nasıl yardımcı olabilirim? Ürün önerileri, sipariş durumu veya genel sorularınız için buradayım.
            </p>
          </div>

          <div 
            v-for="message in chatHistory" 
            :key="message.id"
            class="flex"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <!-- AI Message -->
            <div 
              v-if="message.role === 'assistant'"
              class="flex items-start space-x-3 max-w-[85%] group"
            >
              <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                <CpuChipIcon class="w-5 h-5 text-white" />
              </div>
              <div class="bg-white rounded-3xl rounded-tl-lg p-3 shadow-lg border border-neutral-100 group-hover:shadow-xl transition-all duration-200 w-full">
                <div class="text-neutral-800 text-xs leading-relaxed" v-html="formatMessageWithLinks(message.content)"></div>
                <!-- Ürün Kartları (sadece products varsa) -->
                <div v-if="getMessageProducts(message).length > 0" class="mt-4">
                  <div class="flex items-center space-x-2 mb-3 pb-2 border-b border-neutral-200/50">
                    <div class="w-6 h-6 bg-gradient-to-br from-accent to-orange-600 rounded-full flex items-center justify-center">
                      <ShoppingCartIcon class="w-3.5 h-3.5 text-white" />
                    </div>
                    <span class="text-sm font-semibold text-neutral-700">Önerilen Ürünler</span>
                    <span class="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {{ getMessageProducts(message).length }} ürün
                    </span>
                  </div>
                  <div class="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    <div v-for="product in getMessageProducts(message)" :key="product.id" class="min-w-[160px] max-w-[180px] w-full bg-neutral-50 border border-neutral-200 rounded-xl shadow hover:shadow-lg transition-all duration-200 flex flex-col items-center p-2">
                      <img :src="product.images?.[0] || '/logo.png'" :alt="product.name" class="w-20 h-20 object-cover rounded-lg mb-2" />
                      <div class="text-xs font-semibold text-neutral-800 text-center line-clamp-2 mb-1">{{ product.name }}</div>
                      <div class="text-sm font-bold text-accent mb-2">₺{{ product.price }}</div>
                      <div class="flex gap-1 w-full">
                        <button @click.prevent="() => viewProduct(product)" class="flex-1 bg-primary text-white text-xs rounded-lg py-1 px-2 hover:bg-primary-hover transition-all">İncele</button>
                        <button @click.prevent="() => addToCart(product)" :disabled="isAddingToCart" class="flex-1 bg-accent text-white text-xs rounded-lg py-1 px-2 hover:bg-orange-600 transition-all disabled:bg-neutral-300">{{ isAddingToCart ? 'Ekleniyor...' : 'Sepete Ekle' }}</button>
                      </div>
                    </div>
                  </div>
                </div>
                <span class="text-xs text-neutral-500 mt-2 block">
                  {{ formatTime(message.timestamp) }}
                </span>
              </div>
            </div>

            <!-- User Message -->
            <div 
              v-else-if="message.role === 'user'"
              class="flex items-start space-x-3 max-w-[85%] group"
            >
                             <div class="bg-gradient-to-br from-primary to-primary-hover rounded-3xl rounded-tr-lg p-3 text-white shadow-lg group-hover:shadow-xl transition-all duration-200">
                <p class="text-xs leading-relaxed">{{ message.content }}</p>
                <span class="text-xs opacity-75 mt-2 block">
                  {{ formatTime(message.timestamp) }}
                </span>
              </div>
              <div class="w-10 h-10 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                <UserIcon class="w-5 h-5 text-neutral-700" />
              </div>
            </div>
          </div>

          <!-- Modern Typing Indicator -->
          <div v-if="isLoading" class="flex items-start space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center shadow-md">
              <CpuChipIcon class="w-5 h-5 text-white" />
            </div>
                         <div class="bg-white rounded-3xl rounded-tl-lg p-3 shadow-lg border border-neutral-100">
              <div class="flex space-x-2">
                <div class="w-3 h-3 bg-primary/60 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-3 h-3 bg-primary/60 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-3 h-3 bg-primary/60 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
            </div>
          </div>
        </div>

                 

                 <!-- Compact Quick Actions -->
         <div v-if="quickActions.length > 0" class="px-4 pb-2">
          <div class="flex items-center space-x-1 mb-2">
            <div class="w-0.5 h-3 bg-primary rounded-full"></div>
            <p class="text-xs font-medium text-neutral-600">Hızlı Eylemler</p>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button 
              v-for="action in quickActions" 
              :key="action"
              @click="sendQuickMessage(action)"
              class="text-xs bg-neutral-100 hover:bg-primary/10 hover:text-primary px-3 py-1.5 rounded-lg transition-all duration-200 border border-neutral-200/50 hover:border-primary/30"
            >
              {{ action }}
            </button>
          </div>
        </div>

                 <!-- Modern Message Input -->
         <div class="p-4 border-t border-neutral-200/50 bg-white/80 backdrop-blur-sm">
          <div class="flex space-x-3">
            <div class="flex-1 relative">
            <input 
              v-model="currentMessage"
              @keypress.enter="sendMessage"
              type="text"
              placeholder="Mesajınızı yazın..."
                                 class="w-full border-2 border-neutral-200 hover:border-primary/30 focus:border-primary rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-neutral-500"
              :disabled="isLoading"
            />
              <!-- Input focus indicator -->
              <div class="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 transition-opacity duration-200 pointer-events-none"></div>
            </div>
            <button 
              @click="sendMessage"
              :disabled="!currentMessage.trim() || isLoading"
                             class="bg-gradient-to-br from-primary to-primary-hover hover:from-primary-hover hover:to-primary disabled:from-neutral-300 disabled:to-neutral-300 text-white rounded-2xl p-3 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:hover:scale-100"
            >
              <PaperAirplaneIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modern Toast Notifications -->
    <BaseToast 
      v-if="showToast"
      :message="toastMessage"
      :type="toastType"
      @close="showToast = false"
    />
  </div>
</template>

<script setup lang="ts">
/* context7: ai-chat-widget-enhanced-logic @mcps=7 */
import { ChatBubbleLeftEllipsisIcon, CpuChipIcon, UserIcon, PaperAirplaneIcon, EyeIcon, ShoppingCartIcon } from '@heroicons/vue/20/solid'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import BaseProductCard from '~/components/Base/BaseProductCard.vue'

// Gerekli composable'ları import et
const { addToCart: addToCartComposable } = useCart()
const router = useRouter()

interface ChatWidgetProps {
  defaultOpen?: boolean
}

const props = defineProps<ChatWidgetProps>()

// Chat state
const isChatOpen = ref(props.defaultOpen)
const currentMessage = ref('')
const unreadCount = ref(0)
const hasNewMessage = ref(false)

const quickActions = ref(['Kamp ürünleri', 'Bot önerileri', 'Sipariş durumu', 'İade işlemi'])

// Sepet ve toast state
const isAddingToCart = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// AI Chat composable'ını kullan
const { 
  chatHistory, 
  isLoading, 
  isConnected, 
  sendMessage: sendAIMessage, 
  clearChat 
} = useAIChat()

// Sepet composable'ı yukarıda import edildi

const messagesContainer = ref<HTMLElement>()

// Chat'i aç/kapat
const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
  if (isChatOpen.value) {
    unreadCount.value = 0
    hasNewMessage.value = false
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// Mesaj gönder
const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return
  
  const message = currentMessage.value.trim()
  currentMessage.value = ''
  
  try {
    const response = await sendAIMessage(message)
    
    // Hızlı aksiyonları güncelle
    if (response.suggestions && response.suggestions.length > 0) {
      quickActions.value = response.suggestions
    }
    
    nextTick(() => {
      scrollToBottom()
    })
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error)
    showToastMessage('Mesaj gönderilemedi. Lütfen tekrar deneyin.', 'error')
  }
}

// Hızlı mesaj gönder
const sendQuickMessage = (action: string) => {
  currentMessage.value = action
  sendMessage()
}

// Ürünü görüntüle - Debug log ile
const viewProduct = (product: any) => {
  console.log('Ürün görüntüleniyor:', product)
  
  if (!product.slug) {
    console.error('Ürün slug bulunamadı:', product)
    showToastMessage('❌ Ürün detay sayfası bulunamadı', 'error')
    return
  }
  
  try {
    router.push(`/products/${product.slug}`)
  } catch (error) {
    console.error('Navigasyon hatası:', error)
    showToastMessage('❌ Ürün sayfasına gidilemedi', 'error')
  }
}

// Sepete ekle - Debug log ile
const addToCart = async (product: any) => {
  if (isAddingToCart.value) return
  
  console.log('Sepete ekleniyor:', product)
  
  if (!product.id || !product.name) {
    console.error('Ürün bilgileri eksik:', product)
    showToastMessage('❌ Ürün bilgileri eksik', 'error')
    return
  }
  
  isAddingToCart.value = true
  
  try {
    // Ürün verisini useCart için uygun formata çevir
    const cartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images?.[0] || '/logo.png' // images array'inin ilk elemanı
    }
    
    console.log('Cart product:', cartProduct)
    
    // useCart composable'ından addToCart fonksiyonunu çağır
    const success = addToCartComposable(cartProduct, 1)
    console.log('Sepete ekleme sonucu:', success)
    
    if (success) {
      // Toast bildirim göster
      showToastMessage(`🛒 ${product.name} sepete eklendi!`, 'success')
    } else {
      showToastMessage('❌ Ürün sepete eklenemedi. Lütfen tekrar deneyin.', 'error')
    }
    
  } catch (error) {
    console.error('Sepete ekleme hatası:', error)
    showToastMessage('❌ Ürün sepete eklenemedi. Lütfen tekrar deneyin.', 'error')
  } finally {
    setTimeout(() => {
    isAddingToCart.value = false
    }, 800) // Daha uzun süre göster
  }
}

// Toast bildirim göster
const showToastMessage = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  // 3 saniye sonra otomatik kapat
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Mesaj konteynerini en alta kaydır
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Zaman formatla
const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Mesajdaki linkleri formatla
const formatMessageWithLinks = (content: string) => {
  // Markdown link formatını HTML link'e çevir: [text](/path) -> <a href="/path">text</a>
  return content
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-primary-hover underline font-medium cursor-pointer" onclick="window.location.href=\'$2\'">$1</a>')
    .replace(/\n/g, '<br>')
}

// Mesajdaki ürünleri güvenli şekilde al
const getMessageProducts = (message: any) => {
  const products = message?.products || []
  console.log('Message products:', products) // Debug log
  return products
}

// Component mount edildiğinde chat geçmişini temizle
onMounted(() => {
  console.log('🚀 AI Chat Widget mounted!')
  console.log('useCart composable:', { addToCartComposable })
  console.log('Router:', router)
  
  // İlk açılışta hoş geldin mesajını göster
  quickActions.value = [
    'Popüler ürünler',
    'Yeni ürünler',
    'Kamp malzemeleri',
    'Bot çeşitleri'
  ]
})

// Chat mesajları değiştiğinde scroll yap
watch(chatHistory, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })
</script>

<style scoped>
/* Chat trigger animation */
.chat-trigger-enter-active,
.chat-trigger-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-trigger-enter-from,
.chat-trigger-leave-to {
  opacity: 0;
  transform: scale(0) rotate(180deg);
}

/* Chat window animation */
.chat-window-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-window-leave-active {
  transition: all 0.2s ease-in;
}

.chat-window-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.chat-window-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Modern custom scrollbar for product suggestions */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #475D3A, #3E5233);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #3E5233, #475D3A);
}

/* Modern glassmorphism effects */
.backdrop-blur-xl {
  backdrop-filter: blur(16px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Enhanced animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.group:hover .group-hover\:animate-float {
  animation: float 2s ease-in-out infinite;
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(135deg, #475D3A, #C47B2A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Modern shadow effects */
.shadow-glass {
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    0 0 0 1px rgba(255, 255, 255, 0.18);
}

/* Pulse animation for connection status */
@keyframes pulse-green {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-green {
  animation: pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style> 