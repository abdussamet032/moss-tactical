import { supabase } from '~/server/utils/supabase'
import type { OrderStatus } from '~/types/order'

export default defineEventHandler(async (event) => {
  // İstekten sipariş verilerini al
  const body = await readBody(event)

  // Gerekli alanlar kontrolü
  const requiredFields = ['user_id', 'total_price', 'items']
  const missingFields = requiredFields.filter(field => !body?.[field])
  if (missingFields.length > 0) {
    return {
      status: 'error',
      code: 400,
      message: `Eksik alanlar: ${missingFields.join(', ')}`,
      data: null,
      errors: null,
      meta: null
    }
  }

  // items bir dizi olmalı ve en az bir ürün içermeli
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return {
      status: 'error',
      code: 400,
      message: 'Sipariş kalemleri (items) eksik veya hatalı',
      data: null,
      errors: null,
      meta: null
    }
  }

  // Her bir item için gerekli alanları kontrol et
  for (let i = 0; i < body.items.length; i++) {
    const item = body.items[i]
    const itemRequiredFields = ['product_id', 'quantity', 'price_per_unit']
    
    // variant_id opsiyonel, ama varsa UUID formatında olmalı
    if (item.variant_id && typeof item.variant_id !== 'string') {
      return {
        status: 'error',
        code: 400,
        message: `Item ${i + 1}: variant_id geçersiz format`,
        data: null,
        errors: null,
        meta: null
      }
    }

    const itemMissingFields = itemRequiredFields.filter(field => !item?.[field])
    if (itemMissingFields.length > 0) {
      return {
        status: 'error',
        code: 400,
        message: `Item ${i + 1}: Eksik alanlar: ${itemMissingFields.join(', ')}`,
        data: null,
        errors: null,
        meta: null
      }
    }

    // Quantity pozitif bir sayı olmalı
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      return {
        status: 'error',
        code: 400,
        message: `Item ${i + 1}: quantity pozitif bir sayı olmalı`,
        data: null,
        errors: null,
        meta: null
      }
    }

    // Price pozitif veya sıfır olmalı
    if (typeof item.price_per_unit !== 'number' || item.price_per_unit < 0) {
      return {
        status: 'error',
        code: 400,
        message: `Item ${i + 1}: price_per_unit pozitif bir sayı olmalı`,
        data: null,
        errors: null,
        meta: null
      }
    }
  }

  // total_price pozitif bir sayı olmalı
  if (typeof body.total_price !== 'number' || body.total_price < 0) {
    return {
      status: 'error',
      code: 400,
      message: 'total_price pozitif bir sayı olmalı',
      data: null,
      errors: null,
      meta: null
    }
  }

  // Sipariş oluşturma
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        user_id: body.user_id,
        total_price: body.total_price,
        status: (body.status as OrderStatus) || 'pending'
      }
    ])
    .select()
    .single()

  if (orderError || !order) {
    return {
      status: 'error',
      code: 500,
      message: 'Sipariş oluşturulurken hata oluştu',
      data: null,
      errors: orderError?.details || orderError?.message || null,
      meta: null
    }
  }

  // Sipariş kalemlerini ekle
  // Türkçe açıklama: Her bir ürün için order_items tablosuna kayıt eklenir
  const orderItems = body.items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id || null,
    quantity: item.quantity,
    price_per_unit: item.price_per_unit
  }))

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select()

  if (itemsError) {
    // Sipariş oluşturulmuş ama kalemler eklenememiş, siparişi geri al
    await supabase
      .from('orders')
      .delete()
      .eq('id', order.id)

    return {
      status: 'error',
      code: 500,
      message: 'Sipariş kalemleri eklenirken hata oluştu, sipariş iptal edildi',
      data: null,
      errors: itemsError.details || itemsError.message || null,
      meta: null
    }
  }

  // Başarılı yanıt
  return {
    status: 'success',
    code: 201,
    message: 'Sipariş başarıyla oluşturuldu',
    data: {
      order,
      items
    },
    errors: null,
    meta: null
  }
}) 