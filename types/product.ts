export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  category_id: string
  color: string | null
  created_at: string
  updated_at: string
  image_url?: string
  slug?: string
  category?: string
  total_stock?: number
  images: ProductImage[]
  sizes: ProductSize[]
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  is_primary: boolean
  created_at: string
}

export interface ProductSize {
  id: string
  product_id: string
  size: string
  stock: number
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  created_at: string
} 