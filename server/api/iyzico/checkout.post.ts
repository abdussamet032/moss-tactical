/* context7: iyzico-checkout-fix @mcps=7 */
import Iyzipay from 'iyzipay'

export default defineEventHandler(async (event) => {
  // İstekten gerekli bilgileri al
  const { name, phone, email, address, city, district, zip, cart } = await readBody(event)

  // iyzico config ayarlarını al
  const config = useRuntimeConfig()
  const iyzipay = new Iyzipay({
    apiKey: config.public.iyzicoApiKey,
    secretKey: config.public.iyzicoSecretKey,
    uri: config.public.iyzicoBaseUrl
  })

  // Sepet toplamını hesapla - her item için (birim fiyat * miktar)
  let totalPrice = cart.reduce((sum: number, item: { price_per_unit: number, quantity: number }) => 
    sum + (item.price_per_unit * item.quantity), 0)
  
  // Fiyatları iki ondalık basamağa yuvarla
  totalPrice = Math.round(totalPrice * 100) / 100

  // İyzico checkout form initialize için minimum gerekli alanlar
  const request = {
    // Gerekli temel alanlar
    price: totalPrice.toString(),
    paidPrice: totalPrice.toString(),
    currency: 'TRY',
    callbackUrl: 'http://localhost:3000/api/iyzico/callback', // Callback endpoint'i
    // Buyer bilgileri (required)
    buyer: {
      id: String(Date.now()),
      name,
      surname: name, // Basitleştirme için aynı değer
      email,
      city,
      identityNumber: '11111111111',
      country: 'Turkey',
      registrationAddress: address
    },
    
    // Shipping address (PHYSICAL ürün varsa gerekli)
    shippingAddress: {
      contactName: name,
      city,
      country: 'Turkey',
      address
    },
    
    // Billing address (required)
    billingAddress: {
      contactName: name,
      city,
      country: 'Turkey',
      address
    },
    
    // Basket items - HER ITEM İÇİN TOPLAM FİYAT (birim fiyat * miktar)
    basketItems: cart.map((item: { price_per_unit: number, quantity: number, productId: string, productTitle: string }) => {
      const itemTotalPrice = item.price_per_unit * item.quantity
      return {
        id: item?.productId,
        name: item?.productTitle,
        category1: item?.productTitle,
        price: (Math.round(itemTotalPrice * 100) / 100).toString(), // Toplam fiyat (birim fiyat * miktar)
        itemType: "PHYSICAL"
      }
    })
  }

  // iyzico'ya ödeme başlatma isteği gönder
  return await new Promise((resolve) => {
    iyzipay.checkoutFormInitialize.create(request, (_err: any, result: any) => {
      // Başarısızsa hata mesajı dön
      if (!result || result.status !== 'success') {
        resolve({ error: true, message: result?.errorMessage || 'Ödeme başlatılamadı.' })
        return
      }
      // paymentPageUrl'i dön
      resolve({ paymentPageUrl: result.paymentPageUrl })
    })
  })
}) 