/* context7: ai-chat-assistant-enhanced @mcps=7 */

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  products?: Product[] // Ürünleri mesaja ekle
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string
  short_description: string
  category?: string
}

interface AIResponse {
  message: string
  suggestions?: string[]
  products?: Product[]
  action?: 'search' | 'recommend' | 'help' | 'order_status' | 'category'
}

export const useAIChat = () => {
  const chatHistory = ref<ChatMessage[]>([])
  const isLoading = ref(false)
  const isConnected = ref(false)
  
  // Server-side API kullanımı için config'e gerek yok

  // Chat geçmişini initialize et
  const initializeChat = () => {
    if (chatHistory.value.length === 0) {
      chatHistory.value.push({
        id: generateId(),
        role: 'assistant',
        content: '👋 Merhaba! Moss Tactical AI asistanıyım. Sizin için özel ürün önerileri yapabilirim. "Kamp malzemeleri", "bot önerileri" gibi isteklerinizi belirtebilir veya aradığınız ürünü tarif edebilirsiniz.',
        timestamp: new Date()
      })
    }
    isConnected.value = true
  }

  // Mesaj gönder
  const sendMessage = async (userMessage: string): Promise<AIResponse> => {
    isLoading.value = true
    
    try {
      // Kullanıcı mesajını ekle
      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      }
      chatHistory.value.push(userMsg)

      // Session ID oluştur (rastgele ürünler için)
      const sessionId = Date.now() + Math.random()
      
      // Server-side API'ye gönder
      const chatResponse = await $fetch('/api/ai/chat', {
        method: 'POST',
        body: {
          message: userMessage,
          sessionId: sessionId, // Rastgele ürünler için session ID
          history: chatHistory.value.slice(-6).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
      }) as any

      // AI yanıtını mesaja ekle (ürünlerle birlikte)
      const aiMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: chatResponse.message || 'Üzgünüm, bir hata oluştu.',
        timestamp: new Date(),
        products: chatResponse.products || [] // Ürünleri mesaja ekle
      }
      chatHistory.value.push(aiMsg)

      // Server'dan gelen response'u kullan
      return {
        message: aiMsg.content,
        products: chatResponse.products || [],
        suggestions: chatResponse.suggestions || [],
        action: chatResponse.action
      }

    } catch (error) {
      console.error('AI Chat Error:', error)
      
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Üzgünüm, şu anda teknik bir sorun yaşıyorum. Lütfen daha sonra tekrar deneyin veya farklı bir soru sorun.',
        timestamp: new Date()
      }
      chatHistory.value.push(errorMsg)
      
      return {
        message: errorMsg.content,
        action: 'help',
        products: [],
        suggestions: [
          'Popüler ürünler',
          'Yeni ürünler', 
          'İletişim',
          'Tekrar dene'
        ]
      }
    } finally {
      isLoading.value = false
    }
  }

  // Chat geçmişini temizle
  const clearChat = () => {
    chatHistory.value = []
    initializeChat()
  }

  // Benzersiz ID oluştur
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Chat'i başlat
  onMounted(() => {
    initializeChat()
  })

  return {
    chatHistory: readonly(chatHistory),
    isLoading: readonly(isLoading),
    isConnected: readonly(isConnected),
    sendMessage,
    clearChat,
    initializeChat
  }
} 