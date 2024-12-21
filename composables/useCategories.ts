export const useCategories = () => {
    const categories = {
        'bitki-caylari': {
            id: 1,
            name: 'Bitki Çayları',
            slug: 'bitki-caylari',
            description: 'Doğal ve organik bitki çayları',
            image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2'
        },
        'kis-caylari': {
            id: 2,
            name: 'Kış Çayları',
            slug: 'kis-caylari',
            description: 'Soğuk günler için sıcak lezzetler',
            image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3'
        },
        // Diğer kategoriler...
    }

    const getCategoryBySlug = (slug: string) => {
        return categories[slug] || null
    }

    const getAllCategories = () => {
        return Object.values(categories)
    }

    // Kategoriye ait ürünleri getir
    const getProductsByCategory = (categorySlug: string) => {
        const { getAllProducts } = useProducts()
        // Örnek filtreleme - gerçek uygulamada kategori ilişkisi kurulmalı
        return getAllProducts().filter((product, index) => index < 6)
    }

    return {
        getCategoryBySlug,
        getAllCategories,
        getProductsByCategory
    }
} 