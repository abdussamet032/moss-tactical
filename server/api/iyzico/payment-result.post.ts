import Iyzipay from 'iyzipay'

export default defineEventHandler(async (event) => {
  // Request body'den token'ı al
  const body = await readBody(event)
  const token = body?.token


  const cartCookie = getCookie(event, 'cart')
  console.log("cartCookie: ",cartCookie);
  
  // Token kontrolü
  if (!token) {
    return { 
      status: 'error', 
      message: 'Ödeme token\'ı bulunamadı.'
    }
  }

  // İyzico config ayarlarını al
  const config = useRuntimeConfig()
  
  // Config kontrolü
  if (!config.public.iyzicoApiKey || !config.public.iyzicoSecretKey) {
    return { 
      status: 'error', 
      message: 'İyzico yapılandırması eksik.'
    }
  }

  // İyzico client'ı oluştur
  const iyzipay = new Iyzipay({
    apiKey: config.public.iyzicoApiKey,
    secretKey: config.public.iyzicoSecretKey,
    uri: config.public.iyzicoBaseUrl || 'https://sandbox-api.iyzipay.com'
  })

  // İyzico'ya gönderilecek istek
  const request = { 
    locale: 'tr', 
    token: token
  }

  // İyzico'dan ödeme sonucunu al
  const result = await new Promise((resolve) => {
    iyzipay.checkoutForm.retrieve(request, (err: any, result: any) => {
      // Hata varsa
      if (err) {
        resolve({ status: 'error', message: 'İyzico bağlantı hatası.' })
        return
      }
      
      // Sonuç yoksa
      if (!result) {
        resolve({ status: 'error', message: 'Ödeme bilgisi bulunamadı.' })
        return
      }
      
      // İyzico status başarısız ise
      if (result.status !== 'success') {
        resolve({ 
          status: 'error', 
          message: result.errorMessage || 'Ödeme işlemi başarısız.'
        })
        return
      }

      if(result.paymentStatus !== "SUCCESS"){
        resolve({ 
          status: 'error', 
          message: 'Ödeme işlemi başarısız.',
          paymentStatus: result.paymentStatus
        })
      }
      
      // Başarılı sonuç döndür
      resolve({ 
        status: result.status, 
        message: 'Ödeme başarıyla tamamlandı.',
        paymentStatus: result.paymentStatus,
        result: result.paymentStatus
      })
    })
  })

  return result
}) 