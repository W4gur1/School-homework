/* ============================================================
   NAV — mobile toggle
============================================================ */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ============================================================
   SCROLL REVEAL
   Fades content in as it enters the viewport. Applied to
   document sections, paragraphs, cards and reference items.
============================================================ */
const revealTargets = document.querySelectorAll(
  '.doc-section__head, .doc-section__body p, .section-intro, .pull-quote, ' +
  '.objective-general, .objective-card, .media-slot, .reference-list li'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach((el, i) => {
  // slight stagger within a group for a less mechanical feel
  el.style.transitionDelay = `${(i % 4) * 60}ms`;
  revealObserver.observe(el);
});

/* ============================================================
   MEDIA PLACEHOLDERS
   Client-side only preview: lets whoever is building the page
   drop in a photo or video to see how a slot will look before
   the final assets exist. Nothing is uploaded anywhere, and
   nothing persists after a reload.

   TO SHIP FINAL MEDIA:
   Replace the relevant <div class="media-slot"> block in
   index.html with a plain <img src="assets/nome-do-arquivo.jpg">
   (or <video controls src="...">), or simply keep this file
   picker behavior and point the CSS background at your hosted
   file — either approach works once real assets are ready.
============================================================ */
document.querySelectorAll('.media-slot').forEach(slot => {
  const input = slot.querySelector('.media-slot__input');
  const kind = slot.dataset.kind;

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (!file) return;

    // clear any previous preview
    const oldPreview = slot.querySelector('.media-slot__preview, .media-slot__filename');
    if (oldPreview) oldPreview.remove();
    const oldVideo = slot.querySelector('video.media-slot__preview');
    if (oldVideo) oldVideo.remove();

    const url = URL.createObjectURL(file);

    let previewEl;
    if (kind === 'video' || file.type.startsWith('video/')) {
      previewEl = document.createElement('video');
      previewEl.src = url;
      previewEl.controls = true;
      previewEl.muted = true;
      previewEl.className = 'media-slot__preview';
    } else {
      previewEl = document.createElement('img');
      previewEl.src = url;
      previewEl.alt = slot.dataset.label || 'Pré-visualização';
      previewEl.className = 'media-slot__preview';
    }

    const nameTag = document.createElement('span');
    nameTag.className = 'media-slot__filename';
    nameTag.textContent = file.name;

    slot.appendChild(previewEl);
    slot.appendChild(nameTag);
    slot.classList.add('has-media');
  });
});