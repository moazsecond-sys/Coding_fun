-- جدول المحتوى: مقالات + أسئلة
create table content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  type text not null, -- post أو question
  category text not null, -- ديني أو معرفة أو عام
  allow_comments boolean default true,
  created_at timestamp with time zone default now()
);

-- جدول التعليقات
create table comments (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references content(id) on delete cascade,
  name text not null,
  comment text not null,
  status text default 'pending', -- pending أو approved
  created_at timestamp with time zone default now()
);
