// Mobile nav, translate links, and the "find a service" filter.
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Translate links open this page through Google Translate.
  document.querySelectorAll('[data-lang]').forEach(function (a) {
    var lang = a.getAttribute('data-lang');
    if (lang === 'en') { a.href = location.href; return; }
    a.href = 'https://translate.google.com/translate?sl=en&tl=' + encodeURIComponent(lang) +
      '&u=' + encodeURIComponent(location.href);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Simple client-side filter over cards marked [data-find].
  var input = document.getElementById('finder');
  if (input) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-find]'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('[data-group]'));
    var empty = document.querySelector('.no-results');
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var hit = !q || c.textContent.toLowerCase().indexOf(q) > -1 ||
          (c.getAttribute('data-find') || '').indexOf(q) > -1;
        c.style.display = hit ? '' : 'none';
        if (hit) shown++;
      });
      groups.forEach(function (g) {
        var any = g.querySelectorAll('[data-find]:not([style*="none"])').length;
        g.style.display = any ? '' : 'none';
      });
      if (empty) empty.style.display = shown ? 'none' : 'block';
    });
  }
})();
