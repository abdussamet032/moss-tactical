import { defineEventHandler } from 'h3'
import { supabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // URL'den slug parametresini al
  const slug = event.context.params?.slug

  // Slug yoksa hata döndür
  if (!slug) {
    return {
      status: 'error',
      code: 400,
      message: 'Slug parametresi gerekli',
      data: null,
      errors: 'Slug parametresi gerekli',
      meta: null
    }
  }

  // Ürünü çek
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (productError || !product) {
    return {
      status: 'error',
      code: 404,
      message: 'Ürün bulunamadı',
      data: null,
      errors: productError?.message || 'Ürün bulunamadı',
      meta: null
    }
  }

  // Varyantları çek
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id)

  // Attribute'ları çek
  const { data: attributes } = await supabase
    .from('product_attributes')
    .select('*')
    .eq('product_id', product.id)

  // Ürün görsellerini çek
  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', product.id)

  return {
    status: 'success',
    code: 200,
    message: 'OK',
    data: {
      ...product,
      images: images || [],
      variants: variants || [],
      attributes: attributes || []
    },
    errors: null,
    meta: null
  }
})
