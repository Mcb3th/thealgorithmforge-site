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

let currentClient = null;

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

let currentContentItems = [];

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


  const {
    data: clientData,
    error: clientError,
  } =
    await supabaseClient
      .from(
        "clients"
      )
      .select(
        "id, business_name"
      )
      .eq(
        "id",
        data.client_id
      )
      .maybeSingle();


  if (clientError) {

    console.error(
      "Client record load failed:",
      clientError
    );

    throw new Error(
      "We couldn't load your business information."
    );

  }


  if (!clientData) {

    throw new Error(
      "Your business record could not be found."
    );

  }


  currentClient =
    clientData;


  return data;

}

// =========================================================
// CLIENT CONTENT
// =========================================================

async function loadClientContent() {

  if (!currentMembership?.client_id) {
    return;
  }


  const {
    data,
    error,
  } =
    await supabaseClient
      .from(
        "content_items"
      )
      .select(`
        id,
        title,
        content_type,
        caption,
        planned_publish_at,
        status,
        approval_status,
        client_revision_feedback,
        created_at,
        content_platforms (
          platform,
          platform_caption_override
        ),
        content_assets (
          id,
          asset_type,
          asset_url,
          file_name,
          sort_order
        )
      `)
      .eq(
        "client_id",
        currentMembership.client_id
      )
      .order(
        "planned_publish_at",
        {
          ascending: true,
          nullsFirst: false,
        }
      );


  if (error) {

    console.error(
      "Client content load failed:",
      error
    );

    throw new Error(
      "We couldn't load your content."
    );

  }


  currentContentItems =
    Array.isArray(data)
      ? data
      : [];


  for (
    const item
    of currentContentItems
  ) {

    const assets =
      Array.isArray(
        item.content_assets
      )
        ? item.content_assets
        : [];


    assets.sort(
      (a, b) =>
        (a.sort_order ?? 0) -
        (b.sort_order ?? 0)
    );


    for (
      const asset
      of assets
    ) {

      asset.signed_url = null;


      if (
        !asset.asset_url
      ) {
        continue;
      }


      if (
        /^https?:\/\//i.test(
          asset.asset_url
        )
      ) {

        asset.signed_url =
          asset.asset_url;

        continue;

      }


      const {
        data: signedData,
        error: signedError,
      } =
        await supabaseClient
          .storage
          .from(
            "content-assets"
          )
          .createSignedUrl(
            asset.asset_url,
            3600
          );


      if (signedError) {

        console.error(
          "Content asset signed URL failed:",
          signedError
        );

        continue;

      }


      asset.signed_url =
        signedData?.signedUrl ||
        null;

    }

  }


  renderClientContent();

}

// =========================================================
// CLIENT CONTENT APPROVAL ACTIONS
// =========================================================

function renderClientApprovalActions(
  item
) {

  const approvalStatus =
    item?.approval_status ||
    "not_requested";


  if (
    approvalStatus ===
    "awaiting_approval"
  ) {

    return `
      <div class="client-content-approval-actions">

        <button
          type="button"
          class="btn client-content-approve-button"
          data-content-approve="${escapePortalHtml(
            item.id
          )}"
        >
          Approve
        </button>

        <button
          type="button"
          class="btn btn-secondary client-content-revision-button"
          data-content-revision="${escapePortalHtml(
            item.id
          )}"
        >
          Request Revision
        </button>

      </div>
    `;
  }


  if (
    approvalStatus ===
    "approved"
  ) {

    return `
      <div class="client-content-approval-result is-approved">
        <span class="client-content-approval-label">
          APPROVED
        </span>

        <p>
          This content has been approved
          and is ready to move forward.
        </p>
      </div>
    `;
  }


  if (
    approvalStatus ===
    "changes_requested"
  ) {

    const feedback =
      item.client_revision_feedback ||
      "";

    return `
      <div class="client-content-approval-result is-revision">

        <span class="client-content-approval-label">
          REVISION REQUESTED
        </span>

        ${
          feedback
            ? `
              <div class="client-revision-feedback-block">

                <span class="client-revision-feedback-label">
                  YOUR FEEDBACK
                </span>

                <p class="client-revision-feedback">
                  ${escapePortalHtml(
                    feedback
                  )}
                </p>

              </div>
            `
            : `
              <p>
                A revision has been requested
                for this content.
              </p>
            `
        }

      </div>
    `;
  }


  return "";

}

// =========================================================
// SUBMIT CLIENT CONTENT APPROVAL
// =========================================================

let pendingRevisionContentItemId =
  null;

let pendingApprovalContentItemId = null;

function openApprovalModal(contentItemId) {

  const modal =
    document.getElementById(
      "approvalModal"
    );

  if (!modal) {
    return;
  }

  pendingApprovalContentItemId =
    contentItemId;

  modal.hidden =
    false;

  document.body.style.overflow =
    "hidden";
}


function closeApprovalModal() {

  const modal =
    document.getElementById(
      "approvalModal"
    );

  if (modal) {
    modal.hidden =
      true;
  }

  pendingApprovalContentItemId =
    null;

  document.body.style.overflow =
    "";
}

function openRevisionModal(
  contentItemId
) {

  const modal =
    document.getElementById(
      "revisionModal"
    );

  const textarea =
    document.getElementById(
      "revisionFeedback"
    );

  const error =
    document.getElementById(
      "revisionModalError"
    );


  if (
    !modal ||
    !textarea
  ) {
    return;
  }


  pendingRevisionContentItemId =
    contentItemId;


  textarea.value =
    "";


  if (error) {
    error.hidden = true;
  }


  modal.hidden =
    false;


  document.body.style.overflow =
    "hidden";


  requestAnimationFrame(
    () => {
      textarea.focus();
    }
  );

}


function closeRevisionModal() {

  const modal =
    document.getElementById(
      "revisionModal"
    );

  const textarea =
    document.getElementById(
      "revisionFeedback"
    );

  const error =
    document.getElementById(
      "revisionModalError"
    );


  if (modal) {
    modal.hidden = true;
  }


  if (textarea) {
    textarea.value = "";
  }


  if (error) {
    error.hidden = true;
  }


  pendingRevisionContentItemId =
    null;


  document.body.style.overflow =
    "";

}


async function submitClientContentApproval(
  contentItemId,
  decision,
  feedback = null
) {

  if (
    !contentItemId ||
    !decision
  ) {
    return;
  }





  try {

    const {
      data,
      error,
    } =
      await supabaseClient.rpc(
        "submit_client_content_approval",
        {
          p_content_item_id:
            contentItemId,

          p_decision:
            decision,

          p_feedback:
            feedback,
        }
      );


    if (error) {
      throw error;
    }


    const item =
      currentContentItems.find(
        (contentItem) =>
          contentItem.id ===
          contentItemId
      );


    if (item) {

      item.approval_status =
        decision;

      item.client_revision_feedback =
        feedback;

    }


    if (
  decision ===
  "changes_requested"
) {
  closeRevisionModal();
}

if (
  decision ===
  "approved"
) {
  closeApprovalModal();
}


    console.log(
      "Client approval submitted:",
      data
    );


    renderClientContent();

  } catch (error) {

    console.error(
      "Client approval submission failed:",
      error
    );


    await showClientMessage({
  eyebrow: "SUBMISSION ERROR",
  title: "RESPONSE COULD NOT BE SUBMITTED",
  message:
    "Your response could not be submitted. Please try again.",
  confirmText: "Got It",
});

  }

}

// =========================================================
// REVISION MODAL CONTROLS
// =========================================================

const revisionModal =
  document.getElementById(
    "revisionModal"
  );

const revisionModalCancel =
  document.getElementById(
    "revisionModalCancel"
  );

const revisionModalSubmit =
  document.getElementById(
    "revisionModalSubmit"
  );

const revisionFeedback =
  document.getElementById(
    "revisionFeedback"
  );

const revisionModalError =
  document.getElementById(
    "revisionModalError"
  );


revisionModalCancel
  ?.addEventListener(
    "click",
    () => {
      closeRevisionModal();
    }
  );


revisionModal
  ?.querySelectorAll(
    "[data-close-revision-modal]"
  )
  .forEach(
    (element) => {
      element.addEventListener(
        "click",
        () => {
          closeRevisionModal();
        }
      );
    }
  );


revisionModalSubmit
  ?.addEventListener(
    "click",
    async () => {

      if (
        !pendingRevisionContentItemId
      ) {
        return;
      }


      const feedback =
        revisionFeedback
          ?.value
          .trim() ||
        "";


      if (!feedback) {

        if (revisionModalError) {
          revisionModalError.hidden =
            false;
        }

        revisionFeedback?.focus();

        return;
      }


      if (revisionModalError) {
        revisionModalError.hidden =
          true;
      }


      await submitClientContentApproval(
        pendingRevisionContentItemId,
        "changes_requested",
        feedback
      );

    }
  );


revisionFeedback
  ?.addEventListener(
    "input",
    () => {

      if (
        revisionModalError &&
        revisionFeedback.value.trim()
      ) {
        revisionModalError.hidden =
          true;
      }

    }
  );

const approvalModal =
  document.getElementById(
    "approvalModal"
  );

  const clientActionModal =
  document.getElementById(
    "clientActionModal"
  );

const clientActionModalEyebrow =
  document.getElementById(
    "clientActionModalEyebrow"
  );

const clientActionModalTitle =
  document.getElementById(
    "clientActionModalTitle"
  );

const clientActionModalMessage =
  document.getElementById(
    "clientActionModalMessage"
  );

let clientActionModalResolver =
  null;


function closeClientActionModal(
  result = false
) {

  if (clientActionModal) {
    clientActionModal.hidden =
      true;
  }

  document.body.style.overflow =
    "";

  if (clientActionModalResolver) {

    const resolve =
      clientActionModalResolver;

    clientActionModalResolver =
      null;

    resolve(result);

  }

}


function showClientConfirm({
  eyebrow = "CONFIRM ACTION",
  title = "ARE YOU SURE?",
  message = "Confirm this action to continue.",
  confirmText = "Confirm",
} = {}) {

  if (
    !clientActionModal ||
    !clientActionModalEyebrow ||
    !clientActionModalTitle ||
    !clientActionModalMessage ||
    !clientActionModalCancel ||
    !clientActionModalConfirm
  ) {
    return Promise.resolve(false);
  }

  clientActionModalEyebrow.textContent =
    eyebrow;

  clientActionModalTitle.textContent =
    title;

  clientActionModalMessage.textContent =
    message;

  clientActionModalCancel.hidden =
    false;

  clientActionModalConfirm.textContent =
    confirmText;

  clientActionModal.hidden =
    false;

  document.body.style.overflow =
    "hidden";

  return new Promise(
    (resolve) => {
      clientActionModalResolver =
        resolve;
    }
  );

}


function showClientMessage({
  eyebrow = "NOTICE",
  title = "SOMETHING WENT WRONG",
  message = "Please try again.",
  confirmText = "Got It",
} = {}) {

  if (
    !clientActionModal ||
    !clientActionModalEyebrow ||
    !clientActionModalTitle ||
    !clientActionModalMessage ||
    !clientActionModalCancel ||
    !clientActionModalConfirm
  ) {
    return Promise.resolve();
  }

  clientActionModalEyebrow.textContent =
    eyebrow;

  clientActionModalTitle.textContent =
    title;

  clientActionModalMessage.textContent =
    message;

  clientActionModalCancel.hidden =
    true;

  clientActionModalConfirm.textContent =
    confirmText;

  clientActionModal.hidden =
    false;

  document.body.style.overflow =
    "hidden";

  return new Promise(
    (resolve) => {
      clientActionModalResolver =
        resolve;
    }
  );

}



const clientActionModalCancel =
  document.getElementById(
    "clientActionModalCancel"
  );

const clientActionModalConfirm =
  document.getElementById(
    "clientActionModalConfirm"
  );

// =========================================================
// CLIENT ACTION MODAL CONTROLS
// =========================================================

clientActionModalCancel
  ?.addEventListener(
    "click",
    () => {
      closeClientActionModal(false);
    }
  );


clientActionModalConfirm
  ?.addEventListener(
    "click",
    () => {
      closeClientActionModal(true);
    }
  );


clientActionModal
  ?.querySelectorAll(
    "[data-close-client-action-modal]"
  )
  .forEach(
    (element) => {

      element.addEventListener(
        "click",
        () => {
          closeClientActionModal(false);
        }
      );

    }
  );

const approvalModalCancel =
  document.getElementById(
    "approvalModalCancel"
  );

const approvalModalSubmit =
  document.getElementById(
    "approvalModalSubmit"
  );


approvalModalCancel
  ?.addEventListener(
    "click",
    () => {
      closeApprovalModal();
    }
  );


approvalModal
  ?.querySelectorAll(
    "[data-close-approval-modal]"
  )
  .forEach(
    (element) => {

      element.addEventListener(
        "click",
        () => {
          closeApprovalModal();
        }
      );

    }
  );


approvalModalSubmit
  ?.addEventListener(
    "click",
    async () => {

      if (
        !pendingApprovalContentItemId
      ) {
        return;
      }

      await submitClientContentApproval(
        pendingApprovalContentItemId,
        "approved"
      );

    }
  );

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key ===
      "Escape"
    ) {

            // Close the reusable client action modal first.
      if (
        clientActionModal &&
        !clientActionModal.hidden
      ) {
        closeClientActionModal(false);
        return;
      }

      if (
        approvalModal &&
        !approvalModal.hidden
      ) {
        closeApprovalModal();
        return;
      }

      if (
        revisionModal &&
        !revisionModal.hidden
      ) {
        closeRevisionModal();
      }

    }

  }
);

// =========================================================
// RENDER CLIENT CONTENT
// =========================================================

function formatContentLabel(value) {

  if (!value) {
    return "";
  }

  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

}


// =========================================================
// CLIENT-FACING CONTENT STATUS
// =========================================================

function getClientContentStatus(
  item
) {

  const approvalStatus =
    item?.approval_status ||
    "not_requested";

  const status =
    item?.status ||
    "draft";


  if (
    approvalStatus ===
    "changes_requested"
  ) {
    return "Revision Requested";
  }


  if (
    approvalStatus ===
    "awaiting_approval"
  ) {
    return "Awaiting Your Approval";
  }


  if (
    status ===
    "posted"
  ) {
    return "Posted";
  }


  if (
    status ===
    "scheduled"
  ) {
    return "Scheduled";
  }


  if (
    status ===
    "cancelled"
  ) {
    return "Cancelled";
  }


  if (
    approvalStatus ===
    "approved"
  ) {
    return "Approved";
  }


  return formatContentLabel(
    status
  );

}


function getClientContentStatusClass(
  item
) {

  const approvalStatus =
    item?.approval_status ||
    "not_requested";

  const status =
    item?.status ||
    "draft";


  if (
    approvalStatus ===
    "changes_requested"
  ) {
    return "is-revision";
  }


  if (
    approvalStatus ===
    "awaiting_approval"
  ) {
    return "is-awaiting";
  }


  if (
    status ===
    "posted"
  ) {
    return "is-posted";
  }


  if (
    status ===
    "scheduled"
  ) {
    return "is-scheduled";
  }


  if (
    status ===
    "cancelled"
  ) {
    return "is-cancelled";
  }


  if (
    approvalStatus ===
    "approved"
  ) {
    return "is-approved";
  }


  return "is-draft";

}

// =========================================================
// RENDER CLIENT CONTENT ASSETS
// =========================================================

function renderClientContentAssets(
  item
) {

  const assets =
    Array.isArray(
      item?.content_assets
    )
      ? item.content_assets
      : [];


  if (
    assets.length === 0
  ) {
    return "";
  }


  const assetMarkup =
    assets
      .map((asset) => {

        const signedUrl =
          asset.signed_url ||
          "";

        const assetType =
          asset.asset_type ||
          "file";

        const fileName =
          asset.file_name ||
          "Content asset";


        if (!signedUrl) {

          return `
            <div class="client-content-asset is-unavailable">

              <div class="client-content-file-preview">

                <span class="client-content-file-type">
                  FILE
                </span>

                <div>
                  <strong>
                    ${escapePortalHtml(
                      fileName
                    )}
                  </strong>

                  <span>
                    Preview unavailable
                  </span>
                </div>

              </div>

            </div>
          `;

        }


        if (
          assetType ===
          "image"
        ) {

          return `
            <div class="client-content-asset is-image">

              <a
                href="${escapePortalHtml(
                  signedUrl
                )}"
                target="_blank"
                rel="noopener noreferrer"
                class="client-content-image-link"
              >

                <img
                  src="${escapePortalHtml(
                    signedUrl
                  )}"
                  alt="${escapePortalHtml(
                    fileName
                  )}"
                  loading="lazy"
                >

              </a>

            </div>
          `;

        }


        if (
          assetType ===
          "video"
        ) {

          return `
            <div class="client-content-asset is-video">

              <video
                controls
                preload="metadata"
                class="client-content-video"
              >
                <source
                  src="${escapePortalHtml(
                    signedUrl
                  )}"
                >
                Your browser does not support
                video playback.
              </video>

              <div class="client-content-asset-name">
                ${escapePortalHtml(
                  fileName
                )}
              </div>

            </div>
          `;

        }


        const typeLabel =
          assetType === "pdf"
            ? "PDF"
            : "FILE";


        return `
          <div class="client-content-asset is-file">

            <a
              href="${escapePortalHtml(
                signedUrl
              )}"
              target="_blank"
              rel="noopener noreferrer"
              class="client-content-file-preview"
            >

              <span class="client-content-file-type">
                ${escapePortalHtml(
                  typeLabel
                )}
              </span>

              <div>

                <strong>
                  ${escapePortalHtml(
                    fileName
                  )}
                </strong>

                <span>
                  Open ${escapePortalHtml(
                    typeLabel
                  )}
                </span>

              </div>

            </a>

          </div>
        `;

      })
      .join("");


  return `
    <div class="client-content-assets">

      <span class="client-content-label">
        CONTENT PREVIEW
      </span>

      <div class="client-content-assets-grid">
        ${assetMarkup}
      </div>

    </div>
  `;

}

// =========================================================
// RENDER CLIENT CONTENT CARDS
// =========================================================

function renderClientContent() {

  if (!clientContentList) {
    return;
  }


  contentCount.textContent =
    String(
      currentContentItems.length
    );


  if (
    currentContentItems.length ===
      0
  ) {

    clientContentList.innerHTML = `
      <div class="empty-state">

        <strong>
          No content yet.
        </strong>

        <p>
          Content created for your business
          will appear here.
        </p>

      </div>
    `;

    return;

  }


  clientContentList.innerHTML =
    currentContentItems
      .map((item) => {

        const platforms =
          Array.isArray(
            item.content_platforms
          )
            ? item.content_platforms
            : [];


        const platformNames =
          platforms
            .map(
              (platform) =>
                formatContentLabel(
                  platform.platform
                )
            )
            .filter(Boolean)
            .join(", ");


        const publishDate =
          item.planned_publish_at
            ? new Date(
                item.planned_publish_at
              ).toLocaleDateString(
                undefined,
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )
            : "Not scheduled";


        const status =
          getClientContentStatus(
            item
          );


        const statusClass =
          getClientContentStatusClass(
            item
          );


        const caption =
          item.caption ||
          "No caption has been added yet.";


        return `
          <article class="client-content-item">

            <div class="client-content-item-header">

              <div>

                <span class="card-kicker">
                  ${escapePortalHtml(
                    formatContentLabel(
                      item.content_type ||
                      "CONTENT"
                    )
                  )}
                </span>

                <h3>
                  ${escapePortalHtml(
                    item.title ||
                    "Untitled Content"
                  )}
                </h3>

              </div>


              <span
                class="status-pill ${escapePortalHtml(
                  statusClass
                )}"
              >
                ${escapePortalHtml(
                  status
                )}
              </span>

            </div>


            <div class="client-content-meta">

              <span>
                <strong>
                  Platforms:
                </strong>

                ${escapePortalHtml(
                  platformNames ||
                  "Not selected"
                )}
              </span>


              <span>
                <strong>
                  Publish:
                </strong>

                ${escapePortalHtml(
                  publishDate
                )}
              </span>

            </div>


            ${renderClientContentAssets(
              item
            )}


            <div class="client-content-caption">

              <span class="client-content-label">
                CAPTION
              </span>

              <p>
                ${escapePortalHtml(
                  caption
                )}
              </p>

            </div>


            ${renderClientApprovalActions(
              item
            )}

          </article>
        `;

      })
      .join("");


  clientContentList
    .querySelectorAll(
      "[data-content-approve]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            openApprovalModal(
              button.dataset
                .contentApprove
            );

          }
        );

      }
    );


  clientContentList
    .querySelectorAll(
      "[data-content-revision]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            openRevisionModal(
              button.dataset
                .contentRevision
            );

          }
        );

      }
    );

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
  currentClient?.business_name ||
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

  <a
    href="onboarding.html?mode=edit"
    class="btn"
  >
    Edit Information
  </a>

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
    Array.isArray(data)
      ? data
      : [];


  for (
    const upload
    of clientUploads
  ) {

    upload.preview_url =
      null;


    const isImage =
      upload.mime_type
        ?.startsWith(
          "image/"
        );


    if (
      !isImage ||
      !upload.storage_path
    ) {
      continue;
    }


    const {
      data: signedData,
      error: signedError,
    } =
      await supabaseClient
        .storage
        .from(
          "content-assets"
        )
        .createSignedUrl(
          upload.storage_path,
          3600
        );


    if (signedError) {

      console.error(
        "Upload thumbnail signed URL failed:",
        signedError
      );

      continue;

    }


    upload.preview_url =
      signedData?.signedUrl ||
      null;

  }


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


            const isImage =
              upload.mime_type
                ?.startsWith(
                  "image/"
                );


            const previewMarkup =
              isImage &&
              upload.preview_url
                ? `
                  <div class="client-upload-thumbnail">

                    <img
                      src="${escapePortalHtml(
                        upload.preview_url
                      )}"
                      alt="${escapePortalHtml(
                        upload.file_name
                      )}"
                      loading="lazy"
                    >

                  </div>
                `
                : `
                  <div class="client-upload-icon">
                    ${escapePortalHtml(
                      getUploadTypeLabel(
                        upload.mime_type
                      )
                    )}
                  </div>
                `;


            return `
              <div
                class="client-upload-item"
                data-upload-id="${escapePortalHtml(
                  upload.id
                )}"
              >

                <div class="client-upload-main">

                  ${previewMarkup}

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
  await showClientConfirm({
    eyebrow: "DELETE UPLOAD",
    title: "DELETE THIS FILE?",
    message:
      `Delete "${upload.file_name}"?`,
    confirmText: "Delete File",
  });


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
// RECENT ACTIVITY
// =========================================================

async function loadRecentActivity() {

  const recentActivity =
    document.getElementById(
      "recentActivity"
    );


  if (
    !recentActivity ||
    !currentMembership?.client_id
  ) {
    return;
  }


  const {
    data,
    error,
  } =
    await supabaseClient
      .from(
        "client_activity"
      )
      .select(
        `
          id,
          activity_type,
          title,
          description,
          related_content_item_id,
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
      )
      .limit(5);


  if (error) {

    console.error(
      "Recent activity load failed:",
      error
    );

    renderRecentActivity(
      []
    );

    return;

  }


  renderRecentActivity(
    Array.isArray(data)
      ? data
      : []
  );

}


function renderRecentActivity(
  activityItems
) {

  const recentActivity =
    document.getElementById(
      "recentActivity"
    );


  if (!recentActivity) {
    return;
  }


  if (
    !activityItems.length
  ) {

    recentActivity.className =
      "empty-state";


    recentActivity.innerHTML = `
      <strong>
        Nothing here yet.
      </strong>

      <p>
        Portal activity will appear here as
        we begin working together.
      </p>
    `;

    return;

  }


  recentActivity.className =
    "client-activity-list";


  recentActivity.innerHTML =
    activityItems
      .map(
        (activity) => {

          const icon =
            getActivityIcon(
              activity.activity_type
            );


          const time =
            formatActivityDate(
              activity.created_at
            );


          return `
            <div class="client-activity-item">

              <div class="client-activity-icon">
                ${escapePortalHtml(
                  icon
                )}
              </div>

              <div class="client-activity-copy">

                <strong>
                  ${escapePortalHtml(
                    activity.title ||
                    "Portal activity"
                  )}
                </strong>

                ${
                  activity.description
                    ? `
                      <p>
                        ${escapePortalHtml(
                          activity.description
                        )}
                      </p>
                    `
                    : ""
                }

                <span class="client-activity-time">
                  ${escapePortalHtml(
                    time
                  )}
                </span>

              </div>

            </div>
          `;

        }
      )
      .join("");

}


function getActivityIcon(
  activityType
) {

  switch (
    activityType
  ) {

    case "content_released":
      return "↗";

    case "revision_requested":
      return "↻";

    case "content_returned":
      return "↗";

    case "content_approved":
      return "✓";

    case "upload_added":
      return "↑";

    default:
      return "•";

  }

}


function formatActivityDate(
  value
) {

  if (!value) {
    return "";
  }


  const date =
    new Date(
      value
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }


  return date.toLocaleString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );

}

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

      window.location.href =
        "client-login.html";

      return;

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

    await loadClientContent();

    await initializeOnboardingState();

    await loadClientUploads();

    await loadRecentActivity();

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
