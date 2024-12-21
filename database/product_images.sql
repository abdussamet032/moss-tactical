create table product_images (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  url varchar(255) not null,
  is_primary boolean default false,
  created_at timestamp with time zone default now()
);

-- Her ürün için sadece bir tane primary image olabilir
create unique index one_primary_image_per_product 
on product_images (product_id) 
where is_primary = true; 