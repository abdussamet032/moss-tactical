import type { Product, ProductImage, ProductSize } from '~/types/product'
import { createSlug } from '~/utils/string'

export const useProducts = () => {
  const supabase = useSupabaseClient()
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const formatProduct = (product: any): Product => ({
    ...product,
    image_url: product.images.find((img: ProductImage) => img.is_primary)?.url || product.images[0]?.url,
    slug: createSlug(product.name),
    category: product.category?.name || '',
    total_stock: product.sizes.reduce((sum: number, size: ProductSize) => sum + size.stock, 0)
  })

  const getProducts = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { data: products, error: supabaseError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          images:product_images(*),
          sizes:product_sizes(*)
        `)
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError

      return products.map(formatProduct)

    } catch (err) {
      error.value = err as Error
      console.error('Ürünler getirilirken hata:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getProductBySlug = async (slug: string) => {
    loading.value = true
    error.value = null

    try {
      const { data: products, error: supabaseError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          images:product_images(*),
          sizes:product_sizes(*)
        `)

      if (supabaseError) throw supabaseError

      const product = products.find(p => createSlug(p.name) === slug)
      
      if (!product) {
        throw new Error('Ürün bulunamadı')
      }

      return formatProduct(product)

    } catch (err) {
      error.value = err as Error
      console.error('Ürün getirilirken hata:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getProductsByCategory = async (categorySlug: string) => {
    loading.value = true
    error.value = null

    try {
      const { data: products, error: supabaseError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories!inner(name, slug),
          images:product_images(*),
          sizes:product_sizes(*)
        `)
        .eq('categories.slug', categorySlug)
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError

      return products.map(formatProduct)

    } catch (err) {
      error.value = err as Error
      console.error('Kategori ürünleri getirilirken hata:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    getProducts,
    getProductBySlug,
    getProductsByCategory,
    loading,
    error
  }
}