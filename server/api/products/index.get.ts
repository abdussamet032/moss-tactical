import { supabase } from '~/server/utils/supabase'
import type { Product } from '~/types'

export default defineEventHandler(async (event) => {
  // Query parametrelerinden sayfa, sayfa boyutu, kategori, tag ve sıralama değerlerini al
  const query = getQuery(event)
  const page = Number(query.page) > 0 ? Number(query.page) : 1
  const perPage = Number(query.perPage) > 0 ? Number(query.perPage) : 12
  const category = query.category as string | undefined
  const tag = query.tag as string | undefined
  const sort = query.sort as string | undefined // 'price_asc', 'price_desc', 'newest', 'oldest'
  // Yeni filtreler
  const brand = query.brand as string | undefined
  const minPrice = query.minPrice ? Number(query.minPrice) : undefined
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined
  // Arama filtresi
  const search = query.search as string | undefined

  // Pagination için başlangıç ve bitiş indexlerini hesapla
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  // Supabase query'sini başlat
  let supabaseQuery = supabase
    .from('products')
    .select('*', { count: 'exact' })

  // Kategoriye göre filtrele
  if (category) {
    // Çoklu kategori desteği (virgülle ayrılmış)
    const cats = category.split(',')
    if (cats.length > 1) {
      supabaseQuery = supabaseQuery.in('category_id', cats)
    } else {
      supabaseQuery = supabaseQuery.eq('category_id', category)
    }
  }
  // Tag'e göre filtrele (tags arrayinde arama)
  if (tag) {
    supabaseQuery = supabaseQuery.contains('tags', [tag])
  }
  // Marka filtresi (dummy: brand alanı varsa)
  if (brand) {
    const brands = brand.split(',')
    if (brands.length > 1) {
      supabaseQuery = supabaseQuery.in('brand', brands)
    } else {
      supabaseQuery = supabaseQuery.eq('brand', brand)
    }
  }
  // Fiyat aralığı filtresi
  if (minPrice !== undefined) {
    supabaseQuery = supabaseQuery.gte('price', minPrice)
  }
  if (maxPrice !== undefined) {
    supabaseQuery = supabaseQuery.lte('price', maxPrice)
  }
  // Arama filtresi
  if (search) {
    supabaseQuery = supabaseQuery.ilike('name', `%${search}%`)
  }
  // Sıralama uygula
  if (sort === 'price_asc') {
    supabaseQuery = supabaseQuery.order('price', { ascending: true })
  } else if (sort === 'price_desc') {
    supabaseQuery = supabaseQuery.order('price', { ascending: false })
  } else if (sort === 'oldest') {
    supabaseQuery = supabaseQuery.order('created_at', { ascending: true })
  } else {
    // Varsayılan: en yeni
    supabaseQuery = supabaseQuery.order('created_at', { ascending: false })
  }

  // Sayfalama uygula
  supabaseQuery = supabaseQuery.range(from, to)

  // Sorguyu çalıştır
  const { data, error, count } = await supabaseQuery

  // Hata varsa, hata formatında dön
  if (error) {
    return {
      status: 'error',
      code: 500,
      message: 'Ürünler getirilirken hata oluştu',
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