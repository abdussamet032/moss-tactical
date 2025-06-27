import { supabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // İstekten adres verilerini al
  const body = await readBody(event)

  // Gerekli alanlar kontrolü
  const requiredFields = ['user_id', 'address_line1', 'city', 'country']
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

  // Adres ekleme işlemi
  const { data, error } = await supabase
    .from('addresses')
    .insert([
      {
        user_id: body.user_id,
        address_line1: body.address_line1,
        address_line2: body.address_line2 || null,
        city: body.city,
        state: body.state || null,
        postal_code: body.postal_code || null,
        country: body.country,
        is_default: body.is_default ?? false
      }
    ])
    .select()
    .single()

  // Hata kontrolü
  if (error) {
    return {
      status: 'error',
      code: 500,
      message: 'Adres eklenirken hata oluştu',
      data: null,
      errors: error.details || error.message || null,
      meta: null
    }
  }

  return {
    status: 'success',
    code: 201,
    message: 'Adres başarıyla eklendi',
    data,
    errors: null,
    meta: null
  }
}) 