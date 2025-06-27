<script setup lang="ts">
/* context7: homepage-layout @mcps=7 */
// Nuxt 3 composable ile kullanıcı ve yüklenme durumunu alıyoruz
const { user, loading } = useAuth()

// Ürünleri API'den çek
const {
  data: productsRes,
  pending: productsPending,
  error: productsError
} = await useFetch('/api/products?page=1&perPage=3', { key: 'home-products' })

// API'den dönen ürünler (ProductWithDetails[] bekleniyor)
const products = computed(() => productsRes.value?.data || [])

// Kategorileri API'den çek (ana sayfa için düz liste yeterli)
const {
  data: categoriesRes,
  pending: categoriesPending,
  error: categoriesError
} = await useFetch('/api/categories', { key: 'home-categories' })
const categories = computed(() => categoriesRes.value?.data || [])

// E-posta bülteni için reaktif değişkenler
const newsletterEmail = ref('')
const newsletterPending = ref(false)
const newsletterSuccess = ref('')
const newsletterError = ref('')

// Bülten abonelik formu gönderimi
async function handleNewsletter() {
  newsletterPending.value = true
  newsletterSuccess.value = ''
  newsletterError.value = ''
  // $fetch ile modern POST isteği
  try {
    await $fetch('/api/newsletter', {
      method: 'POST',
      body: { email: newsletterEmail.value }
    })
    newsletterSuccess.value = 'Başarıyla abone oldunuz! Teşekkürler.'
    newsletterEmail.value = ''
  } catch (error) {
    newsletterError.value = 'Bir hata oluştu. Lütfen tekrar deneyin.'
  }
  newsletterPending.value = false
}
</script>

<template>
  <section class="relative min-h-screen flex items-center justify-center bg-neutral-50 overflow-hidden">
    <!-- Arka plan video -->
    <video
      src="../public/videos/anaSayfa.mp4"
      autoplay
      loop
      muted
      playsinline
      alt="Taktik Ekipman Poster"
      class="absolute inset-0 w-full h-full object-cover opacity-70"
    />
    <!-- Gradient overlay: daha modern ve okunaklı bir görünüm için -->
  
    <!-- Hero içerik: sade ve merkezi tasarım -->
    <div class="relative z-10 text-center px-4 max-w-3xl mx-auto">
      <!-- Sade ve net başlık -->
      <h1 class="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
        <span class="block mb-2 text-primary-700">TAKTİK EKİPMANLARDA</span>
        <span class="bg-gradient-to-r from-primary-700 via-primary-400 to-accent-500 bg-clip-text text-transparent animate-gradient-x">YENİ SEZON</span>
      </h1>
      <!-- Kısa açıklama - Sade ve net -->
      <p class="text-lg md:text-xl mb-8 mx-auto font-medium text-primary-700">
        En kaliteli askeri ve outdoor ürünlerle <span class="bg-gradient-to-r from-accent-500 via-primary-400 to-primary-700 bg-clip-text text-transparent font-bold animate-gradient-x">macerana güç kat!</span>
      </p>
      <!-- Sade CTA butonu - BaseButton kullanarak -->
      <BaseButton 
        variant="primary" 
        size="lg" 
        rounded="full"
        to="/products"
        class="bg-gradient-to-r from-primary-700 via-primary-500 to-accent-500 shadow-lg hover:from-primary-800 hover:to-accent-600 hover:via-primary-600 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden animate-gradient-x border-0 text-white"
      >
        <span class="relative z-10 flex items-center justify-center">
          ÜRÜNLERE GÖZ AT
          <!-- SVG ok ikonu -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </BaseButton>
    </div>
  </section>

  <!-- Öne Çıkan Ürünler Bölümü -->
  <section class="py-20 bg-neutral-50 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Başlık: animasyonlu -->
      <h2 class="text-3xl font-bold text-primary-500 mb-8 text-center tracking-tight animate-section-title">
        Öne Çıkan Ürünler
      </h2>
      
      <!-- Yükleniyor durumu: ikon ve animasyon -->
      <div v-if="productsPending" class="flex flex-col items-center justify-center py-12 text-lg text-primary-400 animate-fade-in">
        <svg class="w-8 h-8 mb-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        Yükleniyor...
      </div>
      
      <!-- Hata durumu: ikon ve animasyon -->
      <div v-else-if="productsError" class="flex flex-col items-center justify-center py-12 text-error animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Ürünler yüklenirken hata oluştu.
      </div>
      
      <div v-else>
        <div v-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <!-- Ürün kartlarını sırayla fade-in ile gösteriyoruz -->
          <BaseProductCard
            v-for="(product, idx) in products"
            :key="product.id"
            :product="product"
            :class="'animate-card-fade-in'"
            :style="{ animationDelay: (idx * 120) + 'ms' }"
          />
        </div>
        
        <!-- Daha Fazla Ürün Gör butonu: BaseButton kullanarak -->
        <div v-if="products.length > 0" class="flex justify-center mt-10 animate-fade-in">
          <BaseButton 
            variant="primary" 
            size="lg" 
            rounded="full"
            to="/products"
            class="shadow-md transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            <span class="flex items-center">
              Daha Fazla Ürün Gör
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </BaseButton>
        </div>
        
        <div v-else class="flex flex-col items-center text-primary-400 py-12 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
          Ürün bulunamadı.
        </div>
      </div>
    </div>
  </section>

  <!-- Kategoriler Bölümü: Modern grid, hover animasyonlu -->
  <section class="py-20 relative overflow-hidden bg-neutral-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-primary-700 mb-10 text-center tracking-tight animate-section-title">
        Kategoriler
      </h2>
      
      <div v-if="categoriesPending" class="flex flex-col items-center justify-center py-12 text-lg text-primary-400 animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mb-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Kategoriler yükleniyor...
      </div>
      
      <div v-else-if="categoriesError" class="flex flex-col items-center justify-center py-12 text-error animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Kategoriler yüklenirken hata oluştu.
      </div>
      
      <div v-else>
        <div v-if="categories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <!-- Modern kategori kartı: görsel, badge ve gradientli başlık -->
          <NuxtLink
            v-for="(cat, idx) in categories.slice(0, 5)"
            :key="cat.id"
            :to="`/products?category=${cat.slug}`"
            class="group relative overflow-hidden bg-white rounded-2xl shadow-md border border-primary-100 p-0 flex flex-col items-center hover:bg-primary-50 hover:shadow-lg transition-all duration-300 animate-card-fade-in"
            :style="{ animationDelay: (idx * 100) + 'ms' }"
          >
            <!-- Kategori görseli: örnek/placeholder veya kategoriye özel -->
            <div class="w-full h-32 md:h-36 flex items-center justify-center bg-neutral-100 border-b border-primary-50 overflow-hidden">
              <img
                :src="cat.image || 'https://source.unsplash.com/400x200/?outdoor,gear,' + cat.name"
                :alt="cat.name"
                class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <!-- Badge veya kategori etiketi -->
            <div class="absolute top-3 left-3 bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              {{ cat.name.charAt(0) }}
            </div>
            <!-- Kategori adı ve açıklama -->
            <div class="flex-1 flex flex-col items-center justify-center p-5 w-full">
              <div class="text-lg font-bold bg-gradient-to-r from-primary-700 via-primary-400 to-accent-500 bg-clip-text text-transparent text-center mb-2 animate-gradient-x">
                {{ cat.name }}
              </div>
              <div class="text-sm text-primary-600 text-center line-clamp-2 min-h-[36px]">
                {{ cat.description || 'Outdoor ve taktik ekipmanlar kategorisi.' }}
              </div>
            </div>
            <!-- Hover durumunda görünen ok ikonu -->
            <div class="absolute bottom-4 right-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </NuxtLink>
        </div>
        
        <div v-else class="flex flex-col items-center text-primary-400 py-12 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
          Kategori bulunamadı.
        </div>
        
        <!-- Tüm Kategoriler butonu - BaseButton kullanarak -->
        <div class="flex justify-center mt-10 animate-fade-in">
          <BaseButton 
            variant="primary" 
            size="lg" 
            rounded="full"
            to="/products"
            class="shadow-md transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            Tüm Kategoriler
          </BaseButton>
        </div>
      </div>
    </div>
  </section>

  <!-- Sizden Gelenler (Müşteri Yorumları) Bölümü -->
  <section class="py-20 relative overflow-hidden bg-neutral-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <h2 class="text-3xl font-bold text-primary-700 mb-10 text-center tracking-tight animate-section-title">
        Sizden Gelenler
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Yorum Kartı 1 -->
        <div class="backdrop-blur-sm bg-white/80 rounded-2xl border border-primary-100 shadow-md p-8 flex flex-col items-center text-center animate-card-fade-in hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 relative z-10">
          <div class="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 text-xl font-bold mb-4">
            EK
          </div>
          <p class="text-primary-600 text-lg mb-4">"Siparişim çok hızlı geldi ve ürünler gerçekten kaliteli. Outdoor aktivitelerimde vazgeçilmezim oldu!"</p>
          <span class="font-semibold text-primary-500">Emre K.</span>
        </div>
        
        <!-- Yorum Kartı 2 -->
        <div class="backdrop-blur-sm bg-white/80 rounded-2xl border border-primary-100 shadow-md p-8 flex flex-col items-center text-center animate-card-fade-in hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 relative z-10" style="animation-delay: 120ms;">
          <div class="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 text-xl font-bold mb-4">
            ZA
          </div>
          <p class="text-primary-600 text-lg mb-4">"Hem askeri hem de günlük kullanım için harika ürünler. Müşteri hizmetleri de çok ilgiliydi."</p>
          <span class="font-semibold text-primary-500">Zeynep A.</span>
        </div>
        
        <!-- Yorum Kartı 3 -->
        <div class="backdrop-blur-sm bg-white/80 rounded-2xl border border-primary-100 shadow-md p-8 flex flex-col items-center text-center animate-card-fade-in hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 relative z-10" style="animation-delay: 240ms;">
          <div class="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 text-xl font-bold mb-4">
            AD
          </div>
          <p class="text-primary-600 text-lg mb-4">"Fiyat/performans olarak çok memnun kaldım. Tavsiye ederim!"</p>
          <span class="font-semibold text-primary-500">Ahmet D.</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Avantajlar/Özellikler Bölümü: Modern ve minimalist, SVG ikon + metin -->
  <section class="relative py-16 bg-neutral-50 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Hızlı Teslimat -->
        <div class="group bg-white rounded-xl border border-primary-100 shadow-md p-6 flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <!-- SVG Kamyon ikonu -->
          <div class="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4a1 1 0 01-1-1V7a1 1 0 011-1h3m5 0v6a1 1 0 001 1H6a1 1 0 00-1 1v3a1 1 0 001 1h1" />
            </svg>
          </div>
          <div class="text-lg font-bold text-primary-700 mb-2">Hızlı Teslimat</div>
          <div class="text-primary-600 text-center">Siparişlerinizi en kısa sürede ulaştırıyoruz.</div>
        </div>
        
        <!-- Ücretsiz Kargo -->
        <div class="group bg-white rounded-xl border border-primary-100 shadow-md p-6 flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div class="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div class="text-lg font-bold text-primary-700 mb-2">Ücretsiz Kargo</div>
          <div class="text-primary-600 text-center">Kargo her zaman ücretsiz.</div>
        </div>
        
        <!-- Düşük Fiyat Garantisi -->
        <div class="group bg-white rounded-xl border border-primary-100 shadow-md p-6 flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div class="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div class="text-lg font-bold text-primary-700 mb-2">Düşük Fiyat Garantisi</div>
          <div class="text-primary-600 text-center">Her zaman en uygun fiyatlar.</div>
        </div>
        
        <!-- 7/24 Hizmet -->
        <div class="group bg-white rounded-xl border border-primary-100 shadow-md p-6 flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div class="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="text-lg font-bold text-primary-700 mb-2">7/24 Hizmet</div>
          <div class="text-primary-600 text-center">Her zaman yanınızdayız.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- E-posta Bülteni Abonelik Bölümü: Modern, resimli ve sade -->
  <section class="relative py-20 bg-neutral-50 flex items-center justify-center overflow-hidden">
    <div class="max-w-5xl w-full mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
      <!-- Görsel kısmı -->
      <div class="flex-shrink-0 w-full md:w-1/2 flex justify-center mb-8 md:mb-0 relative overflow-hidden rounded-2xl shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Doğa Manzarası" 
          class="w-full h-80 object-cover" 
          loading="lazy" 
        />
        <div class="absolute inset-0 bg-gradient-to-t from-primary-500/60 to-transparent"></div>
      </div>
      
      <!-- Form ve açıklama -->
      <div class="w-full md:w-1/2 bg-neutral-100 rounded-2xl shadow-sm p-8 flex flex-col">
        <h3 class="text-2xl font-bold text-primary-700 mb-3">Bültenimize Katılın</h3>
        <p class="text-primary-600 mb-6">Kampanya ve yeniliklerden ilk siz haberdar olun. Doğayla uyumlu ürünlerimiz hakkında güncel bilgiler için abone olun.</p>
        
        <form class="w-full flex flex-col gap-4" @submit.prevent="handleNewsletter">
          <div class="relative">
            <!-- SVG E-posta ikonu -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              v-model="newsletterEmail"
              type="email"
              required
              class="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base bg-white"
              placeholder="E-posta adresiniz"
              autocomplete="email"
            />
          </div>
          
          <!-- BaseButton kullanarak form butonu -->
          <BaseButton
            type="submit"
            variant="primary"
            :loading="newsletterPending"
            class="w-full py-3 font-medium text-lg"
          >
            <span v-if="!newsletterPending">Abone Ol</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gönderiliyor...
            </span>
          </BaseButton>
        </form>
        
        <!-- Başarı ve hata mesajları -->
        <div v-if="newsletterSuccess" class="mt-4 text-success flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ newsletterSuccess }}</span>
        </div>
        <div v-if="newsletterError" class="mt-4 text-error flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ newsletterError }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Fade-in animasyonu */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 1.2s cubic-bezier(0.4,0,0.2,1) both;
}

/* Section başlığı için yukarıdan fade-in animasyonu */
@keyframes section-title {
  from { opacity: 0; transform: translateY(-40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-section-title {
  animation: section-title 1.1s cubic-bezier(0.4,0,0.2,1) both;
}

/* Kartlar için fade-in ve büyüme animasyonu, index'e göre gecikmeli */
@keyframes card-fade-in {
  from { opacity: 0; transform: scale(0.96) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-card-fade-in {
  animation: card-fade-in 0.9s cubic-bezier(0.4,0,0.2,1) both;
}

/* Kart hover efekti (BaseProductCard için) */
:deep(.base-product-card) {
  transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
}
:deep(.base-product-card:hover) {
  transform: translateY(-6px) scale(1.035);
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.12);
}

/* Gradient başlık animasyonu */
@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease-in-out infinite;
}
</style>

