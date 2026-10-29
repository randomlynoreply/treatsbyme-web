/* ============================================
   TREATS BY ME — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ── Utility ─────────────────────────────── */
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  /* ── SPA Router ──────────────────────────── */
  const pages = $$('.page');
  const navLinks = $$('[data-page]');
  const hamburger = $('.nav__hamburger');
  const mobileMenu = $('.nav__mobile');

  /* -- Enquiry source (UTM tags, else referrer, else direct) -- */
  const visitSource = $('#visit-source');
  if (visitSource) {
    const q = new URLSearchParams(window.location.search);
    let source = ['utm_source', 'utm_medium', 'utm_campaign'].map(k => q.get(k)).filter(Boolean).join(' / ');
    if (!source && document.referrer) {
      try { source = new URL(document.referrer).hostname; } catch (e) { /* ignore */ }
    }
    visitSource.value = source || 'direct';
  }

  // Sections on the home page that the ribbon scrolls to. "about" is kept so old links still work.
  const homeAnchors = {
    'creations': 'creations',
    'how-it-works': 'how-it-works',
    'our-story': 'our-story',
    'about': 'our-story',
  };

  function showPage(pageId, anchorId) {
    if (homeAnchors[pageId]) {
      anchorId = homeAnchors[pageId];
      pageId = 'home';
    }
    pages.forEach(p => {
      p.classList.remove('active');
      p.setAttribute('aria-hidden', 'true');
    });
    navLinks.forEach(l => l.classList.remove('active'));

    const target = $(`#page-${pageId}`);
    if (!target) return;
    target.classList.add('active');
    document.body.dataset.page = pageId;
    target.removeAttribute('aria-hidden');

    navLinks.filter(l => l.dataset.page === pageId)
            .forEach(l => l.classList.add('active'));

    window.scrollTo({ top: 0 });

    // Re-init scroll reveals for new page
    setTimeout(initReveal, 50);

    // Scroll to a section of the home page, if one was asked for
    const anchorEl = anchorId && $(`#${anchorId}`);
    if (anchorEl) {
      setTimeout(() => anchorEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }

    // Update URL hash for back/forward
    history.pushState({ page: pageId, anchor: anchorId || null }, '', `#${anchorId || pageId}`);
    document.title = pageTitles[pageId] || 'Treats By Me';

    // Close mobile nav
    closeMobileNav();
  }

  const pageTitles = {
    home:    'Custom Cakes Sydney | Treats By Me',
    gallery: 'Gallery — Treats By Me',
    order:   'Make an Enquiry — Treats By Me',
    contact: 'Contact — Treats By Me',
  };

  // Section links on the home page (data-anchor) share the router with page links (data-page)
  $$('[data-anchor]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showPage('home', link.dataset.anchor);
    });
  });

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showPage(link.dataset.page);

      // Category pills open the gallery on the matching filter
      if (link.dataset.filter) {
        const btn = $$('.filter-btn').find(b => b.dataset.filter === link.dataset.filter);
        if (btn) btn.click();
      }
    });
  });

  // Handle back/forward
  window.addEventListener('popstate', e => {
    const page = (e.state && e.state.page) || 'home';
    showPage(page, e.state && e.state.anchor);
  });

  // Load from hash on init
  const initPage = window.location.hash.slice(1) || 'home';
  showPage($(`#page-${initPage}`) || homeAnchors[initPage] ? initPage : 'home');

  /* ── Sticky Nav ──────────────────────────── */
  const nav = $('.nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = y;
  }, { passive: true });

  /* ── Mobile Nav ──────────────────────────── */
  function closeMobileNav() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* ── Scroll Reveal ───────────────────────── */
  function initReveal() {
    const activePage = $('.page.active');
    if (!activePage) return;

    const items = $$('.reveal', activePage);
    if (!items.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach(el => observer.observe(el));
  }

  /* ── Gallery Filter ──────────────────────── */
  const filterBtns = $$('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      // Event filters match one category; "cakes" groups the remaining cake styles
      const eventCats = ['kids-party', 'baby-shower', 'wedding', 'corporate'];
      $$('.gal-item').forEach(item => {
        const itemCat = item.dataset.category;
        const show = cat === 'all' ||
          (cat === 'cakes' ? !eventCats.includes(itemCat) : itemCat === cat);
        if (show) {
          item.style.display = '';
          // Animate in
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ── Lightbox ────────────────────────────── */
  const lightbox     = $('#lightbox');
  const lbImg        = $('#lightbox-img');
  const lbCaption    = $('#lightbox-caption');
  const lbClose      = $('#lightbox-close');
  const lbPrev       = $('#lightbox-prev');
  const lbNext       = $('#lightbox-next');

  let galleryImages  = [];
  let currentLbIdx   = 0;

  function openLightbox(idx) {
    currentLbIdx = idx;
    const item = galleryImages[idx];
    if (!item) return;

    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCaption.textContent = item.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Clear src after transition
    setTimeout(() => { lbImg.src = ''; }, 400);
  }

  function lbNavigate(dir) {
    currentLbIdx = (currentLbIdx + dir + galleryImages.length) % galleryImages.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      openLightbox(currentLbIdx);
      lbImg.style.opacity = '1';
    }, 150);
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => lbNavigate(-1));
  lbNext.addEventListener('click', () => lbNavigate(1));

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbNavigate(-1);
    if (e.key === 'ArrowRight') lbNavigate(1);
  });

  // Register gallery images from DOM
  function registerGalleryImages() {
    galleryImages = [];
    $$('.gal-item').forEach((item, idx) => {
      const img = item.querySelector('img');
      if (!img) return;

      galleryImages.push({
        src: img.dataset.full || img.src,
        alt: img.alt,
        caption: item.dataset.caption || img.alt,
      });

      item.addEventListener('click', () => openLightbox(idx));
    });
  }

  // Re-register when gallery page shown
  document.addEventListener('click', e => {
    const link = e.target.closest('[data-page="gallery"]');
    if (link) setTimeout(registerGalleryImages, 100);
  });

  setTimeout(registerGalleryImages, 200);

  /* ── Enquiry Form ────────────────────────── */
  // Primary: our Worker emails the enquiry to hello@ and sends the customer a
  // thank-you. Fallback: Web3Forms, so an enquiry is never lost if the Worker is down.
  const FORM_ENDPOINT = 'https://treatsbyme-forms.garth-law.workers.dev/';
  const FALLBACK_ENDPOINT = 'https://api.web3forms.com/submit';

  async function sendEnquiry(formData) {
    let res = null;
    let data = null;
    try {
      res = await fetch(FORM_ENDPOINT, { method: 'POST', body: formData });
      data = await res.json();
    } catch (e) { /* network or parse failure: fall through to the fallback */ }

    if (data && data.success) return;
    // A 4xx means the form content was rejected, so retrying elsewhere won't help
    if (res && res.status < 500 && data) throw new Error(data.message || 'Submission failed');

    const fallbackRes = await fetch(FALLBACK_ENDPOINT, { method: 'POST', body: formData });
    const fallbackData = await fallbackRes.json();
    if (!fallbackData.success) throw new Error(fallbackData.message || 'Submission failed');
  }

  const enquiryForm = $('#enquiry-form');
  const formSuccess = $('#form-success');
  const submitBtn   = $('#form-submit-btn');

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Either an email or a mobile number is needed so we can reply
      const emailField = $('#email');
      const phoneField = $('#phone');
      const noContact = !emailField.value.trim() && !phoneField.value.trim();
      emailField.setCustomValidity(noContact ? 'Please add an email or a mobile number so we can reply.' : '');

      // The form has novalidate, so check required fields here
      if (!enquiryForm.reportValidity()) return;

      // Button loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 0.8s linear infinite">
          <path d="M21 12a9 9 0 11-18 0"/>
        </svg>
        Sending…
      `;

      const formData = new FormData(enquiryForm);

      // What they're enquiring about travels at the top of the design notes, so the
      // existing email workflow carries it without a new field
      const about = $('#enquiry-about');
      if (about && about.value) {
        const notes = (formData.get('design_description') || '').toString().trim();
        formData.set('design_description', `Enquiring about: ${about.value}` + (notes ? `\n\n${notes}` : ''));
      }

      try {
        await sendEnquiry(formData);
        enquiryForm.style.display = 'none';
        formSuccess.style.display = 'block';
      } catch (err) {
        console.error(err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Try Again';
        alert('Something went wrong. Please email us at hello@treatsbyme.au');
      }
    });
  }

  /* ── Smooth image lazy loading ───────────── */
  function initLazyImages() {
    const imgs = $$('img[data-src]');
    if (!imgs.length) return;

    const imgObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.addEventListener('load', () => img.classList.add('loaded'));
            imgObserver.unobserve(img);
          }
        });
      },
      { rootMargin: '300px 0px' }
    );

    imgs.forEach(img => imgObserver.observe(img));
  }

  // Re-init lazy loading when pages change
  document.addEventListener('click', () => setTimeout(initLazyImages, 100));
  initLazyImages();

  // Spin keyframe injected
  const style = document.createElement('style');
  style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);

})();
