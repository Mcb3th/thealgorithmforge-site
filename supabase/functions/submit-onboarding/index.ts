import { withSupabase } from 'npm:@supabase/server@^1'

const ALLOWED_ORIGINS = new Set([
  'https://thealgorithmforge.com',
  'https://www.thealgorithmforge.com',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
])

const MAX_PAYLOAD_BYTES = 100 * 1024

type FieldErrors = Record<string, string>

function corsHeaders(origin: string | null) {
  const allowedOrigin =
    origin && ALLOWED_ORIGINS.has(origin)
      ? origin
      : 'https://thealgorithmforge.com'

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    'Vary': 'Origin',
  }
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  origin: string | null,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(origin),
  })
}

function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  )
}

function hasText(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  )
}

function requireObject(
  parent: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldErrors,
): Record<string, unknown> | null {
  const value = parent[key]

  if (!isPlainObject(value)) {
    errors[path] = 'This section is required.'
    return null
  }

  return value
}

function requireString(
  parent: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldErrors,
) {
  const value = parent[key]

  if (
    typeof value !== 'string' ||
    value.trim() === ''
  ) {
    errors[path] = 'This field is required.'
  }
}

function optionalString(
  parent: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldErrors,
) {
  const value = parent[key]

  if (
    value !== undefined &&
    value !== null &&
    typeof value !== 'string'
  ) {
    errors[path] = 'This field must be text.'
  }
}

function requireStringArray(
  parent: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldErrors,
) {
  const value = parent[key]

  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every(
      (item) => typeof item === 'string',
    )
  ) {
    errors[path] =
      'This field must contain one or more selections.'
  }
}

function optionalStringArray(
  parent: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldErrors,
) {
  const value = parent[key]

  if (
    value !== undefined &&
    value !== null &&
    (
      !Array.isArray(value) ||
      !value.every(
        (item) => typeof item === 'string',
      )
    )
  ) {
    errors[path] =
      'This field must contain a list of selections.'
  }
}

function optionalBoolean(
  parent: Record<string, unknown>,
  key: string,
  path: string,
  errors: FieldErrors,
) {
  const value = parent[key]

  if (
    value !== undefined &&
    value !== null &&
    typeof value !== 'boolean'
  ) {
    errors[path] =
      'This field must be true or false.'
  }
}

function validateLength(
  value: unknown,
  path: string,
  errors: FieldErrors,
  min: number,
  max: number,
) {
  if (!hasText(value)) return

  const length = value.trim().length

  if (
    length < min ||
    length > max
  ) {
    errors[path] =
      `Must be between ${min} and ${max} characters.`
  }
}

function validateEnum(
  value: unknown,
  allowed: readonly string[],
  path: string,
  errors: FieldErrors,
) {
  if (
    hasText(value) &&
    !allowed.includes(value)
  ) {
    errors[path] =
      'Please choose a valid option.'
  }
}

function validateSelectionArray(
  value: unknown,
  allowed: readonly string[],
  path: string,
  errors: FieldErrors,
  min = 0,
  max = allowed.length,
) {
  if (!Array.isArray(value)) return

  if (
    value.length < min ||
    value.length > max
  ) {
    errors[path] =
      `Choose between ${min} and ${max} options.`
    return
  }

  if (
    !value.every(
      (item) => typeof item === 'string',
    )
  ) {
    return
  }

  if (
    new Set(value).size !== value.length
  ) {
    errors[path] =
      'Duplicate selections are not allowed.'
    return
  }

  if (
    !value.every(
      (item) => allowed.includes(item),
    )
  ) {
    errors[path] =
      'One or more selections are invalid.'
  }
}

function isValidEmail(
  value: unknown,
): boolean {
  if (!hasText(value)) return false

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value.trim(),
  )
}

function isHttpUrl(
  value: unknown,
): boolean {
  if (!hasText(value)) return false

  try {
    const url = new URL(value.trim())

    return (
      url.protocol === 'http:' ||
      url.protocol === 'https:'
    )
  } catch {
    return false
  }
}

function validateExistingAccounts(
  value: unknown,
  errors: FieldErrors,
) {
  if (
    value === undefined ||
    value === null
  ) {
    return
  }

  if (!Array.isArray(value)) {
    errors[
      'social_media.existing_accounts'
    ] = 'Existing accounts must be a list.'

    return
  }

  value.forEach(
    (account, index) => {
      const base =
        `social_media.existing_accounts.${index}`

      if (!isPlainObject(account)) {
        errors[base] =
          'Each social account must be an object.'

        return
      }

      requireString(
        account,
        'platform',
        `${base}.platform`,
        errors,
      )

      optionalString(
        account,
        'profile_url',
        `${base}.profile_url`,
        errors,
      )
    },
  )
}

// =========================================================
// ALLOWED VALUES
// =========================================================

const OPERATING_SCOPES = [
  'local',
  'multiple_locations',
  'nationwide',
  'online_only',
] as const

const CONTACT_METHODS = [
  'email',
  'phone',
  'text',
  'other',
] as const

const BRAND_VOICES = [
  'professional',
  'friendly',
  'conversational',
  'fun_playful',
  'bold',
  'educational',
  'premium_luxury',
  'approachable',
  'straightforward',
  'energetic',
  'other',
] as const

const BRAND_GUIDELINE_STATUSES = [
  'yes',
  'some',
  'no',
] as const

const BRAND_MATERIALS = [
  'logo',
  'brand_colors',
  'fonts',
  'brand_guide',
  'templates',
  'photography',
  'graphics',
  'other',
] as const

const SOCIAL_PLATFORMS = [
  'facebook',
  'instagram',
  'tiktok',
  'linkedin',
  'youtube',
  'x',
  'threads',
  'other',
] as const

const YES_NO_NOT_SURE = [
  'yes',
  'no',
  'not_sure',
] as const

const GOAL_OPTIONS = [
  'brand_awareness',
  'generate_leads',
  'increase_sales',
  'website_traffic',
  'promote_products_services',
  'promote_events_specials',
  'build_community',
  'educate_customers',
  'showcase_results',
  'stay_visible',
  'improve_professionalism',
  'other',
] as const

const CONTENT_OPTIONS = [
  'photos',
  'graphics',
  'carousels',
  'short_form_video',
  'educational',
  'promotional',
  'testimonials_reviews',
  'behind_the_scenes',
  'product_service_showcases',
  'tips_advice',
  'before_after',
  'other',
  'open_to_recommendations',
] as const

const MEDIA_INVENTORY = [
  'plenty',
  'some',
  'very_little',
  'none',
  'not_sure',
] as const

const MEDIA_SUPPLY = [
  'yes',
  'sometimes',
  'rarely',
  'no',
  'not_sure',
] as const

const TESTIMONIAL_OPTIONS = [
  'yes',
  'no',
  'not_yet',
] as const

const CTA_OPTIONS = [
  'call',
  'dm',
  'website',
  'request_quote',
  'book_appointment',
  'visit_location',
  'purchase',
  'sign_up',
  'other',
] as const

const APPROVAL_TIMINGS = [
  'same_day',
  'within_24_hours',
  'within_48_hours',
  'within_3_business_days',
  'longer_than_3_business_days',
] as const

const APPROVAL_PREFERENCES = [
  'approve_everything',
  'routine_content_preapproved',
  'discuss',
] as const

// =========================================================
// PAYLOAD VALIDATION
// =========================================================

function validatePayload(
  payload: unknown,
): FieldErrors {
  const errors: FieldErrors = {}

  if (!isPlainObject(payload)) {
    errors.payload =
      'The request body must be a JSON object.'

    return errors
  }

  requireString(
    payload,
    'questionnaire_version',
    'questionnaire_version',
    errors,
  )

  const business =
    requireObject(
      payload,
      'business',
      'business',
      errors,
    )

  const primaryContact =
    requireObject(
      payload,
      'primary_contact',
      'primary_contact',
      errors,
    )

  const brand =
    requireObject(
      payload,
      'brand',
      'brand',
      errors,
    )

  const socialMedia =
    requireObject(
      payload,
      'social_media',
      'social_media',
      errors,
    )

  const goals =
    requireObject(
      payload,
      'goals',
      'goals',
      errors,
    )

  const content =
    requireObject(
      payload,
      'content',
      'content',
      errors,
    )

  const requirements =
    requireObject(
      payload,
      'requirements',
      'requirements',
      errors,
    )

  const workflow =
    requireObject(
      payload,
      'workflow',
      'workflow',
      errors,
    )

  // =======================================================
  // STRUCTURAL VALIDATION
  // =======================================================

  if (business) {
    requireString(
      business,
      'business_name',
      'business.business_name',
      errors,
    )

    optionalString(
      business,
      'website',
      'business.website',
      errors,
    )

    requireString(
      business,
      'business_description',
      'business.business_description',
      errors,
    )

    requireString(
      business,
      'operating_scope',
      'business.operating_scope',
      errors,
    )

    optionalString(
      business,
      'service_area',
      'business.service_area',
      errors,
    )

    requireString(
      business,
      'priority_products_services',
      'business.priority_products_services',
      errors,
    )
  }

  if (primaryContact) {
    requireString(
      primaryContact,
      'name',
      'primary_contact.name',
      errors,
    )

    requireString(
      primaryContact,
      'role',
      'primary_contact.role',
      errors,
    )

    requireString(
      primaryContact,
      'email',
      'primary_contact.email',
      errors,
    )

    optionalString(
      primaryContact,
      'phone',
      'primary_contact.phone',
      errors,
    )

    requireString(
      primaryContact,
      'preferred_contact_method',
      'primary_contact.preferred_contact_method',
      errors,
    )
  }

  if (brand) {
    requireString(
      brand,
      'ideal_customer',
      'brand.ideal_customer',
      errors,
    )

    requireString(
      brand,
      'differentiators',
      'brand.differentiators',
      errors,
    )

    requireStringArray(
      brand,
      'brand_voice',
      'brand.brand_voice',
      errors,
    )

    optionalString(
      brand,
      'brand_voice_notes',
      'brand.brand_voice_notes',
      errors,
    )

    optionalString(
      brand,
      'preferred_language',
      'brand.preferred_language',
      errors,
    )

    optionalString(
      brand,
      'avoid_language',
      'brand.avoid_language',
      errors,
    )

    optionalString(
      brand,
      'brand_guidelines_status',
      'brand.brand_guidelines_status',
      errors,
    )

    optionalStringArray(
      brand,
      'brand_materials',
      'brand.brand_materials',
      errors,
    )
  }

  if (socialMedia) {
    validateExistingAccounts(
      socialMedia.existing_accounts,
      errors,
    )

    requireStringArray(
      socialMedia,
      'platforms_to_manage',
      'social_media.platforms_to_manage',
      errors,
    )

    optionalStringArray(
      socialMedia,
      'new_accounts_needed',
      'social_media.new_accounts_needed',
      errors,
    )

    optionalString(
      socialMedia,
      'current_social_manager',
      'social_media.current_social_manager',
      errors,
    )

    optionalBoolean(
      socialMedia,
      'previous_agency_experience',
      'social_media.previous_agency_experience',
      errors,
    )

    optionalString(
      socialMedia,
      'previous_agency_notes',
      'social_media.previous_agency_notes',
      errors,
    )

    optionalString(
      socialMedia,
      'meta_business_portfolio_status',
      'social_media.meta_business_portfolio_status',
      errors,
    )

    optionalString(
      socialMedia,
      'meta_business_portfolio_id',
      'social_media.meta_business_portfolio_id',
      errors,
    )

    optionalString(
      socialMedia,
      'tiktok_business_center_status',
      'social_media.tiktok_business_center_status',
      errors,
    )
  }

  if (goals) {
    requireStringArray(
      goals,
      'primary_goals',
      'goals.primary_goals',
      errors,
    )

    requireString(
      goals,
      'primary_goal',
      'goals.primary_goal',
      errors,
    )

    requireString(
      goals,
      'desired_improvement',
      'goals.desired_improvement',
      errors,
    )
  }

  if (content) {
    optionalStringArray(
      content,
      'content_preferences',
      'content.content_preferences',
      errors,
    )

    requireString(
      content,
      'media_inventory',
      'content.media_inventory',
      errors,
    )

    requireString(
      content,
      'media_supply_frequency',
      'content.media_supply_frequency',
      errors,
    )

    requireString(
      content,
      'priority_features',
      'content.priority_features',
      errors,
    )

    optionalString(
      content,
      'testimonials_available',
      'content.testimonials_available',
      errors,
    )

    optionalString(
      content,
      'upcoming_promotions',
      'content.upcoming_promotions',
      errors,
    )

    optionalString(
      content,
      'content_exclusions',
      'content.content_exclusions',
      errors,
    )
  }

  if (requirements) {
    optionalString(
      requirements,
      'competitor_inspiration',
      'requirements.competitor_inspiration',
      errors,
    )

    optionalString(
      requirements,
      'competitor_inspiration_notes',
      'requirements.competitor_inspiration_notes',
      errors,
    )

    requireString(
      requirements,
      'compliance_status',
      'requirements.compliance_status',
      errors,
    )

    optionalString(
      requirements,
      'compliance_notes',
      'requirements.compliance_notes',
      errors,
    )
  }

  if (workflow) {
    requireString(
      workflow,
      'primary_call_to_action',
      'workflow.primary_call_to_action',
      errors,
    )

    optionalString(
      workflow,
      'call_to_action_destination',
      'workflow.call_to_action_destination',
      errors,
    )

    requireString(
      workflow,
      'approval_contact',
      'workflow.approval_contact',
      errors,
    )

    requireString(
      workflow,
      'approval_timing',
      'workflow.approval_timing',
      errors,
    )

    requireString(
      workflow,
      'approval_preference',
      'workflow.approval_preference',
      errors,
    )

    optionalString(
      workflow,
      'approval_requirements',
      'workflow.approval_requirements',
      errors,
    )

    optionalString(
      workflow,
      'additional_notes',
      'workflow.additional_notes',
      errors,
    )
  }

  // =======================================================
  // BUSINESS RULE VALIDATION
  // =======================================================

  if (
    payload.questionnaire_version !== '1.0'
  ) {
    errors.questionnaire_version =
      'Unsupported questionnaire version.'
  }

  if (business) {
    validateLength(
      business.business_name,
      'business.business_name',
      errors,
      2,
      120,
    )

    validateLength(
      business.business_description,
      'business.business_description',
      errors,
      10,
      2000,
    )

    validateLength(
      business.priority_products_services,
      'business.priority_products_services',
      errors,
      2,
      1500,
    )

    validateEnum(
      business.operating_scope,
      OPERATING_SCOPES,
      'business.operating_scope',
      errors,
    )

    if (
      business.website !== undefined &&
      business.website !== null &&
      hasText(business.website) &&
      !isHttpUrl(business.website)
    ) {
      errors['business.website'] =
        'Please enter a valid website URL.'
    }

    if (
      business.operating_scope === 'local' ||
      business.operating_scope ===
        'multiple_locations'
    ) {
      if (!hasText(business.service_area)) {
        errors['business.service_area'] =
          'Please provide the service area.'
      } else {
        validateLength(
          business.service_area,
          'business.service_area',
          errors,
          2,
          500,
        )
      }
    }
  }

  if (primaryContact) {
    validateLength(
      primaryContact.name,
      'primary_contact.name',
      errors,
      2,
      120,
    )

    validateLength(
      primaryContact.role,
      'primary_contact.role',
      errors,
      2,
      120,
    )

    if (
      hasText(primaryContact.email) &&
      !isValidEmail(primaryContact.email)
    ) {
      errors['primary_contact.email'] =
        'Please enter a valid email address.'
    }

    validateEnum(
      primaryContact.preferred_contact_method,
      CONTACT_METHODS,
      'primary_contact.preferred_contact_method',
      errors,
    )

    if (
      primaryContact.preferred_contact_method ===
        'phone' ||
      primaryContact.preferred_contact_method ===
        'text'
    ) {
      if (!hasText(primaryContact.phone)) {
        errors['primary_contact.phone'] =
          'A phone number is required for this contact method.'
      }
    }
  }

  if (brand) {
    validateLength(
      brand.ideal_customer,
      'brand.ideal_customer',
      errors,
      5,
      2000,
    )

    validateLength(
      brand.differentiators,
      'brand.differentiators',
      errors,
      5,
      2000,
    )

    validateSelectionArray(
      brand.brand_voice,
      BRAND_VOICES,
      'brand.brand_voice',
      errors,
      1,
      6,
    )

    if (
      Array.isArray(brand.brand_voice) &&
      brand.brand_voice.includes('other') &&
      !hasText(brand.brand_voice_notes)
    ) {
      errors['brand.brand_voice_notes'] =
        'Please describe the other brand voice.'
    }

    if (
      hasText(
        brand.brand_guidelines_status,
      )
    ) {
      validateEnum(
        brand.brand_guidelines_status,
        BRAND_GUIDELINE_STATUSES,
        'brand.brand_guidelines_status',
        errors,
      )
    }

    validateSelectionArray(
      brand.brand_materials,
      BRAND_MATERIALS,
      'brand.brand_materials',
      errors,
      0,
      8,
    )
  }

  if (socialMedia) {
    validateSelectionArray(
      socialMedia.platforms_to_manage,
      SOCIAL_PLATFORMS,
      'social_media.platforms_to_manage',
      errors,
      1,
      SOCIAL_PLATFORMS.length,
    )

    validateSelectionArray(
      socialMedia.new_accounts_needed,
      SOCIAL_PLATFORMS,
      'social_media.new_accounts_needed',
      errors,
      0,
      SOCIAL_PLATFORMS.length,
    )

    if (
      Array.isArray(
        socialMedia.existing_accounts,
      )
    ) {
      socialMedia.existing_accounts.forEach(
        (account, index) => {
          if (!isPlainObject(account)) {
            return
          }

          validateEnum(
            account.platform,
            SOCIAL_PLATFORMS,
            `social_media.existing_accounts.${index}.platform`,
            errors,
          )

          if (
            hasText(account.profile_url) &&
            !isHttpUrl(account.profile_url)
          ) {
            errors[
              `social_media.existing_accounts.${index}.profile_url`
            ] =
              'Please enter a valid profile URL.'
          }
        },
      )
    }

    if (
      hasText(
        socialMedia
          .meta_business_portfolio_status,
      )
    ) {
      validateEnum(
        socialMedia
          .meta_business_portfolio_status,
        YES_NO_NOT_SURE,
        'social_media.meta_business_portfolio_status',
        errors,
      )
    }

    if (
      hasText(
        socialMedia
          .tiktok_business_center_status,
      )
    ) {
      validateEnum(
        socialMedia
          .tiktok_business_center_status,
        YES_NO_NOT_SURE,
        'social_media.tiktok_business_center_status',
        errors,
      )
    }
  }

  if (goals) {
    validateSelectionArray(
      goals.primary_goals,
      GOAL_OPTIONS,
      'goals.primary_goals',
      errors,
      1,
      3,
    )

    if (
      hasText(goals.primary_goal) &&
      Array.isArray(goals.primary_goals) &&
      !goals.primary_goals.includes(
        goals.primary_goal,
      )
    ) {
      errors['goals.primary_goal'] =
        'The primary goal must be one of the selected goals.'
    }

    validateLength(
      goals.desired_improvement,
      'goals.desired_improvement',
      errors,
      5,
      2000,
    )
  }

  if (content) {
    validateSelectionArray(
      content.content_preferences,
      CONTENT_OPTIONS,
      'content.content_preferences',
      errors,
      0,
      CONTENT_OPTIONS.length,
    )

    validateEnum(
      content.media_inventory,
      MEDIA_INVENTORY,
      'content.media_inventory',
      errors,
    )

    validateEnum(
      content.media_supply_frequency,
      MEDIA_SUPPLY,
      'content.media_supply_frequency',
      errors,
    )

    validateLength(
      content.priority_features,
      'content.priority_features',
      errors,
      2,
      2000,
    )

    if (
      hasText(
        content.testimonials_available,
      )
    ) {
      validateEnum(
        content.testimonials_available,
        TESTIMONIAL_OPTIONS,
        'content.testimonials_available',
        errors,
      )
    }
  }

  if (requirements) {
    validateEnum(
      requirements.compliance_status,
      YES_NO_NOT_SURE,
      'requirements.compliance_status',
      errors,
    )

    if (
      requirements.compliance_status ===
        'yes' &&
      !hasText(requirements.compliance_notes)
    ) {
      errors['requirements.compliance_notes'] =
        'Please explain the compliance requirements.'
    }
  }

  if (workflow) {
    validateEnum(
      workflow.primary_call_to_action,
      CTA_OPTIONS,
      'workflow.primary_call_to_action',
      errors,
    )

    validateEnum(
      workflow.approval_timing,
      APPROVAL_TIMINGS,
      'workflow.approval_timing',
      errors,
    )

    validateEnum(
      workflow.approval_preference,
      APPROVAL_PREFERENCES,
      'workflow.approval_preference',
      errors,
    )

    const ctaNeedsDestination = [
      'call',
      'website',
      'request_quote',
      'book_appointment',
      'purchase',
      'sign_up',
    ].includes(
      typeof workflow
        .primary_call_to_action === 'string'
        ? workflow.primary_call_to_action
        : '',
    )

    if (
      ctaNeedsDestination &&
      !hasText(
        workflow.call_to_action_destination,
      )
    ) {
      errors[
        'workflow.call_to_action_destination'
      ] =
        'Please provide the destination for this call to action.'
    }
  }

  return errors
}

// =========================================================
// AUTOMATIC WORKFLOW FLAGS
// =========================================================

function generateFlags(
  payload: unknown,
): string[] {
  if (!isPlainObject(payload)) {
    return []
  }

  const flags = new Set<string>()

  const socialMedia =
    isPlainObject(payload.social_media)
      ? payload.social_media
      : null

  const content =
    isPlainObject(payload.content)
      ? payload.content
      : null

  const requirements =
    isPlainObject(payload.requirements)
      ? payload.requirements
      : null

  const workflow =
    isPlainObject(payload.workflow)
      ? payload.workflow
      : null

  if (socialMedia) {
    const platformsToManage =
      Array.isArray(
        socialMedia.platforms_to_manage,
      )
        ? socialMedia.platforms_to_manage
        : []

    const newAccountsNeeded =
      Array.isArray(
        socialMedia.new_accounts_needed,
      )
        ? socialMedia.new_accounts_needed
        : []

    const managesMeta =
      platformsToManage.includes(
        'facebook',
      ) ||
      platformsToManage.includes(
        'instagram',
      )

    if (
      managesMeta &&
      (
        socialMedia
          .meta_business_portfolio_status ===
          'no' ||
        socialMedia
          .meta_business_portfolio_status ===
          'not_sure'
      )
    ) {
      flags.add(
        'META_SETUP_REQUIRED',
      )
    }

    const managesTikTok =
      platformsToManage.includes(
        'tiktok',
      )

    if (
      managesTikTok &&
      (
        socialMedia
          .tiktok_business_center_status ===
          'no' ||
        socialMedia
          .tiktok_business_center_status ===
          'not_sure'
      )
    ) {
      flags.add(
        'TIKTOK_SETUP_REQUIRED',
      )
    }

    if (
      newAccountsNeeded.length > 0
    ) {
      flags.add(
        'NEW_SOCIAL_ACCOUNT_REQUIRED',
      )
    }

    if (
      socialMedia
        .previous_agency_experience ===
      true
    ) {
      flags.add(
        'PREVIOUS_AGENCY_EXPERIENCE',
      )
    }
  }

  if (
    content &&
    (
      content.media_supply_frequency ===
        'rarely' ||
      content.media_supply_frequency ===
        'no'
    )
  ) {
    flags.add(
      'LIMITED_CLIENT_MEDIA',
    )
  }

  if (
    requirements &&
    requirements.compliance_status ===
      'yes'
  ) {
    flags.add(
      'COMPLIANCE_REQUIREMENTS',
    )
  }

  if (
    workflow &&
    workflow.approval_preference ===
      'approve_everything'
  ) {
    flags.add(
      'STRICT_APPROVAL_WORKFLOW',
    )
  }

  return Array.from(flags)
}

// =========================================================
// EDGE FUNCTION
// =========================================================

export default {
  fetch: withSupabase(
    { auth: 'user' },

    async (req, ctx) => {
      const origin =
        req.headers.get('origin')

      // ---------------------------------------------------
      // CORS PREFLIGHT
      // ---------------------------------------------------

      if (req.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(origin),
        })
      }

      // ---------------------------------------------------
      // ORIGIN
      // ---------------------------------------------------

      if (
        origin &&
        !ALLOWED_ORIGINS.has(origin)
      ) {
        return jsonResponse(
          {
            success: false,
            error:
              'ORIGIN_NOT_ALLOWED',
          },
          403,
          origin,
        )
      }

      // ---------------------------------------------------
      // POST ONLY
      // ---------------------------------------------------

      if (req.method !== 'POST') {
        return jsonResponse(
          {
            success: false,
            error:
              'METHOD_NOT_ALLOWED',
          },
          405,
          origin,
        )
      }

      // ---------------------------------------------------
      // JSON ONLY
      // ---------------------------------------------------

      const contentType =
        req.headers.get(
          'content-type',
        ) ?? ''

      if (
        !contentType
          .toLowerCase()
          .includes(
            'application/json',
          )
      ) {
        return jsonResponse(
          {
            success: false,
            error:
              'CONTENT_TYPE_REQUIRED',
          },
          415,
          origin,
        )
      }

      // ---------------------------------------------------
      // PAYLOAD SIZE
      // ---------------------------------------------------

      const rawBody =
        await req.text()

      const payloadBytes =
        new TextEncoder()
          .encode(rawBody)
          .length

      if (
        payloadBytes >
        MAX_PAYLOAD_BYTES
      ) {
        return jsonResponse(
          {
            success: false,
            error:
              'PAYLOAD_TOO_LARGE',
          },
          413,
          origin,
        )
      }

      // ---------------------------------------------------
      // PARSE JSON
      // ---------------------------------------------------

      let payload: unknown

      try {
        payload =
          JSON.parse(rawBody)
      } catch {
        return jsonResponse(
          {
            success: false,
            error:
              'INVALID_JSON',
          },
          400,
          origin,
        )
      }

      // ---------------------------------------------------
      // VALIDATE
      // ---------------------------------------------------

      const validationErrors =
        validatePayload(payload)

      if (
        Object.keys(
          validationErrors,
        ).length > 0
      ) {
        return jsonResponse(
          {
            success: false,
            error:
              'VALIDATION_ERROR',
            fields:
              validationErrors,
          },
          400,
          origin,
        )
      }

      // At this point validation has proven
      // this is an object.
      if (!isPlainObject(payload)) {
        return jsonResponse(
          {
            success: false,
            error:
              'VALIDATION_ERROR',
          },
          400,
          origin,
        )
      }

      // ---------------------------------------------------
      // GENERATE INTERNAL FLAGS
      // ---------------------------------------------------

      const flags =
        generateFlags(payload)

        // ---------------------------------------------------
// VERIFY CLIENT PORTAL MEMBERSHIP
// ---------------------------------------------------

const userId =
  ctx.userClaims?.id

if (!userId) {
  return jsonResponse(
    {
      success: false,
      error: 'AUTH_REQUIRED',
      message:
        'Your client portal session could not be verified.',
    },
    401,
    origin,
  )
}

const {
  data: membership,
  error: membershipError,
} =
  await ctx.supabaseAdmin
    .from('client_users')
    .select(
      'client_id, role, is_active',
    )
    .eq('user_id', userId)
    .maybeSingle()

if (membershipError) {
  console.error(
    'Client membership lookup failed:',
    membershipError,
  )

  return jsonResponse(
    {
      success: false,
      error: 'MEMBERSHIP_LOOKUP_FAILED',
      message:
        'We could not verify your client portal access.',
    },
    500,
    origin,
  )
}

if (
  !membership ||
  membership.is_active !== true
) {
  return jsonResponse(
    {
      success: false,
      error: 'CLIENT_ACCESS_REQUIRED',
      message:
        'An active client portal account is required.',
    },
    403,
    origin,
  )
}
// ---------------------------------------------------
// VERIFY ONBOARDING EDIT PERMISSION
// ---------------------------------------------------

const portalRole =
  String(
    membership.role || '',
  )
    .trim()
    .toLowerCase()

if (
  ![
    'owner',
    'manager',
  ].includes(portalRole)
) {
  return jsonResponse(
    {
      success: false,
      error:
        'ONBOARDING_PERMISSION_REQUIRED',
      message:
        'Only a client Owner or Manager can submit or update onboarding information.',
    },
    403,
    origin,
  )
}

const clientId =
  membership.client_id

      // ---------------------------------------------------
      // ATOMIC DATABASE WRITE
      // ---------------------------------------------------

      try {
        const {
          data,
          error,
        } =
          await ctx.supabaseAdmin
            .rpc(
              'create_onboarding_submission',
              {
                p_payload: payload,
                p_client_id: clientId,
                p_flags: flags,
              },
            )

        if (error) {
          console.error(
            'Onboarding RPC failed:',
            error,
          )

          return jsonResponse(
            {
              success: false,
              error:
                'SUBMISSION_FAILED',
              message:
                'We could not save your onboarding questionnaire. Please try again.',
            },
            500,
            origin,
          )
        }

        if (!isPlainObject(data)) {
          console.error(
            'Unexpected RPC response:',
            data,
          )

          return jsonResponse(
            {
              success: false,
              error:
                'SUBMISSION_FAILED',
              message:
                'We could not save your onboarding questionnaire. Please try again.',
            },
            500,
            origin,
          )
        }

        const submissionId =
          typeof data.submission_id ===
            'string'
            ? data.submission_id
            : null

        if (!submissionId) {
          console.error(
            'RPC returned no submission ID:',
            data,
          )

          return jsonResponse(
            {
              success: false,
              error:
                'SUBMISSION_FAILED',
              message:
                'We could not save your onboarding questionnaire. Please try again.',
            },
            500,
            origin,
          )
        }

        // -------------------------------------------------
        // PUBLIC SUCCESS RESPONSE
        // -------------------------------------------------
        //
        // Do NOT expose:
        // - client ID
        // - workflow flags
        // - raw DB details
        //
        // The browser only gets the submission reference.
        // -------------------------------------------------

        return jsonResponse(
          {
            success: true,
            message:
              'Your onboarding questionnaire has been submitted.',
            submission_id:
              submissionId,
          },
          200,
          origin,
        )
      } catch (error) {
        console.error(
          'Unexpected onboarding error:',
          error,
        )

        return jsonResponse(
          {
            success: false,
            error:
              'SUBMISSION_FAILED',
            message:
              'We could not save your onboarding questionnaire. Please try again.',
          },
          500,
          origin,
        )
      }
    },
  ),
}