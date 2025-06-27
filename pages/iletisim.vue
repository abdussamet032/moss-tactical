<template>
  <div class="max-w-xl mx-auto py-10 px-4">
    <h1 class="text-2xl font-bold mb-6">İletişim</h1>
    <form class="bg-white rounded shadow p-6 flex flex-col gap-4">
      <input type="text" placeholder="Adınız Soyadınız" class="border rounded px-3 py-2" />
      <input type="email" placeholder="E-posta Adresiniz" class="border rounded px-3 py-2" />
      <textarea placeholder="Mesajınız" class="border rounded px-3 py-2"></textarea>
      <button type="submit" class="bg-primary text-white rounded px-4 py-2 font-semibold hover:bg-primary-dark transition">Gönder</button>
    </form>
    <div class="mt-8 bg-gray-50 rounded p-4">
      <div class="font-semibold mb-2">İletişim Bilgileri</div>
      <div class="text-sm text-gray-700">Adres: İstanbul, Türkiye</div>
      <div class="text-sm text-gray-700">E-posta: info@mosstactical.com</div>
      <div class="text-sm text-gray-700">Telefon: +90 555 111 22 33</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Basit iletişim formu, submit işlemi eklenmedi
</script> 