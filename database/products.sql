-- Products tablosu
create table products (
  id uuid default gen_random_uuid() primary key,
  name varchar(255) not null,
  description text,
  price decimal(10,2) not null,
  total_stock int not null default 0,
  category_id uuid references categories(id),
  color varchar(50),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Updated at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column(); 