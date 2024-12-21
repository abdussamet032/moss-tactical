export const useStorage = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const BUCKET_NAME = 'products'

  /**
   * Bucket varlığını kontrol et
   */
  const checkBucket = async () => {
    try {
      // Önce oturum durumunu kontrol et
      if (!user.value) {
        throw new Error('Oturum açmanız gerekiyor')
      }

      console.log('Bucket kontrol ediliyor:', BUCKET_NAME)
      
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets()

      if (bucketsError) {
        console.error('Buckets listesi alınamadı:', bucketsError)
        throw bucketsError
      }

      console.log('Mevcut buckets:', buckets)

      const bucket = buckets.find(b => b.name === BUCKET_NAME)
      if (!bucket) {
        throw new Error(`Bucket '${BUCKET_NAME}' bulunamadı`)
      }

      return bucket
    } catch (error) {
      console.error('Bucket kontrol hatası:', error)
      throw error
    }
  }

  /**
   * Resmi Supabase Storage'a yükler
   */
  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Önce bucket'ı kontrol et
      await checkBucket()

      if (!file) {
        throw new Error('Dosya seçilmedi')
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        throw new Error('Sadece resim dosyaları yüklenebilir')
      }

      console.log('Yüklemeye başlanıyor:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        bucketName: BUCKET_NAME
      })

      // Benzersiz dosya adı oluştur
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${fileName}` // products/ prefix'ini kaldırdık

      // Dosyayı yükle
      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      console.log('Yükleme başarılı:', data)

      // Public URL'i al
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath)

      console.log('Public URL:', publicUrl)

      return publicUrl

    } catch (error) {
      console.error('Resim yükleme hatası:', error)
      throw error
    }
  }

  /**
   * Storage'dan resim silme
   */
  const deleteImage = async (url: string) => {
    try {
      await checkBucket()

      // URL'den dosya adını çıkar
      const fileName = url.split('/').pop()
      if (!fileName) {
        throw new Error('Geçersiz dosya yolu')
      }

      console.log('Silinecek dosya:', fileName)

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName])

      if (error) {
        console.error('Silme hatası:', error)
        throw error
      }

      console.log('Dosya başarıyla silindi')

    } catch (error) {
      console.error('Resim silme hatası:', error)
      throw error
    }
  }

  return {
    uploadImage,
    deleteImage,
    checkBucket
  }
} 