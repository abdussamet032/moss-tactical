/* context7: supabase-storage @mcps=7 */
import { createClient } from '@supabase/supabase-js'

export const useSupabaseStorage = () => {
  // Supabase client'ı kullan
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )

  // Ürün resmi için public URL alma fonksiyonu
  function getProductImageUrl(imagePath: string | null | undefined): string {
    // Eğer resim yolu yoksa fallback kullan
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }

    // Eğer tam URL ise direkt döndür
    if (imagePath.startsWith('http')) {
      return imagePath
    }

    // Supabase storage'dan public URL al
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath)

    return data.publicUrl
  }

  // Avatar resmi için public URL alma fonksiyonu
  function getAvatarImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }

    if (imagePath.startsWith('http')) {
      return imagePath
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(imagePath)

    return data.publicUrl
  }

  // Dosya yükleme fonksiyonu
  async function uploadProductImage(file: File, fileName?: string): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const uploadFileName = fileName || `${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(uploadFileName, file, { upsert: true })

    if (error) {
      throw new Error(`Resim yüklenirken hata oluştu: ${error.message}`)
    }

    // Yüklenen dosyanın public URL'sini döndür
    return getProductImageUrl(data.path)
  }

  return {
    getProductImageUrl,
    getAvatarImageUrl,
    uploadProductImage,
    supabase
  }
} 