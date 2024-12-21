<template>
  <footer class="bg-gray-50 border-t">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Kurumsal -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">Kurumsal</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/hakkimizda" class="text-gray-600 hover:text-gray-900">
                Hakkımızda
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/iletisim" class="text-gray-600 hover:text-gray-900">
                İletişim
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Müşteri Hizmetleri -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">Müşteri Hizmetleri</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/sss" class="text-gray-600 hover:text-gray-900">
                Sıkça Sorulan Sorular
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/kargo-takip" class="text-gray-600 hover:text-gray-900">
                Kargo Takip
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Yasal -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">Yasal</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/gizlilik" class="text-gray-600 hover:text-gray-900">
                Gizlilik Politikası
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/kullanim-kosullari" class="text-gray-600 hover:text-gray-900">
                Kullanım Koşulları
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- İletişim -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">Bizi Takip Edin</h3>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-gray-900">
              <Icon name="mdi:facebook" class="w-6 h-6" />
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-900">
              <Icon name="mdi:twitter" class="w-6 h-6" />
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-900">
              <Icon name="mdi:instagram" class="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t text-center text-gray-600">
        <p>&copy; {{ new Date().getFullYear() }} ModernShop. Tüm hakları saklıdır.</p>
      </div>
    </div>
  </footer>
</template> 