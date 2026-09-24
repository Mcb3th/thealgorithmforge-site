-- =========================================================
-- ENFORCE CLIENT PORTAL ROLES
-- =========================================================
--
-- Owner:
--   Can approve content and edit onboarding.
--
-- Manager:
--   Can approve content and edit onboarding.
--
-- Member:
--   Read-only for content decisions and onboarding data.
-- =========================================================


-- =========================================================
-- CONTENT APPROVAL AUTHORIZATION
-- =========================================================

create or replace function public.submit_client_content_approval(
  p_content_item_id uuid,
  p_decision text,
  p_feedback text default null::text
)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$

declare

  v_user_id uuid;

  v_feedback text;

  v_updated_id uuid;

  v_client_id uuid;

  v_title text;

  v_status text;

  v_approval_status text;

  v_revision_feedback text;

begin

  -- -------------------------------------------------------
  -- Require authentication
  -- -------------------------------------------------------

  v_user_id :=
    auth.uid();


  if v_user_id is null then

    raise exception
      'Authentication required.';

  end if;


  -- -------------------------------------------------------
  -- Validate decision
  -- -------------------------------------------------------

  if p_decision not in (
    'approved',
    'changes_requested'
  ) then

    raise exception
      'Invalid approval decision.';

  end if;


  -- -------------------------------------------------------
  -- Validate revision feedback
  -- -------------------------------------------------------

  v_feedback :=
    nullif(
      btrim(
        coalesce(
          p_feedback,
          ''
        )
      ),
      ''
    );


  if
    p_decision =
      'changes_requested'
    and v_feedback is null
  then

    raise exception
      'Revision feedback is required.';

  end if;


  -- -------------------------------------------------------
  -- Save client decision
  --
  -- Only an active Owner or Manager for the content item's
  -- client may submit an approval decision.
  -- -------------------------------------------------------

  update public.content_items
    as content_item

  set

    status =
      case

        when p_decision =
          'approved'
        then 'approved'

        else 'awaiting_approval'

      end,

    approval_status =
      p_decision,

    client_revision_feedback =
      case

        when p_decision =
          'changes_requested'
        then v_feedback

        else null

      end,

    updated_at =
      now()

  where content_item.id =
      p_content_item_id

    and content_item.client_visible =
      true

    and content_item.approval_status =
      'awaiting_approval'

    and exists (

      select 1

      from public.client_users
        as client_user

      where client_user.client_id =
          content_item.client_id

        and client_user.user_id =
          v_user_id

        and client_user.is_active =
          true

        and client_user.role in (
          'owner',
          'manager'
        )

    )

  returning
    content_item.id,
    content_item.client_id,
    content_item.title,
    content_item.status,
    content_item.approval_status,
    content_item.client_revision_feedback

  into
    v_updated_id,
    v_client_id,
    v_title,
    v_status,
    v_approval_status,
    v_revision_feedback;


  -- -------------------------------------------------------
  -- Nothing updated = action not currently allowed
  -- -------------------------------------------------------

  if v_updated_id is null then

    raise exception
      'Content item is not awaiting your approval or your portal role does not permit approval decisions.';

  end if;


  -- -------------------------------------------------------
  -- Record activity
  -- -------------------------------------------------------

  if p_decision =
    'approved'
  then

    insert into public.client_activity (
      client_id,
      activity_type,
      title,
      description,
      related_content_item_id
    )
    values (
      v_client_id,
      'content_approved',
      'Content approved',
      v_title,
      v_updated_id
    );

  else

    insert into public.client_activity (
      client_id,
      activity_type,
      title,
      description,
      related_content_item_id
    )
    values (
      v_client_id,
      'revision_requested',
      'Revision requested',
      v_title,
      v_updated_id
    );

  end if;


  -- -------------------------------------------------------
  -- Return authoritative saved state
  -- -------------------------------------------------------

  return jsonb_build_object(

    'success',
    true,

    'content_item_id',
    v_updated_id,

    'status',
    v_status,

    'approval_status',
    v_approval_status,

    'client_revision_feedback',
    v_revision_feedback

  );

end;

$function$;


-- Only authenticated users may call the approval RPC.
-- Authorization is then enforced inside the function.

revoke all
on function public.submit_client_content_approval(
  uuid,
  text,
  text
)
from public;

revoke all
on function public.submit_client_content_approval(
  uuid,
  text,
  text
)
from anon;

grant execute
on function public.submit_client_content_approval(
  uuid,
  text,
  text
)
to authenticated;


-- =========================================================
-- INTERNAL ONBOARDING RPC
-- =========================================================
--
-- submit-onboarding validates the authenticated user's
-- active membership and Owner/Manager role before invoking
-- this RPC with the service-role client.
--
-- Browser roles must never invoke this function directly.
-- =========================================================

revoke all
on function public.create_onboarding_submission(
  jsonb,
  uuid,
  text[]
)
from public;

revoke all
on function public.create_onboarding_submission(
  jsonb,
  uuid,
  text[]
)
from anon;

revoke all
on function public.create_onboarding_submission(
  jsonb,
  uuid,
  text[]
)
from authenticated;

grant execute
on function public.create_onboarding_submission(
  jsonb,
  uuid,
  text[]
)
to service_role;