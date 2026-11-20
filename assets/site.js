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

// Open/closed indicator for City Hall, Eastern time. Mon–Fri, 8am–4pm. Holidays not handled.
(function () {
  var els = document.querySelectorAll('.open-status');
  if (!els.length || !window.Intl) return;
  function fmt(h) { return (h % 12 || 12) + (h < 12 ? 'am' : 'pm'); }
  function nowET() {
    var o = {};
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false })
      .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    return { day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(o.weekday), mins: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
  }
  function update() {
    var t = nowET();
    els.forEach(function (el) {
      var oh = parseInt(el.getAttribute('data-open'), 10), ch = parseInt(el.getAttribute('data-close'), 10);
      var weekday = t.day >= 1 && t.day <= 5;
      var isOpen = weekday && t.mins >= oh * 60 && t.mins < ch * 60;
      var msg;
      if (isOpen) msg = 'Open now until ' + fmt(ch);
      else {
        var next = (weekday && t.mins < oh * 60) ? 'today' : (t.day >= 1 && t.day <= 4) ? 'tomorrow' : 'Monday';
        msg = 'Closed now. We open ' + next + ' at ' + fmt(oh);
      }
      el.classList.toggle('is-open', isOpen);
      el.classList.toggle('is-closed', !isOpen);
      el.querySelector('.open-text').textContent = msg;
    });
  }
  update();
  setInterval(update, 60000);
})();
