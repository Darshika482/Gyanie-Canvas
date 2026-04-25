-- =============================================
-- Bal Sanskar Shivir – Supabase Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- STUDENTS
create table if not exists students (
  id text primary key,
  roll_no text not null,
  name text not null,
  mobile text,
  class text,
  batch text,
  "group" text,
  parent_name text,
  mother_name text,
  city text,
  photo_url text,
  reg_id text,
  gender text,
  age integer,
  dob date,
  whatsapp text,
  health_issue boolean default false,
  health_detail text,
  pathshala text,
  prev_shivir boolean default false,
  kit_given boolean default false,
  total_points integer default 0,
  day_points integer[] default array[0,0,0,0,0,0],
  checked_in boolean default false
);
alter table students disable row level security;

-- Run these ALTER statements if table already exists:
-- alter table students add column if not exists mother_name text;
-- alter table students add column if not exists reg_id text;
-- alter table students add column if not exists gender text;
-- alter table students add column if not exists age integer;
-- alter table students add column if not exists dob date;
-- alter table students add column if not exists whatsapp text;
-- alter table students add column if not exists health_issue boolean default false;
-- alter table students add column if not exists health_detail text;
-- alter table students add column if not exists pathshala text;
-- alter table students add column if not exists prev_shivir boolean default false;
-- alter table students add column if not exists kit_given boolean default false;

-- VOLUNTEERS
create table if not exists volunteers (
  id text primary key,
  name text not null,
  pin text not null,
  mobile text,
  roles text[],
  assigned_activity text,
  has_deduction_rights boolean default false,
  responsibilities text[]
);
alter table volunteers disable row level security;

-- TRANSACTIONS
create table if not exists transactions (
  id text primary key,
  student_id text references students(id) on delete set null,
  student_name text,
  volunteer_id text,
  volunteer_name text,
  points integer default 0,
  day integer,
  slot integer,
  activity text,
  timestamp timestamptz default now(),
  flagged boolean default false
);
alter table transactions disable row level security;

-- COIN DISTRIBUTIONS
create table if not exists coin_distributions (
  id text primary key,
  activity text,
  volunteer_name text,
  coins_sent integer,
  day integer,
  slot integer,
  timestamp timestamptz default now()
);
alter table coin_distributions disable row level security;

-- COIN RETURNS
create table if not exists coin_returns (
  id text primary key,
  slot integer,
  volunteer_name text,
  coins_returned integer,
  day integer,
  timestamp timestamptz default now()
);
alter table coin_returns disable row level security;
