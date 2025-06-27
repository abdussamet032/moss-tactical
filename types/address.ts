export interface Address {
  id: string
  user_id?: string | null
  full_name?: string | null
  phone?: string | null
  address_line?: string | null
  city?: string | null
  postal_code?: string | null
  country?: string | null
  is_default?: boolean | null
  created_at?: string | null
}

export interface CreateAddressDto {
  user_id?: string
  full_name: string
  phone: string
  address_line: string
  city: string
  postal_code: string
  country: string
  is_default?: boolean
}

export interface UpdateAddressDto {
  full_name?: string
  phone?: string
  address_line?: string
  city?: string
  postal_code?: string
  country?: string
  is_default?: boolean
} 