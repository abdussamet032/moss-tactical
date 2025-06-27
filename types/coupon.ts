export type DiscountType = 'percentage' | 'fixed' | 'free_shipping'

export interface Coupon {
  id: string
  code: string
  discount_type?: DiscountType | null
  discount_value?: number | null
  valid_from?: string | null
  valid_until?: string | null
  usage_limit?: number | null
  used_count?: number | null
}

export interface CreateCouponDto {
  code: string
  discount_type: DiscountType
  discount_value: number
  valid_from?: string
  valid_until?: string
  usage_limit?: number
}

export interface UpdateCouponDto {
  code?: string
  discount_type?: DiscountType
  discount_value?: number
  valid_from?: string
  valid_until?: string
  usage_limit?: number
}

export interface CouponValidationResult {
  isValid: boolean
  discount: number
  message?: string
} 