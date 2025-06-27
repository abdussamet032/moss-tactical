<template>
  <div class="max-w-lg mx-auto py-10 px-4">
    <h1 class="text-2xl font-bold mb-6 text-center">Profil Bilgilerim</h1>
    <form class="space-y-6 bg-white p-6 rounded-xl shadow-md" @submit.prevent="handleUpdateProfile">
      <div class="flex flex-col items-center gap-2">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="object-cover w-full h-full" />
          <span v-else class="text-gray-400 text-3xl">👤</span>
        </div>
        <input type="file" accept="image/*" @change="onFileChange" class="mt-2 px-3 py-2 border rounded-lg w-full text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
        <input type="text" v-model="form.full_name" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" placeholder="Ad Soyad" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
        <input type="tel" v-model="form.phone" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" placeholder="Telefon" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
        <input type="email" :value="user?.email" class="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500 text-sm" disabled />
      </div>
      <button type="submit" class="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors" :disabled="pending">
        {{ pending ? 'Kaydediliyor...' : 'Güncelle' }}
      </button>
      <div v-if="success" class="text-green-600 text-center text-sm">Profil başarıyla güncellendi.</div>
      <div v-if="error" class="text-red-600 text-center text-sm">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'profile' })
// Supabase Auth ve useFetch kullanımı
const { user, supabase, checkUser } = useAuth()
const form = ref({
  full_name: '',
  phone: '',
  avatar_url: ''
})
const pending = ref(false)
const success = ref(false)
const error = ref('')
const uploadFile = ref<File | null>(null)

// Avatar önizleme için computed
const avatarUrl = computed(() => form.value.avatar_url || user.value?.user_metadata?.avatar_url || '')

// Kullanıcı bilgilerini forma aktar
watchEffect(() => {
  if (user.value) {
    form.value.full_name = user.value.user_metadata?.full_name || ''
    form.value.phone = user.value.user_metadata?.phone || ''
    form.value.avatar_url = user.value.user_metadata?.avatar_url || ''
  }
})

// Dosya seçildiğinde çağrılır
function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadFile.value = target.files[0]
    // Geçici önizleme için
    form.value.avatar_url = URL.createObjectURL(target.files[0])
  }
}

// Profil güncelleme fonksiyonu
async function handleUpdateProfile() {
  pending.value = true
  error.value = ''
  success.value = false

  // Eğer yeni bir dosya seçildiyse önce Supabase Storage'a yükle
  let uploadedAvatarUrl = form.value.avatar_url
  if (uploadFile.value) {
    // user.value null kontrolü
    if (!user.value) {
      error.value = 'Kullanıcı bulunamadı.'
      pending.value = false
      return
    }
    // Dosya adını kullanıcı id'si ile eşsiz yap
    const fileExt = uploadFile.value.name.split('.').pop()
    const fileName = `${user.value.id}_${Date.now()}.${fileExt}`
    // Türkçe: Supabase Storage'a yükle
    const { data: storageData, error: storageError } = await supabase.storage.from('avatars').upload(fileName, uploadFile.value, { upsert: true })
    if (storageError) {
      error.value = storageError.message || 'Resim yüklenirken hata oluştu.'
      pending.value = false
      return
    }
    // Yüklenen dosyanın public URL'sini Supabase composable ile al
    const { getAvatarImageUrl } = useSupabaseStorage()
    uploadedAvatarUrl = getAvatarImageUrl(fileName)
  }

  // Supabase Auth user_metadata güncellemesi
  const { data, error: updateError } = await supabase.auth.updateUser({
    data: {
      full_name: form.value.full_name,
      phone: form.value.phone,
      avatar_url: uploadedAvatarUrl
    }
  })
  if (updateError) {
    error.value = updateError.message || 'Bir hata oluştu.'
  } else {
    success.value = true
    await checkUser() // Kullanıcı bilgisini güncelle
    uploadFile.value = null // Dosya seçimini sıfırla
  }
  pending.value = false
}
</script>

<style scoped>

</style>
