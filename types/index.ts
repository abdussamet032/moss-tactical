// Supabase Database Types
export * from './address'
export * from './cart'
export * from './category'
export * from './coupon'
export * from './order'
export * from './product'
export * from './review'

// Supabase response tipleri için örnek
export interface DatabaseResponse<T> {
  data: T | null
  error: {
    message: string
    details?: string
    hint?: string
    code?: string
  } | null
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
} 