// =========================================================
// THE ALGORITHM FORGE
// CLIENT ACCOUNT SETUP
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
// ELEMENTS
// =========================================================

const setupLoading =
  document.getElementById(
    "setupLoading"
  );

const clientSetupForm =
  document.getElementById(
    "clientSetupForm"
  );

const clientEmail =
  document.getElementById(
    "clientEmail"
  );

const clientPassword =
  document.getElementById(
    "clientPassword"
  );

const clientPasswordConfirm =
  document.getElementById(
    "clientPasswordConfirm"
  );

const setupSubmitButton =
  document.getElementById(
    "setupSubmitButton"
  );

const setupStatus =
  document.getElementById(
    "setupStatus"
  );

const setupError =
  document.getElementById(
    "setupError"
  );

const setupErrorMessage =
  document.getElementById(
    "setupErrorMessage"
  );

const setupSuccess =
  document.getElementById(
    "setupSuccess"
  );

const currentYear =
  document.getElementById(
    "currentYear"
  );


// =========================================================
// STATE
// =========================================================

let currentUser =
  null;

let setupBusy =
  false;

let setupInitialized =
  false;


// =========================================================
// YEAR
// =========================================================

if (currentYear) {

  currentYear.textContent =
    String(
      new Date()
        .getFullYear()
    );

}


// =========================================================
// VIEW HELPERS
// =========================================================

function hideSetupViews() {

  setupLoading.hidden =
    true;

  clientSetupForm.hidden =
    true;

  setupError.hidden =
    true;

  setupSuccess.hidden =
    true;

}


function showLoading() {

  hideSetupViews();

  setupLoading.hidden =
    false;

}


function showSetupForm() {

  hideSetupViews();

  clientSetupForm.hidden =
    false;

}


function showSetupError(
  message
) {

  hideSetupViews();

  setupErrorMessage.textContent =
    message ||
    "The invitation may have expired or already been used. Contact The Algorithm Forge for a new portal invitation.";

  setupError.hidden =
    false;

}


function showSetupSuccess() {

  hideSetupViews();

  setupSuccess.hidden =
    false;

}


// =========================================================
// FORM STATUS
// =========================================================

function clearStatus() {

  setupStatus.hidden =
    true;

  setupStatus.textContent =
    "";

  setupStatus.className =
    "setup-status";

}


function showStatusError(
  message
) {

  setupStatus.hidden =
    false;

  setupStatus.className =
    "setup-status is-error";

  setupStatus.textContent =
    message;

}


// =========================================================
// BUTTON STATE
// =========================================================

function setSetupBusy(
  busy
) {

  setupBusy =
    busy;

  setupSubmitButton.disabled =
    busy;

  clientPassword.disabled =
    busy;

  clientPasswordConfirm.disabled =
    busy;

  setupSubmitButton.textContent =
    busy
      ? "Creating Account..."
      : "Create My Account";

}


// =========================================================
// VERIFY CLIENT MEMBERSHIP
// =========================================================

async function verifyClientMembership() {

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
      "Client membership check failed:",
      error
    );

    throw new Error(
      "We couldn't verify your client portal access."
    );

  }


  if (
    !data ||
    data.is_active !==
      true
  ) {

    throw new Error(
      "This account does not have active client portal access."
    );

  }


  return data;

}


// =========================================================
// INITIALIZE INVITATION
// =========================================================

async function initializeClientSetup() {

  if (setupInitialized) {
    return;
  }


  setupInitialized =
    true;

  showLoading();


  try {

    /*
      Supabase automatically processes the
      authentication values contained in the
      invitation redirect because
      detectSessionInUrl is enabled.

      We then ask Supabase for the resulting session.
    */

    const {
      data: sessionData,
      error: sessionError,
    } =
      await supabaseClient
        .auth
        .getSession();


    if (sessionError) {

      console.error(
        "Invite session load failed:",
        sessionError
      );

      throw new Error(
        "The invitation could not be verified."
      );

    }


    let session =
      sessionData?.session ||
      null;


    /*
      Depending on browser timing, URL-session
      processing can finish a moment after the
      client initializes.

      If no session exists immediately, allow the
      auth state listener a brief opportunity to
      receive the invite sign-in event.
    */

    if (!session) {

      session =
        await waitForInviteSession();

    }


    if (
      !session ||
      !session.user
    ) {

      throw new Error(
        "This invitation is invalid, expired, or has already been used."
      );

    }


    currentUser =
      session.user;


    /*
      Confirm the user still exists with Supabase,
      rather than relying only on local session data.
    */

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
        "Invited user verification failed:",
        userError
      );

      throw new Error(
        "We couldn't verify the account attached to this invitation."
      );

    }


    currentUser =
      userData.user;


    /*
      Verify that the invited Auth user is actually
      linked to an active Algorithm Forge client.
    */

    await verifyClientMembership();


    clientEmail.value =
      currentUser.email ||
      "";


    showSetupForm();


    window.setTimeout(
      () => {

        clientPassword.focus();

      },
      0
    );


  } catch (error) {

    console.error(
      "Client setup initialization failed:",
      error
    );


    showSetupError(
      error?.message ||
      "The invitation could not be verified."
    );

  }

}


// =========================================================
// WAIT FOR INVITE SESSION
// =========================================================

function waitForInviteSession() {

  return new Promise(
    (resolve) => {

      let resolved =
        false;


      const finish =
        (session) => {

          if (resolved) {
            return;
          }


          resolved =
            true;


          subscription
            ?.unsubscribe();


          window.clearTimeout(
            timeoutId
          );


          resolve(
            session ||
            null
          );

        };


      const {
        data: {
          subscription,
        },
      } =
        supabaseClient
          .auth
          .onAuthStateChange(
            (
              event,
              session
            ) => {

              if (
                session &&
                (
                  event ===
                    "SIGNED_IN" ||
                  event ===
                    "INITIAL_SESSION" ||
                  event ===
                    "PASSWORD_RECOVERY"
                )
              ) {

                finish(
                  session
                );

              }

            }
          );


      const timeoutId =
        window.setTimeout(
          () => {

            finish(
              null
            );

          },
          5000
        );

    }
  );

}


// =========================================================
// PASSWORD VALIDATION
// =========================================================

function validatePasswords() {

  const password =
    clientPassword.value;

  const confirmation =
    clientPasswordConfirm.value;


  if (
    password.length <
      8
  ) {

    return {
      valid: false,
      message:
        "Your password must contain at least 8 characters.",
    };

  }


  if (
    password !==
      confirmation
  ) {

    return {
      valid: false,
      message:
        "The passwords do not match.",
    };

  }


  return {
    valid: true,
    message: "",
  };

}


// =========================================================
// ACCOUNT SETUP SUBMIT
// =========================================================

clientSetupForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    if (setupBusy) {
      return;
    }


    clearStatus();


    const validation =
      validatePasswords();


    if (
      !validation.valid
    ) {

      showStatusError(
        validation.message
      );

      return;

    }


    setSetupBusy(
      true
    );


    try {

      /*
        Re-check portal membership immediately
        before changing the password.
      */

      await verifyClientMembership();


      const newPassword =
        clientPassword.value;


      const {
        data,
        error,
      } =
        await supabaseClient
          .auth
          .updateUser({
            password:
              newPassword,
          });


      if (error) {

        console.error(
          "Password creation failed:",
          error
        );

        throw error;

      }


      if (
        !data?.user
      ) {

        throw new Error(
          "The account could not be updated."
        );

      }


      currentUser =
        data.user;


      clientPassword.value =
        "";

      clientPasswordConfirm.value =
        "";


      showSetupSuccess();


      /*
        Client portal page will be created next.

        For now this route is deliberately explicit
        so we have one place to update once the
        portal shell exists.
      */

      window.setTimeout(
        () => {

          window.location.href =
            "client-portal.html";

        },
        1800
      );


    } catch (error) {

      console.error(
        "Client account setup failed:",
        error
      );


      showSetupForm();


      showStatusError(
        error?.message ||
        "We couldn't finish creating your account. Please try again."
      );


    } finally {

      setSetupBusy(
        false
      );

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
        "Client setup auth event:",
        event
      );


      if (
        session?.user
      ) {

        currentUser =
          session.user;

      }

    }
  );


// =========================================================
// START
// =========================================================

initializeClientSetup();