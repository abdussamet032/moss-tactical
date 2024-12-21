import { ref, computed, onMounted } from 'vue'
import type { CartItem, AddToCartPayload } from '~/types/cart'

export const useCart = () => {
  // Sepet ürünleri için reactive state
  const cartItems = ref<CartItem[]>([])

  /**
   * LocalStorage'dan sepeti yükle
   */
  const loadCart = (): void => {
    try {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) {
        cartItems.value = JSON.parse(storedCart)
      }
    } catch (error) {
      console.error('Sepet yüklenirken hata oluştu:', error)
      cartItems.value = []
    }
  }

  /**
   * Sepeti LocalStorage'a kaydet
   */
  const saveCart = (): void => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems.value))
    } catch (error) {
      console.error('Sepet kaydedilirken hata oluştu:', error)
    }
  }

  /**
   * Sepete ürün ekle
   */
  const addToCart = (item: AddToCartPayload): void => {
    try {
      // Ürün verilerini kontrol et
      if (!item.product_id || !item.size_id) {
        throw new Error('Geçersiz ürün bilgisi')
      }

      // Aynı ürün ve beden var mı kontrol et
      const existingItemIndex = cartItems.value.findIndex(
        cartItem => cartItem.product_id === item.product_id && 
                   cartItem.size_id === item.size_id
      )

      if (existingItemIndex !== -1) {
        // Varsa miktarı artır
        cartItems.value[existingItemIndex].quantity += item.quantity
      } else {
        // Yoksa yeni ürün ekle
        cartItems.value.push({
          id: `${item.product_id}-${item.size_id}`,
          ...item
        })
      }

      // Sepeti kaydet
      saveCart()
    } catch (error) {
      console.error('Ürün sepete eklenirken hata oluştu:', error)
      throw error
    }
  }

  /**
   * Sepetten ürün çıkar
   */
  const removeFromCart = (itemId: string): void => {
    try {
      cartItems.value = cartItems.value.filter(item => item.id !== itemId)
      saveCart()
    } catch (error) {
      console.error('Ürün sepetten çıkarılırken hata oluştu:', error)
      throw error
    }
  }

  /**
   * Ürün miktarını güncelle
   */
  const updateQuantity = (itemId: string, quantity: number): void => {
    try {
      if (quantity < 1) {
        throw new Error('Geçersiz miktar')
      }

      const item = cartItems.value.find(item => item.id === itemId)
      if (item) {
        item.quantity = quantity
        saveCart()
      }
    } catch (error) {
      console.error('Ürün miktarı güncellenirken hata oluştu:', error)
      throw error
    }
  }

  /**
   * Sepeti temizle
   */
  const clearCart = (): void => {
    try {
      cartItems.value = []
      saveCart()
    } catch (error) {
      console.error('Sepet temizlenirken hata oluştu:', error)
      throw error
    }
  }

  /**
   * Toplam ürün sayısı
   */
  const totalItems = computed((): number => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  /**
   * Toplam fiyat
   */
  const totalPrice = computed((): number => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  // Sayfa yüklendiğinde sepeti yükle
  onMounted(() => {
    loadCart()
  })

  // Public API
  return {
    items: cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
    totalItems,
    totalPrice
  }
}
