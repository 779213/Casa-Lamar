/* Casa Lamar — comportamenti del sito */
(function () {
  var WA = '393203469211'; // WhatsApp di Mirko

  // Header: ombra allo scroll + barra di progresso
  var header = document.getElementById('header');
  var bar = document.getElementById('progress');
  var ticking = false;
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // Menu mobile
  var btn = document.getElementById('menuBtn');
  var links = document.getElementById('navLinks');
  btn.addEventListener('click', function () {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { btn.classList.remove('open'); links.classList.remove('open'); }
  });

  // Comparsa morbida allo scroll
  var items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Galleria: costruita dalle foto già presenti nella pagina
  var gallery = document.getElementById('gallery');
  var seen = {};
  var shots = [];
  document.querySelectorAll('img[data-gallery]').forEach(function (img) {
    var key = img.getAttribute('src');
    if (seen[key]) return;
    seen[key] = true;
    var g = document.createElement('img');
    g.src = img.src; g.alt = img.alt; g.loading = 'lazy';
    g.dataset.cat = img.dataset.gallery;
    gallery.appendChild(g);
    shots.push(g);
  });

  document.getElementById('chips').addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
    chip.classList.add('on');
    var f = chip.dataset.f;
    shots.forEach(function (s) { s.classList.toggle('hide', f !== 'all' && s.dataset.cat !== f); });
  });

  // Lightbox con frecce e tastiera
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var current = 0;
  function visible() { return shots.filter(function (s) { return !s.classList.contains('hide'); }); }
  function show(i) {
    var list = visible();
    if (!list.length) return;
    current = (i + list.length) % list.length;
    lbImg.src = list[current].src;
    lbImg.alt = list[current].alt;
  }
  gallery.addEventListener('click', function (e) {
    if (e.target.tagName !== 'IMG') return;
    show(visible().indexOf(e.target));
    lb.classList.add('open');
  });
  function close() { lb.classList.remove('open'); }
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function () { show(current - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Form: apre WhatsApp con il messaggio già scritto
  document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('fName').value.trim();
    var din = document.getElementById('fIn').value;
    var dout = document.getElementById('fOut').value;
    var msg = document.getElementById('fMsg').value.trim();
    var text = 'Ciao Mirko, sono ' + name + '. Vorrei informazioni su Casa Lamar';
    if (din) text += ' dal ' + din.split('-').reverse().join('/');
    if (dout) text += ' al ' + dout.split('-').reverse().join('/');
    text += '.' + (msg ? ' ' + msg : '');
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });
})();