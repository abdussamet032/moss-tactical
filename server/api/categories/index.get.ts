import { supabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // Query parametrelerinden tree isteğini al
  const query = getQuery(event)
  const tree = query.tree === 'true'

  // Supabase'den kategorileri çek
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  // Hata kontrolü
  if (error) {
    return {
      status: 'error',
      code: 500,
      message: 'Kategoriler getirilirken hata oluştu',
      data: [],
      errors: error.details || error.message || null,
      meta: null
    }
  }

  // Eğer tree formatı isteniyorsa, hiyerarşik yapı oluştur
  let result = data
  if (tree && data) {
    const categoryMap = new Map()
    const roots: any[] = []

    // Tüm kategorileri map'e ekle
    data.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] })
    })

    // Hiyerarşi oluştur
    data.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)
      if (category.parent_category_id) {
        const parent = categoryMap.get(category.parent_category_id)
        if (parent) {
          parent.children.push(categoryWithChildren)
        }
      } else {
        roots.push(categoryWithChildren)
      }
    })
    result = roots
  }

  return {
    status: 'success',
    code: 200,
    message: 'OK',
    data: result || [],
    errors: null,
    meta: null
  }
}) 