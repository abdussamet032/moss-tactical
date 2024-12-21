create table product_sizes (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  size varchar(10) not null,
  stock int not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Aynı ürün için aynı beden tekrar edilemesin
create unique index unique_product_size 
on product_sizes (product_id, size);

-- Updated at trigger
create trigger update_product_sizes_updated_at
  before update on product_sizes
  for each row
  execute function update_updated_at_column(); 