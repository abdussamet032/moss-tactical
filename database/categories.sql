-- Kategoriler tablosu
create table categories (
  id uuid default gen_random_uuid() primary key,
  name varchar(100) not null,
  slug varchar(100) not null unique,
  parent_id uuid references categories(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Updated at trigger
create trigger update_categories_updated_at
  before update on categories
  for each row
  execute function update_updated_at_column();

-- Örnek kategori verileri
insert into categories (name, slug) values
  ('Ayakkabı', 'ayakkabi'),
  ('Giyim', 'giyim'),
  ('Aksesuar', 'aksesuar'); 