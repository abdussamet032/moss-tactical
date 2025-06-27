import { supabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // Route parametresinden kullanıcı ID'sini al
  const userId = getRouterParam(event, 'userId')

  // Kullanıcı ID kontrolü
  if (!userId) {
    return {
      status: 'error',
      code: 400,
      message: 'Kullanıcı ID gerekli',
      data: null,
      errors: null,
      meta: null
    }
  }

  // Supabase'den adresleri çek
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  // Hata kontrolü
  if (error) {
    return {
      status: 'error',
      code: 500,
      message: 'Adresler getirilirken hata oluştu',
      data: [],
      errors: error.details || error.message || null,
      meta: null
    }
  }

  return {
    status: 'success',
    code: 200,
    message: 'OK',
    data: data || [],
    errors: null,
    meta: null
  }
}) 