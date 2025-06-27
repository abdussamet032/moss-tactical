/* context7: ai-search-suggestions @mcps=7 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const query = body.query?.toLowerCase() || ''
    
    // Basit fallback öneriler - AI olmadan da çalışabilir
    const suggestions = []
    
    if (query.includes('bot') || query.includes('ayakkabı')) {
      suggestions.push({
        text: 'Su geçirmez yürüyüş botları',
        description: 'Dayanıklı ve konforlu outdoor botlar',
        query: 'su geçirmez yürüyüş botu'
      })
      suggestions.push({
        text: 'Kış botları',
        description: 'Soğuk havalarda kullanım için',
        query: 'kış botu outdoor'
      })
    }
    
    if (query.includes('kamp') || query.includes('çadır')) {
      suggestions.push({
        text: 'Kamp malzemeleri seti',
        description: 'Çadır, uyku tulumu ve kamp ekipmanları',
        query: 'kamp malzemeleri set'
      })
      suggestions.push({
        text: 'Su geçirmez çadır',
        description: 'Yağmur ve nem korumalı çadırlar',
        query: 'su geçirmez çadır'
      })
    }
    
    if (query.includes('çanta') || query.includes('sırt')) {
      suggestions.push({
        text: 'Outdoor sırt çantası',
        description: 'Yürüyüş ve kamp için çantalar',
        query: 'outdoor sırt çantası'
      })
    }
    
    // Genel öneriler
    if (suggestions.length === 0) {
      suggestions.push(
        {
          text: 'Popüler kamp ürünleri',
          description: 'En çok tercih edilen kamp malzemeleri',
          query: 'popüler kamp ürünleri'
        },
        {
          text: 'Yürüyüş ekipmanları',
          description: 'Trekking ve hiking için gerekli malzemeler',
          query: 'yürüyüş ekipmanları'
        }
      )
    }
    
    return {
      suggestions: suggestions.slice(0, 4) // Max 4 öneri
    }
    
  } catch (error) {
    console.error('Search suggestions error:', error)
    return { suggestions: [] }
  }
}) 