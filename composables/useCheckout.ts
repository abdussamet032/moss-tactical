export const useCheckout = () => {
    // Form state'i
    const checkoutForm = useState('checkoutForm', () => ({
        // Kişisel Bilgiler
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        
        // Adres Bilgileri
        address: '',
        city: '',
        district: '',
        zipCode: '',
        
        // Kart Bilgileri
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCVC: '',
        
        // Fatura Bilgileri
        sameAsShipping: true,
        billingAddress: '',
        billingCity: '',
        billingDistrict: '',
        billingZipCode: ''
    }))

    // Form validasyonu
    const validateForm = () => {
        const errors = []
        const form = checkoutForm.value

        // Kişisel bilgiler kontrolü
        if (!form.firstName) errors.push('Ad alanı zorunludur')
        if (!form.lastName) errors.push('Soyad alanı zorunludur')
        if (!form.email) errors.push('E-posta alanı zorunludur')
        if (!form.phone) errors.push('Telefon alanı zorunludur')

        // Adres kontrolü
        if (!form.address) errors.push('Adres alanı zorunludur')
        if (!form.city) errors.push('İl alanı zorunludur')
        if (!form.district) errors.push('İlçe alanı zorunludur')

        // Kart bilgileri kontrolü
        if (!form.cardNumber) errors.push('Kart numarası zorunludur')
        if (!form.cardName) errors.push('Kart üzerindeki isim zorunludur')
        if (!form.cardExpiry) errors.push('Son kullanma tarihi zorunludur')
        if (!form.cardCVC) errors.push('CVC kodu zorunludur')

        return errors
    }

    // Ödeme işlemi
    const processPayment = async () => {
        const errors = validateForm()
        if (errors.length > 0) {
            return {
                success: false,
                errors
            }
        }

        try {
            // TODO: Burada gerçek ödeme entegrasyonu yapılacak
            // Örnek başarılı yanıt
            return {
                success: true,
                orderId: 'ORD-' + Date.now()
            }
        } catch (error) {
            return {
                success: false,
                errors: ['Ödeme işlemi sırasında bir hata oluştu']
            }
        }
    }

    return {
        checkoutForm,
        validateForm,
        processPayment
    }
}

export const useMaskedInput = () => {
  const maskConfig = {
    creditCard: '#### #### #### ####',
    expiry: '##/##',
    cvv: '###',
    phone: '+90 (###) ### ## ##'
  }

  return {
    maskConfig
  }
} 