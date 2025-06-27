import { supabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // Query parametrelerinden sayfa ve sayfa boyutunu al
  const query = getQuery(event)
  const page = Number(query.page) > 0 ? Number(query.page) : 1
  const perPage = Number(query.limit) > 0 ? Number(query.limit) : 10
  const userId = query.user_id as string
  const status = query.status as string

  // Pagination için başlangıç ve bitiş indexlerini hesapla
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  // Supabase'den siparişleri çekiyoruz
  let supabaseQuery = supabase
    .from('orders')
    .select(`*, order_items (*)`, { count: 'exact' })

  // Filtreleri uygula
  if (userId) {
    supabaseQuery = supabaseQuery.eq('user_id', userId)
  }
  if (status) {
    supabaseQuery = supabaseQuery.eq('status', status)
  }

  // Sıralama ve sayfalama uygula
  const { data, error, count } = await supabaseQuery
    .order('created_at', { ascending: false })
    .range(from, to)

  // Hata varsa, hata formatında dön
  if (error) {
    return {
      status: 'error',
      code: 500,
      message: 'Siparişler getirilirken hata oluştu',
      data: [],
      errors: error.details || error.message || null,
      meta: null
    }
  }

  // Başarılı ise, istenen formatta dön
  return {
    status: 'success',
    code: 200,
    message: 'OK',
    data: data || [],
    errors: null,
    meta: {
      pagination: {
        page,
        perPage,
        total: count || (data?.length ?? 0),
        totalPages: count ? Math.ceil(count / perPage) : 1
      }
    }
  }
}) 