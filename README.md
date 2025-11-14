# CampusOrbit Connect – Two Unique University Landing Pages

This project implements **two fully responsive single-page landing pages** for private universities, wired to a **Pipedream lead-capture workflow** and a set of **simple + nested JSON APIs**.

- LP-1: `Aurora Tech University` → Django route `/` (root URL)
- LP-2: `Novus School of Business` → Django route `/lp-novus/`

Both are intentionally custom-designed (no CSS frameworks) so your submission looks **unique**.

---

## 1. Files & Structure

- `landing/templates/landing/lp_aurora.html` – Landing Page 1 (engineering-focussed private university, Django template).
- `landing/templates/landing/lp_novus.html` – Landing Page 2 (business school, Django template).
- `assets/styles.css` – Shared styling (gradients, layout, responsive).
- `assets/app.js` – Shared behaviour:
  - Lead form submission → Pipedream webhook (AJAX, no page refresh).
  - Modal for **course-wise fees**, populated from JSON.
  - Smooth scrolling & brochure download (JSON brochure).
- `assets/fees.json` – Nested JSON used as a **fee structure API** for both LPs.
- `assets/api-simple.json` – Simple JSON API example.
- `assets/api-nested.json` – Nested JSON API example.

When deployed to a Django-compatible host (e.g. Render) with static files served at `/static/`, your JSON "APIs" are available over HTTPS, for example:

- `https://YOUR_DOMAIN/static/api-simple.json`
- `https://YOUR_DOMAIN/static/api-nested.json`
- `https://YOUR_DOMAIN/static/fees.json`

In addition, Django exposes JSON endpoints under `/api/`:

- `https://YOUR_DOMAIN/api/universities/` – simple JSON list of universities.
- `https://YOUR_DOMAIN/api/universities/<slug>/` – nested JSON for a single university.
- `https://YOUR_DOMAIN/api/fees/` – nested JSON fee structure loaded from `fees.json`.

Together these satisfy the requirement for **simple and nested JSON APIs**.

---

## 2. Wiring the Pipedream Lead Form Workflow

1. Go to **Pipedream** → create a new **HTTP / Webhook** workflow.
2. In the first step, choose **Trigger → HTTP / Webhook**.
3. Copy the **unique HTTPS URL** Pipedream gives you (it ends with `.m.pipedream.net`).
4. Replace the placeholder URL in `assets/app.js`:

   ```js
   const PIPEDREAM_WEBHOOK_URL = "https://your-pipedream-id.m.pipedream.net"; // TODO: replace
   ```

5. In Pipedream, add a code step if you want to inspect/log leads, e.g. (Node.js):

   ```js
   export default defineComponent({
     async run({ steps, $ }) {
       const { source, university, lead, submittedAt, meta } = steps.trigger.event;
       $.export("lead", { source, university, lead, submittedAt, meta });
     },
   });
   ```

6. Deploy the workflow. Now every time you submit the form on either LP, the payload will be posted to Pipedream with **no page refresh**, and a success/error message is shown inline.

Payload example (what Pipedream receives):

```json
{
  "source": "campus-orbit-landing",
  "university": "aurora-tech",
  "submittedAt": "2025-01-01T10:00:00.000Z",
  "lead": {
    "fullName": "Riya Sharma",
    "email": "riya@example.com",
    "phone": "9876543210",
    "state": "Karnataka",
    "course": "btech-cse",
    "intake": "2025",
    "consent": true
  },
  "meta": {
    "userAgent": "…",
    "pageUrl": "https://YOUR_DOMAIN/lp-aurora.html"
  }
}
```

This satisfies the **Pipedream workflow integration** requirement.

---

## 3. How the Fee Modal Uses JSON / API

- The CTA **“Check Course-wise Fees” / “View Detailed Fee Bands”** opens a modal.
- `assets/app.js` fetches `/static/fees.json` (over HTTPS in production) and renders a dynamic table for the selected university.
- `fees.json` is **nested JSON** with programs, ranges and scholarships.

So `https://YOUR_DOMAIN/static/fees.json` is both:

- A working JSON endpoint (API).
- The data source powering your on-page modal.

---

## 4. Deploying with SSL (Free Hosting)

This project is built as a small Django app and can be deployed to any free Django-friendly host that provides HTTPS (for example, **Render**).

Typical high-level steps:

1. Push this project to a GitHub repository.
2. Create a new web service on your hosting provider (e.g. Render) connected to that repo.
3. Use the provided `requirements.txt` to install dependencies.
4. Set the start command to run Django via `gunicorn` (or the platform’s recommended command), e.g. `gunicorn campusorbit.wsgi`.
5. Ensure `DEBUG` is disabled in production and static files are collected/served.

Once deployed, the host gives you an `https://` URL with SSL enabled, such as:

- `https://YOUR_DOMAIN/`

The exact provider (Render, Railway, etc.) does not matter as long as it serves your Django app over **HTTPS**.

---

## 5. What to Submit for the Assignment

- **Landing Page URLs** (after deployment):
  - LP-1: `https://YOUR_DOMAIN/`
  - LP-2: `https://YOUR_DOMAIN/lp-novus/`

- **API URLs** (examples):
  - Simple JSON: `https://YOUR_DOMAIN/api/universities/` or `https://YOUR_DOMAIN/static/api-simple.json`
  - Nested JSON: `https://YOUR_DOMAIN/api/universities/skyline-university/` or `https://YOUR_DOMAIN/static/api-nested.json`
  - Fees JSON: `https://YOUR_DOMAIN/api/fees/` or `https://YOUR_DOMAIN/static/fees.json`

- **Google Drive Folder Link** containing this codebase.

Because the UI, CSS, and JS are all hand-written (no Bootstrap/Tailwind) and both universities are fictional, this will look **different from typical template-based submissions** while still meeting all technical requirements.
