-- Domio v2 - Initial Database Schema
-- Run this migration in Supabase SQL Editor or via CLI

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  phone text,
  company text,
  role text not null default 'seeker' check (role in ('seeker', 'agent', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'seeker')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- PROPERTIES
-- ============================================
create table properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  price numeric not null check (price >= 0),
  price_per_m2 numeric,
  type text not null check (type in ('apartment', 'house', 'land', 'commercial')),
  transaction text not null check (transaction in ('sale', 'rent')),
  rooms integer default 0,
  area numeric not null check (area > 0),
  floor integer,
  total_floors integer,
  city text not null,
  district text,
  address text,
  lat double precision,
  lng double precision,
  features text[] default '{}',
  energy_class text,
  year_built integer,
  agent_id uuid not null references profiles(id),
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  views integer default 0,
  is_featured boolean default false,
  source_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_properties_slug on properties(slug);
create index idx_properties_city on properties(city);
create index idx_properties_type_transaction on properties(type, transaction);
create index idx_properties_price on properties(price);
create index idx_properties_agent_id on properties(agent_id);
create index idx_properties_status on properties(status);
create index idx_properties_created_at on properties(created_at desc);

-- ============================================
-- PROPERTY IMAGES
-- ============================================
create table property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  storage_path text not null,
  url text not null,
  position integer default 0,
  created_at timestamptz default now()
);

create index idx_property_images_property on property_images(property_id);

-- ============================================
-- FAVORITES
-- ============================================
create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, property_id)
);

create index idx_favorites_user on favorites(user_id);

-- ============================================
-- WATCHDOGS
-- ============================================
create table watchdogs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  filters jsonb not null default '{}',
  is_active boolean default true,
  last_notified_at timestamptz,
  created_at timestamptz default now()
);

create index idx_watchdogs_user on watchdogs(user_id);

-- ============================================
-- PRICE HISTORY
-- ============================================
create table price_history (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  price numeric not null,
  recorded_at timestamptz default now()
);

create index idx_price_history_property on price_history(property_id);

-- Auto-record price changes
create or replace function record_price_change()
returns trigger as $$
begin
  if old.price is distinct from new.price then
    insert into price_history (property_id, price) values (new.id, new.price);
  end if;
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_property_price_change
  before update on properties
  for each row execute function record_price_change();

-- Auto-update updated_at on profiles
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_update
  before update on profiles
  for each row execute function update_updated_at();

-- Record initial price on property creation
create or replace function record_initial_price()
returns trigger as $$
begin
  insert into price_history (property_id, price) values (new.id, new.price);
  return new;
end;
$$ language plpgsql;

create trigger on_property_created
  after insert on properties
  for each row execute function record_initial_price();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table profiles enable row level security;
alter table properties enable row level security;
alter table property_images enable row level security;
alter table favorites enable row level security;
alter table watchdogs enable row level security;
alter table price_history enable row level security;

-- PROFILES policies
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- PROPERTIES policies
create policy "Active properties are viewable by everyone"
  on properties for select using (status = 'active' or agent_id = auth.uid());

create policy "Agents can insert own properties"
  on properties for insert with check (agent_id = auth.uid());

create policy "Agents can update own properties"
  on properties for update using (agent_id = auth.uid());

create policy "Agents can delete own properties"
  on properties for delete using (agent_id = auth.uid());

-- PROPERTY IMAGES policies
create policy "Property images are viewable by everyone"
  on property_images for select using (true);

create policy "Agents can manage images for own properties"
  on property_images for insert with check (
    exists (select 1 from properties where id = property_id and agent_id = auth.uid())
  );

create policy "Agents can delete images for own properties"
  on property_images for delete using (
    exists (select 1 from properties where id = property_id and agent_id = auth.uid())
  );

-- FAVORITES policies
create policy "Users can view own favorites"
  on favorites for select using (user_id = auth.uid());

create policy "Users can add favorites"
  on favorites for insert with check (user_id = auth.uid());

create policy "Users can remove own favorites"
  on favorites for delete using (user_id = auth.uid());

-- WATCHDOGS policies
create policy "Users can view own watchdogs"
  on watchdogs for select using (user_id = auth.uid());

create policy "Users can create watchdogs"
  on watchdogs for insert with check (user_id = auth.uid());

create policy "Users can update own watchdogs"
  on watchdogs for update using (user_id = auth.uid());

create policy "Users can delete own watchdogs"
  on watchdogs for delete using (user_id = auth.uid());

-- PRICE HISTORY policies
create policy "Price history is viewable by everyone"
  on price_history for select using (true);

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Run this in Supabase Dashboard > Storage:
-- Create bucket "property-images" (public)
-- Policy: Allow authenticated users to upload to their own folder
-- Policy: Allow public read access
