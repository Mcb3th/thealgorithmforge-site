-- =========================================================
-- NOTIFICATION EMAIL DELIVERY INFRASTRUCTURE
-- =========================================================
--
-- Required Vault secret names:
--   notification_webhook_secret
--   notification_publishable_key
--
-- Secret values are intentionally not stored in this
-- migration.
-- =========================================================


-- =========================================================
-- EXTENSIONS AND PRIVATE SCHEMA
-- =========================================================

create schema if not exists private;

create extension if not exists pg_net
with schema extensions;

create extension if not exists pg_cron
with schema pg_catalog;


-- =========================================================
-- EMAIL DELIVERY LEDGER
-- =========================================================

create table if not exists
  public.notification_email_deliveries (
    id uuid primary key
      default gen_random_uuid(),

    notification_id uuid not null
      unique
      references public.notifications(id)
      on delete cascade,

    status text not null
      default 'pending'
      check (
        status in (
          'pending',
          'sending',
          'sent',
          'failed',
          'skipped'
        )
      ),

    attempt_count integer not null
      default 0
      check (
        attempt_count >= 0
      ),

    provider_message_id text,
    last_error text,
    last_attempted_at timestamptz,
    sent_at timestamptz,

    created_at timestamptz not null
      default now(),

    updated_at timestamptz not null
      default now()
  );


create index if not exists
  notification_email_deliveries_status_created_idx
on public.notification_email_deliveries (
  status,
  created_at
);


alter table
  public.notification_email_deliveries
enable row level security;


/*
  This table is internal infrastructure. Portal users must
  not be able to read or modify delivery records directly.
*/

revoke all
on public.notification_email_deliveries
from anon, authenticated, service_role;


grant
  insert,
  references,
  select,
  trigger,
  truncate,
  update
on public.notification_email_deliveries
to service_role;


-- =========================================================
-- NOTIFICATION EMAIL WEBHOOK
-- =========================================================

create or replace function
  private.send_notification_email_webhook()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$

declare
  webhook_secret_value text;
  publishable_key_value text;

begin

  select decrypted_secret
  into webhook_secret_value
  from vault.decrypted_secrets
  where name =
    'notification_webhook_secret'
  limit 1;


  select decrypted_secret
  into publishable_key_value
  from vault.decrypted_secrets
  where name =
    'notification_publishable_key'
  limit 1;


  if
    webhook_secret_value is null
    or publishable_key_value is null
  then

    raise warning
      'Notification email webhook credentials are missing from Vault.';

    return new;

  end if;


  perform net.http_post(
    url :=
      'https://dbujzfjwbzjrwaknvdax.supabase.co/functions/v1/send-notification-email',

    headers :=
      jsonb_build_object(
        'Content-Type',
        'application/json',

        'Authorization',
        'Bearer ' ||
          publishable_key_value,

        'apikey',
        publishable_key_value,

        'x-webhook-secret',
        webhook_secret_value
      ),

    body :=
      jsonb_build_object(
        'type',
        'INSERT',

        'table',
        'notifications',

        'schema',
        'public',

        'record',
        to_jsonb(new),

        'old_record',
        null
      ),

    timeout_milliseconds :=
      10000
  );


  return new;


exception
  when others then

    raise warning
      'Notification email webhook dispatch failed: %',
      sqlerrm;

    return new;

end;

$function$;


revoke all
on function
  private.send_notification_email_webhook()
from public, anon, authenticated, service_role;


drop trigger if exists
  send_notification_email_after_insert
on public.notifications;


create trigger
  send_notification_email_after_insert
after insert
on public.notifications
for each row
execute function
  private.send_notification_email_webhook();


-- =========================================================
-- FAILED DELIVERY RETRY FUNCTION
-- =========================================================

create or replace function
  private.retry_failed_notification_emails()
returns integer
language plpgsql
security invoker
set search_path = ''
as $function$

declare
  webhook_secret_value text;
  publishable_key_value text;
  notification_record record;
  queued_count integer :=
    0;

begin

  select decrypted_secret
  into webhook_secret_value
  from vault.decrypted_secrets
  where name =
    'notification_webhook_secret'
  limit 1;


  select decrypted_secret
  into publishable_key_value
  from vault.decrypted_secrets
  where name =
    'notification_publishable_key'
  limit 1;


  if
    webhook_secret_value is null
    or publishable_key_value is null
  then

    raise warning
      'Notification retry credentials are missing from Vault.';

    return 0;

  end if;


  /*
    Recover deliveries that became stuck while
    an earlier Edge Function invocation was running.
  */

  update public.notification_email_deliveries
  set
    status =
      'failed',

    last_error =
      coalesce(
        last_error,
        'The previous delivery attempt became stale.'
      ),

    updated_at =
      now()

  where status in (
    'pending',
    'sending'
  )

  and updated_at <=
    now() -
    interval '15 minutes'

  and attempt_count < 3;


  /*
    Retry failed deliveries:

    Attempt 1: wait at least 5 minutes
    Attempt 2: wait at least 30 minutes
    Stop after 3 total attempts.
  */

  for notification_record in

    select notification.*

    from public.notifications
      as notification

    join public.notification_email_deliveries
      as delivery
    on delivery.notification_id =
      notification.id

    where delivery.status =
      'failed'

    and delivery.attempt_count < 3

    and coalesce(
      delivery.last_attempted_at,
      delivery.created_at
    ) <=
      now() -
      case
        when delivery.attempt_count <= 1
          then interval '5 minutes'
        else interval '30 minutes'
      end

    order by delivery.created_at

    limit 20

  loop

    perform net.http_post(
      url :=
        'https://dbujzfjwbzjrwaknvdax.supabase.co/functions/v1/send-notification-email',

      headers :=
        jsonb_build_object(
          'Content-Type',
          'application/json',

          'Authorization',
          'Bearer ' ||
            publishable_key_value,

          'apikey',
          publishable_key_value,

          'x-webhook-secret',
          webhook_secret_value
        ),

      body :=
        jsonb_build_object(
          'type',
          'INSERT',

          'table',
          'notifications',

          'schema',
          'public',

          'record',
          to_jsonb(
            notification_record
          ),

          'old_record',
          null
        ),

      timeout_milliseconds :=
        10000
    );


    queued_count :=
      queued_count + 1;

  end loop;


  return queued_count;

end;

$function$;


revoke all
on function
  private.retry_failed_notification_emails()
from public, anon, authenticated, service_role;


-- =========================================================
-- AUTOMATIC RETRY SCHEDULE
-- =========================================================

do $migration$

declare
  existing_job_id bigint;

begin

  for existing_job_id in

    select jobid
    from cron.job
    where jobname =
      'retry-notification-emails'

  loop

    perform cron.unschedule(
      existing_job_id
    );

  end loop;


  perform cron.schedule(
    'retry-notification-emails',
    '*/5 * * * *',
    'select private.retry_failed_notification_emails();'
  );

end;

$migration$;