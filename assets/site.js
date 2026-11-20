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

// Demo forms: validate, then show a thank-you. Nothing is sent or stored.
(function () {
  document.querySelectorAll('fieldset[data-max]').forEach(function (fs) {
    var max = parseInt(fs.getAttribute('data-max'), 10);
    fs.addEventListener('change', function () {
      var boxes = fs.querySelectorAll('input[type=checkbox]');
      var n = fs.querySelectorAll('input[type=checkbox]:checked').length;
      boxes.forEach(function (b) { if (!b.checked) b.disabled = n >= max; });
    });
  });
  document.querySelectorAll('form.demo-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.querySelectorAll('.err').forEach(function (x) { x.remove(); });
      form.querySelectorAll('.invalid').forEach(function (x) { x.classList.remove('invalid'); });
      var first = null;
      function flag(el, msg) {
        var p = document.createElement('p'); p.className = 'err'; p.textContent = msg;
        (el.closest('fieldset') || el.closest('label') || el).appendChild(p);
        if (el.classList) el.classList.add('invalid');
        if (!first) first = el;
      }
      form.querySelectorAll('input[required]:not([type=radio]), textarea[required], select[required]').forEach(function (el) {
        if (!el.value.trim()) flag(el, 'This is required.');
        else if (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value)) flag(el, 'Enter a valid email address.');
      });
      form.querySelectorAll('fieldset').forEach(function (fs) {
        var radios = fs.querySelectorAll('input[type=radio][required]');
        if (radios.length && !fs.querySelector('input[type=radio]:checked')) flag(fs, 'Please choose one.');
        if (fs.hasAttribute('data-max') && !fs.querySelector('input[type=checkbox]:checked')) flag(fs, 'Choose at least one.');
      });
      if (first) { (first.focus ? first : form).focus(); first.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
      var thanks = form.nextElementSibling;
      form.hidden = true;
      if (thanks) { thanks.hidden = false; thanks.setAttribute('tabindex', '-1'); thanks.focus(); }
    });
  });
})();
