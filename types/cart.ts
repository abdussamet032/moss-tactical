export interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  size: string
  size_id: string
  quantity: number
  image_url: string
}

export interface AddToCartPayload {
  product_id: string
  name: string
  price: number
  size: string
  size_id: string
  quantity: number
  image_url: string
} 