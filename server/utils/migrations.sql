-- Supabase User Authentication Migration
-- Bu dosya Supabase'deki user_id alanlarını auth.users tablosuna bağlamak için gerekli constraint'leri içerir

-- 1. auth.users'a erişim için public.users view'ı oluştur
CREATE OR REPLACE VIEW public.users AS
SELECT 
  id,
  email,
  created_at,
  updated_at,
  raw_user_meta_data,
  email_confirmed_at,
  last_sign_in_at,
  phone,
  phone_confirmed_at
FROM auth.users;

-- 2. Row Level Security (RLS) politikaları oluştur
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi bilgilerini görebilir
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- 3. addresses tablosuna foreign key constraint ekle
ALTER TABLE public.addresses 
ADD CONSTRAINT fk_addresses_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- addresses için RLS politikaları
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own addresses" ON public.addresses
  FOR ALL USING (auth.uid() = user_id);

-- 4. carts tablosuna foreign key constraint ekle
ALTER TABLE public.carts 
ADD CONSTRAINT fk_carts_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- carts için RLS politikaları
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own carts" ON public.carts
  FOR ALL USING (auth.uid() = user_id);

-- 5. orders tablosuna foreign key constraint ekle
ALTER TABLE public.orders 
ADD CONSTRAINT fk_orders_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- orders için RLS politikaları
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. reviews tablosuna foreign key constraint ekle
ALTER TABLE public.reviews 
ADD CONSTRAINT fk_reviews_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- reviews için RLS politikaları
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own reviews" ON public.reviews
  FOR ALL USING (auth.uid() = user_id);

-- 7. cart_items için RLS (user_id yoksa cart üzerinden kontrol)
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart items" ON public.cart_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

-- 8. order_items için RLS (user_id yoksa order üzerinden kontrol)
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- 9. Diğer tablolar için genel RLS politikaları
-- products tablosu - herkes okuyabilir, sadece admin yazabilir
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

-- categories tablosu - herkes okuyabilir
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- product_variants tablosu - herkes okuyabilir
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product variants" ON public.product_variants
  FOR SELECT USING (true);

-- product_images tablosu - herkes okuyabilir
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT USING (true);

-- coupons tablosu - herkes okuyabilir
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view coupons" ON public.coupons
  FOR SELECT USING (true);

-- 10. Kullanıcı profil bilgileri için özel fonksiyonlar
CREATE OR REPLACE FUNCTION public.get_user_profile(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'id', id,
    'email', email,
    'created_at', created_at,
    'updated_at', updated_at,
    'email_confirmed_at', email_confirmed_at,
    'last_sign_in_at', last_sign_in_at,
    'phone', phone,
    'phone_confirmed_at', phone_confirmed_at,
    'full_name', raw_user_meta_data->>'full_name',
    'avatar_url', raw_user_meta_data->>'avatar_url'
  ) INTO result
  FROM auth.users
  WHERE id = user_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Kullanıcı istatistikleri için fonksiyon
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_orders', COALESCE(order_count.count, 0),
    'total_reviews', COALESCE(review_count.count, 0),
    'cart_items', COALESCE(cart_count.count, 0)
  ) INTO result
  FROM (
    SELECT COUNT(*) as count FROM public.orders WHERE user_id = user_uuid
  ) order_count
  CROSS JOIN (
    SELECT COUNT(*) as count FROM public.reviews WHERE user_id = user_uuid
  ) review_count
  CROSS JOIN (
    SELECT COUNT(*) as count 
    FROM public.cart_items ci
    JOIN public.carts c ON ci.cart_id = c.id
    WHERE c.user_id = user_uuid
  ) cart_count;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; ALTER TABLE public.products ADD COLUMN slug TEXT UNIQUE;
