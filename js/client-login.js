// =========================================================
// THE ALGORITHM FORGE
// CLIENT LOGIN
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

const clientLoginForm =
  document.getElementById(
    "clientLoginForm"
  );

const clientLoginEmail =
  document.getElementById(
    "clientLoginEmail"
  );

const clientLoginPassword =
  document.getElementById(
    "clientLoginPassword"
  );

const clientPasswordToggle =
  document.getElementById(
    "clientPasswordToggle"
  );

const clientLoginError =
  document.getElementById(
    "clientLoginError"
  );

const clientLoginButton =
  document.getElementById(
    "clientLoginButton"
  );

const clientLoginButtonText =
  document.getElementById(
    "clientLoginButtonText"
  );

const clientLoginLoader =
  document.getElementById(
    "clientLoginLoader"
  );


// =========================================================
// STATE
// =========================================================

let loginBusy =
  false;


// =========================================================
// ERROR
// =========================================================

function clearClientLoginError() {

  clientLoginError.hidden =
    true;

  clientLoginError.textContent =
    "";

}


function showClientLoginError(
  message
) {

  clientLoginError.textContent =
    message;

  clientLoginError.hidden =
    false;

}


// =========================================================
// BUSY STATE
// =========================================================

function setClientLoginBusy(
  busy
) {

  loginBusy =
    busy;

  clientLoginButton.disabled =
    busy;

  clientLoginEmail.disabled =
    busy;

  clientLoginPassword.disabled =
    busy;

  clientPasswordToggle.disabled =
    busy;

  clientLoginButtonText.textContent =
    busy
      ? "Signing In..."
      : "Sign In";

  clientLoginLoader.hidden =
    !busy;

}


// =========================================================
// PASSWORD VISIBILITY
// =========================================================

clientPasswordToggle.addEventListener(
  "click",
  () => {

    const visible =
      clientLoginPassword.type ===
      "text";


    clientLoginPassword.type =
      visible
        ? "password"
        : "text";


    clientPasswordToggle.textContent =
      visible
        ? "Show"
        : "Hide";


    clientPasswordToggle.setAttribute(
      "aria-label",
      visible
        ? "Show password"
        : "Hide password"
    );


    clientLoginPassword.focus();

  }
);


// =========================================================
// VERIFY CLIENT MEMBERSHIP
// =========================================================

async function verifyClientMembership(
  userId
) {

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
        userId
      )
      .maybeSingle();


  if (error) {

    console.error(
      "Client membership verification failed:",
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


  return data;

}


// =========================================================
// LOGIN
// =========================================================

clientLoginForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    if (loginBusy) {
      return;
    }


    clearClientLoginError();


    const email =
      clientLoginEmail
        .value
        .trim()
        .toLowerCase();


    const password =
      clientLoginPassword.value;


    if (!email) {

      showClientLoginError(
        "Enter your email address."
      );

      clientLoginEmail.focus();

      return;

    }


    if (!password) {

      showClientLoginError(
        "Enter your password."
      );

      clientLoginPassword.focus();

      return;

    }


    setClientLoginBusy(
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
          "Client login failed:",
          error
        );

        showClientLoginError(
          "The email or password is incorrect."
        );

        return;

      }


      if (
        !data?.user
      ) {

        showClientLoginError(
          "We could not verify this account."
        );

        return;

      }


      await verifyClientMembership(
        data.user.id
      );


      clientLoginPassword.value =
        "";


      window.location.href =
        "client-portal.html";


    } catch (error) {

      console.error(
        "Client portal login failed:",
        error
      );


      /*
        If authentication succeeded but
        membership verification failed,
        sign the user back out so an
        admin account or unrelated account
        does not remain active here.
      */

      await supabaseClient
        .auth
        .signOut();


      showClientLoginError(
        error?.message ||
        "We couldn't complete your sign-in request."
      );


    } finally {

      setClientLoginBusy(
        false
      );

    }

  }
);


// =========================================================
// EXISTING SESSION
// =========================================================

async function initializeClientLogin() {

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
        "Client login session check failed:",
        error
      );

      return;

    }


    const session =
      data?.session ||
      null;


    if (
      !session?.user
    ) {
      return;
    }


    try {

      await verifyClientMembership(
        session.user.id
      );


      window.location.href =
        "client-portal.html";


    } catch {

      /*
        A session exists, but it is not
        an authorized client account.

        Clear it so the login page is
        ready for the correct client.
      */

      await supabaseClient
        .auth
        .signOut();

    }


  } catch (error) {

    console.error(
      "Client login initialization failed:",
      error
    );

  }

}


// =========================================================
// START
// =========================================================

initializeClientLogin();