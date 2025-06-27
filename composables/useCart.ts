/* context7: cart-management @mcps=7 */

interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number
}

export const useCart = () => {
  const cartItems = ref<CartItem[]>([])
  const isLoading = ref(false)

  // Sepet verilerini localStorage'dan yükle
  const loadCart = () => {
    if (process.client) {
      try {
        const stored = localStorage.getItem('cart')
        if (stored) {
          cartItems.value = JSON.parse(stored)
        }
      } catch (error) {
        console.error('Sepet yükleme hatası:', error)
        cartItems.value = []
      }
    }
  }

  // Sepet verilerini localStorage'a kaydet
  const saveCart = () => {
    if (process.client) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems.value))
        // Global sepet sayısını güncelle
        refreshCookie('cart-count')
      } catch (error) {
        console.error('Sepet kaydetme hatası:', error)
      }
    }
  }

  // Ürünü sepete ekle
  const addToCart = (product: any, quantity: number = 1) => {
    isLoading.value = true
    
    try {
      const existingItem = cartItems.value.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cartItems.value.push({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.image,
          quantity
        })
      }
      
      saveCart()
      return true
    } catch (error) {
      console.error('Sepete ekleme hatası:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Ürünü sepetten çıkar
  const removeFromCart = (productId: string) => {
    isLoading.value = true
    
    try {
      cartItems.value = cartItems.value.filter(item => item.id !== productId)
      saveCart()
      return true
    } catch (error) {
      console.error('Sepetten çıkarma hatası:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Ürün miktarını güncelle
  const updateQuantity = (productId: string, quantity: number) => {
    isLoading.value = true
    
    try {
      if (quantity <= 0) {
        return removeFromCart(productId)
      }
      
      const item = cartItems.value.find(item => item.id === productId)
      if (item) {
        item.quantity = quantity
        saveCart()
        return true
      }
      return false
    } catch (error) {
      console.error('Miktar güncelleme hatası:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Sepeti temizle
  const clearCart = () => {
    isLoading.value = true
    
    try {
      cartItems.value = []
      saveCart()
      return true
    } catch (error) {
      console.error('Sepet temizleme hatası:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Toplam ürün sayısı
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  // Toplam fiyat
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  // Sepette ürün var mı kontrol et
  const isInCart = (productId: string) => {
    return cartItems.value.some(item => item.id === productId)
  }

  // Ürünün sepetteki miktarını al
  const getQuantity = (productId: string) => {
    const item = cartItems.value.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  // Component mount edildiğinde sepeti yükle
  onMounted(() => {
    loadCart()
  })

  return {
    cartItems: readonly(cartItems),
    isLoading: readonly(isLoading),
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getQuantity,
    loadCart
  }
} 