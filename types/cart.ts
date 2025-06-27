export interface Cart {
  id: string
  user_id?: string | null
  created_at?: string | null
}

export interface CartItem {
  id: string
  cart_id?: string | null
  variant_id?: string | null
  quantity: number
}

export interface CreateCartDto {
  user_id?: string
}

export interface CreateCartItemDto {
  cart_id: string
  variant_id: string
  quantity: number
}

export interface UpdateCartItemDto {
  quantity: number
}

export interface CartWithItems extends Cart {
  items: CartItem[]
} 