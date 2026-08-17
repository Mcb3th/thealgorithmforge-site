// =========================================================
// THE ALGORITHM FORGE
// CLIENT ONBOARDING - STAGE 5
//
// Navigation
// Conditional logic
// Client-side validation
// Review
// Payload construction
// LIVE Supabase Edge Function submission
// =========================================================


// =========================================================
// CONFIG
// =========================================================

const ONBOARDING_ENDPOINT =
  "https://dbujzfjwbzjrwaknvdax.supabase.co/functions/v1/submit-onboarding";


// =========================================================
// ELEMENTS
// =========================================================

const intro =
  document.getElementById("onboardingIntro");

const app =
  document.getElementById("onboardingApp");

const success =
  document.getElementById("onboardingSuccess");

const startButton =
  document.getElementById("startOnboarding");

const form =
  document.getElementById("onboardingForm");

const backButton =
  document.getElementById("backButton");

const nextButton =
  document.getElementById("nextButton");

const submitButton =
  document.getElementById("submitButton");

const progressLabel =
  document.getElementById("progressLabel");

const progressPercent =
  document.getElementById("progressPercent");

const progressBar =
  document.getElementById("progressBar");

const progressSteps =
  document.querySelectorAll(
    "[data-step-indicator]"
  );

const formSteps =
  document.querySelectorAll(
    ".form-step[data-step]"
  );

const reviewContent =
  document.getElementById("reviewContent");

const formErrorSummary =
  document.getElementById("formErrorSummary");


// =========================================================
// CONDITIONAL FIELD ELEMENTS
// =========================================================

const serviceAreaField =
  document.getElementById(
    "serviceAreaField"
  );

const serviceAreaInput =
  document.getElementById(
    "service_area"
  );

const brandMaterialsField =
  document.getElementById(
    "brandMaterialsField"
  );

const platformUrlFields =
  document.getElementById(
    "platformUrlFields"
  );

const previousAgencyNotesField =
  document.getElementById(
    "previousAgencyNotesField"
  );

const metaSetupFields =
  document.getElementById(
    "metaSetupFields"
  );

const metaPortfolioIdField =
  document.getElementById(
    "metaPortfolioIdField"
  );

const tiktokSetupFields =
  document.getElementById(
    "tiktokSetupFields"
  );

const goalChoices =
  document.getElementById(
    "goalChoices"
  );

const primaryGoalSelect =
  document.getElementById(
    "primary_goal"
  );

const promotionsField =
  document.getElementById(
    "promotionsField"
  );

const complianceNotesField =
  document.getElementById(
    "complianceNotesField"
  );

const ctaDestinationField =
  document.getElementById(
    "ctaDestinationField"
  );

const approvalContactFields =
  document.getElementById(
    "approvalContactFields"
  );

const approvalRequirementsField =
  document.getElementById(
    "approvalRequirementsField"
  );


// =========================================================
// STATE
// =========================================================

let currentStep = 1;
let isSubmitting = false;

const totalQuestionSteps = 7;
const reviewStepNumber = 8;


// =========================================================
// PLATFORM LABELS
// =========================================================

const platformLabels = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
};


// =========================================================
// START ONBOARDING
// =========================================================

startButton.addEventListener(
  "click",
  () => {
    intro.hidden = true;
    app.hidden = false;

    currentStep = 1;

    showStep(currentStep);
    scrollToTop();
  }
);


// =========================================================
// STEP DISPLAY
// =========================================================

function showStep(stepNumber) {
  clearErrorSummary();

  formSteps.forEach(
    (step) => {
      const value =
        Number(step.dataset.step);

      if (value === stepNumber) {
        step.hidden = false;
        step.classList.add(
          "active"
        );
      } else {
        step.hidden = true;
        step.classList.remove(
          "active"
        );
      }
    }
  );

  updateNavigation();
  updateProgress();

  if (
    stepNumber ===
    reviewStepNumber
  ) {
    buildReview();
  }

  scrollToTop();
}


// =========================================================
// NAVIGATION
// =========================================================

nextButton.addEventListener(
  "click",
  () => {
    const valid =
      validateStep(
        currentStep
      );

    if (!valid) {
      return;
    }

    if (
      currentStep <
      reviewStepNumber
    ) {
      currentStep += 1;

      showStep(
        currentStep
      );
    }
  }
);


backButton.addEventListener(
  "click",
  () => {
    if (
      currentStep > 1 &&
      !isSubmitting
    ) {
      currentStep -= 1;

      showStep(
        currentStep
      );
    }
  }
);


function updateNavigation() {
  backButton.disabled =
    currentStep === 1 ||
    isSubmitting;

  const isReview =
    currentStep ===
    reviewStepNumber;

  nextButton.hidden =
    isReview;

  submitButton.hidden =
    !isReview;
}


// =========================================================
// PROGRESS
// =========================================================

function updateProgress() {
  if (
    currentStep <=
    totalQuestionSteps
  ) {
    const percent =
      Math.round(
        (
          currentStep /
          totalQuestionSteps
        ) * 100
      );

    progressLabel.textContent =
      `Step ${currentStep} of ${totalQuestionSteps}`;

    progressPercent.textContent =
      `${percent}%`;

    progressBar.style.width =
      `${percent}%`;
  } else {
    progressLabel.textContent =
      "Review";

    progressPercent.textContent =
      "100%";

    progressBar.style.width =
      "100%";
  }

  progressSteps.forEach(
    (step) => {
      const stepNumber =
        Number(
          step.dataset
            .stepIndicator
        );

      step.classList.remove(
        "active",
        "complete"
      );

      if (
        currentStep <=
        totalQuestionSteps
      ) {
        if (
          stepNumber ===
          currentStep
        ) {
          step.classList.add(
            "active"
          );
        }

        if (
          stepNumber <
          currentStep
        ) {
          step.classList.add(
            "complete"
          );
        }
      } else {
        step.classList.add(
          "complete"
        );
      }
    }
  );
}


// =========================================================
// STEP 1
// PREFERRED CONTACT METHOD
// =========================================================

const preferredContactMethod =
  document.getElementById(
    "preferred_contact_method"
  );

const contactPhone =
  document.getElementById(
    "contact_phone"
  );

const contactPhoneLabel =
  document.getElementById(
    "contactPhoneLabel"
  );


preferredContactMethod.addEventListener(
  "change",
  updatePreferredContactMethod
);


function updatePreferredContactMethod() {
  const method =
    preferredContactMethod.value;

  const phoneRequired =
    method === "phone" ||
    method === "text";

  contactPhone.required =
    phoneRequired;

  contactPhoneLabel.textContent =
    phoneRequired
      ? "Best phone number *"
      : "Best phone number";

  if (!phoneRequired) {
    clearFieldError(
      contactPhone
    );
  }
}


// =========================================================
// STEP 1
// OPERATING SCOPE
// =========================================================

document
  .querySelectorAll(
    'input[name="operating_scope"]'
  )
  .forEach(
    (radio) => {
      radio.addEventListener(
        "change",
        updateServiceArea
      );
    }
  );


function updateServiceArea() {
  const selected =
    getRadioValue(
      "operating_scope"
    );

  const show =
    selected === "local" ||
    selected ===
      "multiple_locations";

  serviceAreaField.hidden =
    !show;

  if (!show) {
    serviceAreaInput.value =
      "";

    clearFieldError(
      serviceAreaInput
    );
  }
}


// =========================================================
// STEP 2
// BRAND MATERIALS
// =========================================================

document
  .querySelectorAll(
    'input[name="brand_guidelines_status"]'
  )
  .forEach(
    (radio) => {
      radio.addEventListener(
        "change",
        updateBrandMaterials
      );
    }
  );


function updateBrandMaterials() {
  const status =
    getRadioValue(
      "brand_guidelines_status"
    );

  const show =
    status === "yes" ||
    status === "some";

  brandMaterialsField.hidden =
    !show;

  if (!show) {
    clearCheckboxGroup(
      "brand_materials"
    );
  }
}


// =========================================================
// STEP 3
// EXISTING SOCIAL PLATFORMS
// =========================================================

const existingPlatformCheckboxes =
  document.querySelectorAll(
    'input[name="existing_platforms"]'
  );


existingPlatformCheckboxes.forEach(
  (checkbox) => {
    checkbox.addEventListener(
      "change",
      handleExistingPlatforms
    );
  }
);


function handleExistingPlatforms(
  event
) {
  const changed =
    event.target;

  const noneCheckbox =
    form.querySelector(
      'input[name="existing_platforms"][value="none"]'
    );

  if (
    changed.value === "none" &&
    changed.checked
  ) {
    existingPlatformCheckboxes
      .forEach(
        (checkbox) => {
          if (
            checkbox.value !==
            "none"
          ) {
            checkbox.checked =
              false;
          }
        }
      );
  }

  if (
    changed.value !== "none" &&
    changed.checked &&
    noneCheckbox
  ) {
    noneCheckbox.checked =
      false;
  }

  buildPlatformUrlFields();
  updateManagedPlatformQuestions();
}


// =========================================================
// DYNAMIC PROFILE URL FIELDS
// =========================================================

function buildPlatformUrlFields() {
  const selected =
    getExistingPlatforms();

  const existingValues = {};

  platformUrlFields
    .querySelectorAll(
      "[data-platform-url]"
    )
    .forEach(
      (input) => {
        existingValues[
          input.dataset
            .platformUrl
        ] = input.value;
      }
    );

  platformUrlFields.innerHTML =
    "";

  selected.forEach(
    (platform) => {
      const label =
        document.createElement(
          "label"
        );

      label.className =
        "field";

      const text =
        document.createElement(
          "span"
        );

      text.textContent =
        `${getPlatformLabel(platform)} profile URL`;

      const input =
        document.createElement(
          "input"
        );

      input.type = "url";

      input.placeholder =
        "https://";

      input.name =
        `profile_url_${platform}`;

      input.dataset.platformUrl =
        platform;

      input.value =
        existingValues[
          platform
        ] || "";

      label.appendChild(
        text
      );

      label.appendChild(
        input
      );

      platformUrlFields
        .appendChild(
          label
        );
    }
  );
}


// =========================================================
// PLATFORMS TO MANAGE
// =========================================================

document
  .querySelectorAll(
    'input[name="platforms_to_manage"]'
  )
  .forEach(
    (checkbox) => {
      checkbox.addEventListener(
        "change",
        updateManagedPlatformQuestions
      );
    }
  );


// =========================================================
// SMART META + TIKTOK CONDITIONALS
// =========================================================

function updateManagedPlatformQuestions() {
  const existing =
    getExistingPlatforms();

  const managed =
    getCheckedValues(
      "platforms_to_manage"
    );

  const existingMeta =
    existing.includes(
      "facebook"
    ) ||
    existing.includes(
      "instagram"
    );

  const managedMeta =
    managed.includes(
      "facebook"
    ) ||
    managed.includes(
      "instagram"
    );

  const shouldAskMeta =
    existingMeta &&
    managedMeta;

  const existingTikTok =
    existing.includes(
      "tiktok"
    );

  const managedTikTok =
    managed.includes(
      "tiktok"
    );

  const shouldAskTikTok =
    existingTikTok &&
    managedTikTok;

  metaSetupFields.hidden =
    !shouldAskMeta;

  tiktokSetupFields.hidden =
    !shouldAskTikTok;

  if (!shouldAskMeta) {
    clearRadioGroup(
      "meta_business_portfolio_status"
    );

    document
      .getElementById(
        "meta_business_portfolio_id"
      )
      .value = "";

    metaPortfolioIdField.hidden =
      true;
  }

  if (!shouldAskTikTok) {
    clearRadioGroup(
      "tiktok_business_center_status"
    );
  }
}


// =========================================================
// DERIVE ACCOUNTS REQUIRING CREATION
// =========================================================

function getNewAccountsNeeded() {
  const existing =
    getExistingPlatforms();

  const managed =
    getCheckedValues(
      "platforms_to_manage"
    );

  return managed.filter(
    (platform) =>
      !existing.includes(
        platform
      )
  );
}


// =========================================================
// META BUSINESS PORTFOLIO ID
// =========================================================

document
  .querySelectorAll(
    'input[name="meta_business_portfolio_status"]'
  )
  .forEach(
    (radio) => {
      radio.addEventListener(
        "change",
        updateMetaPortfolioId
      );
    }
  );


function updateMetaPortfolioId() {
  const status =
    getRadioValue(
      "meta_business_portfolio_status"
    );

  metaPortfolioIdField.hidden =
    status !== "yes";

  if (
    status !== "yes"
  ) {
    document
      .getElementById(
        "meta_business_portfolio_id"
      )
      .value = "";
  }
}


// =========================================================
// PREVIOUS AGENCY
// =========================================================

document
  .querySelectorAll(
    'input[name="previous_agency_experience"]'
  )
  .forEach(
    (radio) => {
      radio.addEventListener(
        "change",
        updatePreviousAgency
      );
    }
  );


function updatePreviousAgency() {
  const selected =
    getRadioValue(
      "previous_agency_experience"
    );

  previousAgencyNotesField.hidden =
    selected !== "true";

  if (
    selected !== "true"
  ) {
    document
      .getElementById(
        "previous_agency_notes"
      )
      .value = "";
  }
}


// =========================================================
// STEP 4
// GOALS
// =========================================================

const goalCheckboxes =
  document.querySelectorAll(
    'input[name="primary_goals"]'
  );


goalCheckboxes.forEach(
  (checkbox) => {
    checkbox.addEventListener(
      "change",
      updateGoals
    );
  }
);


function updateGoals(event) {
  const selected =
    getCheckedValues(
      "primary_goals"
    );

  if (
    selected.length > 3
  ) {
    event.target.checked =
      false;

    showTemporaryGoalMessage();

    return;
  }

  updatePrimaryGoalOptions();
}


function updatePrimaryGoalOptions() {
  const selectedCheckboxes =
    Array.from(
      goalCheckboxes
    ).filter(
      (checkbox) =>
        checkbox.checked
    );

  const previous =
    primaryGoalSelect.value;

  primaryGoalSelect.innerHTML =
    "";

  const placeholder =
    document.createElement(
      "option"
    );

  placeholder.value = "";

  placeholder.textContent =
    "Select your primary goal";

  primaryGoalSelect.appendChild(
    placeholder
  );

  selectedCheckboxes.forEach(
    (checkbox) => {
      const option =
        document.createElement(
          "option"
        );

      option.value =
        checkbox.value;

      const card =
        checkbox.closest(
          ".choice-card"
        );

      option.textContent =
        card
          ?.querySelector(
            "span"
          )
          ?.textContent
          ?.trim() ||
        formatValue(
          checkbox.value
        );
             primaryGoalSelect
        .appendChild(
          option
        );
    }
  );

  const stillExists =
    selectedCheckboxes.some(
      (checkbox) =>
        checkbox.value ===
        previous
    );

  primaryGoalSelect.value =
    stillExists
      ? previous
      : "";
}


function showTemporaryGoalMessage() {
  let message =
    document.getElementById(
      "goalLimitMessage"
    );

  if (!message) {
    message =
      document.createElement(
        "p"
      );

    message.id =
      "goalLimitMessage";

    message.className =
      "field-error";

    message.textContent =
      "Choose up to 3 goals.";

    goalChoices
      .insertAdjacentElement(
        "afterend",
        message
      );
  }

  clearTimeout(
    showTemporaryGoalMessage
      .timeout
  );

  showTemporaryGoalMessage
    .timeout =
    setTimeout(
      () => {
        message.remove();
      },
      2500
    );
}


// =========================================================
// STEP 5
// PROMOTIONS
// =========================================================

document
  .querySelectorAll(
    'input[name="has_promotions"]'
  )
  .forEach(
    (radio) => {
      radio.addEventListener(
        "change",
        updatePromotions
      );
    }
  );


function updatePromotions() {
  const selected =
    getRadioValue(
      "has_promotions"
    );

  promotionsField.hidden =
    selected !== "yes";

  if (
    selected !== "yes"
  ) {
    document
      .getElementById(
        "upcoming_promotions"
      )
      .value = "";
  }
}


// =========================================================
// STEP 6
// COMPLIANCE
// =========================================================

document
  .querySelectorAll(
    'input[name="compliance_status"]'
  )
  .forEach(
    (radio) => {
      radio.addEventListener(
        "change",
        updateCompliance
      );
    }
  );


function updateCompliance() {
  const selected =
    getRadioValue(
      "compliance_status"
    );

  complianceNotesField.hidden =
    selected !== "yes";

  if (
    selected !== "yes"
  ) {
    document
      .getElementById(
        "compliance_notes"
      )
      .value = "";
  }
}


// =========================================================
// STEP 7
// CALL TO ACTION
// =========================================================

const ctaSelect =
  document.getElementById(
    "primary_call_to_action"
  );


ctaSelect.addEventListener(
  "change",
  updateCtaDestination
);


function updateCtaDestination() {
  const value =
    ctaSelect.value;

  const show = [
    "call",
    "website",
    "request_quote",
    "book_appointment",
    "purchase",
    "sign_up",
  ].includes(
    value
  );

  ctaDestinationField.hidden =
    !show;

  if (!show) {
    document
      .getElementById(
        "call_to_action_destination"
      )
      .value = "";
  }
}


// =========================================================
// APPROVAL CONTACT
// =========================================================

document
  .querySelectorAll(
    'input[name="approval_contact"]'
  )
  .forEach(
    (radio) => {
      radio.addEventListener(
        "change",
        updateApprovalContact
      );
    }
  );


function updateApprovalContact() {
  const selected =
    getRadioValue(
      "approval_contact"
    );

  approvalContactFields.hidden =
    selected !== "other";

  if (
    selected !== "other"
  ) {
    clearApprovalContactFields();
  }
}


function clearApprovalContactFields() {
  [
    "approval_contact_name",
    "approval_contact_role",
    "approval_contact_email",
    "approval_contact_phone",
    "approval_contact_method",
  ].forEach(
    (id) => {
      const field =
        document.getElementById(
          id
        );

      if (field) {
        field.value = "";
      }
    }
  );
}


// =========================================================
// APPROVAL PREFERENCE
// =========================================================

const approvalPreference =
  document.getElementById(
    "approval_preference"
  );


approvalPreference.addEventListener(
  "change",
  updateApprovalRequirements
);


function updateApprovalRequirements() {
  const selected =
    approvalPreference.value;

  approvalRequirementsField.hidden =
    selected !==
    "approve_everything";

  if (
    selected !==
    "approve_everything"
  ) {
    document
      .getElementById(
        "approval_requirements"
      )
      .value = "";
  }
}


// =========================================================
// VALIDATION
// =========================================================

function validateStep(
  stepNumber
) {
  clearStepErrors(
    stepNumber
  );

  clearErrorSummary();

  const errors = [];

  switch (
    stepNumber
  ) {
    case 1:
      validateBusiness(
        errors
      );
      break;

    case 2:
      validateBrand(
        errors
      );
      break;

    case 3:
      validateSocial(
        errors
      );
      break;

    case 4:
      validateGoals(
        errors
      );
      break;

    case 5:
      validateContent(
        errors
      );
      break;

    case 6:
      validateRequirements(
        errors
      );
      break;

    case 7:
      validateWorkflow(
        errors
      );
      break;

    default:
      return true;
  }

  if (
    errors.length
  ) {
    showErrorSummary();

    const first =
      document.querySelector(
        ".form-step:not([hidden]) .has-error input, " +
        ".form-step:not([hidden]) .has-error textarea, " +
        ".form-step:not([hidden]) .has-error select, " +
        ".form-step:not([hidden]) .field-group.has-error input"
      );

    if (first) {
      first.focus({
        preventScroll: true,
      });

      first
        .closest(
          ".field, .field-group"
        )
        ?.scrollIntoView({
          behavior:
            "smooth",
          block:
            "center",
        });
    }

    return false;
  }

  return true;
}


// =========================================================
// STEP 1 VALIDATION
// =========================================================

function validateBusiness(
  errors
) {
  validateRequiredText(
    "business_name",
    2,
    "Please enter the business name.",
    errors
  );

  validateRequiredText(
    "contact_name",
    2,
    "Please enter your name.",
    errors
  );

  validateRequiredText(
    "contact_role",
    2,
    "Please enter your role in the business.",
    errors
  );

  validateEmailField(
    "contact_email",
    true,
    errors
  );

  validateRequiredSelect(
    "preferred_contact_method",
    "Please choose your preferred contact method.",
    errors
  );

  const primaryContactMethod =
    getSelectValue(
      "preferred_contact_method"
    );

  if (
    primaryContactMethod === "phone" ||
    primaryContactMethod === "text"
  ) {
    validateRequiredText(
      "contact_phone",
      3,
      primaryContactMethod === "phone"
        ? "Please provide a phone number because you selected Phone as your preferred contact method."
        : "Please provide a phone number because you selected Text as your preferred contact method.",
      errors
    );
  }

  validateOptionalUrl(
    "business_website",
    errors
  );

  const scope =
    getRadioValue(
      "operating_scope"
    );

  if (!scope) {
    addGroupError(
      "operating_scope",
      "Please choose where your business operates.",
      errors
    );
  }

  if (
    scope === "local" ||
    scope ===
      "multiple_locations"
  ) {
    validateRequiredText(
      "service_area",
      2,
      "Please enter your service area.",
      errors
    );
  }

  validateRequiredText(
    "business_description",
    10,
    "Please tell us a little more about your business.",
    errors
  );

  validateRequiredText(
    "priority_products_services",
    2,
    "Please tell us which products or services matter most.",
    errors
  );
}


// =========================================================
// STEP 2 VALIDATION
// =========================================================

function validateBrand(
  errors
) {
  validateRequiredText(
    "ideal_customer",
    5,
    "Please describe your ideal customer.",
    errors
  );

  validateRequiredText(
    "differentiators",
    5,
    "Please tell us what makes your business different.",
    errors
  );

  const voices =
    getCheckedValues(
      "brand_voice"
    );

  if (
    !voices.length
  ) {
    addGroupError(
      "brand_voice",
      "Choose at least one brand personality.",
      errors
    );
  }

  if (
    voices.length > 6
  ) {
    addGroupError(
      "brand_voice",
      "Choose no more than 6 brand personality options.",
      errors
    );
  }

  if (
    voices.includes(
      "other"
    )
  ) {
    validateRequiredText(
      "brand_voice_notes",
      2,
      "Please describe the other brand voice.",
      errors
    );
  }
}


// =========================================================
// STEP 3 VALIDATION
// =========================================================

function validateSocial(
  errors
) {
  const existingRaw =
    getCheckedValues(
      "existing_platforms"
    );

  if (
    !existingRaw.length
  ) {
    addGroupError(
      "existing_platforms",
      "Please tell us which platforms you currently use, or choose None yet.",
      errors
    );
  }

  platformUrlFields
    .querySelectorAll(
      "[data-platform-url]"
    )
    .forEach(
      (input) => {
        if (
          input.value.trim() &&
          !isValidHttpUrl(
            input.value
          )
        ) {
          addFieldError(
            input,
            "Please enter a valid profile URL.",
            errors
          );
        }
      }
    );

  const managed =
    getCheckedValues(
      "platforms_to_manage"
    );

  if (
    !managed.length
  ) {
    addGroupError(
      "platforms_to_manage",
      "Choose at least one platform for The Algorithm Forge to manage.",
      errors
    );
  }

  const existing =
    getExistingPlatforms();

  const shouldAskMeta =
    (
      managed.includes(
        "facebook"
      ) ||
      managed.includes(
        "instagram"
      )
    ) &&
    (
      existing.includes(
        "facebook"
      ) ||
      existing.includes(
        "instagram"
      )
    );

  if (
    shouldAskMeta
  ) {
    const metaStatus =
      getRadioValue(
        "meta_business_portfolio_status"
      );

    if (!metaStatus) {
      addGroupError(
        "meta_business_portfolio_status",
        "Please choose a Meta Business Portfolio status.",
        errors
      );
    }
  }

  const shouldAskTikTok =
    managed.includes(
      "tiktok"
    ) &&
    existing.includes(
      "tiktok"
    );

  if (
    shouldAskTikTok
  ) {
    const tiktokStatus =
      getRadioValue(
        "tiktok_business_center_status"
      );

    if (!tiktokStatus) {
      addGroupError(
        "tiktok_business_center_status",
        "Please choose a TikTok Business Center status.",
        errors
      );
    }
  }
}


// =========================================================
// STEP 4 VALIDATION
// =========================================================

function validateGoals(
  errors
) {
  const goals =
    getCheckedValues(
      "primary_goals"
    );

  if (
    !goals.length
  ) {
    addGroupError(
      "primary_goals",
      "Choose at least one goal.",
      errors
    );
  }

  if (
    goals.length > 3
  ) {
    addGroupError(
      "primary_goals",
      "Choose no more than 3 goals.",
      errors
    );
  }

  if (
    !primaryGoalSelect.value
  ) {
    addFieldError(
      primaryGoalSelect,
      "Please choose your most important goal.",
      errors
    );
  }

  if (
    primaryGoalSelect.value &&
    !goals.includes(
      primaryGoalSelect.value
    )
  ) {
    addFieldError(
      primaryGoalSelect,
      "Your primary goal must be one of the goals selected above.",
      errors
    );
  }

  validateRequiredText(
    "desired_improvement",
    5,
    "Please tell us what improvement you'd most like to see.",
    errors
  );
}


// =========================================================
// STEP 5 VALIDATION
// =========================================================

function validateContent(
  errors
) {
  validateRequiredSelect(
    "media_inventory",
    "Please choose how much existing photo/video content you have.",
    errors
  );

  validateRequiredSelect(
    "media_supply_frequency",
    "Please tell us how often you can provide new media.",
    errors
  );

  validateRequiredText(
    "priority_features",
    2,
    "Please tell us what you'd most like featured.",
    errors
  );

  const hasPromotions =
    getRadioValue(
      "has_promotions"
    );

  if (
    hasPromotions ===
    "yes"
  ) {
    validateRequiredText(
      "upcoming_promotions",
      2,
      "Please tell us about the upcoming promotion or event.",
      errors
    );
  }
}


// =========================================================
// STEP 6 VALIDATION
// =========================================================

function validateRequirements(
  errors
) {
  const status =
    getRadioValue(
      "compliance_status"
    );

  if (!status) {
    addGroupError(
      "compliance_status",
      "Please choose a compliance status.",
      errors
    );
  }

  if (
    status === "yes"
  ) {
    validateRequiredText(
      "compliance_notes",
      5,
      "Please explain the requirements we need to follow.",
      errors
    );
  }
}


// =========================================================
// STEP 7 VALIDATION
// =========================================================

function validateWorkflow(
  errors
) {
  const cta =
    document.getElementById(
      "primary_call_to_action"
    );

  if (
    !cta.value
  ) {
    addFieldError(
      cta,
      "Please choose a primary call to action.",
      errors
    );
  }

  const needsDestination = [
    "call",
    "website",
    "request_quote",
    "book_appointment",
    "purchase",
    "sign_up",
  ].includes(
    cta.value
  );

  if (
    needsDestination
  ) {
    validateRequiredText(
      "call_to_action_destination",
      2,
      "Please provide the destination for this call to action.",
      errors
    );
  }

  const approvalContact =
    getRadioValue(
      "approval_contact"
    );

  if (
    approvalContact ===
    "other"
  ) {
    validateRequiredText(
      "approval_contact_name",
      2,
      "Please enter the approval contact's name.",
      errors
    );

    validateEmailField(
      "approval_contact_email",
      true,
      errors
    );

    validateRequiredSelect(
      "approval_contact_method",
      "Please choose how we should contact the approver.",
      errors
    );

    const method =
      document
        .getElementById(
          "approval_contact_method"
        )
        .value;

    if (
      method === "phone" ||
      method === "text"
    ) {
      validateRequiredText(
        "approval_contact_phone",
        3,
        "Please enter the approval contact's phone number.",
        errors
      );
    }
  }

  validateRequiredSelect(
    "approval_timing",
    "Please choose an approval turnaround time.",
    errors
  );

  validateRequiredSelect(
    "approval_preference",
    "Please choose an approval preference.",
    errors
  );
}


// =========================================================
// VALIDATION HELPERS
// =========================================================

function validateRequiredText(
  id,
  minimumLength,
  message,
  errors
) {
  const field =
    document.getElementById(
      id
    );

  if (!field) {
    return;
  }

  const value =
    field.value.trim();

  if (
    !value ||
    value.length <
      minimumLength
        ) {
    addFieldError(
      field,
      message,
      errors
    );
  }
}


function validateRequiredSelect(
  id,
  message,
  errors
) {
  const field =
    document.getElementById(
      id
    );

  if (
    !field ||
    !field.value
  ) {
    if (field) {
      addFieldError(
        field,
        message,
        errors
      );
    }
  }
}


function validateEmailField(
  id,
  required,
  errors
) {
  const field =
    document.getElementById(
      id
    );

  if (!field) {
    return;
  }

  const value =
    field.value.trim();

  if (!value) {
    if (required) {
      addFieldError(
        field,
        "Please enter a valid email address.",
        errors
      );
    }

    return;
  }

  const valid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(
        value
      );

  if (!valid) {
    addFieldError(
      field,
      "Please enter a valid email address.",
      errors
    );
  }
}


function validateOptionalUrl(
  id,
  errors
) {
  const field =
    document.getElementById(
      id
    );

  if (!field) {
    return;
  }

  const value =
    field.value.trim();

  if (
    value &&
    !isValidHttpUrl(
      value
    )
  ) {
    addFieldError(
      field,
      "Please enter a valid website URL beginning with http:// or https://.",
      errors
    );
  }
}


function isValidHttpUrl(
  value
) {
  try {
    const url =
      new URL(
        value
      );

    return (
      url.protocol ===
        "http:" ||
      url.protocol ===
        "https:"
    );
  } catch {
    return false;
  }
}


function addFieldError(
  field,
  message,
  errors
) {
  if (!field) {
    return;
  }

  const wrapper =
    field.closest(
      ".field"
    );

  if (!wrapper) {
    return;
  }

  wrapper.classList.add(
    "has-error"
  );

  const oldError =
    wrapper.querySelector(
      ".field-error"
    );

  if (oldError) {
    oldError.remove();
  }

  const error =
    document.createElement(
      "span"
    );

  error.className =
    "field-error";

  error.textContent =
    message;

  wrapper.appendChild(
    error
  );

  errors.push(
    message
  );
}


function addGroupError(
  name,
  message,
  errors
) {
  const first =
    form.querySelector(
      `[name="${name}"]`
    );

  if (!first) {
    return;
  }

  const group =
    first.closest(
      ".field-group"
    );

  if (!group) {
    return;
  }

  group.classList.add(
    "has-error"
  );

  const oldError =
    group.querySelector(
      ".field-error"
    );

  if (oldError) {
    oldError.remove();
  }

  const error =
    document.createElement(
      "span"
    );

  error.className =
    "field-error";

  error.textContent =
    message;

  group.appendChild(
    error
  );

  errors.push(
    message
  );
}


function clearFieldError(
  field
) {
  const wrapper =
    field?.closest(
      ".field"
    );

  if (!wrapper) {
    return;
  }

  wrapper.classList.remove(
    "has-error"
  );

  wrapper
    .querySelectorAll(
      ".field-error"
    )
    .forEach(
      (error) =>
        error.remove()
    );
}


function clearStepErrors(
  stepNumber
) {
  const step =
    form.querySelector(
      `.form-step[data-step="${stepNumber}"]`
    );

  if (!step) {
    return;
  }

  step
    .querySelectorAll(
      ".has-error"
    )
    .forEach(
      (element) => {
        element.classList.remove(
          "has-error"
        );
      }
    );

  step
    .querySelectorAll(
      ".field-error"
    )
    .forEach(
      (error) =>
        error.remove()
    );
}


function showErrorSummary(
  message =
    "Please fix the highlighted fields before continuing."
) {
  formErrorSummary.hidden =
    false;

  formErrorSummary.textContent =
    message;
}


function clearErrorSummary() {
  formErrorSummary.hidden =
    true;

  formErrorSummary.textContent =
    "";
}


// =========================================================
// PAYLOAD CONSTRUCTION
// =========================================================

function buildPayload() {
  const existingPlatforms =
    getExistingPlatforms();

  const existingAccounts =
    existingPlatforms.map(
      (platform) => {
        const urlField =
          platformUrlFields
            .querySelector(
              `[data-platform-url="${platform}"]`
            );

        const profileUrl =
          urlField
            ?.value
            ?.trim() || "";

        return {
          platform,

          profile_url:
            profileUrl ||
            null,
        };
      }
    );


  const managedPlatforms =
    getCheckedValues(
      "platforms_to_manage"
    );


  const newAccountsNeeded =
    getNewAccountsNeeded();


  const previousAgencyValue =
    getRadioValue(
      "previous_agency_experience"
    );


  const approvalContact =
    getRadioValue(
      "approval_contact"
    );


  const payload = {

    questionnaire_version:
      "1.0",


    // =====================================================
    // BUSINESS
    // =====================================================

    business: {

      business_name:
        getTextValue(
          "business_name"
        ),

      website:
        getNullableTextValue(
          "business_website"
        ),

      business_description:
        getTextValue(
          "business_description"
        ),

      operating_scope:
        getRadioValue(
          "operating_scope"
        ),

      service_area:
        getNullableTextValue(
          "service_area"
        ),

      priority_products_services:
        getTextValue(
          "priority_products_services"
        ),
    },


    // =====================================================
    // PRIMARY CONTACT
    // =====================================================

    primary_contact: {

      name:
        getTextValue(
          "contact_name"
        ),

      role:
        getTextValue(
          "contact_role"
        ),

      email:
        getTextValue(
          "contact_email"
        )
          .toLowerCase(),

      phone:
        getNullableTextValue(
          "contact_phone"
        ),

      preferred_contact_method:
        getSelectValue(
          "preferred_contact_method"
        ),
    },


    // =====================================================
    // BRAND
    // =====================================================

    brand: {

      ideal_customer:
        getTextValue(
          "ideal_customer"
        ),

      differentiators:
        getTextValue(
          "differentiators"
        ),

      brand_voice:
        getCheckedValues(
          "brand_voice"
        ),

      brand_voice_notes:
        getNullableTextValue(
          "brand_voice_notes"
        ),

      preferred_language:
        getNullableTextValue(
          "preferred_language"
        ),

      avoid_language:
        getNullableTextValue(
          "avoid_language"
        ),

      brand_guidelines_status:
        getNullableRadioValue(
          "brand_guidelines_status"
        ),

      brand_materials:
        getCheckedValues(
          "brand_materials"
        ),
    },


    // =====================================================
    // SOCIAL MEDIA
    // =====================================================

    social_media: {

      existing_accounts:
        existingAccounts,

      platforms_to_manage:
        managedPlatforms,

      new_accounts_needed:
        newAccountsNeeded,

      current_social_manager:
        getNullableSelectValue(
          "current_social_manager"
        ),

      previous_agency_experience:
        previousAgencyValue
          ? previousAgencyValue ===
              "true"
          : null,

      previous_agency_notes:
        getNullableTextValue(
          "previous_agency_notes"
        ),

      meta_business_portfolio_status:
        getNullableRadioValue(
          "meta_business_portfolio_status"
        ),

      meta_business_portfolio_id:
        getNullableTextValue(
          "meta_business_portfolio_id"
        ),

      tiktok_business_center_status:
        getNullableRadioValue(
          "tiktok_business_center_status"
        ),
    },


    // =====================================================
    // GOALS
    // =====================================================

    goals: {

      primary_goals:
        getCheckedValues(
          "primary_goals"
        ),

      primary_goal:
        getSelectValue(
          "primary_goal"
        ),

      desired_improvement:
        getTextValue(
          "desired_improvement"
        ),
    },


    // =====================================================
    // CONTENT
    // =====================================================

    content: {

      content_preferences:
        getCheckedValues(
          "content_preferences"
        ),

      media_inventory:
        getSelectValue(
          "media_inventory"
        ),

      media_supply_frequency:
        getSelectValue(
          "media_supply_frequency"
        ),

      priority_features:
        getTextValue(
          "priority_features"
        ),

      testimonials_available:
        getNullableSelectValue(
          "testimonials_available"
        ),

      upcoming_promotions:
        getRadioValue(
          "has_promotions"
        ) === "yes"
          ? getNullableTextValue(
              "upcoming_promotions"
            )
          : null,

      content_exclusions:
        getNullableTextValue(
          "content_exclusions"
        ),
    },


    // =====================================================
    // REQUIREMENTS
    // =====================================================

    requirements: {

      competitor_inspiration:
        getNullableTextValue(
          "competitor_inspiration"
        ),

      competitor_inspiration_notes:
        getNullableTextValue(
          "competitor_inspiration_notes"
        ),

      compliance_status:
        getRadioValue(
          "compliance_status"
        ),

      compliance_notes:
        getNullableTextValue(
          "compliance_notes"
        ),
    },


    // =====================================================
    // WORKFLOW
    // =====================================================

    workflow: {

      primary_call_to_action:
        getSelectValue(
          "primary_call_to_action"
        ),

      call_to_action_destination:
        getNullableTextValue(
          "call_to_action_destination"
        ),

      approval_contact:
        approvalContact,

      approval_timing:
        getSelectValue(
          "approval_timing"
        ),

      approval_preference:
        getSelectValue(
          "approval_preference"
        ),

      approval_requirements:
        getNullableTextValue(
          "approval_requirements"
        ),

      additional_notes:
        getNullableTextValue(
          "additional_notes"
        ),
    },
  };


  // =======================================================
  // OPTIONAL SECOND APPROVAL CONTACT
  // =======================================================

  if (
    approvalContact ===
    "other"
  ) {
    payload.workflow
      .approval_contact_details = {

      name:
        getTextValue(
          "approval_contact_name"
        ),

      role:
        getNullableTextValue(
          "approval_contact_role"
        ),

      email:
        getTextValue(
          "approval_contact_email"
        )
          .toLowerCase(),

      phone:
        getNullableTextValue(
          "approval_contact_phone"
        ),

      preferred_contact_method:
        getSelectValue(
          "approval_contact_method"
        ),
    };
  }


  return payload;
}


// =========================================================
// REVIEW
// =========================================================

function buildReview() {
  reviewContent.innerHTML =
    "";

  const reviewSections = [

    {
      title: "Business",

      fields: [
        [
          "Business name",
          "business_name",
        ],

        [
          "Your name",
          "contact_name",
        ],

        [
          "Role",
          "contact_role",
        ],

        [
          "Email",
          "contact_email",
        ],

        [
          "Preferred contact method",
          "preferred_contact_method",
        ],

        [
          "Phone",
          "contact_phone",
        ],

        [
          "Website",
          "business_website",
        ],

        [
          "Operating scope",
          "operating_scope",
        ],

        [
          "Service area",
          "service_area",
        ],

        [
          "Business description",
          "business_description",
        ],

        [
          "Priority products / services",
          "priority_products_services",
        ],
      ],
    },


    {
      title: "Brand",

      fields: [
        [
          "Ideal customer",
          "ideal_customer",
        ],

        [
          "Differentiators",
          "differentiators",
        ],

        [
          "Brand voice",
          "brand_voice",
        ],

        [
          "Brand voice notes",
          "brand_voice_notes",
        ],

        [
          "Preferred language",
          "preferred_language",
        ],

        [
          "Avoid language",
          "avoid_language",
        ],

        [
          "Brand guideline status",
          "brand_guidelines_status",
        ],

        [
          "Brand materials",
          "brand_materials",
        ],
      ],
    },


    {
      title:
        "Social Media",

      fields: [
        [
          "Existing platforms",
          "existing_platforms",
        ],

        [
          "Platforms to manage",
          "platforms_to_manage",
        ],

        [
          "Current social manager",
          "current_social_manager",
        ],

        [
          "Previous agency experience",
          "previous_agency_experience",
        ],

        [
          "Previous agency notes",
          "previous_agency_notes",
        ],

        [
          "Meta Business Portfolio",
          "meta_business_portfolio_status",
        ],

        [
          "Meta Portfolio ID",
          "meta_business_portfolio_id",
        ],

        [
          "TikTok Business Center",
          "tiktok_business_center_status",
        ],
      ],
    },


    {
      title: "Goals",

      fields: [
        [
          "Primary goals",
          "primary_goals",
        ],

        [
          "Top priority",
          "primary_goal",
        ],

        [
          "Desired improvement",
          "desired_improvement",
        ],
      ],
    },


    {
      title: "Content",

      fields: [
        [
          "Content preferences",
          "content_preferences",
        ],

        [
          "Media inventory",
          "media_inventory",
        ],

        [
          "Media supply frequency",
          "media_supply_frequency",
        ],

        [
          "Priority features",
          "priority_features",
        ],
                 [
          "Testimonials available",
          "testimonials_available",
        ],

        [
          "Has promotions",
          "has_promotions",
        ],

        [
          "Upcoming promotions",
          "upcoming_promotions",
        ],

        [
          "Content exclusions",
          "content_exclusions",
        ],
      ],
    },


    {
      title:
        "Requirements",

      fields: [
        [
          "Competitors / inspiration",
          "competitor_inspiration",
        ],

        [
          "Inspiration notes",
          "competitor_inspiration_notes",
        ],

        [
          "Compliance status",
          "compliance_status",
        ],

        [
          "Compliance notes",
          "compliance_notes",
        ],
      ],
    },


    {
      title:
        "Working Together",

      fields: [
        [
          "Primary call to action",
          "primary_call_to_action",
        ],

        [
          "CTA destination",
          "call_to_action_destination",
        ],

        [
          "Approval contact",
          "approval_contact",
        ],

        [
          "Approval timing",
          "approval_timing",
        ],

        [
          "Approval preference",
          "approval_preference",
        ],

        [
          "Approval requirements",
          "approval_requirements",
        ],

        [
          "Additional notes",
          "additional_notes",
        ],
      ],
    },
  ];


  reviewSections.forEach(
    (section) => {
      const sectionElement =
        document.createElement(
          "section"
        );

      sectionElement.className =
        "review-section";


      const heading =
        document.createElement(
          "h3"
        );

      heading.textContent =
        section.title;

      sectionElement.appendChild(
        heading
      );


      section.fields.forEach(
        (
          [
            label,
            fieldName,
          ]
        ) => {
          const value =
            getFieldDisplayValue(
              fieldName
            );

          if (!value) {
            return;
          }

          addReviewRow(
            sectionElement,
            label,
            value
          );
        }
      );


      if (
        section.title ===
        "Social Media"
      ) {
        platformUrlFields
          .querySelectorAll(
            "[data-platform-url]"
          )
          .forEach(
            (input) => {
              if (
                !input.value.trim()
              ) {
                return;
              }

              addReviewRow(
                sectionElement,

                `${getPlatformLabel(
                  input.dataset
                    .platformUrl
                )} profile`,

                input.value.trim()
              );
            }
          );


        const newAccounts =
          getNewAccountsNeeded();

        if (
          newAccounts.length
        ) {
          addReviewRow(
            sectionElement,

            "Accounts requiring creation",

            newAccounts
              .map(
                getPlatformLabel
              )
              .join(", ")
          );
        }
      }


      if (
        section.title ===
          "Working Together" &&
        getRadioValue(
          "approval_contact"
        ) === "other"
      ) {
        [
          [
            "Approval contact name",
            "approval_contact_name",
          ],

          [
            "Approval contact role",
            "approval_contact_role",
          ],

          [
            "Approval contact email",
            "approval_contact_email",
          ],

          [
            "Approval contact phone",
            "approval_contact_phone",
          ],

          [
            "Approval contact method",
            "approval_contact_method",
          ],
        ].forEach(
          (
            [
              label,
              fieldName,
            ]
          ) => {
            const value =
              getFieldDisplayValue(
                fieldName
              );

            if (value) {
              addReviewRow(
                sectionElement,
                label,
                value
              );
            }
          }
        );
      }


      reviewContent.appendChild(
        sectionElement
      );
    }
  );
}


function addReviewRow(
  section,
  label,
  value
) {
  const row =
    document.createElement(
      "div"
    );

  row.className =
    "review-row";


  const labelElement =
    document.createElement(
      "div"
    );

  labelElement.className =
    "review-label";

  labelElement.textContent =
    label;


  const valueElement =
    document.createElement(
      "div"
    );

  valueElement.className =
    "review-value";

  valueElement.textContent =
    value;


  row.appendChild(
    labelElement
  );

  row.appendChild(
    valueElement
  );

  section.appendChild(
    row
  );
}


// =========================================================
// DISPLAY HELPERS
// =========================================================

function getFieldDisplayValue(
  fieldName
) {
  const fields =
    form.querySelectorAll(
      `[name="${fieldName}"]`
    );

  if (
    !fields.length
  ) {
    return "";
  }

  const first =
    fields[0];


  if (
    first.type ===
    "checkbox"
  ) {
    return Array.from(
      fields
    )
      .filter(
        (field) =>
          field.checked
      )
      .map(
        (field) => {
          const card =
            field.closest(
              ".choice-card"
            );

          return (
            card
              ?.querySelector(
                "span"
              )
              ?.textContent
              ?.trim() ||
            formatValue(
              field.value
            )
          );
        }
      )
      .join(", ");
  }


  if (
    first.type ===
    "radio"
  ) {
    const checked =
      Array.from(
        fields
      ).find(
        (field) =>
          field.checked
      );

    if (!checked) {
      return "";
    }

    return (
      checked
        .closest(
          ".choice-card"
        )
        ?.querySelector(
          "span"
        )
        ?.textContent
        ?.trim() ||
      formatValue(
        checked.value
      )
    );
  }


  if (
    first.tagName ===
    "SELECT"
  ) {
    if (!first.value) {
      return "";
    }

    return (
      first.options[
        first.selectedIndex
      ]
        ?.textContent
        ?.trim() || ""
    );
  }


  return first.value
    ? first.value.trim()
    : "";
}


// =========================================================
// VALUE HELPERS
// =========================================================

function getTextValue(
  id
) {
  return (
    document
      .getElementById(
        id
      )
      ?.value
      ?.trim() || ""
  );
}


function getNullableTextValue(
  id
) {
  const value =
    getTextValue(
      id
    );

  return value || null;
}


function getSelectValue(
  id
) {
  return (
    document
      .getElementById(
        id
      )
      ?.value || ""
  );
}


function getNullableSelectValue(
  id
) {
  const value =
    getSelectValue(
      id
    );

  return value || null;
}


function getRadioValue(
  name
) {
  const checked =
    form.querySelector(
      `input[name="${name}"]:checked`
    );

  return checked
    ? checked.value
    : "";
}


function getNullableRadioValue(
  name
) {
  const value =
    getRadioValue(
      name
    );

  return value || null;
}


function getCheckedValues(
  name
) {
  return Array.from(
    form.querySelectorAll(
      `input[name="${name}"]:checked`
    )
  ).map(
    (checkbox) =>
      checkbox.value
  );
}


function getExistingPlatforms() {
  return getCheckedValues(
    "existing_platforms"
  ).filter(
    (platform) =>
      platform !== "none"
  );
}


function clearRadioGroup(
  name
) {
  form
    .querySelectorAll(
      `input[name="${name}"]`
    )
    .forEach(
      (radio) => {
        radio.checked =
          false;
      }
    );
}


function clearCheckboxGroup(
  name
) {
  form
    .querySelectorAll(
      `input[name="${name}"]`
    )
    .forEach(
      (checkbox) => {
        checkbox.checked =
          false;
      }
    );
}


function getPlatformLabel(
  platform
) {
  return (
    platformLabels[
      platform
    ] ||
    formatValue(
      platform
    )
  );
}


function formatValue(
  value
) {
  return value
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


function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}


// =========================================================
// SUBMISSION STATE
// =========================================================

function setSubmitting(
  submitting
) {
  isSubmitting =
    submitting;

  submitButton.disabled =
    submitting;

  backButton.disabled =
    submitting ||
    currentStep === 1;

  submitButton.classList.toggle(
    "loading",
    submitting
  );

  const submitText =
    submitButton.querySelector(
      ".submit-text"
    );

  if (submitText) {
    submitText.textContent =
      submitting
        ? "Submitting..."
        : "Submit Onboarding";
  }
}


// =========================================================
// LIVE FORM SUBMISSION
// =========================================================

form.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    if (
      isSubmitting
    ) {
      return;
    }

    clearErrorSummary();

    const payload =
      buildPayload();


    // Keep this available while testing.
    window.__tafOnboardingPayload =
      payload;


    console.log(
      "Submitting onboarding payload:",
      payload
    );


    setSubmitting(
      true
    );


    try {

      const response =
        await fetch(
          ONBOARDING_ENDPOINT,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );


      let result = null;


      try {
        result =
          await response.json();
      } catch {
        throw new Error(
          "The server returned an unreadable response."
        );
      }


      console.log(
        "Onboarding response:",
        result
      );


      // ---------------------------------------------------
      // SERVER REJECTED SUBMISSION
      // ---------------------------------------------------

      if (
        !response.ok ||
        result?.success !== true
      ) {

        console.error(
          "Onboarding submission failed:",
          result
        );


        if (
          result?.error ===
          "VALIDATION_ERROR"
        ) {
          showErrorSummary(
            "Some information could not be validated. Please review your answers and try again."
          );
        } else {
          showErrorSummary(
            result?.message ||
            "We could not submit your onboarding questionnaire. Please try again."
          );
        }


        formErrorSummary
          .scrollIntoView({
            behavior:
              "smooth",
            block:
              "center",
          });


        return;
      }


      // ---------------------------------------------------
      // SUCCESS
      // ---------------------------------------------------

      const submissionId =
        typeof result
          ?.submission_id ===
          "string"
          ? result
              .submission_id
          : null;


      if (!submissionId) {
        throw new Error(
          "The server did not return a submission reference."
        );
      }


      console.log(
        "Onboarding submitted successfully."
      );

      console.log(
        "Submission ID:",
        submissionId
      );


      // Store locally in memory for debugging
      // during development.
      // This does NOT persist after refresh.

      window
        .__tafOnboardingSubmissionId =
        submissionId;


      app.hidden =
        true;

      success.hidden =
        false;

      scrollToTop();

    } catch (error) {

      console.error(
        "Onboarding network error:",
        error
      );


      showErrorSummary(
        "We couldn't reach the onboarding service. Please check your connection and try again."
      );


      formErrorSummary
        .scrollIntoView({
          behavior:
            "smooth",
          block:
            "center",
        });

    } finally {

      setSubmitting(
        false
      );

    }
  }
);


// =========================================================
// INITIALIZE
// =========================================================

function initializeFormState() {
  updatePreferredContactMethod();

  updateServiceArea();

  updateBrandMaterials();

  buildPlatformUrlFields();

  updateManagedPlatformQuestions();

  updateMetaPortfolioId();

  updatePreviousAgency();

  updatePrimaryGoalOptions();

  updatePromotions();

  updateCompliance();

  updateCtaDestination();

  updateApprovalContact();

  updateApprovalRequirements();
}


initializeFormState();

showStep(1);