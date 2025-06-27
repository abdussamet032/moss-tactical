<template>
  <footer class="bg-gray-900 text-gray-200 pt-12 pb-6 px-4 mt-10">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
      <!-- Hakkımızda -->
      <div class="md:col-span-2 flex flex-col gap-3">
        <NuxtLink to="/" class="flex items-center gap-2 mb-2">
          <img src="/logo.png" alt="Moss Tactical" class="h-8 w-8" />
          <span class="text-xl font-bold tracking-tight">Moss Tactical</span>
        </NuxtLink>
        <p class="text-gray-400 text-sm max-w-xs">Taktik ve outdoor ekipmanlarda güvenilir adres. Kalite, hız ve müşteri memnuniyeti önceliğimizdir.</p>
      </div>
      <!-- Bilgi -->
      <div>
        <div class="font-semibold mb-2 text-base">Bilgi</div>
        <ul class="space-y-1 text-sm">
          <li><NuxtLink to="/gizlilik-politikasi" class="hover:text-primary">Gizlilik Politikası</NuxtLink></li>
          <li><NuxtLink to="/mesafeli-satis-sozlesmesi" class="hover:text-primary">Mesafeli Satış Sözleşmesi</NuxtLink></li>
          <li><NuxtLink to="/kvkk" class="hover:text-primary">KVKK</NuxtLink></li>
          <li><NuxtLink to="/kullanim-kosullari" class="hover:text-primary">Kullanım Koşulları</NuxtLink></li>
        </ul>
      </div>
      <!-- Hızlı Linkler -->
      <div>
        <div class="font-semibold mb-2 text-base">Hızlı Linkler</div>
        <ul class="space-y-1 text-sm">
          <li><NuxtLink to="/products" class="hover:text-primary">Tüm Ürünler</NuxtLink></li>
          <li><NuxtLink to="/cart" class="hover:text-primary">Sepetim</NuxtLink></li>
          <li><NuxtLink to="/profilim" class="hover:text-primary">Hesabım</NuxtLink></li>
          <li><NuxtLink to="/iletisim" class="hover:text-primary">İletişim</NuxtLink></li>
        </ul>
      </div>
      <!-- İletişim Bilgileri ve Sosyal Medya -->
      <div>
        <div class="font-semibold mb-2 text-base">İletişim</div>
        <ul class="space-y-1 text-sm">
          <li><span class="text-gray-400">Adres:</span> <span class="text-gray-300">İstanbul, Türkiye</span></li>
          <li><span class="text-gray-400">E-posta:</span> <a href="mailto:info@mosstactical.com" class="hover:text-primary">info@mosstactical.com</a></li>
          <li><span class="text-gray-400">Telefon:</span> <a href="tel:+905551112233" class="hover:text-primary">+90 555 111 22 33</a></li>
        </ul>
        <div class="flex gap-4 mt-4">
          <a href="https://instagram.com" target="_blank" rel="noopener" class="hover:text-primary transition-colors" aria-label="Instagram">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><rect width="20" height="20" x="2" y="2" rx="5" stroke-width="2"/><path d="M16.5 7.5h.01" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="4" stroke-width="2"/></svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener" class="hover:text-primary transition-colors" aria-label="Twitter">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path d="M22 5.92a8.38 8.38 0 01-2.36.65 4.13 4.13 0 001.82-2.27 8.19 8.19 0 01-2.6.99A4.11 4.11 0 0016.11 4c-2.27 0-4.11 1.84-4.11 4.11 0 .32.04.64.1.94C8.09 8.87 5.13 7.38 3.1 5.1c-.35.6-.55 1.3-.55 2.05 0 1.42.72 2.68 1.82 3.42a4.07 4.07 0 01-1.86-.51v.05c0 1.98 1.41 3.63 3.28 4a4.1 4.1 0 01-1.85.07c.52 1.62 2.03 2.8 3.82 2.83A8.24 8.24 0 012 19.54a11.62 11.62 0 006.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0022 5.92z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
          <a href="mailto:info@mosstactical.com" class="hover:text-primary transition-colors" aria-label="E-posta">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><rect width="20" height="16" x="2" y="4" rx="3" stroke-width="2"/><path d="M22 6.5l-8.5 7.5a2 2 0 01-2.5 0L2 6.5" stroke-width="2"/></svg>
          </a>
        </div>
      </div>
    </div>
    <div class="mt-10 text-center text-gray-500 text-xs border-t border-gray-800 pt-6">© {{ new Date().getFullYear() }} Moss Tactical. Tüm hakları saklıdır.</div>
  </footer>
</template>

<script setup lang="ts">
// Modern ve sade footer componenti
// Karmaşık bir mantık olmadığı için script kısmı sade bırakıldı
</script>

<script lang="ts">
export default defineComponent({})
</script> 