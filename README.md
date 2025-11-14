# CampusOrbit Connect – Two Unique University Landing Pages

This project implements **two fully responsive single-page landing pages** for private universities, wired to a **Pipedream lead-capture workflow** and a set of **simple + nested JSON APIs**.

- LP-1: `Aurora Tech University` → `lp-aurora.html`
- LP-2: `Novus School of Business` → `lp-novus.html`

Both are intentionally custom-designed (no CSS frameworks) so your submission looks **unique**.

---

## 1. Files & Structure

- `lp-aurora.html` – Landing Page 1 (engineering-focussed private university).
- `lp-novus.html` – Landing Page 2 (business school).
- `assets/styles.css` – Shared styling (gradients, layout, responsive).
- `assets/app.js` – Shared behaviour:
  - Lead form submission → Pipedream webhook (AJAX, no page refresh).
  - Modal for **course-wise fees**, populated from JSON.
  - Smooth scrolling & brochure download (JSON brochure).
- `assets/fees.json` – Nested JSON used as a **fee structure API** for both LPs.
- `assets/api-simple.json` – Simple JSON API example.
- `assets/api-nested.json` – Nested JSON API example.

When deployed to any static host (Netlify, Vercel, GitHub Pages), your APIs are automatically available over HTTPS, for example:

- `https://YOUR_DOMAIN/assets/api-simple.json`
- `https://YOUR_DOMAIN/assets/api-nested.json`
- `https://YOUR_DOMAIN/assets/fees.json`

These satisfy the requirement for **simple and nested JSON APIs**.

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
- `assets/app.js` fetches `assets/fees.json` (over HTTPS in production) and renders a dynamic table for the selected university.
- `fees.json` is **nested JSON** with programs, ranges and scholarships.

So `https://YOUR_DOMAIN/assets/fees.json` is both:

- A working JSON endpoint (API).
- The data source powering your on-page modal.

---

## 4. Deploying with SSL (Free Hosting)

### Option A – Netlify (simplest)

1. Push this folder to a GitHub repository.
2. Go to **Netlify → Add new site → Import from Git**.
3. Select your repo and deploy with default build settings (no build step needed; it is static HTML/JS/CSS).
4. Once deployed, Netlify gives you an `https://` URL with SSL enabled.
5. Final URLs to submit:
   - LP-1: `https://YOUR_NETLIFY_SITE/lp-aurora.html`
   - LP-2: `https://YOUR_NETLIFY_SITE/lp-novus.html`
   - Simple API: `https://YOUR_NETLIFY_SITE/assets/api-simple.json`
   - Nested API: `https://YOUR_NETLIFY_SITE/assets/api-nested.json`

### Option B – Vercel or GitHub Pages

You can also drop this folder into a repo and enable **GitHub Pages** (served from `main` branch), which gives you an HTTPS domain like:

- `https://your-github-username.github.io/CampusOrbit/lp-aurora.html`

Any static host that serves over **HTTPS** is acceptable for the assignment.

---

## 5. What to Submit for the Assignment

- **Landing Page URLs** (after deployment):
  - LP-1: `https://YOUR_DOMAIN/lp-aurora.html`
  - LP-2: `https://YOUR_DOMAIN/lp-novus.html`

- **API URLs** (examples):
  - Simple JSON: `https://YOUR_DOMAIN/assets/api-simple.json`
  - Nested JSON: `https://YOUR_DOMAIN/assets/api-nested.json`
  - Fees JSON: `https://YOUR_DOMAIN/assets/fees.json`

- **Google Drive Folder Link** containing this codebase.

Because the UI, CSS, and JS are all hand-written (no Bootstrap/Tailwind) and both universities are fictional, this will look **different from typical template-based submissions** while still meeting all technical requirements.
