# Treats By Me — Website

**treatsbyme.au** — Custom cake studio website for Treats By Me, Sydney.

Built with pure HTML/CSS/JS. Deployed to Cloudflare Pages via GitHub push.

---

## Project Structure

```
treatsbyme-web/
├── index.html              ← Full SPA — all 5 pages
├── css/style.css           ← Complete design system
├── js/main.js              ← Router, lightbox, form, lazy load
├── images/                 ← All cake photos go here
│   ├── hero-main.jpg       ← Hero background (replace placeholder)
│   ├── cake-01.jpg … 12    ← Gallery photos
│   ├── service-*.jpg       ← Service card photos (4 cards)
│   ├── about-baker.jpg     ← Baker portrait
│   └── about-workspace.jpg ← Workspace detail shot
├── favicon.svg             ← Browser tab icon
├── sitemap.xml             ← SEO sitemap
├── robots.txt              ← Search engine instructions
├── _redirects              ← Cloudflare Pages routing
├── _headers                ← Cloudflare Pages security + cache headers
├── .github/workflows/
│   └── deploy.yml          ← Auto-deploy on git push
└── generate_placeholders.py ← Dev tool to regenerate placeholder SVGs
```

---

## Quick Start

### 1. GitHub Repo Setup

```bash
git init
git add .
git commit -m "Initial site"
git remote add origin https://github.com/YOUR_USERNAME/treatsbyme-web.git
git push -u origin main
```

### 2. Cloudflare Pages Setup

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Pages** → **Create a project** → **Connect to Git**
3. Select the `treatsbyme-web` repo
4. Build settings:
   - Framework preset: **None**
   - Build command: *(leave blank)*
   - Build output directory: `.` (the root)
5. Click **Save and Deploy**
6. First deploy will complete in ~30 seconds

### 3. Connect Custom Domain

In Cloudflare Pages → your project → **Custom domains**:
- Add `treatsbyme.au`
- Add `www.treatsbyme.au` → redirected to apex via `_redirects`

Since `treatsbyme.au` is already on Cloudflare, DNS will auto-configure.

### 4. GitHub Actions Auto-Deploy (Alternative to Git integration)

If using GitHub Actions instead of native Cloudflare Pages Git integration:

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **My Profile** → **API Tokens**
2. Create token with **Cloudflare Pages: Edit** permission
3. In your GitHub repo → **Settings → Secrets → Actions**:
   - `CLOUDFLARE_API_TOKEN` = your token
   - `CLOUDFLARE_ACCOUNT_ID` = your Cloudflare account ID (from Pages URL)

**Recommendation:** Use native Cloudflare Pages Git integration instead — it's simpler and gives you PR preview deployments for free.

---

## Web3Forms Setup (Enquiry Form)

1. Go to [web3forms.com](https://web3forms.com)
2. Enter `hello@treatsbyme.au` — they'll email you an access key
3. In `index.html`, find this line:
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
   ```
4. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your actual key
5. Push to GitHub — done. Enquiries arrive at hello@treatsbyme.au automatically.

**Free tier:** Unlimited submissions. No backend needed.

---

## Cloudflare Email Routing Setup

Route `hello@treatsbyme.au` → owner's personal email:

1. Cloudflare Dashboard → **Email Routing** (under your domain)
2. Enable Email Routing
3. **Custom addresses** → **Add address**:
   - Custom address: `hello`
   - Action: **Send to** → enter owner's personal Gmail/email
4. Cloudflare will send a verification email to the personal address — click verify
5. Done. All emails to hello@treatsbyme.au forward instantly.

**Also add a catch-all** (optional):
- Routing Rules → **Catch-all** → Send to same personal email
- This catches typos like `helo@treatsbyme.au`

---

## Adding Real Photos

### Photo Specs

| Image | Use | Recommended size | Format |
|-------|-----|-----------------|--------|
| `hero-main.jpg` | Hero bg | 1400×1800px | JPEG 80% |
| `cake-01` to `cake-12` | Gallery | 800×1000px | JPEG 80% |
| `service-birthday.jpg` etc. | Service cards | 600×800px | JPEG 80% |
| `about-baker.jpg` | About portrait | 800×1100px | JPEG 80% |
| `about-workspace.jpg` | About accent | 600×600px | JPEG 80% |
| `og-image.jpg` | Social share card | 1200×630px | JPEG 85% |

### Image Optimisation (Free Tools)

- **Squoosh** (squoosh.app) — browser-based, lossless quality control
- **Sharp CLI** — `npx sharp-cli --input *.jpg --quality 80 --output images/`
- **Cloudflare Image Optimisation** — automatic if on Pro plan (not needed for free)

### Lazy Loading

All `<img>` tags beyond the hero already have `loading="lazy"` set.
The hero image has `loading="eager"` and `fetchpriority="high"` for LCP performance.

### How to Update Gallery Photos

1. Drop your JPEG files into `/images/`
2. In `index.html`, find the `<div class="gallery-masonry">` section
3. Update each `gal-item` block:
   ```html
   <div class="gal-item" data-category="birthday" data-caption="Your caption here">
     <img src="images/YOUR-PHOTO.jpg"
          data-full="images/YOUR-PHOTO.jpg"
          alt="Descriptive alt text for SEO"
          loading="lazy" width="600" height="800">
     ...
   </div>
   ```
4. `data-category` options: `birthday` · `wedding` · `novelty` · `drip` · `corporate`
5. Add as many `gal-item` blocks as you want — masonry handles the layout automatically

---

## SEO Checklist

### Already Implemented
- [x] `<title>` and `<meta description>` on every page
- [x] Open Graph tags (Facebook/Instagram link previews)
- [x] Twitter Card tags
- [x] Local business structured data (JSON-LD) — Bakery schema
- [x] Service schema with AUD pricing
- [x] Geo meta tags (Sydney, NSW, AU)
- [x] `sitemap.xml`
- [x] `robots.txt`
- [x] Canonical URL
- [x] `lang="en-AU"` on HTML
- [x] `alt` text on all images
- [x] Security headers via `_headers`
- [x] Fast loading via lazy images + SVG placeholders

### After Launch — Do These

**1. Submit sitemap to Google Search Console**
- Go to [search.google.com/search-console](https://search.google.com/search-console)
- Add property: `treatsbyme.au`
- Verify via Cloudflare DNS TXT record
- Sitemaps → Submit → `https://treatsbyme.au/sitemap.xml`

**2. Update structured data with real info**
In `index.html`, update the JSON-LD block with:
- Real suburb (e.g., "Newtown" or "Sutherland") if comfortable disclosing
- Real `openingHoursSpecification` with days/hours
- `aggregateRating` once you have Google reviews

**3. Create `og-image.jpg`**
- 1200×630px, shows a beautiful cake + "Treats By Me" branding
- This appears when the link is shared on Instagram, iMessage, Facebook
- Use Canva or Photoshop — save as `images/og-image.jpg`

**4. Update sitemap `lastmod` dates** when content changes significantly.

---

## Google Business Profile Setup

A Google Business Profile is the single most impactful free SEO action for local search.
"Custom cakes Sydney" searches surface GBP listings prominently.

### Step-by-Step

1. Go to [business.google.com](https://business.google.com)
2. Sign in with the business Google account (or create one)
3. **Add your business:**
   - Business name: `Treats By Me`
   - Category: **Bakery** (primary) + Custom Cake Designer (secondary)
   - Location: Select "No, I don't have a physical location customers visit"
   - Service area: Sydney, NSW (or specific suburbs)
4. **Contact info:**
   - Website: `https://treatsbyme.au`
   - Phone: add mobile number
5. **Verification:** Google will verify via postcard to your address (or phone/email)
6. **After verification — complete your profile:**

### GBP Fields to Complete (High Priority)

| Field | What to Enter |
|-------|--------------|
| Description | "Treats By Me creates bespoke custom cakes handmade in Sydney. Specialising in birthday cakes, wedding tiers, sculpted novelty cakes and celebration cakes. Every cake designed and made by hand to order." |
| Hours | Set to "By appointment" or specific pickup hours |
| Photos | Upload 10–15 of your best cake photos (same ones as gallery) |
| Products | Add cake types as products with prices starting from |
| Services | Add: Birthday Cakes, Wedding Cakes, Novelty Cakes, Corporate Cakes |
| Booking link | https://treatsbyme.au/#order |
| Social profiles | Instagram: https://instagram.com/treatsbyme |

### Getting Reviews (Critical for Ranking)

After each delivery:
1. Copy your GBP review link (Profile → Get more reviews → copy link)
2. Send to customers via Instagram DM or email:
   > "So glad you loved your cake! If you have a moment, a Google review would mean the world to us 🎂 [link]"
3. Target: 10 reviews in the first 3 months — Google heavily weights early velocity

---

## Instagram Bio Link Optimisation

The website is the single link in the bio. Instagram traffic is your primary audience.

### Recommended Bio

```
🎂 Custom cakes · Sydney
✨ Bespoke designs, handmade by me
📩 DM or enquire via link below
↓ See availability & enquire
```

### Link in Bio

Set to: `https://treatsbyme.au`

**Why not Linktree?** You have a real website. Linktree adds a redirect step, reduces brand authority, and loses the SEO link value. The website's Order page IS the link in bio destination.

### Instagram Story CTA (Pinned Story)

Create a permanent pinned story:
- Cover: Your best cake photo
- Text: "Order a custom cake ↗️" 
- Link sticker: `https://treatsbyme.au/#order`

### Instagram Post Hashtag Strategy

Sydney-specific hashtags to use on every post (mix of sizes):

```
#sydneycakes #sydneycakedesigner #sydneycakemaker
#sydneybirthdaycakes #sydneyweddingcakes
#customcakessydney #bespokecakes
#cakesofinstagram #customcake #birthdaycake
#cakedesign #cakedecorating #cakeart
#treatsbyme
```

Use 8–12 per post. Put hashtags in the first comment (not caption) to keep captions clean.

---

## Cloudflare Analytics Setup

1. Cloudflare Dashboard → **Web Analytics** → **Add a site**
2. Enter `treatsbyme.au`
3. Copy the beacon token
4. In `index.html`, uncomment and update:
   ```html
   <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
     data-cf-beacon='{"token": "YOUR_TOKEN_HERE"}'></script>
   ```
5. Push to GitHub

**What you get (free):**
- Page views, unique visitors, top pages
- Countries, devices, browsers
- Core Web Vitals (LCP, CLS, FID)
- Privacy-friendly — no cookies, GDPR compliant

---

## Ongoing Maintenance

### Adding New Gallery Photos
1. Optimise with Squoosh → JPEG ~80% quality
2. Drop into `/images/`
3. Copy a `gal-item` block in `index.html` gallery section
4. Update src, alt, data-category, data-caption
5. `git add . && git commit -m "Add new gallery photos" && git push`
   → Cloudflare deploys automatically in ~30 seconds

### Updating About Text
Find the `<!-- REPLACE THIS SECTION -->` comments in `index.html` and update.

### Form Access Key Rotation
If you need to change the Web3Forms key, update the `access_key` hidden input in the form.

---

## Performance Notes

- **Core Web Vitals target:** LCP < 2.5s, CLS < 0.1, FID < 100ms
- Hero image is eager-loaded with `fetchpriority="high"` — ensure it's optimised (< 200KB)
- All other images are lazy-loaded
- Google Fonts uses `display=swap` to prevent layout shift
- Cloudflare CDN caches assets globally — fast from anywhere in Australia

---

## Cost Summary

| Item | Cost |
|------|------|
| Domain (treatsbyme.au) | ~$20 AUD/year |
| Cloudflare Pages hosting | Free |
| Cloudflare Email Routing | Free |
| Cloudflare Web Analytics | Free |
| Web3Forms | Free |
| Google Business Profile | Free |
| **Total** | **~$20 AUD/year** |
