import { supabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // İstekten body'i al
  const body = await readBody(event)
  const { code, total } = body

  // Kupon kodu kontrolü
  if (!code) {
    return {
      status: 'error',
      code: 400,
      message: 'Kupon kodu gerekli',
      data: null,
      errors: null,
      meta: null
    }
  }

  // Supabase'den kuponu çek
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .single()

  if (error || !coupon) {
    return {
      status: 'error',
      code: 404,
      message: 'Geçersiz kupon kodu',
      data: null,
      errors: error || null,
      meta: null
    }
  }

  const now = new Date()

  // Tarih kontrolü
  if (coupon.valid_from && new Date(coupon.valid_from) > now) {
    return {
      status: 'error',
      code: 400,
      message: 'Kupon henüz geçerli değil',
      data: null,
      errors: null,
      meta: null
    }
  }

  if (coupon.valid_until && new Date(coupon.valid_until) < now) {
    return {
      status: 'error',
      code: 400,
      message: 'Kupon süresi dolmuş',
      data: null,
      errors: null,
      meta: null
    }
  }

  // Kullanım limiti kontrolü
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return {
      status: 'error',
      code: 400,
      message: 'Kupon kullanım limiti dolmuş',
      data: null,
      errors: null,
      meta: null
    }
  }

  // İndirim hesaplama
  let discount = 0
  if (coupon.discount_type === 'percentage') {
    discount = (total * (coupon.discount_value || 0)) / 100
  } else if (coupon.discount_type === 'fixed') {
    discount = coupon.discount_value || 0
  } else if (coupon.discount_type === 'free_shipping') {
    discount = 0 // Kargo bedeli ayrı hesaplanır
  }

  return {
    status: 'success',
    code: 200,
    message: 'Kupon geçerli',
    data: {
      discount: Math.round(discount * 100) / 100,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value
      }
    },
    errors: null,
    meta: null
  }
}) 