// =========================================================
// THE ALGORITHM FORGE
// CLIENT PORTAL
// =========================================================


// =========================================================
// SUPABASE CONFIG
// =========================================================

const SUPABASE_URL =
  "https://dbujzfjwbzjrwaknvdax.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_LaXzH-5gXws_N8LMfbf-6g_aInczyqT";


// =========================================================
// CREATE SUPABASE CLIENT
// =========================================================

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );


// =========================================================
// ROOT ELEMENTS
// =========================================================

const portalLoading =
  document.getElementById(
    "portalLoading"
  );

const portalApp =
  document.getElementById(
    "portalApp"
  );

const portalAccessError =
  document.getElementById(
    "portalAccessError"
  );

const portalAccessErrorMessage =
  document.getElementById(
    "portalAccessErrorMessage"
  );


// =========================================================
// ACCOUNT ELEMENTS
// =========================================================

const clientSignOut =
  document.getElementById(
    "clientSignOut"
  );

const sidebarClientName =
  document.getElementById(
    "sidebarClientName"
  );

const sidebarClientEmail =
  document.getElementById(
    "sidebarClientEmail"
  );

const portalBusinessName =
  document.getElementById(
    "portalBusinessName"
  );

const topbarClientEmail =
  document.getElementById(
    "topbarClientEmail"
  );

const clientAvatar =
  document.getElementById(
    "clientAvatar"
  );

const topbarAvatar =
  document.getElementById(
    "topbarAvatar"
  );

const welcomeHeading =
  document.getElementById(
    "welcomeHeading"
  );


// =========================================================
// ONBOARDING ELEMENTS
// =========================================================

const onboardingStatus =
  document.getElementById(
    "onboardingStatus"
  );

const onboardingDescription =
  document.getElementById(
    "onboardingDescription"
  );

const onboardingAction =
  document.getElementById(
    "onboardingAction"
  );

const onboardingPanel =
  document.getElementById(
    "onboardingPanel"
  );

  // =========================================================
// UPLOAD ELEMENTS
// =========================================================

const clientUploadInput =
  document.getElementById(
    "clientUploadInput"
  );

const clientUploadButton =
  document.getElementById(
    "clientUploadButton"
  );

const selectedUploadFiles =
  document.getElementById(
    "selectedUploadFiles"
  );

const clientUploadNote =
  document.getElementById(
    "clientUploadNote"
  );

const clientUploadClearButton =
  document.getElementById(
    "clientUploadClearButton"
  );

const clientUploadSubmitButton =
  document.getElementById(
    "clientUploadSubmitButton"
  );

const clientUploadStatus =
  document.getElementById(
    "clientUploadStatus"
  );

const clientUploadsList =
  document.getElementById(
    "clientUploadsList"
  );

const clientUploadCount =
  document.getElementById(
    "clientUploadCount"
  );

const uploadCount =
  document.getElementById(
    "uploadCount"
  );


// =========================================================
// NAVIGATION
// =========================================================

const portalNavItems =
  document.querySelectorAll(
    ".portal-nav-item[data-view]"
  );

const portalViews =
  document.querySelectorAll(
    ".portal-view"
  );

const openViewButtons =
  document.querySelectorAll(
    "[data-open-view]"
  );


// =========================================================
// STATE
// =========================================================

let currentUser =
  null;

let currentMembership =
  null;

let currentOnboardingSubmission =
  null;

let currentView =
  "dashboard";

  let selectedClientUploadFiles =
  [];

let clientUploads =
  [];

let uploadInProgress =
  false;

// =========================================================
// ROOT VIEWS
// =========================================================

function hideRootViews() {

  portalLoading.hidden =
    true;

  portalApp.hidden =
    true;

  portalAccessError.hidden =
    true;

}


function showLoading() {

  hideRootViews();

  portalLoading.hidden =
    false;

}


function showPortal() {

  hideRootViews();

  portalApp.hidden =
    false;

}


function showAccessError(
  message
) {

  hideRootViews();

  portalAccessErrorMessage.textContent =
    message ||
    "Please sign in with an authorized client account to access this portal.";

  portalAccessError.hidden =
    false;

}


// =========================================================
// CLIENT MEMBERSHIP
// =========================================================

async function loadClientMembership() {

  const {
    data,
    error,
  } =
    await supabaseClient
      .from(
        "client_users"
      )
      .select(
        "user_id, client_id, role, is_active"
      )
      .eq(
        "user_id",
        currentUser.id
      )
      .maybeSingle();


  if (error) {

    console.error(
      "Client membership load failed:",
      error
    );

    throw new Error(
      "We couldn't verify your client portal access."
    );

  }


  if (!data) {

    throw new Error(
      "This account is not connected to an Algorithm Forge client."
    );

  }


  if (
    data.is_active !==
      true
  ) {

    throw new Error(
      "Your client portal access is currently inactive."
    );

  }


  currentMembership =
    data;


  return data;

}


// =========================================================
// DISPLAY IDENTITY
// =========================================================

function renderClientIdentity() {

  const email =
    currentUser?.email ||
    "";

  const metadata =
    currentUser?.user_metadata ||
    {};

  const businessName =
    metadata.business_name ||
    "Your Business";

  const displayName =
    metadata.full_name ||
    metadata.name ||
    businessName;


  portalBusinessName.textContent =
    businessName.toUpperCase();


  sidebarClientName.textContent =
    displayName;


  sidebarClientEmail.textContent =
    email;


  topbarClientEmail.textContent =
    email;


  const initials =
    getInitials(
      displayName
    );


  clientAvatar.textContent =
    initials;

  topbarAvatar.textContent =
    initials;


  welcomeHeading.textContent =
    `LET'S GET TO WORK.`;

}


// =========================================================
// INITIALS
// =========================================================

function getInitials(
  value
) {

  const cleanValue =
    String(
      value || ""
    ).trim();


  if (!cleanValue) {
    return "AF";
  }


  const pieces =
    cleanValue
      .split(/\s+/)
      .filter(Boolean);


  if (
    pieces.length ===
      1
  ) {

    return pieces[0]
      .slice(
        0,
        2
      )
      .toUpperCase();

  }


  return (
    pieces[0][0] +
    pieces[
      pieces.length - 1
    ][0]
  ).toUpperCase();

}


// =========================================================
// NAVIGATION
// =========================================================

function showPortalView(
  viewName
) {

  currentView =
    viewName;


  portalViews.forEach(
    (view) => {

      const matches =
        view.id ===
        `view-${viewName}`;


      view.hidden =
        !matches;


      view.classList.toggle(
        "active",
        matches
      );

    }
  );


  portalNavItems.forEach(
    (button) => {

      button.classList.toggle(
        "active",
        button.dataset.view ===
          viewName
      );

    }
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

}


// =========================================================
// NAVIGATION EVENTS
// =========================================================

portalNavItems.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const viewName =
          button.dataset.view;


        if (
  viewName ===
  "onboarding"
) {

  if (
    currentOnboardingSubmission
  ) {

    showPortalView(
      "onboarding"
    );

  } else {

    window.location.href =
      "onboarding.html";

  }

  return;

}


        showPortalView(
          viewName
        );

      }
    );

  }
);


openViewButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        showPortalView(
          button.dataset.openView
        );

      }
    );

  }
);


// =========================================================
// ONBOARDING
// =========================================================

function renderOnboardingRequired() {

  onboardingStatus.textContent =
    "Required";

  onboardingStatus.className =
    "status-pill is-required";


  onboardingDescription.textContent =
    "Complete your onboarding so we can learn about your business, brand, audience, and content goals.";


  onboardingAction.textContent =
    "Start Onboarding";


  onboardingPanel.innerHTML = `
    <div class="empty-state">

      <strong>
        Let's get your business set up.
      </strong>

      <p>
        Your onboarding information gives The Algorithm
        Forge the foundation we need to create content
        that actually fits your business.
      </p>

    </div>
  `;

}


function renderOnboardingComplete() {

  onboardingStatus.textContent =
    "Complete";

  onboardingStatus.className =
    "status-pill is-complete";


  onboardingDescription.textContent =
    "Your onboarding information has been submitted.";


  onboardingAction.textContent =
    "View Onboarding";


  onboardingPanel.innerHTML = `
    <div class="empty-state">

      <strong>
        Onboarding complete.
      </strong>

      <p>
        Your business information is on file with
        The Algorithm Forge.
      </p>

    </div>
  `;

}

// =========================================================
// ONBOARDING SUMMARY HELPERS
// =========================================================

function escapePortalHtml(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


// =========================================================
// ONBOARDING SUMMARY
// =========================================================

function renderOnboardingSummary() {

  if (
    !currentOnboardingSubmission
      ?.raw_response
  ) {

    onboardingPanel.innerHTML = `
      <div class="empty-state">

        <strong>
          Onboarding complete.
        </strong>

        <p>
          Your onboarding submission has been received.
        </p>

      </div>
    `;

    return;

  }


  const payload =
    currentOnboardingSubmission
      .raw_response;


  const formatLabel =
    (value) =>
      String(value)
        .replaceAll(
          "_",
          " "
        )
        .replace(
          /\b\w/g,
          (letter) =>
            letter.toUpperCase()
        );


  const formatValue =
    (value) => {

      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return "Not provided";
      }


      if (
        typeof value ===
        "boolean"
      ) {
        return value
          ? "Yes"
          : "No";
      }


      if (
        Array.isArray(value)
      ) {

        if (
          value.length === 0
        ) {
          return "None";
        }


        return value
          .map(
            (item) => {

              if (
                typeof item ===
                "string"
              ) {
                return formatLabel(
                  item
                );
              }


              if (
                item &&
                typeof item ===
                "object"
              ) {

                const platform =
                  item.platform
                    ? formatLabel(
                        item.platform
                      )
                    : "Account";

                const url =
                  item.profile_url ||
                  "";

                return url
                  ? `${platform}: ${url}`
                  : platform;

              }


              return String(
                item
              );

            }
          )
          .join(", ");

      }


      return formatLabel(
        String(value)
      );

    };


  const makeRow =
    (
      label,
      value
    ) => `
      <div class="onboarding-summary-row">

        <span class="onboarding-summary-label">
          ${escapePortalHtml(label)}
        </span>

        <div class="onboarding-summary-value">
          ${escapePortalHtml(
            formatValue(value)
          )}
        </div>

      </div>
    `;


  const makeSection =
    (
      title,
      rows
    ) => `
      <section class="onboarding-summary-section">

        <h3>
          ${escapePortalHtml(title)}
        </h3>

        <div class="onboarding-summary-grid">
          ${rows.join("")}
        </div>

      </section>
    `;


  const business =
    payload.business ||
    {};

  const contact =
    payload.primary_contact ||
    {};

  const brand =
    payload.brand ||
    {};

  const social =
    payload.social_media ||
    {};

  const goals =
    payload.goals ||
    {};

  const content =
    payload.content ||
    {};

  const requirements =
    payload.requirements ||
    {};

  const workflow =
    payload.workflow ||
    {};


  const submittedDate =
    currentOnboardingSubmission
      .submitted_at
      ? new Date(
          currentOnboardingSubmission
            .submitted_at
        ).toLocaleString()
      : "Unknown";


  onboardingPanel.innerHTML = `

    <div class="onboarding-summary-header">

      <div>

        <span class="card-kicker">
          SUBMITTED
        </span>

        <h3>
          YOUR ONBOARDING
        </h3>

        <p>
          Submitted ${escapePortalHtml(
            submittedDate
          )}
        </p>

      </div>

      <span class="status-pill is-complete">
        Complete
      </span>

    </div>


    ${makeSection(
      "Business",
      [
        makeRow(
          "Business Name",
          business.business_name
        ),

        makeRow(
          "Website",
          business.website
        ),

        makeRow(
          "What We Do",
          business.business_description
        ),

        makeRow(
          "Operating Scope",
          business.operating_scope
        ),

        makeRow(
          "Service Area",
          business.service_area
        ),

        makeRow(
          "Priority Products / Services",
          business.priority_products_services
        ),
      ]
    )}


    ${makeSection(
      "Primary Contact",
      [
        makeRow(
          "Name",
          contact.name
        ),

        makeRow(
          "Role",
          contact.role
        ),

        makeRow(
          "Email",
          contact.email
        ),

        makeRow(
          "Phone",
          contact.phone
        ),

        makeRow(
          "Preferred Contact Method",
          contact.preferred_contact_method
        ),
      ]
    )}


    ${makeSection(
      "Brand",
      [
        makeRow(
          "Ideal Customer",
          brand.ideal_customer
        ),

        makeRow(
          "What Sets Us Apart",
          brand.differentiators
        ),

        makeRow(
          "Brand Voice",
          brand.brand_voice
        ),

        makeRow(
          "Brand Voice Notes",
          brand.brand_voice_notes
        ),

        makeRow(
          "Preferred Language",
          brand.preferred_language
        ),

        makeRow(
          "Language to Avoid",
          brand.avoid_language
        ),

        makeRow(
          "Brand Guidelines",
          brand.brand_guidelines_status
        ),

        makeRow(
          "Brand Materials",
          brand.brand_materials
        ),
      ]
    )}


    ${makeSection(
      "Social Media",
      [
        makeRow(
          "Existing Accounts",
          social.existing_accounts
        ),

        makeRow(
          "Platforms to Manage",
          social.platforms_to_manage
        ),

        makeRow(
          "New Accounts Needed",
          social.new_accounts_needed
        ),

        makeRow(
          "Current Social Manager",
          social.current_social_manager
        ),

        makeRow(
          "Previous Agency Experience",
          social.previous_agency_experience
        ),

        makeRow(
          "Previous Agency Notes",
          social.previous_agency_notes
        ),

        makeRow(
          "Meta Business Portfolio",
          social.meta_business_portfolio_status
        ),

        makeRow(
          "TikTok Business Center",
          social.tiktok_business_center_status
        ),
      ]
    )}


    ${makeSection(
      "Goals",
      [
        makeRow(
          "Primary Goals",
          goals.primary_goals
        ),

        makeRow(
          "Top Priority",
          goals.primary_goal
        ),

        makeRow(
          "Desired Improvement",
          goals.desired_improvement
        ),
      ]
    )}


    ${makeSection(
      "Content",
      [
        makeRow(
          "Content Preferences",
          content.content_preferences
        ),

        makeRow(
          "Existing Media",
          content.media_inventory
        ),

        makeRow(
          "Media Supply",
          content.media_supply_frequency
        ),

        makeRow(
          "Priority Features",
          content.priority_features
        ),

        makeRow(
          "Testimonials",
          content.testimonials_available
        ),

        makeRow(
          "Upcoming Promotions",
          content.upcoming_promotions
        ),

        makeRow(
          "Content Exclusions",
          content.content_exclusions
        ),
      ]
    )}


    ${makeSection(
      "Requirements",
      [
        makeRow(
          "Competitors / Inspiration",
          requirements.competitor_inspiration
        ),

        makeRow(
          "Inspiration Notes",
          requirements.competitor_inspiration_notes
        ),

        makeRow(
          "Compliance Requirements",
          requirements.compliance_status
        ),

        makeRow(
          "Compliance Notes",
          requirements.compliance_notes
        ),
      ]
    )}


    ${makeSection(
      "Workflow",
      [
        makeRow(
          "Primary Call to Action",
          workflow.primary_call_to_action
        ),

        makeRow(
          "CTA Destination",
          workflow.call_to_action_destination
        ),

        makeRow(
          "Approval Contact",
          workflow.approval_contact
        ),

        makeRow(
          "Approval Timing",
          workflow.approval_timing
        ),

        makeRow(
          "Approval Preference",
          workflow.approval_preference
        ),

        makeRow(
          "Approval Requirements",
          workflow.approval_requirements
        ),

        makeRow(
          "Additional Notes",
          workflow.additional_notes
        ),
      ]
    )}

  `;

}


// =========================================================
// ONBOARDING STATE
// =========================================================

async function initializeOnboardingState() {

  if (
    !currentMembership?.client_id
  ) {

    currentOnboardingSubmission =
      null;

    renderOnboardingRequired();

    return;

  }


  const {
    data,
    error,
  } =
    await supabaseClient
      .from(
        "onboarding_submissions"
      )
      .select(
        "id, submitted_at, raw_response"
      )
      .eq(
        "client_id",
        currentMembership.client_id
      )
      .order(
        "submitted_at",
        {
          ascending: false,
        }
      )
      .limit(1)
      .maybeSingle();


  if (error) {

    console.error(
      "Onboarding status load failed:",
      error
    );

    currentOnboardingSubmission =
      null;

    renderOnboardingRequired();

    return;

  }


  if (data) {

    currentOnboardingSubmission =
      data;

    renderOnboardingComplete();

    renderOnboardingSummary();

    return;

  }


  currentOnboardingSubmission =
    null;

  renderOnboardingRequired();

}


// =========================================================
// ONBOARDING ACTION
// =========================================================

onboardingAction.addEventListener(
  "click",
  () => {

    if (
      currentOnboardingSubmission
    ) {

      showPortalView(
        "onboarding"
      );

      return;

    }


    window.location.href =
      "onboarding.html";

  }
);

// =========================================================
// CLIENT UPLOAD HELPERS
// =========================================================

function formatUploadBytes(
  bytes
) {

  const value =
    Number(bytes || 0);


  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return "0 B";
  }


  const units = [
    "B",
    "KB",
    "MB",
    "GB",
  ];


  const index =
    Math.min(
      Math.floor(
        Math.log(value) /
        Math.log(1024)
      ),
      units.length - 1
    );


  const amount =
    value /
    Math.pow(
      1024,
      index
    );


  return `${amount.toFixed(
    index === 0
      ? 0
      : 1
  )} ${units[index]}`;

}


function sanitizeUploadFileName(
  fileName
) {

  const clean =
    String(
      fileName || "file"
    )
      .trim()
      .replace(
        /[^a-zA-Z0-9._-]+/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      );


  return (
    clean ||
    "file"
  );

}


function getUploadTypeLabel(
  mimeType
) {

  const type =
    String(
      mimeType || ""
    ).toLowerCase();


  if (
    type.startsWith(
      "image/"
    )
  ) {
    return "IMG";
  }


  if (
    type.startsWith(
      "video/"
    )
  ) {
    return "VID";
  }


  if (
    type.startsWith(
      "audio/"
    )
  ) {
    return "AUD";
  }


  if (
    type ===
      "application/pdf"
  ) {
    return "PDF";
  }


  return "FILE";

}


// =========================================================
// SELECTED FILES
// =========================================================

function renderSelectedUploadFiles() {

  if (
    selectedClientUploadFiles
      .length === 0
  ) {

    selectedUploadFiles.hidden =
      true;

    selectedUploadFiles.innerHTML =
      "";

    clientUploadClearButton.hidden =
      true;

    clientUploadSubmitButton.disabled =
      true;

    return;

  }


  selectedUploadFiles.innerHTML =
    selectedClientUploadFiles
      .map(
        (file) => `
          <div class="selected-upload-file">

            <div class="selected-upload-file-main">

              <span class="selected-upload-file-name">
                ${escapePortalHtml(
                  file.name
                )}
              </span>

              <span class="selected-upload-file-meta">
                ${escapePortalHtml(
                  file.type ||
                  "Unknown file type"
                )}
                ·
                ${escapePortalHtml(
                  formatUploadBytes(
                    file.size
                  )
                )}
              </span>

            </div>

          </div>
        `
      )
      .join("");


  selectedUploadFiles.hidden =
    false;

  clientUploadClearButton.hidden =
    false;

  clientUploadSubmitButton.disabled =
    uploadInProgress;

}


function setSelectedUploadFiles(
  files
) {

  selectedClientUploadFiles =
    Array.from(
      files || []
    ).filter(
      (file) =>
        file instanceof File
    );


  renderSelectedUploadFiles();

}


function clearSelectedUploadFiles() {

  selectedClientUploadFiles =
    [];

  clientUploadInput.value =
    "";

  clientUploadNote.value =
    "";

  renderSelectedUploadFiles();

}


// =========================================================
// UPLOAD STATUS
// =========================================================

function clearClientUploadStatus() {

  clientUploadStatus.hidden =
    true;

  clientUploadStatus.textContent =
    "";

  clientUploadStatus.className =
    "upload-status";

}


function showClientUploadStatus(
  message,
  type = ""
) {

  clientUploadStatus.hidden =
    false;

  clientUploadStatus.textContent =
    message;

  clientUploadStatus.className =
    "upload-status";


  if (
    type ===
    "success"
  ) {

    clientUploadStatus
      .classList
      .add(
        "is-success"
      );

  }


  if (
    type ===
    "error"
  ) {

    clientUploadStatus
      .classList
      .add(
        "is-error"
      );

  }

}


// =========================================================
// UPLOAD BUSY STATE
// =========================================================

function setUploadBusy(
  busy
) {

  uploadInProgress =
    busy;

  clientUploadSubmitButton.disabled =
    busy ||
    selectedClientUploadFiles
      .length === 0;

  clientUploadButton.disabled =
    busy;

  clientUploadClearButton.disabled =
    busy;

  clientUploadNote.disabled =
    busy;

  clientUploadSubmitButton.textContent =
    busy
      ? "Uploading..."
      : "Upload Files";

}


// =========================================================
// LOAD CLIENT UPLOADS
// =========================================================

async function loadClientUploads() {

  if (
    !currentMembership
      ?.client_id
  ) {
    return;
  }


  const {
    data,
    error,
  } =
    await supabaseClient
      .from(
        "client_uploads"
      )
      .select(
        `
          id,
          client_id,
          uploaded_by,
          storage_path,
          file_name,
          mime_type,
          file_size,
          note,
          created_at
        `
      )
      .eq(
        "client_id",
        currentMembership.client_id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );


  if (error) {

    console.error(
      "Client uploads load failed:",
      error
    );

    clientUploads =
      [];

    renderClientUploads();

    return;

  }


  clientUploads =
    data ||
    [];


  renderClientUploads();

}


// =========================================================
// RENDER CLIENT UPLOADS
// =========================================================

function renderClientUploads() {

  const count =
    clientUploads.length;


  clientUploadCount.textContent =
    String(count);


  if (uploadCount) {

    uploadCount.textContent =
      String(count);

  }


  if (
    count === 0
  ) {

    clientUploadsList.innerHTML = `
      <div class="empty-state">

        <strong>
          No uploads yet.
        </strong>

        <p>
          Files you send to us will appear here.
        </p>

      </div>
    `;

    return;

  }


  clientUploadsList.innerHTML = `
    <div class="client-upload-list">

      ${clientUploads
        .map(
          (upload) => {

            const canDelete =
              upload.uploaded_by ===
              currentUser?.id;


            const created =
              upload.created_at
                ? new Date(
                    upload.created_at
                  ).toLocaleString()
                : "";


            return `
              <div
                class="client-upload-item"
                data-upload-id="${escapePortalHtml(
                  upload.id
                )}"
              >

                <div class="client-upload-main">

                  <div class="client-upload-icon">
                    ${escapePortalHtml(
                      getUploadTypeLabel(
                        upload.mime_type
                      )
                    )}
                  </div>

                  <div class="client-upload-copy">

                    <span class="client-upload-name">
                      ${escapePortalHtml(
                        upload.file_name
                      )}
                    </span>

                    <div class="client-upload-meta">
                      ${escapePortalHtml(
                        formatUploadBytes(
                          upload.file_size
                        )
                      )}
                      ·
                      ${escapePortalHtml(
                        created
                      )}
                    </div>

                    ${
                      upload.note
                        ? `
                          <div class="client-upload-note">
                            ${escapePortalHtml(
                              upload.note
                            )}
                          </div>
                        `
                        : ""
                    }

                  </div>

                </div>


                <div class="client-upload-actions">

                  <button
                    type="button"
                    class="client-upload-action"
                    data-upload-action="open"
                    data-upload-id="${escapePortalHtml(
                      upload.id
                    )}"
                  >
                    Open
                  </button>

                  ${
                    canDelete
                      ? `
                        <button
                          type="button"
                          class="client-upload-action is-danger"
                          data-upload-action="delete"
                          data-upload-id="${escapePortalHtml(
                            upload.id
                          )}"
                        >
                          Delete
                        </button>
                      `
                      : ""
                  }

                </div>

              </div>
            `;

          }
        )
        .join("")}

    </div>
  `;

}


// =========================================================
// UPLOAD FILES
// =========================================================

async function uploadSelectedClientFiles() {

  if (
    uploadInProgress ||
    selectedClientUploadFiles
      .length === 0
  ) {
    return;
  }


  if (
    !currentMembership
      ?.client_id ||
    !currentUser?.id
  ) {

    showClientUploadStatus(
      "Your client portal session could not be verified.",
      "error"
    );

    return;

  }


  clearClientUploadStatus();

  setUploadBusy(
    true
  );


  const note =
    clientUploadNote.value
      .trim() ||
    null;


  let completed =
    0;


  try {

    for (
      const file
      of selectedClientUploadFiles
    ) {

      const safeName =
        sanitizeUploadFileName(
          file.name
        );


      const storagePath =
        `${currentMembership.client_id}/uploads/${crypto.randomUUID()}-${safeName}`;


      const {
        error: storageError,
      } =
        await supabaseClient
          .storage
          .from(
            "content-assets"
          )
          .upload(
            storagePath,
            file,
            {
              cacheControl:
                "3600",

              upsert:
                false,

              contentType:
                file.type ||
                undefined,
            }
          );


      if (storageError) {

        console.error(
          "Client file upload failed:",
          storageError
        );

        throw new Error(
          `Could not upload ${file.name}.`
        );

      }


      const {
        error: recordError,
      } =
        await supabaseClient
          .from(
            "client_uploads"
          )
          .insert({
            client_id:
              currentMembership
                .client_id,

            uploaded_by:
              currentUser.id,

            storage_path:
              storagePath,

            file_name:
              file.name,

            mime_type:
              file.type ||
              null,

            file_size:
              file.size,

            note,
          });


      if (recordError) {

        console.error(
          "Client upload record failed:",
          recordError
        );


        /*
          Clean up the Storage file if
          the database record fails.
        */

        await supabaseClient
          .storage
          .from(
            "content-assets"
          )
          .remove([
            storagePath,
          ]);


        throw new Error(
          `Could not finish saving ${file.name}.`
        );

      }


      completed += 1;

    }


    clearSelectedUploadFiles();


    await loadClientUploads();


    showClientUploadStatus(
      `${completed} ${
        completed === 1
          ? "file"
          : "files"
      } uploaded successfully.`,
      "success"
    );


  } catch (error) {

    console.error(
      "Client upload failed:",
      error
    );


    showClientUploadStatus(
      error?.message ||
      "We could not upload your files. Please try again.",
      "error"
    );


    /*
      Reload the list because some files
      may have completed successfully
      before another file failed.
    */

    await loadClientUploads();


  } finally {

    setUploadBusy(
      false
    );

  }

}


// =========================================================
// OPEN CLIENT UPLOAD
// =========================================================

async function openClientUpload(
  uploadId
) {

  const upload =
    clientUploads.find(
      (item) =>
        item.id ===
        uploadId
    );


  if (!upload) {
    return;
  }


  const {
    data,
    error,
  } =
    await supabaseClient
      .storage
      .from(
        "content-assets"
      )
      .createSignedUrl(
        upload.storage_path,
        300
      );


  if (
    error ||
    !data?.signedUrl
  ) {

    console.error(
      "Signed upload URL failed:",
      error
    );

    showClientUploadStatus(
      "We couldn't open that file.",
      "error"
    );

    return;

  }


  window.open(
    data.signedUrl,
    "_blank",
    "noopener,noreferrer"
  );

}


// =========================================================
// DELETE CLIENT UPLOAD
// =========================================================

async function deleteClientUpload(
  uploadId
) {

  const upload =
    clientUploads.find(
      (item) =>
        item.id ===
        uploadId
    );


  if (!upload) {
    return;
  }


  if (
    upload.uploaded_by !==
    currentUser?.id
  ) {
    return;
  }


  const confirmed =
    window.confirm(
      `Delete "${upload.file_name}"?`
    );


  if (!confirmed) {
    return;
  }


  clearClientUploadStatus();


  const {
    error: storageError,
  } =
    await supabaseClient
      .storage
      .from(
        "content-assets"
      )
      .remove([
        upload.storage_path,
      ]);


  if (storageError) {

    console.error(
      "Client upload delete failed:",
      storageError
    );

    showClientUploadStatus(
      "We couldn't delete that file.",
      "error"
    );

    return;

  }


  const {
    error: recordError,
  } =
    await supabaseClient
      .from(
        "client_uploads"
      )
      .delete()
      .eq(
        "id",
        upload.id
      );


  if (recordError) {

    console.error(
      "Client upload record delete failed:",
      recordError
    );

    showClientUploadStatus(
      "The file was removed, but its upload record could not be cleaned up.",
      "error"
    );

    return;

  }


  await loadClientUploads();


  showClientUploadStatus(
    "File deleted.",
    "success"
  );

}


// =========================================================
// CLIENT UPLOAD EVENTS
// =========================================================

clientUploadButton.addEventListener(
  "click",
  () => {

    if (
      !uploadInProgress
    ) {

      clientUploadInput.click();

    }

  }
);


clientUploadInput.addEventListener(
  "change",
  () => {

    setSelectedUploadFiles(
      clientUploadInput.files
    );

    clearClientUploadStatus();

  }
);


clientUploadClearButton.addEventListener(
  "click",
  () => {

    if (
      !uploadInProgress
    ) {

      clearSelectedUploadFiles();

      clearClientUploadStatus();

    }

  }
);


clientUploadSubmitButton.addEventListener(
  "click",
  uploadSelectedClientFiles
);


// ---------------------------------------------------------
// DRAG + DROP
// ---------------------------------------------------------

[
  "dragenter",
  "dragover",
].forEach(
  (eventName) => {

    clientUploadButton.addEventListener(
      eventName,
      (event) => {

        event.preventDefault();

        event.stopPropagation();


        if (
          !uploadInProgress
        ) {

          clientUploadButton
            .classList
            .add(
              "is-dragging"
            );

        }

      }
    );

  }
);


[
  "dragleave",
  "drop",
].forEach(
  (eventName) => {

    clientUploadButton.addEventListener(
      eventName,
      (event) => {

        event.preventDefault();

        event.stopPropagation();

        clientUploadButton
          .classList
          .remove(
            "is-dragging"
          );

      }
    );

  }
);


clientUploadButton.addEventListener(
  "drop",
  (event) => {

    if (uploadInProgress) {
      return;
    }


    const files =
      event.dataTransfer
        ?.files;


    if (
      files?.length
    ) {

      setSelectedUploadFiles(
        files
      );

      clearClientUploadStatus();

    }

  }
);


// ---------------------------------------------------------
// UPLOAD LIST ACTIONS
// ---------------------------------------------------------

clientUploadsList.addEventListener(
  "click",
  async (event) => {

    const button =
      event.target.closest(
        "[data-upload-action]"
      );


    if (!button) {
      return;
    }


    const uploadId =
      button.dataset
        .uploadId;

    const action =
      button.dataset
        .uploadAction;


    if (!uploadId) {
      return;
    }


    if (
      action ===
      "open"
    ) {

      await openClientUpload(
        uploadId
      );

      return;

    }


    if (
      action ===
      "delete"
    ) {

      await deleteClientUpload(
        uploadId
      );

    }

  }
);

// =========================================================
// SIGN OUT
// =========================================================

clientSignOut.addEventListener(
  "click",
  async () => {

    clientSignOut.disabled =
      true;

    clientSignOut.textContent =
      "Signing Out...";


    try {

      const {
        error,
      } =
        await supabaseClient
          .auth
          .signOut();


      if (error) {
        throw error;
      }


      window.location.href =
        "index.html";


    } catch (error) {

      console.error(
        "Client sign out failed:",
        error
      );


      clientSignOut.disabled =
        false;

      clientSignOut.textContent =
        "Sign Out";

    }

  }
);


// =========================================================
// AUTH CHANGES
// =========================================================

supabaseClient
  .auth
  .onAuthStateChange(
    (
      event,
      session
    ) => {

      console.log(
        "Client portal auth event:",
        event
      );


      if (
        event ===
          "SIGNED_OUT"
      ) {

        currentUser =
          null;

        currentMembership =
          null;

      }


      if (
        session?.user
      ) {

        currentUser =
          session.user;

      }

    }
  );


// =========================================================
// INITIALIZE PORTAL
// =========================================================

async function initializePortal() {

  showLoading();


  try {

    const {
      data: sessionData,
      error: sessionError,
    } =
      await supabaseClient
        .auth
        .getSession();


    if (sessionError) {

      console.error(
        "Portal session load failed:",
        sessionError
      );

      throw new Error(
        "We couldn't verify your sign-in session."
      );

    }


    const session =
      sessionData?.session ||
      null;


    if (
      !session ||
      !session.user
    ) {

      throw new Error(
        "Please sign in with an authorized client account to access this portal."
      );

    }


    currentUser =
      session.user;


    const {
      data: userData,
      error: userError,
    } =
      await supabaseClient
        .auth
        .getUser();


    if (
      userError ||
      !userData?.user
    ) {

      console.error(
        "Portal user verification failed:",
        userError
      );

      throw new Error(
        "We couldn't verify your client account."
      );

    }


    currentUser =
      userData.user;


    await loadClientMembership();


    renderClientIdentity();


    await initializeOnboardingState();

    await loadClientUploads();

    showPortal();


    showPortalView(
      currentView
    );


  } catch (error) {

    console.error(
      "Client portal initialization failed:",
      error
    );


    showAccessError(
      error?.message ||
      "Client portal access could not be verified."
    );

  }

}


// =========================================================
// START
// =========================================================

initializePortal();