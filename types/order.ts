export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  user_id?: string | null
  total?: number | null
  status?: OrderStatus | null
  created_at?: string | null
}

export interface OrderItem {
  id: string
  order_id?: string | null
  variant_id?: string | null
  quantity?: number | null
  price?: number | null
}

export interface CreateOrderDto {
  user_id?: string
  total: number
  status?: OrderStatus
}

export interface UpdateOrderDto {
  total?: number
  status?: OrderStatus
}

export interface CreateOrderItemDto {
  order_id: string
  variant_id: string
  quantity: number
  price: number
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
}

export interface OrderSummary {
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
} 