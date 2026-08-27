// =========================================================
// THE ALGORITHM FORGE
// CLIENT PASSWORD RESET
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

const resetPasswordForm =
  document.getElementById(
    "resetPasswordForm"
  );

const newPassword =
  document.getElementById(
    "newPassword"
  );

const confirmPassword =
  document.getElementById(
    "confirmPassword"
  );

const newPasswordToggle =
  document.getElementById(
    "newPasswordToggle"
  );

const confirmPasswordToggle =
  document.getElementById(
    "confirmPasswordToggle"
  );

const resetPasswordMessage =
  document.getElementById(
    "resetPasswordMessage"
  );

const resetPasswordButton =
  document.getElementById(
    "resetPasswordButton"
  );

const resetPasswordButtonText =
  document.getElementById(
    "resetPasswordButtonText"
  );

const resetPasswordLoader =
  document.getElementById(
    "resetPasswordLoader"
  );


// =========================================================
// STATE
// =========================================================

let resetBusy =
  false;

let recoverySessionReady =
  false;


// =========================================================
// MESSAGE
// =========================================================

function clearResetMessage() {

  resetPasswordMessage.hidden =
    true;

  resetPasswordMessage.textContent =
    "";

}


function showResetMessage(
  message
) {

  resetPasswordMessage.textContent =
    message;

  resetPasswordMessage.hidden =
    false;

}


// =========================================================
// BUSY STATE
// =========================================================

function setResetBusy(
  busy
) {

  resetBusy =
    busy;

  resetPasswordButton.disabled =
    busy;

  newPassword.disabled =
    busy;

  confirmPassword.disabled =
    busy;

  newPasswordToggle.disabled =
    busy;

  confirmPasswordToggle.disabled =
    busy;

  resetPasswordButtonText.textContent =
    busy
      ? "Updating..."
      : "Update Password";

  resetPasswordLoader.hidden =
    !busy;

}


// =========================================================
// PASSWORD TOGGLES
// =========================================================

function wirePasswordToggle(
  button,
  input
) {

  button.addEventListener(
    "click",
    () => {

      const visible =
        input.type ===
        "text";


      input.type =
        visible
          ? "password"
          : "text";


      button.textContent =
        visible
          ? "Show"
          : "Hide";


      button.setAttribute(
        "aria-label",
        visible
          ? "Show password"
          : "Hide password"
      );


      input.focus();

    }
  );

}


wirePasswordToggle(
  newPasswordToggle,
  newPassword
);


wirePasswordToggle(
  confirmPasswordToggle,
  confirmPassword
);


// =========================================================
// RECOVERY SESSION
// =========================================================

async function initializeRecoverySession() {

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
        "Recovery session check failed:",
        error
      );

      showResetMessage(
        "This password reset link could not be verified."
      );

      return;

    }


    if (
      data?.session?.user
    ) {

      recoverySessionReady =
        true;

      return;

    }


    showResetMessage(
      "This password reset link is invalid or has expired."
    );


  } catch (error) {

    console.error(
      "Recovery initialization failed:",
      error
    );


    showResetMessage(
      "This password reset link could not be verified."
    );

  }

}


// =========================================================
// AUTH EVENTS
// =========================================================

supabaseClient.auth.onAuthStateChange(
  (
    event,
    session
  ) => {

    console.log(
      "Client recovery auth event:",
      event
    );


    if (
      event ===
      "PASSWORD_RECOVERY"
    ) {

      recoverySessionReady =
        true;

      clearResetMessage();

    }


    if (
      event ===
      "SIGNED_IN" &&
      session?.user
    ) {

      recoverySessionReady =
        true;

    }

  }
);


// =========================================================
// UPDATE PASSWORD
// =========================================================

resetPasswordForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    if (resetBusy) {
      return;
    }


    clearResetMessage();


    const password =
      newPassword.value;

    const confirmation =
      confirmPassword.value;


    if (!recoverySessionReady) {

      showResetMessage(
        "This password reset session is not active. Please request a new reset link."
      );

      return;

    }


    if (
      password.length < 8
    ) {

      showResetMessage(
        "Your new password must be at least 8 characters long."
      );

      newPassword.focus();

      return;

    }


    if (
      password !==
      confirmation
    ) {

      showResetMessage(
        "The passwords do not match."
      );

      confirmPassword.focus();

      return;

    }


    setResetBusy(
      true
    );


    try {

      const {
        error,
      } =
        await supabaseClient
          .auth
          .updateUser({
            password,
          });


      if (error) {

        console.error(
          "Password update failed:",
          error
        );


        showResetMessage(
          "We couldn't update your password. Please request a new reset link and try again."
        );

        return;

      }


      /*
        Sign out after the reset so the client
        performs a normal login with the new
        password. This keeps the recovery flow
        nicely separated from the portal session.
      */

      await supabaseClient
        .auth
        .signOut();


      window.location.href =
        "client-login.html?reset=success";


    } catch (error) {

      console.error(
        "Unexpected password update error:",
        error
      );


      showResetMessage(
        "We couldn't update your password. Please try again."
      );


    } finally {

      setResetBusy(
        false
      );

    }

  }
);


// =========================================================
// START
// =========================================================

initializeRecoverySession();