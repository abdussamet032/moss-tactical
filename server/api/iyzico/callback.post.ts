import Iyzipay from 'iyzipay'

export default defineEventHandler(async (event) => {
  // Türkçe: iyzico'dan gelen callback POST verilerini al
  const { token } = await readBody(event)
  
  if (!token) {
    // Token yoksa hata sayfasına yönlendir
    return sendRedirect(event, '/cart/payment-result?error=no-token', 302)
  }

  // Token'ı query string ile birlikte payment-result sayfasına yönlendir
  return sendRedirect(event, `/cart/payment-result?token=${token}`, 302)
}) 