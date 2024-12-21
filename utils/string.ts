/**
 * Verilen metni URL-dostu bir slug'a dönüştürür
 * Örnek: "Mavi Kot Pantolon" -> "mavi-kot-pantolon"
 */
export const createSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')     // Boşlukları ve alt çizgileri tire ile değiştir
    .replace(/[ğ]/g, 'g')        // Türkçe karakterleri değiştir
    .replace(/[ü]/g, 'u')
    .replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i')
    .replace(/[ö]/g, 'o')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9-]/g, '')  // Alfanumerik ve tire dışındaki karakterleri kaldır
    .replace(/--+/g, '-')        // Ardışık tireleri tek tireye dönüştür
    .replace(/^-+|-+$/g, '')     // Baştaki ve sondaki tireleri kaldır
}

/**
 * Metni belirli bir uzunlukta kısaltır
 * Örnek: truncateText("Uzun bir metin", 10) -> "Uzun bir..."
 */
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Metni capitalize eder (ilk harfi büyük yapar)
 * Örnek: "mavi kot" -> "Mavi kot"
 */
export const capitalize = (text: string): string => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Para birimini formatlar
 * Örnek: formatCurrency(1234.56) -> "1.234,56 TL"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2
  }).format(amount)
} 