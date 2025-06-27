export interface Review {
  id: string
  user_id?: string | null
  product_id?: string | null
  rating?: number | null
  comment?: string | null
  created_at?: string | null
}

export interface CreateReviewDto {
  user_id?: string
  product_id: string
  rating: number
  comment?: string
}

export interface UpdateReviewDto {
  rating?: number
  comment?: string
}

export interface ReviewWithUser extends Review {
  user?: {
    id: string
    name?: string
    email?: string
  } | null
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
} 