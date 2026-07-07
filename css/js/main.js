/* ============================================================
   SOMTO.DEV — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Active Nav Link ─────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  /* ── Hamburger Menu ──────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('overlay');

  if (hamburger && sidebar && overlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      hamburger.classList.remove('open');
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });

    sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    });
  }

  /* ── Scroll Fade-in ──────────────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => observer.observe(el));

  /* ── Back to Top ─────────────────────────────────────────── */
  const backTop = document.getElementById('back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    });

    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Contact Form Validation ─────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = [
        { id: 'name',    msg: 'Please enter your name.' },
        { id: 'email',   msg: 'Please enter a valid email.', isEmail: true },
        { id: 'subject', msg: 'Please enter a subject.' },
        { id: 'message', msg: 'Please write a message (min 20 characters).', minLen: 20 },
      ];

      fields.forEach(({ id, msg, isEmail, minLen }) => {
        const group = document.getElementById(id).closest('.form-group');
        const val   = document.getElementById(id).value.trim();
        let ok = val.length > 0;

        if (isEmail) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (minLen)   ok = val.length >= minLen;

        group.classList.toggle('has-error', !ok);
        group.querySelector('.error-msg').textContent = msg;
        if (!ok) valid = false;
      });

      if (valid) {
        form.style.display = 'none';
        document.getElementById('form-success').classList.add('show');
      }
    });

    // Clear error on input
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('has-error');
      });
    });
  }

  /* ── Lightbox ────────────────────────────────────────────── */
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightbox-img');
  const lbCaption  = document.getElementById('lightbox-caption');
  const lbClose    = document.getElementById('lightbox-close');
  const lbPrev     = document.getElementById('lightbox-prev');
  const lbNext     = document.getElementById('lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (lightbox && galleryItems.length) {
    let current = 0;

    function openLightbox(index) {
      current = index;
      const item = galleryItems[index];
      lbImg.src = item.dataset.full || item.querySelector('img').src;
      lbCaption.textContent = item.dataset.caption || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    lbPrev.addEventListener('click', () => {
      current = (current - 1 + galleryItems.length) % galleryItems.length;
      openLightbox(current);
    });

    lbNext.addEventListener('click', () => {
      current = (current + 1) % galleryItems.length;
      openLightbox(current);
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbPrev.click();
      if (e.key === 'ArrowRight') lbNext.click();
    });
  }

});
