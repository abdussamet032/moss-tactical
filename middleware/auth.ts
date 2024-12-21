export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  const protectedPages = [
    '/profil',
    '/siparislerim',
    '/odeme',
    '/hesap-ayarlari'
  ]

  if (to.path === '/giris' || to.path === '/kayit') {
    if (user.value) {
      return navigateTo('/')
    }
    return
  }

  if (protectedPages.includes(to.path) && !user.value) {
    return navigateTo('/giris')
  }
})