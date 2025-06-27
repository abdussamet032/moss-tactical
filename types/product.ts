export interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  category_id?: string | null
  tags?: string[] | null
  price: number
  currency?: string | null
  seo_meta?: Record<string, any> | null // JSONB alanı için Record<string, any> kullanıyoruz
  created_at?: string | null // Supabase tarihleri string olarak döner
}

export interface ProductVariant {
  id: string
  product_id?: string | null
  name?: string | null
  sku?: string | null
  stock?: number | null
  metadata?: Record<string, any> | null // JSONB alanı için Record<string, any> kullanıyoruz
  created_at?: string | null
}

export interface ProductImage {
  id: string
  product_id?: string | null
  url: string
  is_featured?: boolean | null
  created_at?: string | null
}

export interface CreateProductDto {
  name: string
  slug: string
  description?: string
  category_id?: string
  price: number
  currency?: string
  seo_meta?: Record<string, any>
}

export interface UpdateProductDto {
  name?: string
  slug?: string
  description?: string
  category_id?: string
  price?: number
  currency?: string
  seo_meta?: Record<string, any>
}

export interface CreateProductVariantDto {
  product_id: string
  name?: string
  sku?: string
  stock?: number
  metadata?: Record<string, any>
}

export interface UpdateProductVariantDto {
  name?: string
  sku?: string
  stock?: number
  metadata?: Record<string, any>
}

export interface CreateProductImageDto {
  product_id: string
  url: string
  is_featured?: boolean
}

export interface ProductWithDetails extends Product {
  variants: ProductVariant[]
  images: ProductImage[]
  category?: {
    id: string
    name: string
    slug?: string
  } | null
}

export interface SEOMeta {
  title?: string
  description?: string
  keywords?: string[]
  og_image?: string
}

export interface VariantMetadata {
  color?: string
  size?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  [key: string]: any
} 