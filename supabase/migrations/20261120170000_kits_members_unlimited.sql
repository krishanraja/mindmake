-- Krish's own addresses: founding tier and no one-per-person limit on the free codes (Ruling, Krish, 2026-11-20).
alter table public.kit_members add column if not exists unlimited boolean not null default false;
