import { supabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // URL'den productId parametresini al
  const productId = event.context.params?.productId

  // Query parametrelerini al
  const query = getQuery(event)
  const page = Number(query.page) > 0 ? Number(query.page) : 1
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10

  // Ürün ID kontrolü
  if (!productId) {
    return {
      status: 'error',
      code: 400,
      message: 'Ürün ID gerekli',
      data: null,
      errors: 'Ürün ID gerekli',
      meta: null
    }
  }

  // Sayfalama için başlangıç ve bitiş indexlerini hesapla
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Supabase'den değerlendirmeleri çek
  const { data, error, count } = await supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .eq('product_id', productId)
    .range(from, to)
    .order('created_at', { ascending: false })

  // Hata kontrolü
  if (error) {
    return {
      status: 'error',
      code: 500,
      message: 'Değerlendirmeler getirilirken hata oluştu',
      data: [],
      errors: error.details || error.message || null,
      meta: null
    }
  }

  // Tüm değerlendirmeleri çekip rating istatistiklerini hesapla
  const { data: allReviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId)

  // İstatistik objesi
  const stats = {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }
  }

  if (allReviews && allReviews.length > 0) {
    // Ortalama puan ve toplam yorum sayısı
    const totalRating = allReviews.reduce((sum, review) => sum + (review.rating || 0), 0)
    stats.averageRating = totalRating / allReviews.length
    stats.totalReviews = allReviews.length

    // Puan dağılımı
    allReviews.forEach(review => {
      if (review.rating && review.rating >= 1 && review.rating <= 5) {
        stats.ratingDistribution[review.rating as keyof typeof stats.ratingDistribution]++
      }
    })
  }

  // Başarılı response
  return {
    status: 'success',
    code: 200,
    message: 'OK',
    data: data || [],
    stats,
    errors: null,
    meta: {
      pagination: {
        page,
        limit,
        total: count || (data?.length ?? 0),
        totalPages: count ? Math.ceil(count / limit) : 1
      }
    }
  }
}) 