// =========================================================
// THE ALGORITHM FORGE
// ADMIN DASHBOARD V1.4
//
// Supabase authentication
// Admin authorization
// Session handling
// Dashboard summary
// Recent clients
// Full clients list
// Client Command Center
// Setup Tasks workflow
// Admin navigation
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

const authLoading =
  document.getElementById("authLoading");

const loginPage =
  document.getElementById("loginPage");

const unauthorizedPage =
  document.getElementById("unauthorizedPage");

const adminApp =
  document.getElementById("adminApp");


// =========================================================
// LOGIN ELEMENTS
// =========================================================

const loginForm =
  document.getElementById("loginForm");

const loginEmail =
  document.getElementById("loginEmail");

const loginPassword =
  document.getElementById("loginPassword");

const loginButton =
  document.getElementById("loginButton");

const loginButtonText =
  document.getElementById("loginButtonText");

const loginLoader =
  document.getElementById("loginLoader");

const loginError =
  document.getElementById("loginError");

const passwordToggle =
  document.getElementById("passwordToggle");


// =========================================================
// ADMIN ELEMENTS
// =========================================================

const signOutButton =
  document.getElementById("signOutButton");

const unauthorizedSignOut =
  document.getElementById("unauthorizedSignOut");

const adminUserEmail =
  document.getElementById("adminUserEmail");

const adminPageTitle =
  document.getElementById("adminPageTitle");

const adminNavItems =
  document.querySelectorAll("[data-admin-view]");

const adminViews =
  document.querySelectorAll("[data-view]");

const goToViewButtons =
  document.querySelectorAll("[data-go-to-view]");


// =========================================================
// DASHBOARD ELEMENTS
// =========================================================

const totalClients =
  document.getElementById("totalClients");

const onboardingClients =
  document.getElementById("onboardingClients");

const openTasks =
  document.getElementById("openTasks");

const activeClients =
  document.getElementById("activeClients");

const recentClients =
  document.getElementById("recentClients");


// =========================================================
// CLIENTS ELEMENTS
// =========================================================

const clientsList =
  document.getElementById("clientsList");


// =========================================================
// SETUP TASK ELEMENTS
// =========================================================

const tasksSummary =
  document.getElementById("tasksSummary");

const tasksList =
  document.getElementById("tasksList");
// =========================================================
// CONTENT ELEMENTS
// =========================================================

const newContentButton =
  document.getElementById(
    "newContentButton"
  );

const contentTotal =
  document.getElementById(
    "contentTotal"
  );

const contentDrafts =
  document.getElementById(
    "contentDrafts"
  );

const contentAwaitingApproval =
  document.getElementById(
    "contentAwaitingApproval"
  );

const contentScheduled =
  document.getElementById(
    "contentScheduled"
  );

const contentStatusFilters =
  document.getElementById(
    "contentStatusFilters"
  );

const contentList =
  document.getElementById(
    "contentList"
  );

  const contentCreatePanel =
  document.getElementById(
    "contentCreatePanel"
  );

const contentCreateTitle =
  document.getElementById(
    "contentCreateTitle"
  );

const contentCreateClose =
  document.getElementById(
    "contentCreateClose"
  );

const contentCreateCancel =
  document.getElementById(
    "contentCreateCancel"
  );

const contentCreateForm =
  document.getElementById(
    "contentCreateForm"
  );

const contentClient =
  document.getElementById(
    "contentClient"
  );

const contentTitle =
  document.getElementById(
    "contentTitle"
  );

const contentType =
  document.getElementById(
    "contentType"
  );

const contentPlatformInputs =
  document.querySelectorAll(
    "[data-content-platform]"
  );

const contentCaption =
  document.getElementById(
    "contentCaption"
  );

const contentPublishAt =
  document.getElementById(
    "contentPublishAt"
  );

const contentStatus =
  document.getElementById(
    "contentStatus"
  );

const contentApprovalStatus =
  document.getElementById(
    "contentApprovalStatus"
  );

const contentInternalNotes =
  document.getElementById(
    "contentInternalNotes"
  );

const contentCreateError =
  document.getElementById(
    "contentCreateError"
  );

const contentCreateSubmit =
  document.getElementById(
    "contentCreateSubmit"
  );

const contentCreateSubmitText =
  document.getElementById(
    "contentCreateSubmitText"
  );

const contentCreateLoader =
  document.getElementById(
    "contentCreateLoader"
  );

  const contentDetail =
  document.getElementById(
    "contentDetail"
  );

const contentDetailBack =
  document.getElementById(
    "contentDetailBack"
  );

const contentDetailLoading =
  document.getElementById(
    "contentDetailLoading"
  );

const contentDetailError =
  document.getElementById(
    "contentDetailError"
  );

const contentDetailErrorText =
  document.getElementById(
    "contentDetailErrorText"
  );

const contentDetailBody =
  document.getElementById(
    "contentDetailBody"
  );

const contentDetailClient =
  document.getElementById(
    "contentDetailClient"
  );

const contentDetailStatus =
  document.getElementById(
    "contentDetailStatus"
  );

const contentDetailTitle =
  document.getElementById(
    "contentDetailTitle"
  );

const contentDetailType =
  document.getElementById(
    "contentDetailType"
  );

const contentDetailEdit =
  document.getElementById(
    "contentDetailEdit"
  );

const contentDetailStatusValue =
  document.getElementById(
    "contentDetailStatusValue"
  );

const contentDetailApproval =
  document.getElementById(
    "contentDetailApproval"
  );

const contentDetailPublish =
  document.getElementById(
    "contentDetailPublish"
  );

const contentDetailCaption =
  document.getElementById(
    "contentDetailCaption"
  );

const contentDetailPlatforms =
  document.getElementById(
    "contentDetailPlatforms"
  );

const contentDetailPublishFull =
  document.getElementById(
    "contentDetailPublishFull"
  );

const contentDetailTypeFull =
  document.getElementById(
    "contentDetailTypeFull"
  );

const contentDetailNotes =
  document.getElementById(
    "contentDetailNotes"
  );

const contentDetailAssets =
  document.getElementById(
    "contentDetailAssets"
  );

const contentAssetUploadButton =
  document.getElementById(
    "contentAssetUploadButton"
  );

const contentAssetFileInput =
  document.getElementById(
    "contentAssetFileInput"
  );

const contentAssetUploadStatus =
  document.getElementById(
    "contentAssetUploadStatus"
  );

// =========================================================
// OPEN CONTENT EDIT PANEL
// =========================================================

async function openContentEditPanel() {

  if (
    !contentCreatePanel ||
    !selectedContentData
  ) {
    return;
  }


  const content =
    selectedContentData.content || {};


  const platforms =
    Array.isArray(
      selectedContentData.platforms
    )
      ? selectedContentData.platforms
      : [];


  contentFormMode =
    "edit";


  editingContentId =
    content.id || null;


  clearContentCreateError();


  // -------------------------------------------------------
  // PANEL TITLE
  // -------------------------------------------------------

  contentCreateTitle.textContent =
    "EDIT CONTENT";


  contentCreateSubmitText.textContent =
    "Save Changes";


  // -------------------------------------------------------
  // CLIENT
  //
  // Client stays visible but locked during edit.
  // -------------------------------------------------------

 if (
  !clientsLoaded
) {

  await loadClients();

}


populateContentClientOptions();


contentClient.value =
  content.client_id || "";


  contentClient.disabled =
    true;


  // -------------------------------------------------------
  // TITLE
  // -------------------------------------------------------

  contentTitle.value =
    content.title || "";


  // -------------------------------------------------------
  // CONTENT TYPE
  // -------------------------------------------------------

  contentType.value =
    content.content_type || "";


  // -------------------------------------------------------
  // PLATFORMS
  // -------------------------------------------------------

  const selectedPlatforms =
    new Set(
      platforms.map(
        (platform) =>
          platform.platform
      )
    );


  contentPlatformInputs.forEach(
    (input) => {

      input.checked =
        selectedPlatforms.has(
          input.value
        );

    }
  );


  // -------------------------------------------------------
  // CAPTION
  // -------------------------------------------------------

  contentCaption.value =
    content.caption || "";


  // -------------------------------------------------------
  // PUBLISH DATE / TIME
  // -------------------------------------------------------

  contentPublishAt.value =
    formatDateTimeLocalValue(
      content.planned_publish_at
    );


  // -------------------------------------------------------
  // STATUS
  // -------------------------------------------------------

  contentStatus.value =
    content.status || "draft";


  // -------------------------------------------------------
  // APPROVAL
  // -------------------------------------------------------

  contentApprovalStatus.value =
    content.approval_status ||
    "not_requested";


  // -------------------------------------------------------
  // INTERNAL NOTES
  // -------------------------------------------------------

  contentInternalNotes.value =
    content.internal_notes || "";


  // -------------------------------------------------------
  // OPEN PANEL
  // -------------------------------------------------------

  contentCreatePanel.hidden =
    false;


  document.body.style.overflow =
    "hidden";


  window.setTimeout(
    () => {

      contentTitle.focus();

    },
    0
  );
}

// =========================================================
// STATE
// =========================================================

let currentUser = null;

let currentView =
  "dashboard";

let authBusy =
  false;


// Dashboard state.

let dashboardLoaded =
  false;

let dashboardLoadPromise =
  null;


// Clients state.

let clientsLoaded =
  false;

let clientsLoadPromise =
  null;

let cachedClients =
  [];


// Client detail state.

let selectedClientId =
  null;

let selectedClientData =
  null;

let clientDetailLoadPromise =
  null;


// Setup Tasks state.

let setupTasksLoaded =
  false;

let setupTasksLoadPromise =
  null;

let cachedSetupTasks =
  [];

let resolvingTaskIds =
  new Set();
// Content state.

let contentLoaded =
  false;

let contentLoadPromise =
  null;

let cachedContent =
  [];

let activeContentFilter =
  "all";

let contentCreateBusy =
  false;

  let selectedContentId =
  null;

let selectedContentData =
  null;

let contentDetailLoadPromise =
  null;

let contentFormMode =
  "create";

let editingContentId =
  null;

// =========================================================
// ROOT VIEW HELPERS
// =========================================================

function hideAllRootViews() {
  authLoading.hidden =
    true;

  loginPage.hidden =
    true;

  unauthorizedPage.hidden =
    true;

  adminApp.hidden =
    true;
}


function showLoading() {
  hideAllRootViews();

  authLoading.hidden =
    false;
}


function showLogin() {
  hideAllRootViews();

  clearLoginError();

  loginPage.hidden =
    false;

  loginEmail.focus();
}


function showUnauthorized() {
  hideAllRootViews();

  unauthorizedPage.hidden =
    false;
}


function showAdmin() {
  hideAllRootViews();

  adminApp.hidden =
    false;

  adminUserEmail.textContent =
    currentUser?.email || "";

  showAdminView(
    currentView
  );

  loadDashboardSummary();
}


// =========================================================
// PASSWORD VISIBILITY
// =========================================================

passwordToggle.addEventListener(
  "click",
  () => {

    const visible =
      loginPassword.type ===
      "text";


    loginPassword.type =
      visible
        ? "password"
        : "text";


    passwordToggle.textContent =
      visible
        ? "Show"
        : "Hide";


    passwordToggle.setAttribute(
      "aria-label",
      visible
        ? "Show password"
        : "Hide password"
    );


    loginPassword.focus();

  }
);


// =========================================================
// LOGIN
// =========================================================

loginForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    if (authBusy) {
      return;
    }


    clearLoginError();


    const email =
      loginEmail
        .value
        .trim()
        .toLowerCase();


    const password =
      loginPassword.value;


    if (!email) {

      showLoginError(
        "Enter your email address."
      );

      loginEmail.focus();

      return;
    }


    if (!password) {

      showLoginError(
        "Enter your password."
      );

      loginPassword.focus();

      return;
    }


    setLoginBusy(
      true
    );


    try {

      const {
        data,
        error,
      } =
        await supabaseClient
          .auth
          .signInWithPassword({
            email,
            password,
          });


      if (error) {

        console.error(
          "Supabase login failed:",
          error
        );


        showLoginError(
          "The email or password is incorrect."
        );

        return;
      }


      if (!data?.user) {

        showLoginError(
          "We could not verify this account."
        );

        return;
      }


      currentUser =
        data.user;


      const authorized =
        await checkAdminAccess();


      if (!authorized) {

        showUnauthorized();

        return;
      }


      loginPassword.value =
        "";


      resetAdminData();


      showAdmin();

    } catch (error) {

      console.error(
        "Unexpected login error:",
        error
      );


      showLoginError(
        "We couldn't complete the sign-in request. Please try again."
      );

    } finally {

      setLoginBusy(
        false
      );

    }

  }
);


// =========================================================
// LOGIN STATE
// =========================================================

function setLoginBusy(
  busy
) {

  authBusy =
    busy;


  loginButton.disabled =
    busy;

  loginEmail.disabled =
    busy;

  loginPassword.disabled =
    busy;


  loginButtonText.textContent =
    busy
      ? "Signing In..."
      : "Sign In";


  loginLoader.hidden =
    !busy;
}


// =========================================================
// LOGIN ERRORS
// =========================================================

function showLoginError(
  message
) {

  loginError.textContent =
    message;

  loginError.hidden =
    false;
}


function clearLoginError() {

  loginError.textContent =
    "";

  loginError.hidden =
    true;
}


// =========================================================
// ADMIN AUTHORIZATION
// =========================================================

async function checkAdminAccess() {

  try {

    const {
      data,
      error,
    } =
      await supabaseClient
        .rpc(
          "is_admin"
        );


    if (error) {

      console.error(
        "Admin authorization check failed:",
        error
      );

      return false;
    }


    return data === true;

  } catch (error) {

    console.error(
      "Admin authorization error:",
      error
    );

    return false;
  }
}


// =========================================================
// RESET ADMIN DATA
// =========================================================

function resetAdminData() {

  dashboardLoaded =
    false;

  dashboardLoadPromise =
    null;


  clientsLoaded =
    false;

  clientsLoadPromise =
    null;

  cachedClients =
    [];


  selectedClientId =
    null;

  selectedClientData =
    null;

  clientDetailLoadPromise =
    null;


  setupTasksLoaded =
    false;

  setupTasksLoadPromise =
    null;

  cachedSetupTasks =
    [];

  resolvingTaskIds.clear();


  contentLoaded =
    false;

  contentLoadPromise =
    null;

  cachedContent =
    [];

  activeContentFilter =
    "all";


  resetDashboardState();

  resetClientsState();

  resetSetupTasksState();

  resetContentState();
}


// =========================================================
// DASHBOARD STATE
// =========================================================

function resetDashboardState() {

  totalClients.textContent =
    "—";

  onboardingClients.textContent =
    "—";

  openTasks.textContent =
    "—";

  activeClients.textContent =
    "—";


  recentClients.innerHTML = `
    <p>
      Loading client data...
    </p>
  `;
}


// =========================================================
// DASHBOARD SUMMARY
// =========================================================

async function loadDashboardSummary(
  forceRefresh = false
) {

  if (
    dashboardLoaded &&
    !forceRefresh
  ) {
    return;
  }


  if (
    dashboardLoadPromise &&
    !forceRefresh
  ) {
    return dashboardLoadPromise;
  }


  dashboardLoadPromise =
    performDashboardSummaryLoad();


  try {

    await dashboardLoadPromise;

  } finally {

    dashboardLoadPromise =
      null;

  }
}


async function performDashboardSummaryLoad() {

  setDashboardLoadingState();


  try {

    const {
      data,
      error,
    } =
      await supabaseClient
        .rpc(
          "get_admin_dashboard_summary"
        );


    if (error) {
      throw error;
    }


    if (
      !data ||
      typeof data !==
        "object"
    ) {

      throw new Error(
        "Dashboard summary returned an invalid response."
      );
    }


    console.log(
      "Dashboard summary:",
      data
    );


    renderDashboardSummary(
      data
    );


    dashboardLoaded =
      true;

  } catch (error) {

    console.error(
      "Dashboard summary load failed:",
      error
    );


    dashboardLoaded =
      false;


    renderDashboardError();

  }
}


// =========================================================
// DASHBOARD LOADING
// =========================================================

function setDashboardLoadingState() {

  totalClients.textContent =
    "…";

  onboardingClients.textContent =
    "…";

  openTasks.textContent =
    "…";

  activeClients.textContent =
    "…";


  recentClients.innerHTML = `
    <p>
      Loading recent clients...
    </p>
  `;
}


// =========================================================
// DASHBOARD RENDERING
// =========================================================

function renderDashboardSummary(
  summary
) {

  totalClients.textContent =
    formatCount(
      summary.total_clients
    );


  onboardingClients.textContent =
    formatCount(
      summary.onboarding_clients
    );


  openTasks.textContent =
    formatCount(
      summary.open_tasks
    );


  activeClients.textContent =
    formatCount(
      summary.active_clients
    );


  renderRecentClients(
    Array.isArray(
      summary.recent_clients
    )
      ? summary.recent_clients
      : []
  );
}


function formatCount(
  value
) {

  const numeric =
    Number(value);


  if (
    Number.isNaN(
      numeric
    )
  ) {
    return "0";
  }


  return String(
    numeric
  );
}


// =========================================================
// RECENT CLIENTS
// =========================================================

function renderRecentClients(
  clients
) {

  recentClients.innerHTML =
    "";


  if (!clients.length) {

    recentClients.innerHTML = `
      <p>
        No clients have been added yet.
      </p>
    `;

    return;
  }


  const list =
    document.createElement(
      "div"
    );

  list.className =
    "clients-list";


  clients.forEach(
    (client) => {

      const card =
        createCompactClientCard(
          client
        );


      list.appendChild(
        card
      );

    }
  );


  recentClients.appendChild(
    list
  );
}


// =========================================================
// COMPACT CLIENT CARD
// =========================================================

function createCompactClientCard(
  client
) {

  const card =
    document.createElement(
      "article"
    );

  card.className =
    "client-card";


  const main =
    document.createElement(
      "div"
    );

  main.className =
    "client-card-main";


  const heading =
    document.createElement(
      "div"
    );

  heading.className =
    "client-card-heading";


  const businessName =
    document.createElement(
      "h3"
    );

  businessName.className =
    "client-business-name";

  businessName.textContent =
    client.business_name ||
    "Unnamed Client";


  heading.appendChild(
    businessName
  );


  heading.appendChild(
    createStatusBadge(
      client.status
    )
  );


  main.appendChild(
    heading
  );


  main.appendChild(
    createClientContactLine(
      client.contact_name,
      client.contact_email
    )
  );


  const actions =
    document.createElement(
      "div"
    );

  actions.className =
    "client-card-actions";


  actions.appendChild(
    createOpenClientButton(
      client.id
    )
  );


  card.appendChild(
    main
  );

  card.appendChild(
    actions
  );


  return card;
}


// =========================================================
// DASHBOARD ERROR
// =========================================================

function renderDashboardError() {

  totalClients.textContent =
    "!";

  onboardingClients.textContent =
    "!";

  openTasks.textContent =
    "!";

  activeClients.textContent =
    "!";


  recentClients.innerHTML =
    "";


  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "clients-state-inner";


  const message =
    document.createElement(
      "p"
    );

  message.className =
    "clients-state-copy";

  message.textContent =
    "Dashboard data could not be loaded.";


  const retry =
    document.createElement(
      "button"
    );

  retry.type =
    "button";

  retry.className =
    "btn";

  retry.textContent =
    "Try Again";


  retry.addEventListener(
    "click",
    () => {

      loadDashboardSummary(
        true
      );

    }
  );


  wrapper.appendChild(
    message
  );

  wrapper.appendChild(
    retry
  );


  recentClients.appendChild(
    wrapper
  );
}


// =========================================================
// CLIENTS STATE
// =========================================================

function resetClientsState() {

  if (!clientsList) {
    return;
  }


  clientsList.className =
    "dashboard-placeholder";


  clientsList.innerHTML = `
    <p>
      Client records will appear here.
    </p>
  `;
}


// =========================================================
// LOAD CLIENTS
// =========================================================

async function loadClients(
  forceRefresh = false
) {

  if (
    selectedClientId &&
    selectedClientData
  ) {
    return;
  }


  if (
    clientsLoaded &&
    !forceRefresh
  ) {

    renderClients(
      cachedClients
    );

    return;
  }


  if (
    clientsLoadPromise &&
    !forceRefresh
  ) {
    return clientsLoadPromise;
  }


  clientsLoadPromise =
    performClientsLoad();


  try {

    await clientsLoadPromise;

  } finally {

    clientsLoadPromise =
      null;

  }
}


async function performClientsLoad() {

  renderClientsLoading();


  try {

    const {
      data,
      error,
    } =
      await supabaseClient
        .rpc(
          "get_admin_clients_list"
        );


    if (error) {
      throw error;
    }


    if (
      !Array.isArray(
        data
      )
    ) {

      throw new Error(
        "Client list returned an invalid response."
      );
    }


    cachedClients =
      data;


    renderClients(
      data
    );


    clientsLoaded =
      true;

  } catch (error) {

    console.error(
      "Client list load failed:",
      error
    );


    clientsLoaded =
      false;


    renderClientsError();

  }
}


// =========================================================
// CLIENTS LOADING
// =========================================================

function renderClientsLoading() {

  clientsList.className =
    "clients-state";


  clientsList.innerHTML = `
    <div class="clients-state-inner">

      <div
        class="clients-loader"
        aria-hidden="true"
      ></div>

      <p class="clients-state-copy">
        Loading client records...
      </p>

    </div>
  `;
}


// =========================================================
// RENDER CLIENTS
// =========================================================

function renderClients(
  clients
) {

  clientsList.innerHTML =
    "";


  if (!clients.length) {

    renderClientsEmpty();

    return;
  }


  clientsList.className =
    "clients-list";


  clients.forEach(
    (client) => {

      clientsList.appendChild(
        createClientCard(
          client
        )
      );

    }
  );
}


// =========================================================
// FULL CLIENT CARD
// =========================================================

function createClientCard(
  client
) {

  const card =
    document.createElement(
      "article"
    );

  card.className =
    "client-card";

  card.dataset.clientId =
    client.id || "";


  const main =
    document.createElement(
      "div"
    );

  main.className =
    "client-card-main";


  const heading =
    document.createElement(
      "div"
    );

  heading.className =
    "client-card-heading";


  const businessName =
    document.createElement(
      "h3"
    );

  businessName.className =
    "client-business-name";

  businessName.textContent =
    client.business_name ||
    "Unnamed Client";


  heading.appendChild(
    businessName
  );


  heading.appendChild(
    createStatusBadge(
      client.status
    )
  );


  main.appendChild(
    heading
  );


  main.appendChild(
    createClientContactLine(
      client.contact_name,
      client.contact_email
    )
  );


  const meta =
    document.createElement(
      "div"
    );

  meta.className =
    "client-meta";


  meta.appendChild(
    createPlatformsMeta(
      client.platforms_managed
    )
  );


  meta.appendChild(
    createTasksMeta(
      client.open_tasks
    )
  );


  meta.appendChild(
    createDateMeta(
      client.created_at
    )
  );


  main.appendChild(
    meta
  );


  const actions =
    document.createElement(
      "div"
    );

  actions.className =
    "client-card-actions";


  actions.appendChild(
    createOpenClientButton(
      client.id
    )
  );


  card.appendChild(
    main
  );

  card.appendChild(
    actions
  );


  return card;
}


// =========================================================
// CLIENT CONTACT LINE
// =========================================================

function createClientContactLine(
  name,
  email
) {

  const contact =
    document.createElement(
      "div"
    );

  contact.className =
    "client-contact";


  if (name) {

    const nameElement =
      document.createElement(
        "span"
      );

    nameElement.textContent =
      name;


    contact.appendChild(
      nameElement
    );
  }


  if (
    name &&
    email
  ) {

    const separator =
      document.createElement(
        "span"
      );

    separator.className =
      "client-contact-separator";

    separator.textContent =
      "•";


    contact.appendChild(
      separator
    );
  }


  if (email) {

    const emailElement =
      document.createElement(
        "span"
      );

    emailElement.textContent =
      email;


    contact.appendChild(
      emailElement
    );
  }


  if (
    !name &&
    !email
  ) {

    const empty =
      document.createElement(
        "span"
      );

    empty.textContent =
      "No primary contact";


    contact.appendChild(
      empty
    );
  }


  return contact;
}


// =========================================================
// CLIENT META
// =========================================================

function createPlatformsMeta(
  platforms
) {

  const item =
    createMetaItem(
      "Managed Platforms"
    );


  const container =
    document.createElement(
      "div"
    );

  container.className =
    "client-platforms";


  const values =
    Array.isArray(
      platforms
    )
      ? platforms
      : [];


  if (!values.length) {

    const empty =
      document.createElement(
        "span"
      );

    empty.className =
      "client-meta-value";

    empty.textContent =
      "None";


    container.appendChild(
      empty
    );

  } else {

    values.forEach(
      (platform) => {

        const badge =
          document.createElement(
            "span"
          );

        badge.className =
          "client-platform-badge";

        badge.textContent =
          formatPlatform(
            platform
          );


        container.appendChild(
          badge
        );

      }
    );
  }


  item.appendChild(
    container
  );


  return item;
}


function createTasksMeta(
  taskCount
) {

  const item =
    createMetaItem(
      "Open Tasks"
    );


  const count =
    Number(
      taskCount || 0
    );


  const value =
    document.createElement(
      "span"
    );

  value.className =
    "client-meta-value client-task-count";


  if (
    count > 0
  ) {

    value.classList.add(
      "has-tasks"
    );


    const dot =
      document.createElement(
        "span"
      );

    dot.className =
      "client-task-dot";


    const text =
      document.createElement(
        "span"
      );

    text.textContent =
      count === 1
        ? "1 task"
        : `${count} tasks`;


    value.appendChild(
      dot
    );

    value.appendChild(
      text
    );

  } else {

    value.textContent =
      "None";

  }


  item.appendChild(
    value
  );


  return item;
}


function createDateMeta(
  dateValue
) {

  const item =
    createMetaItem(
      "Date Added"
    );


  const value =
    document.createElement(
      "span"
    );

  value.className =
    "client-meta-value";

  value.textContent =
    formatClientDate(
      dateValue
    );


  item.appendChild(
    value
  );


  return item;
}


function createMetaItem(
  labelText
) {

  const item =
    document.createElement(
      "div"
    );

  item.className =
    "client-meta-item";


  const label =
    document.createElement(
      "span"
    );

  label.className =
    "client-meta-label";

  label.textContent =
    labelText;


  item.appendChild(
    label
  );


  return item;
}


// =========================================================
// STATUS BADGE
// =========================================================

function createStatusBadge(
  statusValue
) {

  const status =
    statusValue ||
    "unknown";


  const badge =
    document.createElement(
      "span"
    );


  badge.className =
    `client-status status-${sanitizeClassValue(status)}`;


  badge.textContent =
    formatStatus(
      status
    );


  return badge;
}


// =========================================================
// OPEN CLIENT
// =========================================================

function createOpenClientButton(
  clientId
) {

  const button =
    document.createElement(
      "button"
    );


  button.type =
    "button";

  button.className =
    "client-open-button";

  button.textContent =
    "Open →";

  button.dataset.clientId =
    clientId || "";


  button.addEventListener(
    "click",
    () => {

      openClient(
        clientId
      );

    }
  );


  return button;
}


async function openClient(
  clientId
) {

  if (!clientId) {

    console.error(
      "Cannot open client: missing client ID."
    );

    return;
  }


  selectedClientId =
    clientId;

  selectedClientData =
    null;


  showAdminView(
    "clients",
    {
      skipClientListLoad: true,
    }
  );


  renderClientDetailLoading();


  clientDetailLoadPromise =
    performClientDetailLoad(
      clientId
    );


  try {

    await clientDetailLoadPromise;

  } finally {

    clientDetailLoadPromise =
      null;

  }
}


// =========================================================
// LOAD CLIENT DETAIL
// =========================================================

async function performClientDetailLoad(
  clientId
) {

  try {

    const {
      data,
      error,
    } =
      await supabaseClient
        .rpc(
          "get_client_dashboard",
          {
            p_client_id:
              clientId,
          }
        );


    if (error) {
      throw error;
    }


    if (
      !data ||
      typeof data !==
        "object"
    ) {

      throw new Error(
        "Client dashboard returned an invalid response."
      );
    }


    selectedClientData =
      data;


    renderClientCommandCenter(
      data
    );

  } catch (error) {

    console.error(
      "Client dashboard load failed:",
      error
    );


    renderClientDetailError(
      clientId
    );

  }
}


// =========================================================
// CLIENT DETAIL STATES
// =========================================================

function renderClientDetailLoading() {

  clientsList.className =
    "client-detail-state";


  clientsList.innerHTML = `
    <div class="client-detail-state-inner">

      <div
        class="clients-loader"
        aria-hidden="true"
      ></div>

      <p class="client-detail-state-copy">
        Loading client command center...
      </p>

    </div>
  `;
}


function renderClientDetailError(
  clientId
) {

  clientsList.className =
    "client-detail-state";


  clientsList.innerHTML =
    "";


  const inner =
    document.createElement(
      "div"
    );

  inner.className =
    "client-detail-state-inner";


  const title =
    document.createElement(
      "h3"
    );

  title.className =
    "client-detail-state-title";

  title.textContent =
    "CLIENT COULD NOT BE LOADED";


  const copy =
    document.createElement(
      "p"
    );

  copy.className =
    "client-detail-state-copy";

  copy.textContent =
    "The client record could not be retrieved from Supabase.";


  const retry =
    document.createElement(
      "button"
    );

  retry.type =
    "button";

  retry.className =
    "btn";

  retry.textContent =
    "Try Again";


  retry.addEventListener(
    "click",
    () => {

      openClient(
        clientId
      );

    }
  );


  const back =
    document.createElement(
      "button"
    );

  back.type =
    "button";

  back.className =
    "client-detail-back";

  back.textContent =
    "← All Clients";


  back.addEventListener(
    "click",
    showClientsList
  );


  inner.appendChild(
    title
  );

  inner.appendChild(
    copy
  );

  inner.appendChild(
    retry
  );

  inner.appendChild(
    back
  );


  clientsList.appendChild(
    inner
  );
}


// =========================================================
// CLIENT COMMAND CENTER
// =========================================================

function renderClientCommandCenter(
  data
) {

  const client =
    data.client || {};


  const primaryContact =
    data.primary_contact || {};


  const approvalContact =
    data.approval_contact || {};


  const onboarding =
    data.onboarding || {};


  const socialAccounts =
    Array.isArray(
      data.social_accounts
    )
      ? data.social_accounts
      : [];

 const clientUploads =
  Array.isArray(
    data.client_uploads
  )
    ? data.client_uploads
    : [];

  const activeFlags =
    Array.isArray(
      data.active_flags
    )
      ? data.active_flags
      : [];


  clientsList.className =
    "client-command-center";


  clientsList.innerHTML =
    "";


  const backButton =
    document.createElement(
      "button"
    );

  backButton.type =
    "button";

  backButton.className =
    "client-detail-back";

  backButton.textContent =
    "← All Clients";


  backButton.addEventListener(
    "click",
    showClientsList
  );


  clientsList.appendChild(
    backButton
  );


  clientsList.appendChild(
    createClientDetailHeader(
      client,
      primaryContact
    )
  );


  clientsList.appendChild(
    createClientDetailStats(
      socialAccounts,
      activeFlags,
      onboarding
    )
  );

  clientsList.appendChild(
  createPortalAccessSection(
    client,
    primaryContact
  )
);


  const grid =
    document.createElement(
      "div"
    );

  grid.className =
    "client-detail-grid";


  grid.appendChild(
    createBusinessSection(
      client,
      onboarding
    )
  );


  grid.appendChild(
    createContactsSection(
      primaryContact,
      approvalContact
    )
  );


  grid.appendChild(
    createSocialAccountsSection(
      socialAccounts
    )
  );


  grid.appendChild(
    createFlagsSection(
      activeFlags
    )
  );


  grid.appendChild(
    createGoalsSection(
      onboarding
    )
  );


  grid.appendChild(
    createBrandSection(
      onboarding
    )
  );


  grid.appendChild(
    createContentSection(
      onboarding
    )
  );

  grid.appendChild(
  createClientUploadsSection(
    clientUploads
  )
);


  grid.appendChild(
    createWorkflowSection(
      onboarding
    )
  );


  clientsList.appendChild(
    grid
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// =========================================================
// CLIENT PORTAL ACCESS
// =========================================================

function createPortalAccessSection(
  client,
  primaryContact
) {

  const section =
    document.createElement(
      "section"
    );

  section.className =
    "client-portal-access";


  const heading =
    document.createElement(
      "div"
    );

  heading.className =
    "client-portal-heading";


  const headingText =
    document.createElement(
      "div"
    );


  const eyebrow =
    document.createElement(
      "p"
    );

  eyebrow.className =
    "eyebrow";

  eyebrow.textContent =
    "CLIENT PORTAL";


  const title =
    document.createElement(
      "h3"
    );

  title.textContent =
    "PORTAL ACCESS";


  const description =
    document.createElement(
      "p"
    );

  description.className =
    "client-portal-description";

  description.textContent =
    "Invite an authorized client contact to create their portal account.";


  headingText.appendChild(
    eyebrow
  );

  headingText.appendChild(
    title
  );

  headingText.appendChild(
    description
  );


  heading.appendChild(
    headingText
  );


  section.appendChild(
    heading
  );


  const form =
    document.createElement(
      "form"
    );

  form.className =
    "client-portal-form";


  const emailField =
    document.createElement(
      "label"
    );

  emailField.className =
    "client-portal-field";


  const emailLabel =
    document.createElement(
      "span"
    );

  emailLabel.textContent =
    "EMAIL ADDRESS";


  const emailInput =
    document.createElement(
      "input"
    );

  emailInput.type =
    "email";

  emailInput.placeholder =
    "client@example.com";

  emailInput.required =
    true;

  emailInput.value =
    primaryContact?.email ||
    "";


  emailField.appendChild(
    emailLabel
  );

  emailField.appendChild(
    emailInput
  );


  const roleField =
    document.createElement(
      "label"
    );

  roleField.className =
    "client-portal-field";


  const roleLabel =
    document.createElement(
      "span"
    );

  roleLabel.textContent =
    "PORTAL ROLE";


  const roleSelect =
    document.createElement(
      "select"
    );


  const ownerOption =
    document.createElement(
      "option"
    );

  ownerOption.value =
    "owner";

  ownerOption.textContent =
    "Owner";


  const managerOption =
    document.createElement(
      "option"
    );

  managerOption.value =
    "manager";

  managerOption.textContent =
    "Manager";


  const memberOption =
    document.createElement(
      "option"
    );

  memberOption.value =
    "member";

  memberOption.textContent =
    "Member";


  roleSelect.appendChild(
    ownerOption
  );

  roleSelect.appendChild(
    managerOption
  );

  roleSelect.appendChild(
    memberOption
  );


  roleField.appendChild(
    roleLabel
  );

  roleField.appendChild(
    roleSelect
  );


  const inviteButton =
    document.createElement(
      "button"
    );

  inviteButton.type =
    "submit";

  inviteButton.className =
    "btn client-portal-invite-button";

  inviteButton.textContent =
    "Invite to Portal";


  const status =
    document.createElement(
      "div"
    );

  status.className =
    "client-portal-status";

  status.hidden =
    true;


  form.appendChild(
    emailField
  );

  form.appendChild(
    roleField
  );

  form.appendChild(
    inviteButton
  );


  section.appendChild(
    form
  );

  section.appendChild(
    status
  );


  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const email =
        emailInput
          .value
          .trim()
          .toLowerCase();

      const role =
        roleSelect.value;


      if (!email) {
        return;
      }


      inviteButton.disabled =
        true;

      inviteButton.textContent =
        "Sending Invite...";


      status.hidden =
        false;

      status.className =
        "client-portal-status";

      status.textContent =
        "Creating portal invitation...";


      try {

        const {
          data,
          error,
        } =
          await supabaseClient
            .functions
            .invoke(
              "invite-client",
              {
                body: {
                  email,
                  client_id:
                    client.id,
                  role,
                },
              }
            );


        if (error) {
          throw error;
        }


        if (
          !data?.success
        ) {

          throw new Error(
            data?.error ||
            "The portal invitation could not be created."
          );

        }


        status.classList.add(
          "is-success"
        );

        status.textContent =
          data.message ||
          `Invitation sent to ${email}.`;


      } catch (error) {

        console.error(
          "Client portal invitation failed:",
          error
        );


        status.classList.add(
          "is-error"
        );

        status.textContent =
          error?.message ||
          "The portal invitation could not be sent.";

      } finally {

        inviteButton.disabled =
          false;

        inviteButton.textContent =
          "Invite to Portal";

      }

    }
  );


  return section;

}

// =========================================================
// CLIENT DETAIL HEADER
// =========================================================

function createClientDetailHeader(
  client,
  primaryContact
) {

  const header =
    document.createElement(
      "section"
    );

  header.className =
    "client-detail-header";


  const titleArea =
    document.createElement(
      "div"
    );

  titleArea.className =
    "client-detail-title";


  const titleRow =
    document.createElement(
      "div"
    );

  titleRow.className =
    "client-detail-title-row";


  const title =
    document.createElement(
      "h2"
    );

  title.textContent =
    client.business_name ||
    "Unnamed Client";


  titleRow.appendChild(
    title
  );


  titleRow.appendChild(
    createStatusBadge(
      client.status
    )
  );


  const contactLine =
    document.createElement(
      "div"
    );

  contactLine.className =
    "client-detail-contact";


  appendContactPiece(
    contactLine,
    primaryContact.name
  );


  appendContactPiece(
    contactLine,
    primaryContact.role
  );


  if (
    primaryContact.email
  ) {

    const email =
      document.createElement(
        "a"
      );

    email.href =
      `mailto:${primaryContact.email}`;

    email.textContent =
      primaryContact.email;


    contactLine.appendChild(
      email
    );
  }


  if (
    primaryContact.phone
  ) {

    const phone =
      document.createElement(
        "a"
      );

    phone.href =
      `tel:${primaryContact.phone}`;

    phone.textContent =
      formatPhoneDisplay(
        primaryContact.phone
      );


    contactLine.appendChild(
      phone
    );
  }


  titleArea.appendChild(
    titleRow
  );

  titleArea.appendChild(
    contactLine
  );


  const meta =
    document.createElement(
      "div"
    );

  meta.className =
    "client-detail-header-meta";


  const created =
    document.createElement(
      "span"
    );

  created.className =
    "client-detail-created";

  created.textContent =
    `Client since ${formatClientDate(
      client.created_at
    )}`;


  meta.appendChild(
    created
  );


  header.appendChild(
    titleArea
  );

  header.appendChild(
    meta
  );


  return header;
}


function appendContactPiece(
  container,
  value
) {

  if (!value) {
    return;
  }


  if (
    container.children.length
  ) {

    const separator =
      document.createElement(
        "span"
      );

    separator.textContent =
      "•";


    container.appendChild(
      separator
    );
  }


  const element =
    document.createElement(
      "span"
    );

  element.textContent =
    value;


  container.appendChild(
    element
  );
}


// =========================================================
// CLIENT DETAIL STATS
// =========================================================

function createClientDetailStats(
  socialAccounts,
  activeFlags,
  onboarding
) {

  const stats =
    document.createElement(
      "div"
    );

  stats.className =
    "client-detail-stats";


  stats.appendChild(
    createDetailStat(
      "Managed Social Accounts",
      String(
        socialAccounts.filter(
          (account) =>
            account.managed_by_af
        ).length
      )
    )
  );


  stats.appendChild(
    createDetailStat(
      "Open Setup Tasks",
      String(
        activeFlags.length
      )
    )
  );


  stats.appendChild(
    createDetailStat(
      "Approval Process",
      formatStatus(
        onboarding.approval_preference ||
        "not set"
      )
    )
  );


  return stats;
}


function createDetailStat(
  label,
  value
) {

  const card =
    document.createElement(
      "article"
    );

  card.className =
    "client-detail-stat";


  const labelElement =
    document.createElement(
      "span"
    );

  labelElement.className =
    "client-detail-stat-label";

  labelElement.textContent =
    label;


  const valueElement =
    document.createElement(
      "strong"
    );

  valueElement.className =
    "client-detail-stat-value";

  valueElement.textContent =
    value;


  card.appendChild(
    labelElement
  );

  card.appendChild(
    valueElement
  );


  return card;
}


// =========================================================
// CLIENT DETAIL SECTIONS
// =========================================================

function createBusinessSection(
  client,
  onboarding
) {

  const section =
    createDetailSection(
      "BUSINESS",
      "BUSINESS OVERVIEW"
    );


  const fields =
    createDetailFields();


  addDetailTextField(
    fields,
    "Business Description",
    client.business_description
  );


  addDetailTextField(
    fields,
    "Operating Scope",
    formatNullableStatus(
      client.operating_scope
    )
  );


  addDetailTextField(
    fields,
    "Service Area",
    client.service_area
  );


  addDetailLinkField(
    fields,
    "Website",
    client.website
  );


  addDetailTextField(
    fields,
    "Priority Products / Services",
    onboarding.priority_products_services
  );


  section.appendChild(
    fields
  );


  return section;
}


function createContactsSection(
  primary,
  approval
) {

  const section =
    createDetailSection(
      "CONTACTS",
      "PEOPLE & APPROVALS"
    );


  const fields =
    createDetailFields();


  addDetailTextField(
    fields,
    "Primary Contact",
    buildContactName(
      primary
    )
  );


  addDetailTextField(
    fields,
    "Primary Email",
    primary.email
  );


  addDetailTextField(
    fields,
    "Primary Phone",
    formatPhoneDisplay(
      primary.phone
    )
  );


  addDetailTextField(
    fields,
    "Preferred Contact Method",
    formatNullableStatus(
      primary.preferred_contact_method
    )
  );


  addDetailTextField(
    fields,
    "Approval Contact",
    buildContactName(
      approval
    )
  );


  addDetailTextField(
    fields,
    "Approval Email",
    approval.email
  );


  section.appendChild(
    fields
  );


  return section;
}


function createSocialAccountsSection(
  accounts
) {

  const section =
    createDetailSection(
      "SOCIAL",
      "SOCIAL ACCOUNTS"
    );


  if (!accounts.length) {

    section.appendChild(
      createDetailEmpty(
        "No social account records are available."
      )
    );


    return section;
  }


  const list =
    document.createElement(
      "div"
    );

  list.className =
    "client-social-list";


  accounts.forEach(
    (account) => {

      list.appendChild(
        createSocialAccountRow(
          account
        )
      );

    }
  );


  section.appendChild(
    list
  );


  return section;
}


function createSocialAccountRow(
  account
) {

  const row =
    document.createElement(
      "article"
    );

  row.className =
    "client-social-row";


  const main =
    document.createElement(
      "div"
    );

  main.className =
    "client-social-main";


  const platformRow =
    document.createElement(
      "div"
    );

  platformRow.className =
    "client-social-platform-row";


  const platform =
    document.createElement(
      "span"
    );

  platform.className =
    "client-social-platform";

  platform.textContent =
    formatPlatform(
      account.platform
    );


  platformRow.appendChild(
    platform
  );


  if (
    account.profile_name
  ) {

    const profile =
      document.createElement(
        "span"
      );

    profile.className =
      "client-platform-badge";

    profile.textContent =
      account.profile_name;


    platformRow.appendChild(
      profile
    );
  }


  main.appendChild(
    platformRow
  );


  const url =
    document.createElement(
      "div"
    );

  url.className =
    "client-social-url";


  if (
    account.profile_url
  ) {

    const link =
      document.createElement(
        "a"
      );

    link.href =
      account.profile_url;

    link.target =
      "_blank";

    link.rel =
      "noopener noreferrer";

    link.textContent =
      account.profile_url;


    url.appendChild(
      link
    );

  } else {

    url.textContent =
      account.needs_creation
        ? "Account creation required"
        : "No profile URL saved";

  }


  main.appendChild(
    url
  );


  const statuses =
    document.createElement(
      "div"
    );

  statuses.className =
    "client-social-statuses";


  statuses.appendChild(
    createSocialStatus(
      account.managed_by_af
        ? "Managed by AF"
        : "Not Managed",
      account.managed_by_af
        ? "good"
        : "neutral"
    )
  );


  if (
    account.needs_creation
  ) {

    statuses.appendChild(
      createSocialStatus(
        "Needs Creation",
        "warning"
      )
    );
  }


  if (
    account.access_status
  ) {

    statuses.appendChild(
      createSocialStatus(
        formatStatus(
          account.access_status
        ),
        account.access_status ===
          "setup_needed"
          ? "warning"
          : "neutral"
      )
    );
  }


  row.appendChild(
    main
  );

  row.appendChild(
    statuses
  );


  return row;
}


function createSocialStatus(
  label,
  type
) {

  const status =
    document.createElement(
      "span"
    );


  status.className =
    `client-social-status status-${type}`;


  status.textContent =
    label;


  return status;
}


function createFlagsSection(
  flags
) {

  const section =
    createDetailSection(
      "SETUP",
      "OPEN SETUP TASKS"
    );


  if (!flags.length) {

    section.appendChild(
      createDetailEmpty(
        "No open onboarding flags. This client is clear."
      )
    );


    return section;
  }


  const list =
    document.createElement(
      "div"
    );

  list.className =
    "client-flags-list";


  flags.forEach(
    (flag) => {

      list.appendChild(
        createFlagRow(
          flag
        )
      );

    }
  );


  section.appendChild(
    list
  );


  return section;
}


function createFlagRow(
  flag
) {

  const row =
    document.createElement(
      "article"
    );

  row.className =
    "client-flag";


  const icon =
    document.createElement(
      "div"
    );

  icon.className =
    "client-flag-icon";

  icon.textContent =
    "!";


  const content =
    document.createElement(
      "div"
    );

  content.className =
    "client-flag-content";


  const title =
    document.createElement(
      "h4"
    );

  title.className =
    "client-flag-title";

  title.textContent =
    formatFlagType(
      flag.flag_type
    );


  content.appendChild(
    title
  );


  if (
    flag.notes
  ) {

    const notes =
      document.createElement(
        "p"
      );

    notes.className =
      "client-flag-notes";

    notes.textContent =
      flag.notes;


    content.appendChild(
      notes
    );
  }


  row.appendChild(
    icon
  );

  row.appendChild(
    content
  );


  return row;
}


function createGoalsSection(
  onboarding
) {

  const section =
    createDetailSection(
      "STRATEGY",
      "GOALS & AUDIENCE",
      true
    );


  const fields =
    createDetailFields();


  addDetailChipsField(
    fields,
    "Primary Goals",
    onboarding.primary_goals
  );


  addDetailTextField(
    fields,
    "Top Priority",
    formatNullableStatus(
      onboarding.primary_goal
    )
  );


  addDetailTextField(
    fields,
    "Ideal Customer",
    onboarding.ideal_customer
  );


  addDetailTextField(
    fields,
    "Desired Improvement",
    onboarding.desired_improvement
  );


  addDetailTextField(
    fields,
    "Primary Call To Action",
    formatNullableStatus(
      onboarding.primary_call_to_action
    )
  );


  addDetailTextField(
    fields,
    "CTA Destination",
    onboarding.call_to_action_destination
  );


  section.appendChild(
    fields
  );


  return section;
}


function createBrandSection(
  onboarding
) {

  const section =
    createDetailSection(
      "BRAND",
      "BRAND PROFILE"
    );


  const fields =
    createDetailFields();


  addDetailTextField(
    fields,
    "Differentiators",
    onboarding.differentiators
  );


  addDetailChipsField(
    fields,
    "Brand Voice",
    onboarding.brand_voice
  );


  addDetailTextField(
    fields,
    "Brand Voice Notes",
    onboarding.brand_voice_notes
  );


  addDetailTextField(
    fields,
    "Preferred Language",
    onboarding.preferred_language
  );


  addDetailTextField(
    fields,
    "Language / Topics To Avoid",
    onboarding.avoid_language
  );


  addDetailTextField(
    fields,
    "Brand Guidelines",
    formatNullableStatus(
      onboarding.brand_guidelines_status
    )
  );


  addDetailChipsField(
    fields,
    "Brand Materials",
    onboarding.brand_materials
  );


  section.appendChild(
    fields
  );


  return section;
}


function createContentSection(
  onboarding
) {

  const section =
    createDetailSection(
      "CONTENT",
      "CONTENT PROFILE"
    );


  const fields =
    createDetailFields();


  addDetailChipsField(
    fields,
    "Content Preferences",
    onboarding.content_preferences
  );


  addDetailTextField(
    fields,
    "Media Inventory",
    formatNullableStatus(
      onboarding.media_inventory
    )
  );


  addDetailTextField(
    fields,
    "Media Supply Frequency",
    formatNullableStatus(
      onboarding.media_supply_frequency
    )
  );


  addDetailTextField(
    fields,
    "Priority Features",
    onboarding.priority_features
  );


  addDetailTextField(
    fields,
    "Testimonials",
    formatNullableStatus(
      onboarding.testimonials_available
    )
  );


  addDetailTextField(
    fields,
    "Upcoming Promotions",
    onboarding.upcoming_promotions
  );


  addDetailTextField(
    fields,
    "Content Exclusions",
    onboarding.content_exclusions
  );


  section.appendChild(
    fields
  );


  return section;
}

// =========================================================
// CLIENT UPLOADS SECTION
// =========================================================

function createClientUploadsSection(
  uploads
) {

  const section =
    createDetailSection(
      "UPLOADS",
      "CLIENT-SUPPLIED MEDIA"
    );


  if (
    !uploads.length
  ) {

    section.appendChild(
      createDetailEmpty(
        "No client uploads yet."
      )
    );

    return section;

  }


  const list =
    document.createElement(
      "div"
    );

  list.className =
    "admin-client-uploads-list";


  uploads.forEach(
    (upload) => {

      list.appendChild(
        createClientUploadRow(
          upload
        )
      );

    }
  );


  section.appendChild(
    list
  );


  return section;

}


// =========================================================
// CLIENT UPLOAD ROW
// =========================================================

function createClientUploadRow(
  upload
) {

  const row =
    document.createElement(
      "article"
    );

  row.className =
    "admin-client-upload-row";


  const main =
    document.createElement(
      "div"
    );

  main.className =
    "admin-client-upload-main";


  const icon =
    document.createElement(
      "div"
    );

  icon.className =
    "admin-client-upload-icon";

  icon.textContent =
    getAdminUploadTypeLabel(
      upload.mime_type
    );


  const copy =
    document.createElement(
      "div"
    );

  copy.className =
    "admin-client-upload-copy";


  const name =
    document.createElement(
      "strong"
    );

  name.className =
    "admin-client-upload-name";

  name.textContent =
    upload.file_name ||
    "Unnamed File";


  const meta =
    document.createElement(
      "span"
    );

  meta.className =
    "admin-client-upload-meta";

  meta.textContent =
    `${formatAdminUploadBytes(
      upload.file_size
    )} • ${formatClientDate(
      upload.created_at
    )}`;


  copy.appendChild(
    name
  );

  copy.appendChild(
    meta
  );


  if (
    upload.note
  ) {

    const note =
      document.createElement(
        "p"
      );

    note.className =
      "admin-client-upload-note";

    note.textContent =
      upload.note;

    copy.appendChild(
      note
    );

  }


  main.appendChild(
    icon
  );

  main.appendChild(
    copy
  );


  const actions =
    document.createElement(
      "div"
    );

  actions.className =
    "admin-client-upload-actions";


  const openButton =
    document.createElement(
      "button"
    );

  openButton.type =
    "button";

  openButton.className =
    "client-open-button";

  openButton.textContent =
    "Open";


  openButton.addEventListener(
    "click",
    async () => {

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
          "Admin client upload open failed:",
          error
        );

        window.alert(
          "The uploaded file could not be opened."
        );

        return;

      }


      window.open(
        data.signedUrl,
        "_blank",
        "noopener,noreferrer"
      );

    }
  );


  actions.appendChild(
    openButton
  );


  row.appendChild(
    main
  );

  row.appendChild(
    actions
  );


  return row;

}


// =========================================================
// CLIENT UPLOAD DISPLAY HELPERS
// =========================================================

function getAdminUploadTypeLabel(
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


function formatAdminUploadBytes(
  bytes
) {

  const value =
    Number(
      bytes || 0
    );


  if (
    !Number.isFinite(
      value
    ) ||
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

function createWorkflowSection(
  onboarding
) {

  const section =
    createDetailSection(
      "WORKFLOW",
      "APPROVAL & REQUIREMENTS"
    );


  const fields =
    createDetailFields();


  addDetailTextField(
    fields,
    "Approval Timing",
    formatNullableStatus(
      onboarding.approval_timing
    )
  );


  addDetailTextField(
    fields,
    "Approval Preference",
    formatNullableStatus(
      onboarding.approval_preference
    )
  );


  addDetailTextField(
    fields,
    "Approval Requirements",
    onboarding.approval_requirements
  );


  addDetailTextField(
    fields,
    "Compliance Status",
    formatNullableStatus(
      onboarding.compliance_status
    )
  );


  addDetailTextField(
    fields,
    "Compliance Notes",
    onboarding.compliance_notes
  );


  addDetailTextField(
    fields,
    "Competitors / Inspiration",
    onboarding.competitor_inspiration
  );


  addDetailTextField(
    fields,
    "Competitor Notes",
    onboarding.competitor_inspiration_notes
  );


  addDetailTextField(
    fields,
    "Additional Notes",
    onboarding.additional_notes
  );


  section.appendChild(
    fields
  );


  return section;
}


// =========================================================
// DETAIL FACTORIES
// =========================================================

function createDetailSection(
  eyebrow,
  title,
  fullWidth = false
) {

  const section =
    document.createElement(
      "section"
    );


  section.className =
    "client-detail-section";


  if (
    fullWidth
  ) {

    section.classList.add(
      "full-width"
    );

  }


  const heading =
    document.createElement(
      "div"
    );

  heading.className =
    "client-detail-section-heading";


  const eyebrowElement =
    document.createElement(
      "p"
    );

  eyebrowElement.className =
    "eyebrow";

  eyebrowElement.textContent =
    eyebrow;


  const titleElement =
    document.createElement(
      "h3"
    );

  titleElement.textContent =
    title;


  heading.appendChild(
    eyebrowElement
  );

  heading.appendChild(
    titleElement
  );


  section.appendChild(
    heading
  );


  return section;
}


function createDetailFields() {

  const fields =
    document.createElement(
      "div"
    );

  fields.className =
    "client-detail-fields";


  return fields;
}


function addDetailTextField(
  container,
  label,
  value
) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return;
  }


  const field =
    createDetailFieldShell(
      label
    );


  const output =
    document.createElement(
      "p"
    );

  output.className =
    "client-detail-field-value";

  output.textContent =
    String(
      value
    );


  field.appendChild(
    output
  );


  container.appendChild(
    field
  );
}


function addDetailLinkField(
  container,
  label,
  value
) {

  if (!value) {
    return;
  }


  const field =
    createDetailFieldShell(
      label
    );


  const output =
    document.createElement(
      "p"
    );

  output.className =
    "client-detail-field-value";


  const link =
    document.createElement(
      "a"
    );

  link.href =
    value;

  link.target =
    "_blank";

  link.rel =
    "noopener noreferrer";

  link.textContent =
    value;


  output.appendChild(
    link
  );


  field.appendChild(
    output
  );


  container.appendChild(
    field
  );
}


function addDetailChipsField(
  container,
  label,
  values
) {

  if (
    !Array.isArray(
      values
    ) ||
    !values.length
  ) {
    return;
  }


  const field =
    createDetailFieldShell(
      label
    );


  const chips =
    document.createElement(
      "div"
    );

  chips.className =
    "client-detail-chips";


  values.forEach(
    (value) => {

      const chip =
        document.createElement(
          "span"
        );

      chip.className =
        "client-detail-chip";

      chip.textContent =
        formatStatus(
          value
        );


      chips.appendChild(
        chip
      );

    }
  );


  field.appendChild(
    chips
  );


  container.appendChild(
    field
  );
}


function createDetailFieldShell(
  labelText
) {

  const field =
    document.createElement(
      "div"
    );

  field.className =
    "client-detail-field";


  const label =
    document.createElement(
      "span"
    );

  label.className =
    "client-detail-field-label";

  label.textContent =
    labelText;


  field.appendChild(
    label
  );


  return field;
}


function createDetailEmpty(
  message
) {

  const empty =
    document.createElement(
      "div"
    );

  empty.className =
    "client-detail-empty";

  empty.textContent =
    message;


  return empty;
}


// =========================================================
// RETURN TO CLIENT LIST
// =========================================================

function showClientsList() {

  selectedClientId =
    null;

  selectedClientData =
    null;

  clientDetailLoadPromise =
    null;


  adminPageTitle.textContent =
    "CLIENTS";


  if (
    clientsLoaded
  ) {

    renderClients(
      cachedClients
    );

  } else {

    loadClients(
      true
    );

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}


// =========================================================
// CLIENT LIST EMPTY / ERROR
// =========================================================

function renderClientsEmpty() {

  clientsList.className =
    "clients-state";


  clientsList.innerHTML = `
    <div class="clients-state-inner">

      <h3 class="clients-state-title">
        NO CLIENTS YET
      </h3>

      <p class="clients-state-copy">
        Client records will appear here after an
        onboarding submission creates a client.
      </p>

    </div>
  `;
}


function renderClientsError() {

  clientsList.className =
    "clients-state";


  clientsList.innerHTML =
    "";


  const inner =
    document.createElement(
      "div"
    );

  inner.className =
    "clients-state-inner";


  const title =
    document.createElement(
      "h3"
    );

  title.className =
    "clients-state-title";

  title.textContent =
    "CLIENTS COULD NOT BE LOADED";


  const copy =
    document.createElement(
      "p"
    );

  copy.className =
    "clients-state-copy";

  copy.textContent =
    "The client list could not be retrieved from Supabase.";


  const retry =
    document.createElement(
      "button"
    );

  retry.type =
    "button";

  retry.className =
    "btn clients-retry-button";

  retry.textContent =
    "Try Again";


  retry.addEventListener(
    "click",
    () => {

      loadClients(
        true
      );

    }
  );


  inner.appendChild(
    title
  );

  inner.appendChild(
    copy
  );

  inner.appendChild(
    retry
  );


  clientsList.appendChild(
    inner
  );
}


// =========================================================
// SETUP TASKS STATE
// =========================================================

function resetSetupTasksState() {

  if (
    !tasksList ||
    !tasksSummary
  ) {
    return;
  }


  tasksSummary.textContent =
    "—";


  tasksList.innerHTML = `
    <div class="tasks-state">

      <div class="tasks-state-inner">

        <p class="tasks-state-copy">
          Setup tasks will appear here.
        </p>

      </div>

    </div>
  `;
}


// =========================================================
// LOAD SETUP TASKS
// =========================================================

async function loadSetupTasks(
  forceRefresh = false
) {

  if (
    setupTasksLoaded &&
    !forceRefresh
  ) {

    renderSetupTasks(
      cachedSetupTasks
    );

    return;
  }


  if (
    setupTasksLoadPromise &&
    !forceRefresh
  ) {
    return setupTasksLoadPromise;
  }


  setupTasksLoadPromise =
    performSetupTasksLoad();


  try {

    await setupTasksLoadPromise;

  } finally {

    setupTasksLoadPromise =
      null;

  }
}


async function performSetupTasksLoad() {

  renderSetupTasksLoading();


  try {

    const {
      data,
      error,
    } =
      await supabaseClient
        .rpc(
          "get_admin_setup_tasks"
        );


    if (error) {

  let functionMessage =
    error.message ||
    "The portal invitation could not be created.";

  try {

    if (
      error.context &&
      typeof error.context.json ===
        "function"
    ) {

      const errorBody =
        await error.context.json();


      if (
        errorBody?.error
      ) {

        functionMessage =
          errorBody.error;

      } else if (
        errorBody?.message
      ) {

        functionMessage =
          errorBody.message;

      }

    }

  } catch (
    responseError
  ) {

    console.error(
      "Could not read invite function error response:",
      responseError
    );

  }


  throw new Error(
    functionMessage
  );

}


    if (
      !Array.isArray(
        data
      )
    ) {

      throw new Error(
        "Setup tasks returned an invalid response."
      );
    }


    console.log(
      "Setup tasks:",
      data
    );


    cachedSetupTasks =
      data;


    renderSetupTasks(
      data
    );


    setupTasksLoaded =
      true;

  } catch (error) {

    console.error(
      "Setup task load failed:",
      error
    );


    setupTasksLoaded =
      false;


    renderSetupTasksError();

  }
}


// =========================================================
// SETUP TASK LOADING
// =========================================================

function renderSetupTasksLoading() {

  tasksSummary.textContent =
    "LOADING";


  tasksList.innerHTML = `
    <div class="tasks-state">

      <div class="tasks-state-inner">

        <div
          class="tasks-loader"
          aria-hidden="true"
        ></div>

        <p class="tasks-state-copy">
          Loading setup tasks...
        </p>

      </div>

    </div>
  `;
}


// =========================================================
// RENDER SETUP TASKS
// =========================================================

function renderSetupTasks(
  tasks
) {

  tasksList.innerHTML =
    "";


  const count =
    tasks.length;


  tasksSummary.textContent =
    count === 1
      ? "1 OPEN TASK"
      : `${count} OPEN TASKS`;


  if (!count) {

    renderSetupTasksEmpty();

    return;
  }


  tasks.forEach(
    (task) => {

      tasksList.appendChild(
        createSetupTaskCard(
          task
        )
      );

    }
  );
}


// =========================================================
// SETUP TASK CARD
// =========================================================

function createSetupTaskCard(
  task
) {

  const card =
    document.createElement(
      "article"
    );

  card.className =
    "task-card";

  card.dataset.taskId =
    task.id || "";


  const main =
    document.createElement(
      "div"
    );

  main.className =
    "task-card-main";


  // -------------------------------------------------------
  // CLIENT
  // -------------------------------------------------------

  const clientRow =
    document.createElement(
      "div"
    );

  clientRow.className =
    "task-client-row";


  const clientName =
    document.createElement(
      "h3"
    );

  clientName.className =
    "task-client-name";

  clientName.textContent =
    task.business_name ||
    "Unnamed Client";


  clientRow.appendChild(
    clientName
  );


  clientRow.appendChild(
    createStatusBadge(
      task.client_status
    )
  );


  // -------------------------------------------------------
  // TASK TITLE
  // -------------------------------------------------------

  const title =
    document.createElement(
      "h4"
    );

  title.className =
    "task-title";

  title.textContent =
    formatFlagType(
      task.flag_type
    );


  // -------------------------------------------------------
  // NOTES / DESCRIPTION
  // -------------------------------------------------------

  const notes =
    document.createElement(
      "p"
    );

  notes.className =
    "task-notes";

  notes.textContent =
    task.notes ||
    getFlagDescription(
      task.flag_type
    );


  // -------------------------------------------------------
  // META
  // -------------------------------------------------------

  const meta =
    document.createElement(
      "div"
    );

  meta.className =
    "task-meta";


  if (
    task.contact_name
  ) {

    const contact =
      document.createElement(
        "span"
      );

    contact.innerHTML =
      `<strong>Contact:</strong> ${escapeHtml(
        task.contact_name
      )}`;


    meta.appendChild(
      contact
    );
  }


  if (
    task.contact_email
  ) {

    const email =
      document.createElement(
        "span"
      );

    email.textContent =
      task.contact_email;


    meta.appendChild(
      email
    );
  }


  if (
    task.created_at
  ) {

    const created =
      document.createElement(
        "span"
      );

    created.textContent =
      `Created ${formatClientDate(
        task.created_at
      )}`;


    meta.appendChild(
      created
    );
  }


  main.appendChild(
    clientRow
  );

  main.appendChild(
    title
  );

  main.appendChild(
    notes
  );

  main.appendChild(
    meta
  );


  // -------------------------------------------------------
  // ACTIONS
  // -------------------------------------------------------

  const actions =
    document.createElement(
      "div"
    );

  actions.className =
    "task-card-actions";


  const openClientButton =
    document.createElement(
      "button"
    );

  openClientButton.type =
    "button";

  openClientButton.className =
    "task-open-button";

  openClientButton.textContent =
    "Open Client";


  openClientButton.addEventListener(
    "click",
    () => {

      openClient(
        task.client_id
      );

    }
  );


  const resolveButton =
    document.createElement(
      "button"
    );

  resolveButton.type =
    "button";

  resolveButton.className =
    "task-resolve-button";

  resolveButton.textContent =
    "✓ Resolve";


  if (
    resolvingTaskIds.has(
      task.id
    )
  ) {

    resolveButton.disabled =
      true;

    resolveButton.textContent =
      "Resolving...";

  }


  resolveButton.addEventListener(
    "click",
    () => {

      resolveSetupTask(
        task,
        resolveButton
      );

    }
  );


  actions.appendChild(
    openClientButton
  );

  actions.appendChild(
    resolveButton
  );


  card.appendChild(
    main
  );

  card.appendChild(
    actions
  );


  return card;
}


// =========================================================
// RESOLVE SETUP TASK
// =========================================================

async function resolveSetupTask(
  task,
  button
) {

  if (
    !task?.id ||
    resolvingTaskIds.has(
      task.id
    )
  ) {
    return;
  }


  const confirmed =
    window.confirm(
      `Resolve "${formatFlagType(
        task.flag_type
      )}" for ${task.business_name || "this client"}?`
    );


  if (!confirmed) {
    return;
  }


  resolvingTaskIds.add(
    task.id
  );


  button.disabled =
    true;

  button.textContent =
    "Resolving...";


  try {

    const {
      data,
      error,
    } =
      await supabaseClient
        .rpc(
          "resolve_onboarding_flag",
          {
            p_flag_id:
              task.id,
          }
        );


    if (error) {
      throw error;
    }


    console.log(
      "Resolved setup task:",
      data
    );


    // -----------------------------------------------------
    // Invalidate dependent client data.
    // -----------------------------------------------------

    clientsLoaded =
      false;

    cachedClients =
      [];


    if (
      selectedClientId ===
      task.client_id
    ) {

      selectedClientData =
        null;

    }


    // -----------------------------------------------------
    // Refresh task list.
    // -----------------------------------------------------

    setupTasksLoaded =
      false;


    await loadSetupTasks(
      true
    );


    // -----------------------------------------------------
    // Refresh dashboard counts.
    // -----------------------------------------------------

    dashboardLoaded =
      false;


    await loadDashboardSummary(
      true
    );


  } catch (error) {

    console.error(
      "Resolve setup task failed:",
      error
    );


    window.alert(
      "The setup task could not be resolved. Please try again."
    );


  } finally {

    resolvingTaskIds.delete(
      task.id
    );


    if (
      document.body.contains(
        button
      )
    ) {

      button.disabled =
        false;

      button.textContent =
        "✓ Resolve";

    }

  }
}


// =========================================================
// SETUP TASK EMPTY STATE
// =========================================================

function renderSetupTasksEmpty() {

  tasksSummary.textContent =
    "0 OPEN TASKS";


  tasksList.innerHTML = `
    <div class="tasks-state">

      <div class="tasks-state-inner">

        <h3 class="tasks-state-title">
          ALL CLEAR
        </h3>

        <p class="tasks-state-copy">
          There are no open setup tasks requiring attention.
        </p>

      </div>

    </div>
  `;
}


// =========================================================
// SETUP TASK ERROR
// =========================================================

function renderSetupTasksError() {

  tasksSummary.textContent =
    "!";


  tasksList.innerHTML =
    "";


  const state =
    document.createElement(
      "div"
    );

  state.className =
    "tasks-state";


  const inner =
    document.createElement(
      "div"
    );

  inner.className =
    "tasks-state-inner";


  const title =
    document.createElement(
      "h3"
    );

  title.className =
    "tasks-state-title";

  title.textContent =
    "TASKS COULD NOT BE LOADED";


  const copy =
    document.createElement(
      "p"
    );

  copy.className =
    "tasks-state-copy";

  copy.textContent =
    "The setup task list could not be retrieved from Supabase.";


  const retry =
    document.createElement(
      "button"
    );

  retry.type =
    "button";

  retry.className =
    "btn";

  retry.textContent =
    "Try Again";


  retry.addEventListener(
    "click",
    () => {

      loadSetupTasks(
        true
      );

    }
  );


  inner.appendChild(
    title
  );

  inner.appendChild(
    copy
  );

  inner.appendChild(
    retry
  );


  state.appendChild(
    inner
  );


  tasksList.appendChild(
    state
  );
}


// =========================================================
// NEW CONTENT PANEL HELPERS
// =========================================================

async function openContentCreatePanel() {

  if (
    !contentCreatePanel
  ) {
    return;
  }


  clearContentCreateError();


  if (
    !clientsLoaded
  ) {

    await loadClients();

  }


  populateContentClientOptions();


  contentCreatePanel.hidden =
    false;


  document.body.style.overflow =
    "hidden";


  window.setTimeout(
    () => {

      contentClient.focus();

    },
    0
  );
}


function closeContentCreatePanel() {

  if (
    !contentCreatePanel ||
    contentCreateBusy
  ) {
    return;
  }


  contentCreatePanel.hidden =
    true;


  document.body.style.overflow =
    "";


  resetContentCreateForm();
}


// =========================================================
// CLIENT DROPDOWN
// =========================================================

function populateContentClientOptions() {

  if (
    !contentClient
  ) {
    return;
  }


  const currentValue =
    contentClient.value;


  contentClient.innerHTML = `
    <option value="">
      Select a client
    </option>
  `;


  cachedClients.forEach(
    (client) => {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        client.id;


      option.textContent =
        client.business_name ||
        "Unnamed Client";


      contentClient.appendChild(
        option
      );

    }
  );


  if (
    currentValue &&
    cachedClients.some(
      (client) =>
        client.id ===
        currentValue
    )
  ) {

    contentClient.value =
      currentValue;

  }
}


// =========================================================
// RESET NEW CONTENT FORM
// =========================================================

function resetContentCreateForm() {

  if (
    !contentCreateForm
  ) {
    return;
  }


  contentCreateForm.reset();

    contentFormMode =
    "create";


  editingContentId =
    null;


  contentClient.disabled =
    false;


  contentCreateTitle.textContent =
    "NEW CONTENT";


  contentStatus.value =
    "draft";


  contentApprovalStatus.value =
    "not_requested";


  clearContentCreateError();


  setContentCreateBusy(
    false
  );
}


// =========================================================
// CONTENT CREATE ERROR
// =========================================================

function showContentCreateError(
  message
) {

  if (
    !contentCreateError
  ) {
    return;
  }


  contentCreateError.textContent =
    message;


  contentCreateError.hidden =
    false;
}


function clearContentCreateError() {

  if (
    !contentCreateError
  ) {
    return;
  }


  contentCreateError.textContent =
    "";


  contentCreateError.hidden =
    true;
}


// =========================================================
// CONTENT CREATE BUSY STATE
// =========================================================

function setContentCreateBusy(
  busy
) {

  contentCreateBusy =
    busy;


  if (
    contentCreateSubmit
  ) {

    contentCreateSubmit.disabled =
      busy;

  }


  if (
    contentCreateSubmitText
  ) {

    contentCreateSubmitText.textContent =
      busy
        ? "Creating..."
        : "Create Content";

  }


  if (
    contentCreateLoader
  ) {

    contentCreateLoader.hidden =
      !busy;

  }
}

// =========================================================
// CONTENT STATE
// =========================================================

function resetContentState() {

  if (
    !contentList ||
    !contentTotal ||
    !contentDrafts ||
    !contentAwaitingApproval ||
    !contentScheduled
  ) {
    return;
  }


  contentTotal.textContent =
    "—";

  contentDrafts.textContent =
    "—";

  contentAwaitingApproval.textContent =
    "—";

  contentScheduled.textContent =
    "—";


  contentList.innerHTML = `
    <div class="content-state">

      <div class="content-state-inner">

        <p class="content-state-copy">
          Content records will appear here.
        </p>

      </div>

    </div>
  `;


  if (
    contentStatusFilters
  ) {

    contentStatusFilters
      .querySelectorAll(
        "[data-content-filter]"
      )
      .forEach(
        (button) => {

          const matches =
            button.dataset.contentFilter ===
            "all";


          button.classList.toggle(
            "active",
            matches
          );

        }
      );

  }
}


// =========================================================
// LOAD CONTENT
// =========================================================

async function loadContent(
  forceRefresh = false
) {

  if (
    contentLoaded &&
    !forceRefresh
  ) {

    renderContent(
      cachedContent
    );

    return;
  }


  if (
    contentLoadPromise &&
    !forceRefresh
  ) {

    return contentLoadPromise;

  }


  contentLoadPromise =
    performContentLoad();


  try {

    await contentLoadPromise;

  } finally {

    contentLoadPromise =
      null;

  }
}


async function performContentLoad() {

  renderContentLoading();


  try {

    const {
      data,
      error,
    } =
      await supabaseClient
        .rpc(
          "get_admin_content_list"
        );


    if (error) {

      throw error;

    }


    if (
      !Array.isArray(
        data
      )
    ) {

      throw new Error(
        "Content list returned an invalid response."
      );

    }


    console.log(
      "Admin content:",
      data
    );


    cachedContent =
      data;


    contentLoaded =
      true;


    renderContentSummary(
      data
    );


    renderContent(
      data
    );

  } catch (error) {

    console.error(
      "Content list load failed:",
      error
    );


    contentLoaded =
      false;


    renderContentError();

  }
}


// =========================================================
// CONTENT LOADING
// =========================================================

function renderContentLoading() {

  contentTotal.textContent =
    "…";

  contentDrafts.textContent =
    "…";

  contentAwaitingApproval.textContent =
    "…";

  contentScheduled.textContent =
    "…";


  contentList.innerHTML = `
    <div class="content-state">

      <div class="content-state-inner">

        <div
          class="content-loader"
          aria-hidden="true"
        ></div>

        <p class="content-state-copy">
          Loading content records...
        </p>

      </div>

    </div>
  `;
}


// =========================================================
// CONTENT SUMMARY
// =========================================================

function renderContentSummary(
  items
) {

  const total =
    items.length;


  const drafts =
    items.filter(
      (item) =>
        item.status ===
        "draft"
    ).length;


  const awaitingApproval =
    items.filter(
      (item) =>
        item.status ===
        "awaiting_approval"
    ).length;


  const scheduled =
    items.filter(
      (item) =>
        item.status ===
        "scheduled"
    ).length;


  contentTotal.textContent =
    String(
      total
    );


  contentDrafts.textContent =
    String(
      drafts
    );


  contentAwaitingApproval.textContent =
    String(
      awaitingApproval
    );


  contentScheduled.textContent =
    String(
      scheduled
    );
}


// =========================================================
// CONTENT EMPTY STATE
// =========================================================

function renderContentEmpty() {

  contentList.innerHTML = `
    <div class="content-state">

      <div class="content-state-inner">

        <h3 class="content-state-title">
          NO CONTENT YET
        </h3>

        <p class="content-state-copy">
          Create the first content item to begin
          building the production queue.
        </p>

      </div>

    </div>
  `;
}


// =========================================================
// CONTENT ERROR
// =========================================================

function renderContentError() {

  contentTotal.textContent =
    "!";

  contentDrafts.textContent =
    "!";

  contentAwaitingApproval.textContent =
    "!";

  contentScheduled.textContent =
    "!";


  contentList.innerHTML =
    "";


  const state =
    document.createElement(
      "div"
    );

  state.className =
    "content-state";


  const inner =
    document.createElement(
      "div"
    );

  inner.className =
    "content-state-inner";


  const title =
    document.createElement(
      "h3"
    );

  title.className =
    "content-state-title";

  title.textContent =
    "CONTENT COULD NOT BE LOADED";


  const copy =
    document.createElement(
      "p"
    );

  copy.className =
    "content-state-copy";

  copy.textContent =
    "The content list could not be retrieved from Supabase.";


  const retry =
    document.createElement(
      "button"
    );

  retry.type =
    "button";

  retry.className =
    "btn";

  retry.textContent =
    "Try Again";


  retry.addEventListener(
    "click",
    () => {

      loadContent(
        true
      );

    }
  );


  inner.appendChild(
    title
  );

  inner.appendChild(
    copy
  );

  inner.appendChild(
    retry
  );


  state.appendChild(
    inner
  );


  contentList.appendChild(
    state
  );
}

// =========================================================
// RENDER CONTENT
// =========================================================

function renderContent(
  items
) {

  if (!contentList) {
    return;
  }


  const filteredItems =
    activeContentFilter === "all"
      ? items
      : items.filter(
          (item) =>
            item.status ===
            activeContentFilter
        );


  contentList.innerHTML =
    "";


  if (
    !filteredItems.length
  ) {

    if (
      items.length === 0
    ) {

      renderContentEmpty();

      return;

    }


    renderContentFilteredEmpty();

    return;
  }


  filteredItems.forEach(
    (item) => {

      contentList.appendChild(
        createContentCard(
          item
        )
      );

    }
  );
}


// =========================================================
// FILTERED EMPTY STATE
// =========================================================

function renderContentFilteredEmpty() {

  contentList.innerHTML = `
    <div class="content-state">

      <div class="content-state-inner">

        <h3 class="content-state-title">
          NOTHING HERE
        </h3>

        <p class="content-state-copy">
          No content items match this status filter.
        </p>

      </div>

    </div>
  `;
}


// =========================================================
// CONTENT CARD
// =========================================================

function createContentCard(
  item
) {

  const card =
    document.createElement(
      "article"
    );

  card.className =
    "content-card";

  card.dataset.contentItemId =
    item.id || "";


  const main =
    document.createElement(
      "div"
    );

  main.className =
    "content-card-main";


  const clientRow =
    document.createElement(
      "div"
    );

  clientRow.className =
    "content-card-client-row";


  const clientName =
    document.createElement(
      "span"
    );

  clientName.className =
    "content-client-name";

  clientName.textContent =
    item.business_name ||
    "Unnamed Client";


  clientRow.appendChild(
    clientName
  );


  clientRow.appendChild(
    createContentStatusBadge(
      item.status
    )
  );


  const title =
    document.createElement(
      "h3"
    );

  title.className =
    "content-card-title";

  title.textContent =
    item.title ||
    "Untitled Content";


  const meta =
    document.createElement(
      "div"
    );

  meta.className =
    "content-card-meta";


  meta.appendChild(
    createContentTypeMeta(
      item.content_type
    )
  );


  meta.appendChild(
    createContentPlatformsMeta(
      item.platforms
    )
  );


  meta.appendChild(
    createContentApprovalMeta(
      item.approval_status
    )
  );


  meta.appendChild(
    createContentPublishMeta(
      item.planned_publish_at
    )
  );


  main.appendChild(
    clientRow
  );

  main.appendChild(
    title
  );

  main.appendChild(
    meta
  );


  const actions =
    document.createElement(
      "div"
    );

  actions.className =
    "content-card-actions";


  const openButton =
    document.createElement(
      "button"
    );

  openButton.type =
    "button";

  openButton.className =
    "content-open-button";

  openButton.textContent =
    "Open →";

  openButton.dataset.contentItemId =
    item.id || "";


openButton.addEventListener(
  "click",
  () => {

    openContentItem(
      item.id
    );

  }
);




  actions.appendChild(
    openButton
  );


  card.appendChild(
    main
  );

  card.appendChild(
    actions
  );


  return card;
}

// =========================================================
// OPEN CONTENT ITEM
// =========================================================

async function openContentItem(
  contentItemId
) {

  if (!contentItemId) {

    console.error(
      "Cannot open content item: missing content ID."
    );

    return;
  }


  selectedContentId =
    contentItemId;

  selectedContentData =
    null;


  // Hide queue.
  contentList.hidden =
    true;


  // Show detail shell.
  contentDetail.hidden =
    false;


  renderContentDetailLoading();


  contentDetailLoadPromise =
    performContentDetailLoad(
      contentItemId
    );


  try {

    await contentDetailLoadPromise;

  } finally {

    contentDetailLoadPromise =
      null;

  }
}


// =========================================================
// LOAD CONTENT DETAIL
// =========================================================

async function performContentDetailLoad(
  contentItemId
) {

  try {

    const {
      data,
      error,
    } =
      await supabaseClient
        .rpc(
          "get_admin_content_item",
          {
            p_content_item_id:
              contentItemId,
          }
        );


    if (error) {
      throw error;
    }


    if (
      !data ||
      typeof data !==
        "object"
    ) {

      throw new Error(
        "Content detail returned an invalid response."
      );

    }


    console.log(
      "Content detail:",
      data
    );


    selectedContentData =
      data;


    renderContentDetail(
      data
    );

  } catch (error) {

    console.error(
      "Content detail load failed:",
      error
    );


    renderContentDetailError(
      error?.message ||
      "The content record could not be retrieved."
    );

  }
}


// =========================================================
// CONTENT DETAIL LOADING
// =========================================================

function renderContentDetailLoading() {

  contentDetailLoading.hidden =
    false;

  contentDetailError.hidden =
    true;

  contentDetailBody.hidden =
    true;
}


// =========================================================
// CONTENT DETAIL ERROR
// =========================================================

function renderContentDetailError(
  message
) {

  contentDetailLoading.hidden =
    true;

  contentDetailBody.hidden =
    true;

  contentDetailError.hidden =
    false;


  contentDetailErrorText.textContent =
    message;
}


// =========================================================
// RENDER CONTENT DETAIL
// =========================================================

function renderContentDetail(
  data
) {

  const content =
    data.content || {};


  const platforms =
    Array.isArray(
      data.platforms
    )
      ? data.platforms
      : [];


  const assets =
    Array.isArray(
      data.assets
    )
      ? data.assets
      : [];


  contentDetailLoading.hidden =
    true;

  contentDetailError.hidden =
    true;

  contentDetailBody.hidden =
    false;


  // -------------------------------------------------------
  // HERO
  // -------------------------------------------------------

  contentDetailClient.textContent =
    content.business_name ||
    "Unnamed Client";


  contentDetailTitle.textContent =
    content.title ||
    "Untitled Content";


  contentDetailType.textContent =
    formatContentType(
      content.content_type
    );


  // -------------------------------------------------------
  // STATUS BADGE
  // -------------------------------------------------------

  contentDetailStatus.className =
    `content-status status-${sanitizeClassValue(
      content.status ||
      "draft"
    )}`;


  contentDetailStatus.textContent =
    formatStatus(
      content.status ||
      "draft"
    );


  // -------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------

  contentDetailStatusValue.textContent =
    formatStatus(
      content.status ||
      "draft"
    );


  contentDetailApproval.textContent =
    formatStatus(
      content.approval_status ||
      "not_requested"
    );


  contentDetailPublish.textContent =
    content.planned_publish_at
      ? formatContentDateTime(
          content.planned_publish_at
        )
      : "Not scheduled";


  // -------------------------------------------------------
  // CAPTION
  // -------------------------------------------------------

  contentDetailCaption.textContent =
    content.caption ||
    "No caption added.";


  // -------------------------------------------------------
  // PLATFORMS
  // -------------------------------------------------------

  renderContentDetailPlatforms(
    platforms
  );


  // -------------------------------------------------------
  // SCHEDULING
  // -------------------------------------------------------

  contentDetailPublishFull.textContent =
    content.planned_publish_at
      ? formatContentDateTime(
          content.planned_publish_at
        )
      : "Not scheduled";


  contentDetailTypeFull.textContent =
    formatContentType(
      content.content_type
    );


  // -------------------------------------------------------
  // INTERNAL NOTES
  // -------------------------------------------------------

  contentDetailNotes.textContent =
    content.internal_notes ||
    "No internal notes.";


  // -------------------------------------------------------
  // ASSETS
  // -------------------------------------------------------

  renderContentDetailAssets(
    assets
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}


// =========================================================
// CONTENT DETAIL PLATFORMS
// =========================================================

function renderContentDetailPlatforms(
  platforms
) {

  contentDetailPlatforms.innerHTML =
    "";


  if (!platforms.length) {

    const empty =
      document.createElement(
        "p"
      );

    empty.className =
      "content-detail-empty";

    empty.textContent =
      "No platforms assigned.";


    contentDetailPlatforms.appendChild(
      empty
    );

    return;
  }


  platforms.forEach(
    (platformRecord) => {

      const badge =
        document.createElement(
          "span"
        );

      badge.className =
        "content-detail-platform";


      badge.textContent =
        formatPlatform(
          platformRecord.platform
        );


      contentDetailPlatforms.appendChild(
        badge
      );

    }
  );
}


// =========================================================
// CONTENT DETAIL ASSETS
// =========================================================

async function renderContentDetailAssets(
  assets
) {

  contentDetailAssets.innerHTML =
    "";


  if (!assets.length) {

    const empty =
      document.createElement(
        "p"
      );

    empty.className =
      "content-detail-empty";

    empty.textContent =
      "No media assets attached yet.";


    contentDetailAssets.appendChild(
      empty
    );

    return;
  }


  for (
    const asset of assets
  ) {

    const item =
      document.createElement(
        "div"
      );

    item.className =
      "content-detail-asset";


    const name =
      document.createElement(
        "strong"
      );

    name.textContent =
      asset.file_name ||
      formatStatus(
        asset.asset_type
      ) ||
      "Media Asset";


    const actions =
      document.createElement(
        "div"
      );

    actions.className =
      "content-detail-asset-actions";


    if (
      asset.asset_url
    ) {

      try {

        let assetLink =
          asset.asset_url;


        if (
          !/^https?:\/\//i.test(
            asset.asset_url
          )
        ) {

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
                asset.asset_url,
                3600
              );


          if (error) {
            throw error;
          }


          assetLink =
            data?.signedUrl || null;

        }


        if (
          assetLink
        ) {

          const link =
            document.createElement(
              "a"
            );

          link.href =
            assetLink;

          link.target =
            "_blank";

          link.rel =
            "noopener noreferrer";

          link.className =
            "content-detail-asset-open";

          link.textContent =
            "Open Asset";


          actions.appendChild(
            link
          );

        }

      } catch (error) {

        console.error(
          "Asset signed URL failed:",
          error
        );


        const unavailable =
          document.createElement(
            "span"
          );

        unavailable.className =
          "content-detail-asset-error";

        unavailable.textContent =
          "Asset unavailable";


        actions.appendChild(
          unavailable
        );

      }

    }


    if (
      asset.id
    ) {

      const deleteButton =
        document.createElement(
          "button"
        );

      deleteButton.type =
        "button";

      deleteButton.className =
        "content-detail-asset-delete";

      deleteButton.textContent =
        "Delete";


      deleteButton.addEventListener(
        "click",
        () => {

          deleteContentAsset(
            asset
          );

        }
      );


      actions.appendChild(
        deleteButton
      );

    }


    item.appendChild(
      name
    );

    item.appendChild(
      actions
    );


    contentDetailAssets.appendChild(
      item
    );

  }

}

async function deleteContentAsset(
  asset
) {

  if (
    !asset?.id ||
    !selectedContentId
  ) {
    return;
  }


  const confirmed =
    window.confirm(
      `Delete "${asset.file_name || "this asset"}"?`
    );


  if (!confirmed) {
    return;
  }


  const previousScrollPosition =
    window.scrollY;


  showContentAssetUploadStatus(
    `Deleting ${asset.file_name || "asset"}...`
  );


  try {

    const {
      error: deleteRecordError,
    } =
      await supabaseClient
        .from(
          "content_assets"
        )
        .delete()
        .eq(
          "id",
          asset.id
        );


    if (
      deleteRecordError
    ) {
      throw deleteRecordError;
    }


    if (
      asset.asset_url &&
      !/^https?:\/\//i.test(
        asset.asset_url
      )
    ) {

      const {
        error: storageDeleteError,
      } =
        await supabaseClient
          .storage
          .from(
            "content-assets"
          )
          .remove([
            asset.asset_url,
          ]);


      if (
        storageDeleteError
      ) {

        console.error(
          "Storage asset deletion failed:",
          storageDeleteError
        );

      }

    }


    await openContentItem(
      selectedContentId
    );


    window.scrollTo({
      top: previousScrollPosition,
      behavior: "instant",
    });


    showContentAssetUploadStatus(
      `${asset.file_name || "Asset"} deleted successfully.`,
      "success"
    );


  } catch (error) {

    console.error(
      "Content asset deletion failed:",
      error
    );


    showContentAssetUploadStatus(
      error?.message ||
      "The asset could not be deleted.",
      "error"
    );

  }

}

  

// =========================================================
// RETURN TO CONTENT QUEUE
// =========================================================

function showContentQueue() {

  selectedContentId =
    null;

  selectedContentData =
    null;

  contentDetailLoadPromise =
    null;


  contentDetail.hidden =
    true;

  contentList.hidden =
    false;


  renderContent(
    cachedContent
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}


// =========================================================
// CONTENT TYPE META
// =========================================================

function createContentTypeMeta(
  contentType
) {

  const item =
    createContentMetaItem(
      "Content Type"
    );


  const value =
    document.createElement(
      "span"
    );

  value.className =
    "content-meta-value";

  value.textContent =
    formatContentType(
      contentType
    );


  item.appendChild(
    value
  );


  return item;
}


// =========================================================
// CONTENT PLATFORMS META
// =========================================================

function createContentPlatformsMeta(
  platforms
) {

  const item =
    createContentMetaItem(
      "Platforms"
    );


  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "content-platforms";


  const values =
    Array.isArray(
      platforms
    )
      ? platforms
      : [];


  if (!values.length) {

    const empty =
      document.createElement(
        "span"
      );

    empty.className =
      "content-meta-value";

    empty.textContent =
      "None";


    wrapper.appendChild(
      empty
    );

  } else {

    values.forEach(
      (platform) => {

        const badge =
          document.createElement(
            "span"
          );

        badge.className =
          "content-platform-badge";

        badge.textContent =
          formatPlatform(
            platform
          );


        wrapper.appendChild(
          badge
        );

      }
    );
  }


  item.appendChild(
    wrapper
  );


  return item;
}


// =========================================================
// CONTENT APPROVAL META
// =========================================================

function createContentApprovalMeta(
  approvalStatus
) {

  const item =
    createContentMetaItem(
      "Approval"
    );


  item.appendChild(
    createContentApprovalBadge(
      approvalStatus
    )
  );


  return item;
}


// =========================================================
// CONTENT PUBLISH META
// =========================================================

function createContentPublishMeta(
  publishAt
) {

  const item =
    createContentMetaItem(
      "Publish"
    );


  const value =
    document.createElement(
      "span"
    );

  value.className =
    "content-meta-value";


  value.textContent =
    publishAt
      ? formatContentDateTime(
          publishAt
        )
      : "Not scheduled";


  item.appendChild(
    value
  );


  return item;
}


// =========================================================
// CONTENT META ITEM
// =========================================================

function createContentMetaItem(
  labelText
) {

  const item =
    document.createElement(
      "div"
    );

  item.className =
    "content-meta-item";


  const label =
    document.createElement(
      "span"
    );

  label.className =
    "content-meta-label";

  label.textContent =
    labelText;


  item.appendChild(
    label
  );


  return item;
}


// =========================================================
// CONTENT STATUS BADGE
// =========================================================

function createContentStatusBadge(
  statusValue
) {

  const status =
    statusValue ||
    "draft";


  const badge =
    document.createElement(
      "span"
    );


  badge.className =
    `content-status status-${sanitizeClassValue(
      status
    )}`;


  badge.textContent =
    formatStatus(
      status
    );


  return badge;
}


// =========================================================
// CONTENT APPROVAL BADGE
// =========================================================

function createContentApprovalBadge(
  statusValue
) {

  const status =
    statusValue ||
    "not_requested";


  const badge =
    document.createElement(
      "span"
    );


  badge.className =
    `content-approval-status approval-${sanitizeClassValue(
      status
    )}`;


  badge.textContent =
    formatStatus(
      status
    );


  return badge;
}


// =========================================================
// CONTENT TYPE DISPLAY
// =========================================================

function formatContentType(
  value
) {

  const labels = {

    static_post:
      "Static Post",

    carousel:
      "Carousel",

    short_form_video:
      "Short-Form Video",

    story:
      "Story",

    other:
      "Other",

  };


  return (
    labels[value] ||
    formatStatus(
      value
    ) ||
    "Unknown"
  );
}


// =========================================================
// CONTENT DATE / TIME
// =========================================================

function formatContentDateTime(
  value
) {

  if (!value) {
    return "Not scheduled";
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
    return "Unknown";
  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      month:
        "short",

      day:
        "numeric",

      year:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit",
    }
  ).format(
    date
  );
}

// =========================================================
// DATETIME-LOCAL VALUE
// =========================================================

function formatDateTimeLocalValue(
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


  const pad =
    (number) =>
      String(number)
        .padStart(
          2,
          "0"
        );


  return (
    `${date.getFullYear()}-` +
    `${pad(
      date.getMonth() + 1
    )}-` +
    `${pad(
      date.getDate()
    )}T` +
    `${pad(
      date.getHours()
    )}:` +
    `${pad(
      date.getMinutes()
    )}`
  );
}


// =========================================================
// CONTENT FILTERS
// =========================================================

if (
  contentStatusFilters
) {

  contentStatusFilters.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(
          "[data-content-filter]"
        );


      if (!button) {
        return;
      }


      const filter =
        button.dataset
          .contentFilter;


      activeContentFilter =
        filter || "all";


      contentStatusFilters
        .querySelectorAll(
          "[data-content-filter]"
        )
        .forEach(
          (filterButton) => {

            filterButton
              .classList
              .toggle(
                "active",
                filterButton ===
                  button
              );

          }
        );


      renderContent(
        cachedContent
      );

    }
  );
}

// =========================================================
// CONTENT COMMAND CENTER BUTTONS
// =========================================================

if (
  contentDetailBack
) {

  contentDetailBack.addEventListener(
    "click",
    showContentQueue
  );
}


if (
  contentDetailEdit
) {

  contentDetailEdit.addEventListener(
    "click",
    openContentEditPanel
  );
}

if (
  contentAssetUploadButton &&
  contentAssetFileInput
) {

  contentAssetUploadButton.addEventListener(
    "click",
    () => {

      contentAssetFileInput.value =
        "";

      contentAssetFileInput.click();

    }
  );

}

if (
  contentAssetFileInput
) {

  contentAssetFileInput.addEventListener(
    "change",
    async () => {

      const file =
        contentAssetFileInput.files?.[0];

      if (!file) {
        return;
      }


      if (
        !selectedContentData ||
        !selectedContentId
      ) {

        showContentAssetUploadStatus(
          "Open a content item before uploading an asset.",
          "error"
        );

        return;
      }


      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "video/mp4",
        "video/quicktime",
        "video/webm",
        "application/pdf",
      ];


      if (
        !allowedTypes.includes(
          file.type
        )
      ) {

        showContentAssetUploadStatus(
          "That file type is not supported. Use an image, video, or PDF.",
          "error"
        );

        return;
      }


      const maxFileSize =
        50 * 1024 * 1024;


      if (
        file.size >
        maxFileSize
      ) {

        showContentAssetUploadStatus(
          "That file is larger than the 50 MB upload limit.",
          "error"
        );

        return;
      }


      await uploadContentAsset(
        file
      );

    }
  );

}

async function uploadContentAsset(
  file
) {

  const content =
    selectedContentData?.content || {};


  if (
    !content.id ||
    !content.client_id
  ) {

    showContentAssetUploadStatus(
      "The content record is missing required information.",
      "error"
    );

    return;
  }


  setContentAssetUploadBusy(
    true
  );


  let storagePath =
    null;


  try {

    const safeFileName =
      sanitizeStorageFileName(
        file.name
      );


    const uniqueId =
      crypto.randomUUID();


    storagePath =
      `${content.client_id}/${content.id}/${uniqueId}-${safeFileName}`;


    showContentAssetUploadStatus(
      `Uploading ${file.name}...`
    );


    const {
      error: uploadError,
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
          }
        );


    if (
      uploadError
    ) {

      throw uploadError;

    }


    const assetType =
      getContentAssetType(
        file
      );


    const existingAssets =
      Array.isArray(
        selectedContentData.assets
      )
        ? selectedContentData.assets
        : [];


    const {
      error: insertError,
    } =
      await supabaseClient
        .from(
          "content_assets"
        )
        .insert({
          content_item_id:
            content.id,

          asset_type:
            assetType,

          asset_url:
            storagePath,

          file_name:
            file.name,

          sort_order:
            existingAssets.length,
        });


    if (
      insertError
    ) {

      await supabaseClient
        .storage
        .from(
          "content-assets"
        )
        .remove([
          storagePath,
        ]);


      throw insertError;

    }


    const previousScrollPosition =
  window.scrollY;


await openContentItem(
  content.id
);


window.scrollTo({
  top: previousScrollPosition,
  behavior: "instant",
});


showContentAssetUploadStatus(
  `${file.name} uploaded successfully.`,
  "success"
);


  } catch (error) {

    console.error(
      "Content asset upload failed:",
      error
    );


    showContentAssetUploadStatus(
      error?.message ||
      "The asset could not be uploaded.",
      "error"
    );


  } finally {

    setContentAssetUploadBusy(
      false
    );


    contentAssetFileInput.value =
      "";

  }
}


function sanitizeStorageFileName(
  fileName
) {

  return String(
    fileName || "asset"
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

}


function getContentAssetType(
  file
) {

  if (
    file.type.startsWith(
      "image/"
    )
  ) {
    return "image";
  }


  if (
    file.type.startsWith(
      "video/"
    )
  ) {
    return "video";
  }


  if (
    file.type ===
    "application/pdf"
  ) {
    return "pdf";
  }


  return "file";
}


function setContentAssetUploadBusy(
  busy
) {

  if (
    contentAssetUploadButton
  ) {

    contentAssetUploadButton.disabled =
      busy;


    contentAssetUploadButton.textContent =
      busy
        ? "Uploading..."
        : "+ Upload Asset";

  }


  if (
    contentAssetFileInput
  ) {

    contentAssetFileInput.disabled =
      busy;

  }

}


function showContentAssetUploadStatus(
  message,
  type = ""
) {

  if (
    !contentAssetUploadStatus
  ) {
    return;
  }


  contentAssetUploadStatus.textContent =
    message;


  contentAssetUploadStatus.className =
    "content-asset-upload-status";


  if (
    type === "error"
  ) {

    contentAssetUploadStatus.classList.add(
      "is-error"
    );

  }


  if (
    type === "success"
  ) {

    contentAssetUploadStatus.classList.add(
      "is-success"
    );

  }


  contentAssetUploadStatus.hidden =
    false;

}

// =========================================================
// NEW CONTENT BUTTON
// =========================================================

if (
  newContentButton
) {

  newContentButton.addEventListener(
    "click",
    openContentCreatePanel
  );
}


// =========================================================
// CLOSE NEW CONTENT PANEL
// =========================================================

if (
  contentCreateClose
) {

  contentCreateClose.addEventListener(
    "click",
    closeContentCreatePanel
  );
}


if (
  contentCreateCancel
) {

  contentCreateCancel.addEventListener(
    "click",
    closeContentCreatePanel
  );
}


if (
  contentCreatePanel
) {

  const overlay =
    contentCreatePanel.querySelector(
      ".content-create-overlay"
    );


  if (
    overlay
  ) {

    overlay.addEventListener(
      "click",
      closeContentCreatePanel
    );

  }
}


// =========================================================
// ESCAPE KEY
// =========================================================

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key ===
        "Escape" &&
      contentCreatePanel &&
      !contentCreatePanel.hidden &&
      !contentCreateBusy
    ) {

      closeContentCreatePanel();

    }

  }
);

// =========================================================
// CREATE CONTENT FORM SUBMISSION
// =========================================================

if (
  contentCreateForm
) {

  contentCreateForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      if (
        contentCreateBusy
      ) {
        return;
      }


      clearContentCreateError();


      // ---------------------------------------------------
      // CLIENT
      // ---------------------------------------------------

      const clientId =
        contentClient.value;


      if (!clientId) {

        showContentCreateError(
          "Select a client."
        );

        contentClient.focus();

        return;
      }


      // ---------------------------------------------------
      // TITLE
      // ---------------------------------------------------

      const title =
        contentTitle
          .value
          .trim();


      if (!title) {

        showContentCreateError(
          "Enter an internal title."
        );

        contentTitle.focus();

        return;
      }


      // ---------------------------------------------------
      // CONTENT TYPE
      // ---------------------------------------------------

      const type =
        contentType.value;


      if (!type) {

        showContentCreateError(
          "Select a content type."
        );

        contentType.focus();

        return;
      }


      // ---------------------------------------------------
      // PLATFORMS
      // ---------------------------------------------------

      const platforms =
        Array.from(
          contentPlatformInputs
        )
          .filter(
            (input) =>
              input.checked
          )
          .map(
            (input) =>
              input.value
          );


      if (!platforms.length) {

        showContentCreateError(
          "Select at least one platform."
        );

        return;
      }


      // ---------------------------------------------------
      // OPTIONAL VALUES
      // ---------------------------------------------------

      const caption =
        contentCaption
          .value
          .trim();


      const publishAt =
        contentPublishAt.value;


      const status =
        contentStatus.value ||
        "draft";


      const approvalStatus =
        contentApprovalStatus.value ||
        "not_requested";


      const internalNotes =
        contentInternalNotes
          .value
          .trim();


      // ---------------------------------------------------
      // CREATE
      // ---------------------------------------------------

      setContentCreateBusy(
        true
      );


      try {

        
             let rpcName;

let rpcParams;


if (
  contentFormMode ===
  "edit"
) {

  if (!editingContentId) {

    throw new Error(
      "The content item ID is missing."
    );

  }


  rpcName =
    "update_admin_content_item";


  rpcParams = {

    p_content_item_id:
      editingContentId,

    p_title:
      title,

    p_content_type:
      type,

    p_platforms:
      platforms,

    p_caption:
      caption || null,

    p_planned_publish_at:
      publishAt
        ? new Date(
            publishAt
          ).toISOString()
        : null,

    p_status:
      status,

    p_approval_status:
      approvalStatus,

    p_internal_notes:
      internalNotes || null,

  };

} else {

  rpcName =
    "create_admin_content_item";


  rpcParams = {

    p_client_id:
      clientId,

    p_title:
      title,

    p_content_type:
      type,

    p_platforms:
      platforms,

    p_caption:
      caption || null,

    p_planned_publish_at:
      publishAt
        ? new Date(
            publishAt
          ).toISOString()
        : null,

    p_status:
      status,

    p_approval_status:
      approvalStatus,

    p_internal_notes:
      internalNotes || null,

  };

}


const {
  data,
  error,
} =
  await supabaseClient
    .rpc(
      rpcName,
      rpcParams
    );


        if (error) {

          throw error;

        }


       const wasEditing =
  contentFormMode ===
  "edit";


const updatedContentId =
  editingContentId;


console.log(
  wasEditing
    ? "Content updated:"
    : "Content created:",
  data
);


        // -----------------------------------------------
        // REFRESH CONTENT CACHE
        // -----------------------------------------------

        contentLoaded =
          false;

        cachedContent =
          [];


        // -----------------------------------------------
        // CLOSE FORM
        // -----------------------------------------------

        contentCreateBusy =
          false;


        contentCreatePanel.hidden =
          true;


        document.body.style.overflow =
          "";


        resetContentCreateForm();


        // -----------------------------------------------
        // REFRESH CONTENT PAGE
        // -----------------------------------------------

        await loadContent(
          true
        );

        if (
  wasEditing &&
  updatedContentId
) {

  await openContentItem(
    updatedContentId
  );

}


      } catch (error) {

        console.error(
          "Create content failed:",
          error
        );


        showContentCreateError(
          error?.message ||
          "The content item could not be created."
        );


      } finally {

        setContentCreateBusy(
          false
        );

      }

    }
  );
}

// =========================================================
// FLAG DESCRIPTIONS
// =========================================================

function getFlagDescription(
  flagType
) {

  const descriptions = {

    META_SETUP_REQUIRED:
      "Meta Business setup or access still needs to be completed for this client.",

    TIKTOK_SETUP_REQUIRED:
      "TikTok business setup or access still needs to be completed for this client.",

    NEW_SOCIAL_ACCOUNT_REQUIRED:
      "One or more social accounts managed by The Algorithm Forge still need to be created.",

    PREVIOUS_AGENCY_EXPERIENCE:
      "Review the client's previous agency experience and any related onboarding notes.",

    COMPLIANCE_REVIEW_REQUIRED:
      "Review the client's compliance requirements before content production begins.",

  };


  return (
    descriptions[
      flagType
    ] ||
    "This onboarding item requires review or setup."
  );
}


// =========================================================
// DISPLAY HELPERS
// =========================================================

function formatStatus(
  value
) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "";
  }


  return String(
    value
  )
    .replaceAll(
      "_",
      " "
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}


function formatNullableStatus(
  value
) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }


  return formatStatus(
    value
  );
}


function formatPlatform(
  value
) {

  const labels = {

    facebook:
      "Facebook",

    instagram:
      "Instagram",

    tiktok:
      "TikTok",

  };


  return (
    labels[value] ||
    formatStatus(
      value
    )
  );
}


function formatFlagType(
  value
) {

  if (!value) {
    return "Setup Task";
  }


  const labels = {

    META_SETUP_REQUIRED:
      "Meta Setup Required",

    TIKTOK_SETUP_REQUIRED:
      "TikTok Setup Required",

    NEW_SOCIAL_ACCOUNT_REQUIRED:
      "New Social Account Required",

    PREVIOUS_AGENCY_EXPERIENCE:
      "Previous Agency Experience",

    COMPLIANCE_REVIEW_REQUIRED:
      "Compliance Review Required",

  };


  return (
    labels[value] ||
    formatStatus(
      value
    )
  );
}


function sanitizeClassValue(
  value
) {

  return String(
    value
  )
    .toLowerCase()
    .replace(
      /[^a-z0-9_-]/g,
      "-"
    );
}


function formatClientDate(
  value
) {

  if (!value) {
    return "Unknown";
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
    return "Unknown";
  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      month:
        "short",

      day:
        "numeric",

      year:
        "numeric",
    }
  ).format(
    date
  );
}


function formatPhoneDisplay(
  value
) {

  if (!value) {
    return null;
  }


  const digits =
    String(
      value
    ).replace(
      /\D/g,
      ""
    );


  if (
    digits.length === 10
  ) {

    return (
      `(${digits.slice(0, 3)}) ` +
      `${digits.slice(3, 6)}-` +
      `${digits.slice(6)}`
    );
  }


  if (
    digits.length === 11 &&
    digits.startsWith(
      "1"
    )
  ) {

    return (
      `+1 (${digits.slice(1, 4)}) ` +
      `${digits.slice(4, 7)}-` +
      `${digits.slice(7)}`
    );
  }


  return String(
    value
  );
}


function buildContactName(
  contact
) {

  if (
    !contact ||
    !contact.name
  ) {
    return null;
  }


  if (
    contact.role
  ) {

    return (
      `${contact.name} · ` +
      `${contact.role}`
    );
  }


  return contact.name;
}


// Only used for strings inserted via innerHTML.

function escapeHtml(
  value
) {

  return String(
    value
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
// SIGN OUT
// =========================================================

async function signOut() {

  if (authBusy) {
    return;
  }


  authBusy =
    true;


  try {

    const {
      error,
    } =
      await supabaseClient
        .auth
        .signOut();


    if (error) {

      console.error(
        "Sign out failed:",
        error
      );

    }


    currentUser =
      null;


    resetAdminData();


    loginPassword.value =
      "";


    showLogin();

  } catch (error) {

    console.error(
      "Unexpected sign out error:",
      error
    );

  } finally {

    authBusy =
      false;

  }
}


signOutButton.addEventListener(
  "click",
  signOut
);


unauthorizedSignOut.addEventListener(
  "click",
  signOut
);


// =========================================================
// ADMIN NAVIGATION
// =========================================================

adminNavItems.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const view =
          button.dataset
            .adminView;


        if (
          view !==
          "clients"
        ) {

          selectedClientId =
            null;

          selectedClientData =
            null;

        }


        showAdminView(
          view
        );

      }
    );

  }
);


goToViewButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const view =
          button.dataset
            .goToView;


        showAdminView(
          view
        );

      }
    );

  }
);


// =========================================================
// SHOW ADMIN VIEW
// =========================================================

function showAdminView(
  viewName,
  options = {}
) {

  currentView =
    viewName;


  adminViews.forEach(
    (view) => {

      const matches =
        view.dataset.view ===
        viewName;


      view.hidden =
        !matches;


      view.classList.toggle(
        "active",
        matches
      );

    }
  );


  adminNavItems.forEach(
    (button) => {

      const matches =
        button.dataset.adminView ===
        viewName;


      button.classList.toggle(
        "active",
        matches
      );

    }
  );


  adminPageTitle.textContent =
    getViewTitle(
      viewName
    );


  if (
    viewName ===
      "clients" &&
    !options.skipClientListLoad &&
    !selectedClientId
  ) {

    loadClients();

  }


  if (
    viewName ===
    "tasks"
  ) {

    loadSetupTasks();

  }


  if (
    viewName ===
    "content"
  ) {

    loadContent();

  }

}


// =========================================================
// VIEW TITLE
// =========================================================

function getViewTitle(
  viewName
) {

  const titles = {

    dashboard:
      "DASHBOARD",

    clients:
      "CLIENTS",

    tasks:
      "SETUP TASKS",

    content:
      "CONTENT",

  };


  return (
    titles[
      viewName
    ] ||
    "DASHBOARD"
  );
}


// =========================================================
// RESTORE EXISTING SESSION
// =========================================================

async function restoreSession() {

  showLoading();


  try {

    const {
      data,
      error,
    } =
      await supabaseClient
        .auth
        .getSession();


    if (error) {

      console.error(
        "Session restore failed:",
        error
      );


      showLogin();

      return;
    }


    const session =
      data?.session;


    if (!session) {

      showLogin();

      return;
    }


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
        "User validation failed:",
        userError
      );


      await supabaseClient
        .auth
        .signOut();


      showLogin();

      return;
    }


    currentUser =
      userData.user;


    const authorized =
      await checkAdminAccess();


    if (!authorized) {

      showUnauthorized();

      return;
    }


    resetAdminData();


    showAdmin();

  } catch (error) {

    console.error(
      "Session initialization error:",
      error
    );


    showLogin();

  }
}


// =========================================================
// AUTH STATE LISTENER
// =========================================================

supabaseClient
  .auth
  .onAuthStateChange(
    (
      event,
      session
    ) => {

      console.log(
        "Auth event:",
        event
      );


      if (
        event ===
        "SIGNED_OUT"
      ) {

        currentUser =
          null;


        resetAdminData();


        showLogin();


        return;
      }


      if (
        session?.user
      ) {

        currentUser =
          session.user;

      }


      // Auth events may fire multiple times
      // during initialization or token refresh.
      //
      // Data loading remains controlled by
      // login, restoreSession, and navigation.

    }
  );


// =========================================================
// INITIALIZE
// =========================================================

restoreSession();