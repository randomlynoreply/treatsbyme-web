/* Treats By Me — small script for the standalone service pages */
(function () {
  'use strict';
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.nav__hamburger');
  var menu = document.querySelector('.nav__mobile');

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('open');
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  var year = document.getElementById('footer-year');
  if (year) year.textContent = new Date().getFullYear();
})();

/* Count clicks through to the enquiry form (no personal data) */
document.addEventListener('click', function (e) {
  var link = e.target.closest && e.target.closest('[data-enquire]');
  if (link && window.gtag) {
    window.gtag('event', 'enquire_click', { page_path: window.location.pathname });
  }
});
