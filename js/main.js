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

  function showPage(pageId) {
    pages.forEach(p => {
      p.classList.remove('active');
      p.setAttribute('aria-hidden', 'true');
    });
    navLinks.forEach(l => l.classList.remove('active'));

    const target = $(`#page-${pageId}`);
    if (!target) return;
    target.classList.add('active');
    target.removeAttribute('aria-hidden');

    navLinks.filter(l => l.dataset.page === pageId)
            .forEach(l => l.classList.add('active'));

    window.scrollTo({ top: 0 });

    // Re-init scroll reveals for new page
    setTimeout(initReveal, 50);

    // Update URL hash for back/forward
    history.pushState({ page: pageId }, '', `#${pageId}`);
    document.title = pageTitles[pageId] || 'Treats By Me';

    // Close mobile nav
    closeMobileNav();
  }

  const pageTitles = {
    home:    'Treats By Me — Custom Cakes Sydney',
    gallery: 'Gallery — Treats By Me',
    order:   'Order a Custom Cake — Treats By Me',
    about:   'About — Treats By Me',
    contact: 'Contact — Treats By Me',
  };

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  // Handle back/forward
  window.addEventListener('popstate', e => {
    const page = (e.state && e.state.page) || 'home';
    showPage(page);
  });

  // Load from hash on init
  const initPage = window.location.hash.slice(1) || 'home';
  showPage(initPage);

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
  const hamburger = $('.nav__hamburger');
  const mobileMenu = $('.nav__mobile');

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
      $$('.gal-item').forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
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

  /* ── Web3Forms Enquiry Form ──────────────── */
  const enquiryForm = $('#enquiry-form');
  const formSuccess = $('#form-success');
  const submitBtn   = $('#form-submit-btn');

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Button loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 0.8s linear infinite">
          <path d="M21 12a9 9 0 11-18 0"/>
        </svg>
        Sending…
      `;

      const formData = new FormData(enquiryForm);

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        if (data.success) {
          enquiryForm.style.display = 'none';
          formSuccess.style.display = 'block';
        } else {
          throw new Error(data.message || 'Submission failed');
        }
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
