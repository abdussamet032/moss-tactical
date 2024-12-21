<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Yeni Ürün Ekle</h1>

    <form @submit.prevent="handleSubmit" class="max-w-2xl space-y-6">
      <!-- Temel Ürün Bilgileri -->
      <div class="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 class="font-semibold text-lg mb-4">Temel Bilgiler</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Ürün Adı</label>
            <input 
              v-model="product.name" 
              type="text" 
              required
              class="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Kategori</label>
            <select 
              v-model="product.category_id" 
              required
              class="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Kategori Seçin</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Fiyat (TL)</label>
            <input 
              v-model="product.price" 
              type="number" 
              step="0.01"
              required
              class="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Renk</label>
            <input 
              v-model="product.color" 
              type="text"
              class="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Açıklama</label>
          <textarea 
            v-model="product.description" 
            rows="4"
            class="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>
      </div>

      <!-- Görseller -->
      <div class="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 class="font-semibold text-lg mb-4">Ürün Görselleri</h2>
        
        <div class="space-y-4">
          <div v-for="(image, index) in product.images" :key="index" 
            class="flex items-center gap-4 p-4 border rounded-lg">
            <!-- Resim yükleme alanı -->
            <div class="flex-1">
              <input 
                type="file"
                accept="image/*"
                @change="(e) => handleImageUpload(e, index)"
                class="hidden"
                :ref="el => imageInputs[index] = el"
              >
              <div class="flex items-center gap-4">
                <!-- Önizleme -->
                <div v-if="image.url" class="w-24 h-24 relative">
                  <img 
                    :src="image.url" 
                    class="w-full h-full object-cover rounded-lg"
                    alt="Ürün görseli"
                  >
                  <button 
                    @click="removeImage(index)"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <Icon name="material-symbols:close" class="w-4 h-4" />
                  </button>
                </div>
                <!-- Yükleme butonu -->
                <button 
                  v-if="!image.url"
                  type="button"
                  @click="imageInputs[index].click()"
                  class="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <Icon name="material-symbols:upload" class="w-5 h-5" />
                  Görsel Yükle
                </button>
                <!-- Yükleniyor -->
                <div v-if="image.loading" class="flex items-center gap-2">
                  <div class="animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent"></div>
                  Yükleniyor...
                </div>
              </div>
            </div>

            <!-- Ana görsel seçimi -->
            <label class="flex items-center gap-2 whitespace-nowrap">
              <input 
                type="radio" 
                :name="'primary'" 
                :checked="image.is_primary"
                @change="setPrimaryImage(index)"
              >
              Ana Görsel
            </label>
          </div>
        </div>

        <!-- Yeni görsel ekleme butonu -->
        <button 
          type="button"
          @click="addImage"
          class="text-primary-600 hover:text-primary-800 flex items-center gap-2"
        >
          <Icon name="material-symbols:add-circle-outline" class="w-5 h-5" />
          Görsel Ekle
        </button>
      </div>

      <!-- Bedenler ve Stok -->
      <div class="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 class="font-semibold text-lg mb-4">Bedenler ve Stok</h2>
        
        <div class="space-y-4">
          <div v-for="(size, index) in product.sizes" :key="index" class="flex items-center gap-4">
            <input 
              v-model="size.size" 
              type="text" 
              placeholder="Beden"
              class="w-32 p-2 border rounded focus:ring-2 focus:ring-primary-500"
            >
            <input 
              v-model="size.stock" 
              type="number" 
              min="0"
              placeholder="Stok"
              class="w-32 p-2 border rounded focus:ring-2 focus:ring-primary-500"
            >
            <button 
              type="button"
              @click="removeSize(index)"
              class="text-red-600 hover:text-red-800"
            >
              <Icon name="material-symbols:delete-outline" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <button 
          type="button"
          @click="addSize"
          class="text-primary-600 hover:text-primary-800 flex items-center gap-2"
        >
          <Icon name="material-symbols:add-circle-outline" class="w-5 h-5" />
          Beden Ekle
        </button>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button 
          type="submit"
          :disabled="loading"
          class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {{ loading ? 'Kaydediliyor...' : 'Ürünü Kaydet' }}
        </button>
      </div>
    </form>

    <!-- Toplu Ürün Ekleme -->
    <div class="mb-8 bg-white p-6 rounded-lg shadow-sm">
      <h2 class="text-xl font-semibold mb-4">Toplu Ürün Ekleme (CSV)</h2>
      
      <!-- CSV Örnek Şablon İndirme -->
      <div class="mb-4">
        <button @click="downloadTemplate" 
          class="text-primary-600 hover:text-primary-700 flex items-center gap-2">
          <Icon name="material-symbols:download" class="w-5 h-5" />
          CSV Şablonunu İndir
        </button>
      </div>

      <!-- CSV Yükleme -->
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div class="flex flex-col items-center">
          <input
            type="file"
            accept=".csv"
            @change="handleCsvUpload"
            class="hidden"
            ref="fileInput"
          >
          <button 
            @click="$refs.fileInput.click()"
            class="mb-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            :disabled="csvLoading"
          >
            {{ csvLoading ? 'Yükleniyor...' : 'CSV Dosyası Seç' }}
          </button>
          <p class="text-sm text-gray-500">veya dosyayı buraya sürükleyin</p>
        </div>

        <!-- Yüklenen Dosya Bilgisi -->
        <div v-if="csvFile" class="mt-4">
          <div class="flex items-center gap-2">
            <Icon name="material-symbols:file-present" class="w-5 h-5 text-primary-600" />
            <span>{{ csvFile.name }}</span>
            <button @click="csvFile = null" class="text-red-600 hover:text-red-700">
              <Icon name="material-symbols:close" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- İşlem Durumu -->
        <div v-if="csvProcessing" class="mt-4">
          <div class="flex items-center gap-2">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
            <span>İşleniyor: {{ processedCount }}/{{ totalCount }}</span>
          </div>
        </div>
      </div>

      <!-- Hata Mesajları -->
      <div v-if="csvErrors.length > 0" class="mt-4">
        <h3 class="font-medium text-red-600 mb-2">Hatalar:</h3>
        <ul class="list-disc list-inside text-sm text-red-600">
          <li v-for="(error, index) in csvErrors" :key="index">
            {{ error }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import Papa from 'papaparse'
import { saveAs } from 'file-saver'

const supabase = useSupabaseClient()
const loading = ref(false)
const categories = ref([])
const { uploadImage, deleteImage } = useStorage()
const imageInputs = ref([])

// Ürün state'i
const product = ref({
  name: '',
  description: '',
  price: '',
  category_id: '',
  color: '',
  images: [{ url: '', is_primary: true, loading: false }],
  sizes: [{ size: '', stock: 0 }]
})

// Kategorileri yükle
const loadCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    categories.value = data
  } catch (error) {
    console.error('Kategoriler yüklenirken hata:', error)
  }
}

// Görsel işlemleri
const addImage = () => {
  product.value.images.push({ url: '', is_primary: false, loading: false })
}

const removeImage = async (index) => {
  try {
    if (product.value.images[index].url) {
      await deleteImage(product.value.images[index].url)
    }
    product.value.images.splice(index, 1)
    
    // En az bir resim olsun
    if (product.value.images.length === 0) {
      addImage()
    }
    
    // Primary image kontrolü
    if (!product.value.images.some(img => img.is_primary)) {
      product.value.images[0].is_primary = true
    }
  } catch (error) {
    console.error('Resim silme hatası:', error)
    alert('Resim silinirken bir hata oluştu!')
  }
}

const setPrimaryImage = (index) => {
  product.value.images.forEach((image, i) => {
    image.is_primary = i === index
  })
}

// Beden işlemleri
const addSize = () => {
  product.value.sizes.push({ size: '', stock: 0 })
}

const removeSize = (index) => {
  product.value.sizes.splice(index, 1)
  if (product.value.sizes.length === 0) {
    addSize()
  }
}

// Form gönderimi
const handleSubmit = async () => {
  try {
    loading.value = true

    // Toplam stok hesapla
    const totalStock = product.value.sizes.reduce((sum, size) => sum + Number(size.stock), 0)

    // Ana ürünü ekle
    const { data: insertedProduct, error: productError } = await supabase
      .from('products')
      .insert([{  // Array içinde obje olarak gönder
        name: product.value.name,
        description: product.value.description,
        price: Number(product.value.price), // Number'a çevir
        stock: totalStock,
        category_id: product.value.category_id,
        color: product.value.color
      }])
      .select('*')  // Eklenen ürünü geri al
      .single()

    if (productError) throw productError

    console.log('Eklenen ürün:', insertedProduct) // Debug için

    // Görselleri ekle
    if (insertedProduct) {
      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(
          product.value.images
            .filter(image => image.url) // Boş URL'leri filtrele
            .map(image => ({
              product_id: insertedProduct.id,
              url: image.url,
              is_primary: image.is_primary
            }))
        )

      if (imagesError) throw imagesError

      // Bedenleri ekle
      const { error: sizesError } = await supabase
        .from('product_sizes')
        .insert(
          product.value.sizes
            .filter(size => size.size && size.stock) // Boş bedenleri filtrele
            .map(size => ({
              product_id: insertedProduct.id,
              size: size.size,
              stock: Number(size.stock) // Number'a çevir
            }))
        )

      if (sizesError) throw sizesError

      // Başarılı mesajı göster
      alert('Ürün başarıyla eklendi!')
      
      // Formu temizle
      product.value = {
        name: '',
        description: '',
        price: '',
        category_id: '',
        color: '',
        images: [{ url: '', is_primary: true, loading: false }],
        sizes: [{ size: '', stock: 0 }]
      }
    }

  } catch (error) {
    console.error('Ürün eklenirken hata:', error)
    alert('Ürün eklenirken bir hata oluştu: ' + error.message)
  } finally {
    loading.value = false
  }
}

// Sayfa yüklendiğinde kategorileri getir
onMounted(() => {
  loadCategories()
})

// Mevcut state tanımlamalarına ekleyin
const fileInput = ref(null)
const csvFile = ref(null)
const csvLoading = ref(false)
const csvProcessing = ref(false)
const csvErrors = ref([])
const processedCount = ref(0)
const totalCount = ref(0)

// CSV şablonunu indirme
const downloadTemplate = () => {
  const headers = [
    'name',
    'description',
    'price',
    'color',
    'category_id',
    'image_urls', // Virgülle ayrılmış URL'ler, ilk URL ana görsel
    'sizes' // Format: "42:5,43:7,44:5" (beden:stok)
  ]

  const sampleData = [
    'Askeri Bot',
    'Yüksek dayanıklılığa sahip askeri bot.',
    '999.99',
    'Haki',
    'kategori_id',
    'https://example.com/bot1.jpg,https://example.com/bot2.jpg',
    '42:5,43:7,44:5'
  ]

  const csv = Papa.unparse({
    fields: headers,
    data: [sampleData]
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, 'urun_sablonu.csv')
}

// CSV dosyası yükleme
const handleCsvUpload = async (event) => {
  try {
    const file = event.target.files[0]
    if (!file) return

    csvFile.value = file
    csvLoading.value = true
    csvErrors.value = []
    
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          csvProcessing.value = true
          totalCount.value = results.data.length
          processedCount.value = 0

          for (const row of results.data) {
            try {
              // Ana ürünü ekle
              const { data: productData, error: productError } = await supabase
                .from('products')
                .insert({
                  name: row.name,
                  description: row.description,
                  price: Number(row.price),
                  color: row.color,
                  category_id: row.category_id,
                  stock: calculateTotalStock(row.sizes)
                })
                .select()
                .single()

              if (productError) throw productError

              // Görselleri ekle (URL'lerden)
              if (row.image_urls) {
                const imageUrls = row.image_urls.split(',').map(url => url.trim())
                const images = imageUrls.map((url, index) => ({
                  product_id: productData.id,
                  url: url,
                  is_primary: index === 0
                }))

                const { error: imagesError } = await supabase
                  .from('product_images')
                  .insert(images)

                if (imagesError) throw imagesError
              }

              // Bedenleri ekle
              if (row.sizes) {
                const sizeList = row.sizes.split(',')
                const sizes = sizeList.map(sizeItem => {
                  const [size, stock] = sizeItem.trim().split(':')
                  return {
                    product_id: productData.id,
                    size: size.trim(),
                    stock: Number(stock)
                  }
                })

                const { error: sizesError } = await supabase
                  .from('product_sizes')
                  .insert(sizes)

                if (sizesError) throw sizesError
              }

              processedCount.value++
            } catch (error) {
              console.error('Ürün ekleme hatası:', error)
              csvErrors.value.push(`Satır ${processedCount.value + 1}: ${error.message}`)
            }
          }

          alert(`${processedCount.value} ürün başarıyla eklendi.`)
        } catch (error) {
          console.error('CSV işleme hatası:', error)
          csvErrors.value.push('CSV işlenirken bir hata oluştu: ' + error.message)
        } finally {
          csvProcessing.value = false
          csvLoading.value = false
          csvFile.value = null
          if (fileInput.value) fileInput.value.value = ''
        }
      },
      error: (error) => {
        console.error('CSV parse hatası:', error)
        csvErrors.value.push('CSV dosyası okunamadı: ' + error.message)
        csvLoading.value = false
      }
    })
  } catch (error) {
    console.error('Dosya yükleme hatası:', error)
    csvErrors.value.push('Dosya yüklenirken bir hata oluştu: ' + error.message)
    csvLoading.value = false
  }
}

// Toplam stok hesaplama yardımcı fonksiyonu
const calculateTotalStock = (sizesStr) => {
  if (!sizesStr) return 0
  return sizesStr.split(',')
    .reduce((total, size) => {
      const stock = Number(size.split(':')[1])
      return total + (isNaN(stock) ? 0 : stock)
    }, 0)
}

// Resim yükleme işlemi
const handleImageUpload = async (event, index) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    product.value.images[index].loading = true

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      throw new Error('Lütfen sadece resim dosyası seçin')
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Dosya boyutu 5MB\'dan küçük olmalıdır')
    }

    // Eski resmi sil (varsa)
    if (product.value.images[index].url) {
      try {
        await deleteImage(product.value.images[index].url)
      } catch (error) {
        console.warn('Eski resim silinirken hata:', error)
        // Eski resim silinememesi kritik bir hata değil, devam edebiliriz
      }
    }

    // Yeni resmi yükle
    const publicUrl = await uploadImage(file)
    
    if (!publicUrl) {
      throw new Error('Resim URL\'i alınamadı')
    }

    product.value.images[index].url = publicUrl

  } catch (error) {
    console.error('Resim yükleme hatası:', error)
    alert(error.message || 'Resim yüklenirken bir hata oluştu!')
    
    // Hata durumunda mevcut image state'ini temizle
    product.value.images[index].url = ''
  } finally {
    product.value.images[index].loading = false
    // Input'u temizle ki aynı dosyayı tekrar seçebilsin
    if (imageInputs.value[index]) {
      imageInputs.value[index].value = ''
    }
  }
}
</script> 