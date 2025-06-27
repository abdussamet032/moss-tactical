/* context7: ai-chat-api-enhanced @mcps=7 */
import { OpenAI } from 'openai'

interface ChatRequest {
  message: string
  sessionId?: number
  history?: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
  }>
}

export default defineEventHandler(async (event) => {
  try {
    // CORS başlıkları ekle
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')

    // OPTIONS request için
    if (getMethod(event) === 'OPTIONS') {
      return null
    }

    const body = await readBody<ChatRequest>(event)
    
    if (!body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Mesaj gerekli'
      })
    }

    const config = useRuntimeConfig()
    
    // OpenAI yoksa basit bot response'u ver
    if (!config.openaiApiKey) {
      return handleSimpleBot(body.message)
    }

    // OpenAI client'ı oluştur
    const openai = new OpenAI({
      apiKey: config.openaiApiKey
    })

    // Sistemdeki mevcut ürünleri al (AI'ya context vermek için)
    const availableProducts = await getAvailableProductCategories()

    // Geliştirilmiş sistem promptu - akıllı ürün önerisi
    const systemPrompt = `Sen Moss Tactical'ın özel AI alışveriş asistanısın. SADECE Moss Tactical'da bulunan ürünler hakkında konuş ve akıllı öneriler yap.

## TEMEL KURALLAR:
1. SADECE Moss Tactical ürünleri hakkında konuş
2. Kullanıcının ihtiyacını analiz et ve en uygun ürünleri öner
3. Eğer tam eşleşme yoksa benzer veya alternatif ürünler öner
4. Temiz ve doğal yanıtlar ver - teknik etiket kullanma
5. Dostça, uzman ve güvenilir ol

## MEVCUT ÜRÜN KATEGORİLERİ:
${availableProducts.categories.join(', ')}

## POPÜLER ÜRÜNLER:
${availableProducts.featured.map((p: any) => `- ${p.name} (₺${p.price})`).join('\n')}

## AKILLI ÖNERİ STRATEJİSİ:
1. Kullanıcının tam ihtiyacını analiz et
2. Önce tam eşleşen ürünleri öner
3. Yoksa benzer özellikli alternatifler sun
4. Kullanım amacına göre uygun kategoriler öner
5. "Bu ürün yok ama şu alternatif var" yaklaşımı

## YANIT KURALLARI:
- Dostça ve uzman tavırla yaklaş
- Türkçe konuş, maksimum 80 kelime
- Spesifik ihtiyaçları karşılayan öneriler yap
- Güvenlik ve kalite vurgusu yap
- Kullanıcıyı ürün kartlarına yönlendir

## ÖRNEKLER:
✅ "Yürüyüş botu arıyorsunuz. Stokta tam size uygun Taktik Bot var. Alternatif olarak Su Geçirmez Bot da tercih edebilirsiniz."
✅ "Belirttiğiniz ürün şu anda mevcut değil ama benzer özellikli X modeli var. Size daha uygun olabilir."
❌ "Bu ürünümüz yok."

Unutma: Her zaman alternatif öner, boş bırakma!`

    // Mesaj geçmişini hazırla
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(body.history || []),
      { role: 'user', content: body.message }
    ]

    // OpenAI API çağrısı - daha dinamik yanıtlar için
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective model
      messages: messages as any,
      max_tokens: 400,
      temperature: 0.8, // Daha yaratıcı ve varyasyonlu yanıtlar
      presence_penalty: 0.3, // Tekrarları azalt
      frequency_penalty: 0.2, // Kelime tekrarlarını engelle
      top_p: 0.9, // Nucleus sampling ile çeşitlilik artır
      stream: false
    })

    const aiResponse = completion.choices[0]?.message?.content || 'Üzgünüm, bir hata oluştu.'

    // Yanıtı analiz et ve aksiyonu belirle
    let action: string | undefined
    let searchTerm: string | undefined
    let category: string | undefined

    if (aiResponse.includes('SEARCH:')) {
      action = 'search'
      searchTerm = aiResponse.split('SEARCH:')[1]?.split('\n')[0]?.trim()
    } else if (aiResponse.includes('PRODUCT:')) {
      action = 'recommend'
      category = aiResponse.split('PRODUCT:')[1]?.split('\n')[0]?.trim()
    } else if (aiResponse.includes('CATEGORY:')) {
      action = 'category'
      category = aiResponse.split('CATEGORY:')[1]?.split('\n')[0]?.trim()
    } else {
          // Otomatik ürün önerisi yap - daha akıllı kategori seçimi
    action = 'recommend'
    category = extractCategoryFromMessage(body.message)
    
    // Eğer kategori yoksa anahtar kelime bazlı arama yap
    if (!category) {
      const keywords = extractKeywords(body.message)
      if (keywords.length > 0) {
        action = 'search'
        searchTerm = keywords[0] // İlk anahtar kelimeyi kullan
      }
    }
    }

    // Ürün önerileri getir - Debug log ile
    let products: any[] = []
    console.log(`[AI Chat Debug] Action: ${action}, SearchTerm: ${searchTerm}, Category: ${category}`)
    
    if (action === 'search' && searchTerm) {
      console.log(`[AI Chat Debug] Searching for: ${searchTerm}`)
      products = await getProductsBySearch(searchTerm)
    } else if (action === 'recommend' || action === 'category') {
      console.log(`[AI Chat Debug] Recommending for category: ${category}`)
      products = await getRecommendedProducts(category, body.message)
    }

    // Eğer ürün bulunamazsa genel önerileri getir
    if (products.length === 0) {
      console.log(`[AI Chat Debug] No products found, getting general recommendations`)
      products = await getGeneralRecommendations(body.sessionId)
    }
    
    console.log(`[AI Chat Debug] Found ${products.length} products:`, products.map(p => p.name))

    // Önerilen hızlı aksiyonları belirle
    const suggestions = generateQuickActions(body.message, action)

    // AI yanıtını temizle ve formatla
    let cleanedMessage = aiResponse
      .replace(/SEARCH:[^\n]*/g, '')
      .replace(/PRODUCT:[^\n]*/g, '')
      .replace(/CATEGORY:[^\n]*/g, '')
      .trim()

    // Ürün önerileri varsa yanıta kısa bilgi ekle
    if (products.length > 0) {
      cleanedMessage += `\n\n🛍️ Size ${products.length} ürün önerisi hazırladım. Aşağıdaki ürün kartlarından detayları inceleyebilir ve sepete ekleyebilirsiniz.`
    }

    // Chat geçmişine mesajı ürünlerle birlikte ekle
    const messageWithProducts = {
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: cleanedMessage,
      timestamp: new Date(),
      products: products // Ürünleri mesajla birlikte gönder
    }

    return {
      message: cleanedMessage,
      action,
      products,
      suggestions,
      messageData: messageWithProducts, // Frontend için mesaj datası
      usage: {
        prompt_tokens: completion.usage?.prompt_tokens || 0,
        completion_tokens: completion.usage?.completion_tokens || 0,
        total_tokens: completion.usage?.total_tokens || 0
      }
    }

  } catch (error: any) {
    console.error('AI Chat API Error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'AI servisi şu anda kullanılamıyor'
    })
  }
})

// Mevcut ürün kategorilerini ve popüler ürünleri getir
async function getAvailableProductCategories() {
  try {
    const { supabase } = await import('~/server/utils/supabase')
    
    // Kategorileri al
    const { data: categories } = await supabase
      .from('products')
      .select('category')
      .eq('is_active', true)
      .not('category', 'is', null)
    
    const uniqueCategories = [...new Set(categories?.map((p: any) => p.category) || [])]
    
    // Popüler ürünleri al
    const { data: featured } = await supabase
      .from('products')
      .select('name, price')
      .eq('is_active', true)
      .limit(5)

    return {
      categories: uniqueCategories,
      featured: featured || []
    }
  } catch (error) {
    console.error('Error getting product categories:', error)
    return {
      categories: ['Kamp Malzemeleri', 'Botlar', 'Çantalar', 'Giyim'],
      featured: []
    }
  }
}

// Geliştirilmiş ürün arama fonksiyonu - daha kapsamlı arama
async function getProductsBySearch(searchTerm: string) {
  try {
    const { supabase } = await import('~/server/utils/supabase')
    
    // Çoklu arama stratejisi
    const searchStrategies = [
      // Strateji 1: Tam eşleşme araması
      () => supabase
        .from('products')
        .select('id, name, slug, price, images, description, category, brand')
        .or(`name.ilike.%${searchTerm}%, description.ilike.%${searchTerm}%, brand.ilike.%${searchTerm}%, category.ilike.%${searchTerm}%`)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(4),
      
      // Strateji 2: Benzer terimlerle arama
      () => {
        const similarTerms = getSimilarTerms(searchTerm)
        const searchTerms = similarTerms.map(term => 
          `name.ilike.%${term}%, description.ilike.%${term}%, category.ilike.%${term}%`
        ).join(', ')
        
        return supabase
          .from('products')
          .select('id, name, slug, price, images, description, category, brand')
          .or(searchTerms)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(6)
      }
    ]

    // İlk stratejiyi dene
    const { data: exactResults, error: exactError } = await searchStrategies[0]()
    
    if (!exactError && exactResults && exactResults.length > 0) {
      return exactResults
    }

    // Eğer tam eşleşme yoksa benzer terimlerle ara
    const { data: similarResults, error: similarError } = await searchStrategies[1]()
    
    if (!similarError && similarResults && similarResults.length > 0) {
      // Rastgele karıştır ve 4 tane al
      for (let i = similarResults.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [similarResults[i], similarResults[j]] = [similarResults[j], similarResults[i]]
      }
      return similarResults.slice(0, 4)
    }

    return []
  } catch (error) {
    console.error('Product search error:', error)
    return []
  }
}

// Geliştirilmiş akıllı öneri sistemi
async function getRecommendedProducts(category?: string, userMessage?: string) {
  try {
    const { supabase } = await import('~/server/utils/supabase')
    
    // 1. Önce tam eşleşme arama yap
    let exactMatches = await searchExactMatches(userMessage, category)
    
    if (exactMatches.length > 0) {
      return exactMatches.slice(0, 4)
    }

    // 2. Benzer ürünleri ara
    let similarProducts = await searchSimilarProducts(userMessage, category)
    
    if (similarProducts.length > 0) {
      return similarProducts.slice(0, 4)
    }

    // 3. Kategori bazlı öneriler
    if (category) {
      const categoryProducts = await searchByCategory(category)
      if (categoryProducts.length > 0) {
        return categoryProducts.slice(0, 4)
      }
    }

    // 4. Son çare: popüler ürünler
    return await getGeneralRecommendations()

  } catch (error) {
    console.error('Recommended products error:', error)
    return []
  }
}

// Tam eşleşme araması
async function searchExactMatches(userMessage?: string, category?: string) {
  if (!userMessage) return []
  
  try {
    const { supabase } = await import('~/server/utils/supabase')
    const keywords = extractKeywords(userMessage)
    
    if (keywords.length === 0) return []

    let query = supabase
      .from('products')
      .select('id, name, slug, price, images, description, category, brand')
      .eq('is_active', true)

    // Tam eşleşme araması - ürün ismi veya açıklama
    const exactSearchTerms = keywords.map(k => 
      `name.ilike.%${k}%, description.ilike.%${k}%, brand.ilike.%${k}%`
    ).join(', ')
    
    const { data, error } = await query
      .or(exactSearchTerms)
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Exact match search error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Exact match search error:', error)
    return []
  }
}

// Benzer ürün araması
async function searchSimilarProducts(userMessage?: string, category?: string) {
  if (!userMessage) return []
  
  try {
    const { supabase } = await import('~/server/utils/supabase')
    
    // Mesajdan intent çıkar
    const intent = extractProductIntent(userMessage)
    const keywords = extractKeywords(userMessage)
    
    let query = supabase
      .from('products')
      .select('id, name, slug, price, images, description, category, brand')
      .eq('is_active', true)

    // Intent bazlı arama
    if (intent.use_case) {
      // Kullanım amacına göre ara (örn: "yürüyüş için", "kamp için")
      query = query.or(`description.ilike.%${intent.use_case}%, category.ilike.%${intent.use_case}%`)
    } else if (intent.feature) {
      // Özellik bazlı arama (örn: "su geçirmez", "hafif")
      query = query.or(`description.ilike.%${intent.feature}%, name.ilike.%${intent.feature}%`)
    } else if (keywords.length > 0) {
      // Anahtar kelime bazlı benzer arama
      const similarTerms = keywords.flatMap(k => getSimilarTerms(k))
      const searchTerms = similarTerms.map(k => 
        `name.ilike.%${k}%, description.ilike.%${k}%, category.ilike.%${k}%`
      ).join(', ')
      query = query.or(searchTerms)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Similar products search error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Similar products search error:', error)
    return []
  }
}

// Kategori bazlı arama - rastgele sıralama ile
async function searchByCategory(category: string) {
  try {
    const { supabase } = await import('~/server/utils/supabase')
    
    // Kategori ürünlerini rastgele getir
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, price, images, description, category, brand')
      .eq('is_active', true)
      .ilike('category', `%${category}%`)
      .order('id', { ascending: Math.random() > 0.5 }) // Rastgele sıralama
      .limit(6) // Daha fazla getir

    if (error) {
      console.error('Category search error:', error)
      return []
    }

    const products = data || []
    
    // Ürünleri karıştır ve 4 tane al
    if (products.length > 4) {
      for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]]
      }
      return products.slice(0, 4)
    }

    return products
  } catch (error) {
    console.error('Category search error:', error)
    return []
  }
}

// Ürün amacını çıkar
function extractProductIntent(message: string) {
  const msg = message.toLowerCase()
  
  // Kullanım amacı tespiti
  const useCases = {
    'yürüyüş': ['yürüyüş', 'hiking', 'doğa', 'patika'],
    'kamp': ['kamp', 'camping', 'çadır', 'bivak'],
    'taktik': ['taktik', 'tactical', 'operasyon', 'görev'],
    'günlük': ['günlük', 'şehir', 'sokak', 'casual'],
    'kış': ['kış', 'soğuk', 'kar', 'winter'],
    'yaz': ['yaz', 'sıcak', 'summer', 'hafif']
  }
  
  // Özellik tespiti
  const features = {
    'su_gecirmez': ['su geçirmez', 'waterproof', 'suya dayanıklı'],
    'nefes_alir': ['nefes alır', 'breathable', 'havalandırma'],
    'hafif': ['hafif', 'light', 'lightweight'],
    'dayanikli': ['dayanıklı', 'sağlam', 'güçlü', 'robust']
  }
  
  let use_case = null
  let feature = null
  
  // Use case tespiti
  for (const [key, terms] of Object.entries(useCases)) {
    if (terms.some(term => msg.includes(term))) {
      use_case = key
      break
    }
  }
  
  // Feature tespiti
  for (const [key, terms] of Object.entries(features)) {
    if (terms.some(term => msg.includes(term))) {
      feature = key
      break
    }
  }
  
  return { use_case, feature }
}

// Benzer terimleri getir
function getSimilarTerms(keyword: string): string[] {
  const synonyms: { [key: string]: string[] } = {
    'bot': ['ayakkabı', 'footwear', 'shoe', 'boot'],
    'çanta': ['bag', 'sırtlık', 'torba', 'backpack'],
    'kamp': ['camping', 'outdoor', 'doğa', 'bivak'],
    'taktik': ['tactical', 'askeri', 'operasyon'],
    'yürüyüş': ['hiking', 'trekking', 'doğa yürüyüşü'],
    'su': ['water', 'suya', 'geçirmez', 'proof'],
    'çadır': ['tent', 'barınak', 'shelter'],
    'uyku': ['sleep', 'sleeping', 'dinlenme']
  }
  
  return synonyms[keyword] || [keyword]
}

// Genel öneriler (hiçbir şey bulunamazsa) - Rastgele ürünler
async function getGeneralRecommendations(sessionId?: number) {
  try {
    const { supabase } = await import('~/server/utils/supabase')
    
    // Rastgele ürünler getirmek için farklı yaklaşımlar dene
    const strategies = [
      // Strateji 1: Son eklenen ürünler
      () => supabase
        .from('products')
        .select('id, name, slug, price, images, description, category, brand')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(4),
      
      // Strateji 2: Rastgele ID ile
      () => supabase
        .from('products')
        .select('id, name, slug, price, images, description, category, brand')
        .eq('is_active', true)
        .order('id', { ascending: Math.random() > 0.5 })
        .limit(4),
        
      // Strateji 3: Farklı kategorilerden
      () => supabase
        .from('products')
        .select('id, name, slug, price, images, description, category, brand')
        .eq('is_active', true)
        .not('category', 'is', null)
        .limit(6)
    ]

    // SessionId bazlı rastgele strateji seç (daha tutarlı rastgelelik)
    const sessionSeed = sessionId || Date.now()
    const strategyIndex = Math.floor((sessionSeed * 7919) % strategies.length) // Prime sayı ile daha iyi dağılım
    const randomStrategy = strategies[strategyIndex]
    const { data, error } = await randomStrategy()

    if (error) {
      console.error('General recommendations error:', error)
      return []
    }

    // Eğer 6 ürün geldiyse karıştır ve 4 tanesini al
    const products = data || []
    if (products.length > 4) {
      // Array'i karıştır
      for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]]
      }
      return products.slice(0, 4)
    }

    return products
  } catch (error) {
    console.error('General recommendations error:', error)
    return []
  }
}

// Mesajdan kategori çıkar - Geliştirilmiş versiyon
function extractCategoryFromMessage(message: string): string | undefined {
  const msg = message.toLowerCase()
  
  // Önce intent'i kontrol et
  const intent = extractProductIntent(message)
  if (intent.use_case) {
    return intent.use_case
  }
  
  // Kategori anahtar kelimeleri
  const categoryMap = {
    'kamp': ['kamp', 'çadır', 'uyku', 'tulum', 'camping', 'outdoor', 'bivak'],
    'bot': ['bot', 'ayakkabı', 'footwear', 'shoe', 'yürüyüş', 'hiking'],
    'çanta': ['çanta', 'sırt', 'tactical', 'bag', 'backpack', 'torba'],
    'giyim': ['giyim', 'ceket', 'pantolon', 'kıyafet', 'clothing', 'jacket'],
    'aksesuar': ['aksesuar', 'ekipman', 'malzeme', 'gear', 'accessory']
  }
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => msg.includes(keyword))) {
      return category
    }
  }
  
  return undefined
}

// Anahtar kelimeleri çıkar
function extractKeywords(message: string): string[] {
  const stopWords = ['bir', 'bu', 'şu', 'o', 'ne', 'nasıl', 'hangi', 'için', 'ile', 've', 'veya', 'ama', 'fakat']
  const words = message.toLowerCase().split(/\s+/)
  return words.filter(word => 
    word.length > 2 && 
    !stopWords.includes(word) &&
    !word.match(/^\d+$/)
  ).slice(0, 3)
}

// Basit bot yanıtları (OpenAI olmadan)
function handleSimpleBot(message: string) {
  const msg = message.toLowerCase()
  let response = ''
  let action = 'recommend'
  
  if (msg.includes('bot') || msg.includes('ayakkabı')) {
    response = 'Bot kategorimizde su geçirmez yürüyüş botları, kış botları ve taktik botlar bulunmaktadır. Size özel ürünler gösteriyorum.'
  } else if (msg.includes('kamp') || msg.includes('çadır')) {
    response = 'Kamp malzemelerimiz arasında çadırlar, uyku tulumları ve kamp ekipmanları var. En popüler ürünlerimizi gösteriyorum.'
  } else if (msg.includes('sipariş')) {
    response = 'Sipariş durumunuzu kontrol etmek için sipariş numaranızı paylaşabilir veya profilim sayfasından takip edebilirsiniz.'
    action = 'order_status'
  } else {
    response = 'Merhaba! Moss Tactical ürünleri hakkında size yardımcı olabilmek için popüler ürünlerimizi gösteriyorum.'
  }
  
  return {
    message: response,
    action,
    products: [],
    suggestions: generateQuickActions(message, action)
  }
}

// Hızlı aksiyonları oluştur
function generateQuickActions(userMessage: string, action?: string): string[] {
  const message = userMessage.toLowerCase()
  
  if (action === 'order_status') {
    return [
      'Sipariş numaramı unuttum',
      'Kargo durumu',
      'İade talep et'
    ]
  }
  
  if (message.includes('kamp')) {
    return [
      'Su geçirmez çadır',
      'Uyku tulumu önerisi',
      'Kamp ocağı modelleri'
    ]
  }
  
  if (message.includes('bot')) {
    return [
      'Yürüyüş botu modelleri',
      'Su geçirmez bot',
      'Kış botu önerileri'
    ]
  }
  
  // Varsayılan aksiyonlar
  return [
    'Popüler ürünler',
    'Yeni çıkan ürünler',
    'İndirimli ürünler',
    'Kategorileri göster'
  ]
} 