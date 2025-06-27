import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig()

export const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
)

/* context7: db-insert-sample-products @mcps=5 */
// Bu fonksiyon, Supabase 'products' tablosuna örnek 3 ürün ekler.
export async function insertSampleProducts() {
  const sampleProducts = [
    {
      name: 'Taktik Sırt Çantası',
      slug: 'taktik-sirt-cantasi',
      description: 'Dayanıklı, çok bölmeli ve outdoor kullanıma uygun sırt çantası.',
      price: 1299.99,
      currency: 'TRY',
      tags: ['outdoor', 'çanta', 'taktik'],
      seo_meta: { title: 'Taktik Sırt Çantası', description: 'Outdoor için ideal taktik sırt çantası.' }
    },
    {
      name: 'Askeri Bot',
      slug: 'askeri-bot',
      description: 'Su geçirmez, nefes alabilen ve kaymaz tabanlı askeri bot.',
      price: 1899.5,
      currency: 'TRY',
      tags: ['bot', 'askeri', 'outdoor'],
      seo_meta: { title: 'Askeri Bot', description: 'Zorlu araziler için askeri bot.' }
    },
    {
      name: 'Kamp Matı',
      slug: 'kamp-mati',
      description: 'Hafif, kolay taşınabilir ve yalıtımlı kamp matı.',
      price: 499.0,
      currency: 'TRY',
      tags: ['kamp', 'mat', 'outdoor'],
      seo_meta: { title: 'Kamp Matı', description: 'Konforlu uyku için kamp matı.' }
    }
  ]
  const { data, error } = await supabase
    .from('products')
    .insert(sampleProducts)
    .select('*')
  if (error) throw error
  return data
} 