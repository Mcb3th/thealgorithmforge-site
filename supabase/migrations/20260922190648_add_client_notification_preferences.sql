-- =========================================================
-- CLIENT NOTIFICATION PREFERENCES
-- Stores optional email preferences per authenticated user.
-- =========================================================

create schema if not exists private;


create table if not exists public.notification_preferences (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  email_enabled boolean not null default true,

  email_content_awaiting_approval boolean not null default true,
  email_content_scheduled boolean not null default true,
  email_content_posted boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- UPDATED-AT TRIGGER
-- =========================================================

create or replace function
  private.set_notification_preferences_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


revoke all
on function
  private.set_notification_preferences_updated_at()
from public;


drop trigger if exists
  set_notification_preferences_updated_at
on public.notification_preferences;


create trigger
  set_notification_preferences_updated_at
before update
on public.notification_preferences
for each row
execute function
  private.set_notification_preferences_updated_at();


-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.notification_preferences
enable row level security;


drop policy if exists
  "Users can view their notification preferences"
on public.notification_preferences;


create policy
  "Users can view their notification preferences"
on public.notification_preferences
for select
to authenticated
using (
  (select auth.uid()) = user_id
);


drop policy if exists
  "Users can create their notification preferences"
on public.notification_preferences;


create policy
  "Users can create their notification preferences"
on public.notification_preferences
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);


drop policy if exists
  "Users can update their notification preferences"
on public.notification_preferences;


create policy
  "Users can update their notification preferences"
on public.notification_preferences
for update
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);


-- =========================================================
-- LEAST-PRIVILEGE ACCESS
-- =========================================================

revoke all
on public.notification_preferences
from anon, authenticated;


grant select, insert, update
on public.notification_preferences
to authenticated;


grant select
on public.notification_preferences
to service_role;