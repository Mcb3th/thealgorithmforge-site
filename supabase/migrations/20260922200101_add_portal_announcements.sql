-- =========================================================
-- CLIENT PORTAL ANNOUNCEMENTS
-- Displays important portal updates once per user.
-- =========================================================

create schema if not exists private;


-- =========================================================
-- ANNOUNCEMENTS
-- =========================================================

create table if not exists
  public.portal_announcements (
    id uuid primary key
      default gen_random_uuid(),

    version text not null
      unique
      check (
        length(
          btrim(version)
        ) > 0
      ),

    title text not null
      check (
        length(
          btrim(title)
        ) > 0
      ),

    summary text not null
      check (
        length(
          btrim(summary)
        ) > 0
      ),

    details text[] not null
      default '{}'::text[],

    published_at timestamptz not null
      default now(),

    is_active boolean not null
      default true,

    created_at timestamptz not null
      default now(),

    updated_at timestamptz not null
      default now()
  );


create index if not exists
  portal_announcements_active_published_idx
on public.portal_announcements (
  published_at desc
)
where is_active = true;


-- =========================================================
-- PER-USER DISMISSALS
-- =========================================================

create table if not exists
  public.portal_announcement_dismissals (
    announcement_id uuid not null
      references public.portal_announcements(id)
      on delete cascade,

    user_id uuid not null
      references auth.users(id)
      on delete cascade,

    dismissed_at timestamptz not null
      default now(),

    primary key (
      announcement_id,
      user_id
    )
  );


create index if not exists
  portal_announcement_dismissals_user_idx
on public.portal_announcement_dismissals (
  user_id,
  announcement_id
);


-- =========================================================
-- UPDATED-AT TRIGGER
-- =========================================================

create or replace function
  private.set_portal_announcement_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $function$

begin

  new.updated_at =
    now();

  return new;

end;

$function$;


revoke all
on function
  private.set_portal_announcement_updated_at()
from public, anon, authenticated, service_role;


drop trigger if exists
  set_portal_announcement_updated_at
on public.portal_announcements;


create trigger
  set_portal_announcement_updated_at
before update
on public.portal_announcements
for each row
execute function
  private.set_portal_announcement_updated_at();


-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table
  public.portal_announcements
enable row level security;


alter table
  public.portal_announcement_dismissals
enable row level security;


drop policy if exists
  "Authenticated users can view active portal announcements"
on public.portal_announcements;


create policy
  "Authenticated users can view active portal announcements"
on public.portal_announcements
for select
to authenticated
using (
  is_active = true
  and published_at <= now()
);


drop policy if exists
  "Users can view their announcement dismissals"
on public.portal_announcement_dismissals;


create policy
  "Users can view their announcement dismissals"
on public.portal_announcement_dismissals
for select
to authenticated
using (
  (select auth.uid()) = user_id
);


drop policy if exists
  "Users can dismiss portal announcements"
on public.portal_announcement_dismissals;


create policy
  "Users can dismiss portal announcements"
on public.portal_announcement_dismissals
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);


-- =========================================================
-- LEAST-PRIVILEGE ACCESS
-- =========================================================

revoke all
on public.portal_announcements
from anon, authenticated;


grant select
on public.portal_announcements
to authenticated;


revoke all
on public.portal_announcement_dismissals
from anon, authenticated;


grant select, insert
on public.portal_announcement_dismissals
to authenticated;


grant all
on public.portal_announcements
to service_role;


grant all
on public.portal_announcement_dismissals
to service_role;

-- =========================================================
-- INITIAL PORTAL ANNOUNCEMENT
-- =========================================================

insert into public.portal_announcements (
  version,
  title,
  summary,
  details
)
values (
  '2026.09.22',
  'YOUR PORTAL JUST GOT BETTER',
  'We added more control over your account, email preferences, and portal notifications.',
  array[
    'Choose which content updates are also sent to your email.',
    'Turn all optional notification emails on or off with one setting.',
    'See clearer guidance when changing your portal sign-in email.',
    'Benefit from improved notification delivery and automatic retry protection.'
  ]
)
on conflict (
  version
)
do nothing;