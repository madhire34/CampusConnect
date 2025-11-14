// CampusOrbit Connect front-end logic
// - Lead forms -> Pipedream webhook
// - Modal with dynamic fees loaded from JSON (acts as a nested JSON API)
// - Smooth scroll for CTA link
const PIPEDREAM_WEBHOOK_URL = "https://eowyb15a9thcajj.m.pipedream.net";
const FEES_JSON_URL = "assets/fees.json";

let cachedFees = null;

function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function smoothScrollTo(targetSelector) {
  const el = typeof targetSelector === "string" ? qs(targetSelector) : targetSelector;
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ----- Modal handling -----

async function openFeesModal(universityKey) {
  const modal = qs("#fees-modal");
  if (!modal) return;

  modal.dataset.university = universityKey;
  modal.classList.add("modal--open");
  modal.setAttribute("aria-hidden", "false");

  const contentEl = qs("[data-role='fees-content']", modal);
  if (!contentEl) return;

  contentEl.innerHTML = "<p class='modal__hint'>Loading live fee ranges…</p>";

  try {
    const feesData = await loadFeesJson();
    const universityFees = feesData[universityKey];

    if (!universityFees) {
      contentEl.innerHTML =
        "<p class='modal__hint'>No fee details found for this university. Please try again later.</p>";
      return;
    }

    contentEl.innerHTML = renderFeesTable(universityFees);
  } catch (error) {
    console.error("Failed to load fees", error);
    contentEl.innerHTML =
      "<p class='modal__hint'>We couldn't load the fee structure right now. Please try again in a bit.</p>";
  }
}

function closeModal(modal) {
  modal.classList.remove("modal--open");
  modal.setAttribute("aria-hidden", "true");
}

async function loadFeesJson() {
  if (cachedFees) return cachedFees;
  const res = await fetch(FEES_JSON_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Unable to fetch fees.json");
  }
  cachedFees = await res.json();
  return cachedFees;
}

function renderFeesTable(universityFees) {
  const { label, currency, programs } = universityFees;
  const symbol = currency === "INR" ? "₹" : "";

  const rows = programs
    .map((p) => {
      const scholarships = p.scholarships?.length
        ? `<div class="fees-table__scholarships">Scholarships: ${p.scholarships.join(", ")}</div>`
        : "";
      return `
        <tr>
          <td>
            <div>${p.name}</div>
            <div class="fees-table__scholarships">Duration: ${p.duration}</div>
          </td>
          <td>${symbol}${p.annualRange}</td>
          <td>${symbol}${p.totalRange}</td>
          <td>${scholarships}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <p class="modal__hint">${label} · ${currency}</p>
    <table class="fees-table">
      <thead>
        <tr>
          <th>Program</th>
          <th>Annual Fees</th>
          <th>Total Program Fees</th>
          <th>Scholarships</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// ----- Lead form handling (Pipedream integration) -----

function wireLeadForms() {
  const forms = qsa(".lead-form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const university = form.dataset.university || "unknown";
      const messageEl = qs("[data-role='form-message']", form);
      clearFormErrors(form, messageEl);

      const payload = getLeadFormPayload(form, university);
      const validationError = validatePayload(payload);

      if (validationError) {
        if (messageEl) {
          messageEl.textContent = validationError;
          messageEl.classList.add("form-message--error");
        }
        return;
      }

      const submitBtn = qs("button[type='submit']", form);
      const originalText = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting…";
      }

      try {
        const res = await fetch(PIPEDREAM_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error("Request failed");
        }

        if (messageEl) {
          messageEl.textContent = "Thanks! Your details have been shared successfully.";
          messageEl.classList.add("form-message--success");
        }

        form.reset();
      } catch (err) {
        console.error("Lead form error", err);
        if (messageEl) {
          messageEl.textContent = "We couldn't submit your details. Please try again in a moment.";
          messageEl.classList.add("form-message--error");
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  });
}

function getLeadFormPayload(form, university) {
  const formData = new FormData(form);
  const now = new Date().toISOString();

  return {
    source: "campus-orbit-landing",
    university,
    submittedAt: now,
    lead: {
      fullName: formData.get("fullName")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      state: formData.get("state")?.toString().trim(),
      course: formData.get("course")?.toString().trim(),
      intake: formData.get("intake")?.toString().trim(),
      consent: formData.get("consent") === "on",
    },
    meta: {
      userAgent: navigator.userAgent,
      pageUrl: window.location.href,
    },
  };
}

function validatePayload(payload) {
  const { lead } = payload;

  if (!lead.fullName || lead.fullName.length < 3) {
    return "Please enter your full name.";
  }

  if (!lead.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return "Please enter a valid email address.";
  }

  if (!lead.phone || !/^\d{10}$/.test(lead.phone)) {
    return "Please enter a valid 10-digit Indian mobile number.";
  }

  if (!lead.state) {
    return "Please mention your state.";
  }

  if (!lead.course) {
    return "Please choose a course/program of interest.";
  }

  if (!lead.intake) {
    return "Please select an intake year.";
  }

  if (!lead.consent) {
    return "Please provide consent so we can contact you about your application.";
  }

  return null;
}

function clearFormErrors(form, messageEl) {
  qsa(".field", form).forEach((field) => field.classList.remove("field--error"));
  if (messageEl) {
    messageEl.textContent = "";
    messageEl.classList.remove("form-message--success", "form-message--error");
  }
}

// ----- Misc UI wiring -----

function wireModalsAndCTAs() {
  // Open modal buttons
  qsa(".js-open-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const university = btn.dataset.university;
      if (!university) return;
      openFeesModal(university);
    });
  });

  // Close modal elements (backdrop + close icon)
  qsa("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", () => {
      const modal = el.closest(".modal");
      if (modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      qsa(".modal.modal--open").forEach((modal) => closeModal(modal));
    }
  });

  // Smooth scroll CTAs
  qsa(".js-scroll-to").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      if (target) smoothScrollTo(target);
    });
  });

  // Fake brochure downloads using dynamic JSON
  qsa(".js-download-brochure").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const university = btn.dataset.university;
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Preparing brochure…";

      try {
        const data = await loadFeesJson();
        const uni = data[university];
        const blob = new Blob([JSON.stringify(uni, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${university}-brochure.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error("Brochure download failed", e);
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  });
}

// Boot

document.addEventListener("DOMContentLoaded", () => {
  wireLeadForms();
  wireModalsAndCTAs();
});
