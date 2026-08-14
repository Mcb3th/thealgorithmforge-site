const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");
const revealElements = document.querySelectorAll(".reveal");

const contactForm = document.querySelector("#contactForm");
const submitButton = document.querySelector(".contact-submit");
const formStatus = document.querySelector("#formStatus");

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const serviceInput = document.querySelector("#service");
const messageInput = document.querySelector("#message");

/* ========================================
   STICKY HEADER
======================================== */

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* ========================================
   MOBILE NAVIGATION
======================================== */

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  mainNav.classList.toggle("active");

  const isOpen = menuToggle.classList.contains("active");

  menuToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    mainNav.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* ========================================
   SCROLL REVEAL
======================================== */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

/* ========================================
   CONTACT FORM HELPERS
======================================== */

function showError(input, message) {
  input.classList.add("error");

  const errorElement = document.querySelector(
    `#${input.id}Error`
  );

  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearError(input) {
  input.classList.remove("error");

  const errorElement = document.querySelector(
    `#${input.id}Error`
  );

  if (errorElement) {
    errorElement.textContent = "";
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ========================================
   CLEAR ERRORS WHILE TYPING
======================================== */

[nameInput, emailInput, serviceInput, messageInput].forEach(
  (input) => {
    input.addEventListener("input", () => {
      clearError(input);
      formStatus.className = "form-status";
      formStatus.textContent = "";
    });

    input.addEventListener("change", () => {
      clearError(input);
    });
  }
);

/* ========================================
   CONTACT FORM SUBMIT
======================================== */

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  let isValid = true;

  formStatus.className = "form-status";
  formStatus.textContent = "";

  clearError(nameInput);
  clearError(emailInput);
  clearError(serviceInput);
  clearError(messageInput);

  if (nameInput.value.trim().length < 2) {
    showError(
      nameInput,
      "Please enter your name."
    );
    isValid = false;
  }

  if (!isValidEmail(emailInput.value.trim())) {
    showError(
      emailInput,
      "Please enter a valid email address."
    );
    isValid = false;
  }

  if (!serviceInput.value) {
    showError(
      serviceInput,
      "Please choose a service."
    );
    isValid = false;
  }

  if (messageInput.value.trim().length < 10) {
    showError(
      messageInput,
      "Please tell me a little more about what you need."
    );
    isValid = false;
  }

  if (!isValid) {
    formStatus.className = "form-status error";
    formStatus.textContent =
      "Please fix the highlighted fields and try again.";

    return;
  }

  submitButton.classList.add("loading");
  submitButton.disabled = true;

  try {
  const formData = new FormData(contactForm);

  const response = await fetch(contactForm.action, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Form submission failed.");
  }

  formStatus.className = "form-status success";
  formStatus.textContent =
    "Thanks! Your message has been sent. I'll be in touch soon.";

  contactForm.reset();

} catch (error) {

  console.error(error);

  formStatus.className = "form-status error";
  formStatus.textContent =
    "Something went wrong while sending your message. Please try again.";

} finally {

  submitButton.classList.remove("loading");
  submitButton.disabled = false;

}
});