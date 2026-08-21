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

let currentView =
  "dashboard";


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

        showPortalView(
          button.dataset.view
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
// TEMPORARY ONBOARDING STATE
// =========================================================

function initializeOnboardingState() {

  /*
    For this first portal shell, a newly invited
    account is treated as requiring onboarding.

    Next we will connect this to the existing
    onboarding records so returning clients
    automatically show Complete instead.
  */

  renderOnboardingRequired();

}


// =========================================================
// ONBOARDING ACTION
// =========================================================

onboardingAction.addEventListener(
  "click",
  () => {

    showPortalView(
      "onboarding"
    );

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


    initializeOnboardingState();


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