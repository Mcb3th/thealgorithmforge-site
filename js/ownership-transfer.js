// =========================================================
// THE ALGORITHM FORGE
// OWNERSHIP TRANSFER ACCEPTANCE
// =========================================================


// =========================================================
// SUPABASE CONFIG
// =========================================================

const SUPABASE_URL =
  "https://dbujzfjwbzjrwaknvdax.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_LaXzH-5gXws_N8LMfbf-6g_aInczyqT";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession:
          true,

        autoRefreshToken:
          true,

        detectSessionInUrl:
          true,
      },
    }
  );


// =========================================================
// ELEMENTS
// =========================================================

const transferLoading =
  document.getElementById(
    "transferLoading"
  );

const ownershipAcceptanceForm =
  document.getElementById(
    "ownershipAcceptanceForm"
  );

const transferError =
  document.getElementById(
    "transferError"
  );

const transferErrorMessage =
  document.getElementById(
    "transferErrorMessage"
  );

const transferSuccess =
  document.getElementById(
    "transferSuccess"
  );

const transferSuccessMessage =
  document.getElementById(
    "transferSuccessMessage"
  );

const transferBusinessName =
  document.getElementById(
    "transferBusinessName"
  );

const transferOwnerName =
  document.getElementById(
    "transferOwnerName"
  );

const transferOwnerEmail =
  document.getElementById(
    "transferOwnerEmail"
  );

const transferExpiration =
  document.getElementById(
    "transferExpiration"
  );

const ownershipPasswordSection =
  document.getElementById(
    "ownershipPasswordSection"
  );

const ownershipPassword =
  document.getElementById(
    "ownershipPassword"
  );

const ownershipPasswordConfirm =
  document.getElementById(
    "ownershipPasswordConfirm"
  );

const ownershipConfirmation =
  document.getElementById(
    "ownershipConfirmation"
  );

const ownershipAcceptanceStatus =
  document.getElementById(
    "ownershipAcceptanceStatus"
  );

const ownershipAcceptanceSubmit =
  document.getElementById(
    "ownershipAcceptanceSubmit"
  );

const currentYear =
  document.getElementById(
    "currentYear"
  );


// =========================================================
// STATE
// =========================================================

const transferId =
  new URLSearchParams(
    window.location.search
  )
    .get(
      "request"
    )
    ?.trim() ||
  "";

let currentUser =
  null;

let currentTransfer =
  null;

let requiresPasswordSetup =
  false;


// =========================================================
// ROOT STATES
// =========================================================

function hideTransferStates() {

  transferLoading.hidden =
    true;

  ownershipAcceptanceForm.hidden =
    true;

  transferError.hidden =
    true;

  transferSuccess.hidden =
    true;

}


function showTransferError(
  message
) {

  hideTransferStates();

  transferErrorMessage.textContent =
    message ||
    "This ownership transfer invitation cannot be used.";

  transferError.hidden =
    false;

}


function showTransferForm() {

  hideTransferStates();

  ownershipAcceptanceForm.hidden =
    false;

}


function showTransferSuccess(
  message
) {

  hideTransferStates();

  transferSuccessMessage.textContent =
    message ||
    "You are now the owner of this client portal.";

  transferSuccess.hidden =
    false;

}


// =========================================================
// FORM STATUS
// =========================================================

function clearAcceptanceStatus() {

  ownershipAcceptanceStatus.textContent =
    "";

  ownershipAcceptanceStatus.className =
    "setup-status";

  ownershipAcceptanceStatus.hidden =
    true;

}


function showAcceptanceStatus(
  message,
  type = "error"
) {

  ownershipAcceptanceStatus.textContent =
    message;

  ownershipAcceptanceStatus.className =
    `setup-status is-${type}`;

  ownershipAcceptanceStatus.hidden =
    false;

}


// =========================================================
// FUNCTION ERROR MESSAGE
// =========================================================

async function getFunctionErrorMessage(
  error,
  data,
  fallback
) {

  if (
    data?.error
  ) {
    return data.error;
  }


  if (
    error?.context
  ) {

    try {

      const errorBody =
        await error.context
          .json();

      if (
        errorBody?.error
      ) {
        return errorBody.error;
      }

    } catch {
      // Use the fallback below.
    }

  }


  return (
    error?.message ||
    fallback
  );

}


// =========================================================
// INVOKE TRANSFER FUNCTION
// =========================================================

async function invokeTransferFunction(
  action
) {

  const {
    data: sessionData,
    error: sessionError,
  } =
    await supabaseClient
      .auth
      .getSession();


  if (sessionError) {
    throw sessionError;
  }


  const session =
    sessionData?.session ||
    null;


  if (
    !session?.access_token
  ) {

    throw new Error(
      "Your secure invitation session could not be verified. Open the original link from your email again."
    );

  }


  const {
    data,
    error,
  } =
    await supabaseClient
      .functions
      .invoke(
        "accept-ownership-transfer",
        {
          body: {
            action,
            transfer_id:
              transferId,
          },

          headers: {
            Authorization:
              `Bearer ${session.access_token}`,
          },
        }
      );


  if (error) {

    const message =
      await getFunctionErrorMessage(
        error,
        data,
        "The ownership transfer could not be processed."
      );

    throw new Error(
      message
    );

  }


  if (
    !data?.success
  ) {

    throw new Error(
      data?.error ||
      "The ownership transfer could not be processed."
    );

  }


  return data;

}


// =========================================================
// FORMAT EXPIRATION
// =========================================================

function formatExpiration(
  value
) {

  const date =
    new Date(
      value
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Unavailable";
  }


  return date.toLocaleString(
    undefined,
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
  );

}


// =========================================================
// PASSWORD VISIBILITY
// =========================================================

document
  .querySelectorAll(
    "[data-transfer-password-toggle]"
  )
  .forEach(
    (toggleButton) => {

      toggleButton.addEventListener(
        "click",
        () => {

          const inputId =
            toggleButton.dataset
              .transferPasswordToggle;

          const passwordInput =
            document.getElementById(
              inputId
            );


          if (!passwordInput) {
            return;
          }


          const willShow =
            passwordInput.type ===
            "password";


          passwordInput.type =
            willShow
              ? "text"
              : "password";

          toggleButton.textContent =
            willShow
              ? "Hide"
              : "Show";

          toggleButton.setAttribute(
            "aria-label",
            willShow
              ? "Hide password"
              : "Show password"
          );

        }
      );

    }
  );


// =========================================================
// LOAD TRANSFER
// =========================================================

async function initializeTransfer() {

  if (currentYear) {

    currentYear.textContent =
      new Date()
        .getFullYear();

  }


  if (!transferId) {

    showTransferError(
      "The ownership transfer ID is missing from this invitation."
    );

    return;

  }


  const hashParameters =
    new URLSearchParams(
      window.location.hash
        .replace(
          /^#/,
          ""
        )
    );


  const authenticationError =
    hashParameters.get(
      "error_description"
    );


  if (
    authenticationError
  ) {

    showTransferError(
      authenticationError
    );

    return;

  }


  try {

    const {
      data: sessionData,
      error: sessionError,
    } =
      await supabaseClient
        .auth
        .getSession();


    if (sessionError) {
      throw sessionError;
    }


    if (
      !sessionData?.session
    ) {

      throw new Error(
        "Your secure invitation session could not be found. Open the original ownership-transfer email again."
      );

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

      throw new Error(
        "Your account could not be verified."
      );

    }


    currentUser =
      userData.user;


    /*
      Remove authentication tokens from the visible
      browser address while preserving the request ID.
    */

    if (
      window.location.hash
    ) {

      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`
      );

    }


    const preview =
      await invokeTransferFunction(
        "preview"
      );


    currentTransfer =
      preview.transfer;

    requiresPasswordSetup =
      currentTransfer
        .requires_password_setup ===
      true;


    transferBusinessName.textContent =
      currentTransfer
        .business_name ||
      "Client Account";

    transferOwnerName.textContent =
      currentTransfer
        .replacement_name ||
      "New Owner";

    transferOwnerEmail.textContent =
      currentTransfer
        .replacement_email ||
      currentUser.email ||
      "Unavailable";

    transferExpiration.textContent =
      formatExpiration(
        currentTransfer
          .expires_at
      );


    ownershipPasswordSection.hidden =
      !requiresPasswordSetup;

    ownershipPassword.required =
      requiresPasswordSetup;

    ownershipPasswordConfirm.required =
      requiresPasswordSetup;


    clearAcceptanceStatus();

    showTransferForm();


  } catch (error) {

    console.error(
      "Ownership transfer initialization failed:",
      error
    );


    showTransferError(
      error?.message ||
      "This ownership transfer invitation could not be verified."
    );

  }

}


// =========================================================
// ACCEPT TRANSFER
// =========================================================

ownershipAcceptanceForm
  ?.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      clearAcceptanceStatus();


      if (
        requiresPasswordSetup
      ) {

        const password =
          ownershipPassword
            .value;

        const confirmation =
          ownershipPasswordConfirm
            .value;


        if (
          password.length < 12
        ) {

          showAcceptanceStatus(
            "Your password must contain at least 12 characters."
          );

          ownershipPassword.focus();

          return;

        }


        if (
          password !==
          confirmation
        ) {

          showAcceptanceStatus(
            "The passwords do not match."
          );

          ownershipPasswordConfirm.focus();

          return;

        }

      }


      if (
        !ownershipConfirmation
          .checked
      ) {

        showAcceptanceStatus(
          "Confirm that you understand the ownership transfer before continuing."
        );

        ownershipConfirmation.focus();

        return;

      }


      ownershipAcceptanceSubmit.disabled =
        true;

      ownershipAcceptanceSubmit.textContent =
        "Accepting Ownership...";


      try {

        if (
          requiresPasswordSetup
        ) {

          const {
            error: passwordError,
          } =
            await supabaseClient
              .auth
              .updateUser({
                password:
                  ownershipPassword
                    .value,
              });


          if (passwordError) {
            throw passwordError;
          }

        }


        const result =
          await invokeTransferFunction(
            "accept"
          );


        ownershipPassword.value =
          "";

        ownershipPasswordConfirm.value =
          "";


        showTransferSuccess(
          result.message ||
          "You are now the owner of this client portal."
        );


      } catch (error) {

        console.error(
          "Ownership transfer acceptance failed:",
          error
        );


        showAcceptanceStatus(
          error?.message ||
          "The ownership transfer could not be completed."
        );


        ownershipAcceptanceSubmit.disabled =
          false;

        ownershipAcceptanceSubmit.textContent =
          "Accept Account Ownership";

      }

    }
  );


// =========================================================
// START
// =========================================================

initializeTransfer();