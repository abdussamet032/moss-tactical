import { supabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // Tüm ürünlerden benzersiz marka listesini ve adetlerini çek
  const { data, error } = await supabase
    .from('products')
    .select('brand')

  if (error) {
    return {
      status: 'error',
      code: 500,
      message: 'Markalar getirilirken hata oluştu',
      data: [],
      errors: error.details || error.message || null,
      meta: null
    }
  }

  // Marka isimlerini ve adetlerini hesapla
  const brandMap: Record<string, number> = {}
  for (const item of data || []) {
    if (item.brand) {
      brandMap[item.brand] = (brandMap[item.brand] || 0) + 1
    }
  }
  const brands = Object.entries(brandMap).map(([name, count]) => ({ name, count }))

  return {
    status: 'success',
    code: 200,
    message: 'OK',
    data: brands,
    errors: null,
    meta: null
  }
}) 