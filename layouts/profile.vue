<template>
  <div class="flex flex-col min-h-screen">
    <BaseNav />
    <div class="flex min-h-[70vh] bg-neutral-50 rounded-2xl shadow-card overflow-hidden">
      <!-- Modern Sidebar Başlangıcı -->
      <aside class="min-w-[90px] max-w-[260px] bg-neutral-200 py-8 px-4 border-r border-neutral-200 flex flex-col items-center md:items-start transition-all">
        <!-- Sidebar başlık -->
        <div class="mb-8 w-full flex items-center justify-center md:justify-start">
          <span class="text-xl font-bold text-primary-700 tracking-tight">Profil</span>
        </div>
        <nav class="w-full">
          <ul class="flex flex-col gap-2 w-full">
            <li>
              <NuxtLink to="/profilim" active-class="!bg-primary !text-white !shadow-cardHover" class="flex items-center gap-3 px-4 py-2 rounded-xl text-primary-700 font-medium transition-all duration-200 hover:bg-primary-hover hover:text-white hover:scale-[1.03] group">
                <span class="i-heroicons-user text-lg group-hover:text-white" />
                <span class="hidden md:inline">Profilim</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/profilim/siparislerim" active-class="!bg-primary !text-white !shadow-cardHover" class="flex items-center gap-3 px-4 py-2 rounded-xl text-primary-700 font-medium transition-all duration-200 hover:bg-primary-hover hover:text-white hover:scale-[1.03] group">
                <span class="i-heroicons-shopping-bag text-lg group-hover:text-white" />
                <span class="hidden md:inline">Siparişlerim</span>
              </NuxtLink>
            </li>
            <li>
              <button class="flex items-center gap-3 w-full px-4 py-2 rounded-xl bg-warning/10 text-warning font-medium transition-all duration-200 hover:bg-warning hover:text-white hover:scale-[1.03] mt-2 group" @click="logout">
                <span class="i-heroicons-arrow-left-on-rectangle text-lg group-hover:text-white" />
                <span class="hidden md:inline">Çıkış Yap</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <!-- Modern Sidebar Sonu -->
      <!-- İçerik Alanı -->
      <main class="flex-1 p-10 bg-neutral-50 min-h-full md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// context7: profile-layout @mcps=7
// Bu layout, profil sayfaları için ana renk paletine uygun bir sidebar ve içerik alanı sunar.
const { user, signOut } = useAuth()
const router = useRouter()
const logout = () => {
  signOut()
  router.push('/giris-yap')
}
</script>
