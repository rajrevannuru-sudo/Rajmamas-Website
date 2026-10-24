/* VAKS Consulting — interactions. No dependencies.
   1. Mobile menu toggle (.menu-btn ↔ #mobile-menu)
   2. Services dropdown: opens on hover/focus via CSS; click toggles .open for touch and keyboard
   3. Esc closes whichever is open. FAQ uses native <details>, no script needed. */
(function () {
  var menuSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  var closeSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  function setMenu(btn, open) {
    var m = document.getElementById(btn.getAttribute('aria-controls'));
    m.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    btn.innerHTML = open ? closeSvg : menuSvg;
  }
  document.querySelectorAll('.menu-btn').forEach(function (b) {
    b.addEventListener('click', function () { setMenu(b, b.getAttribute('aria-expanded') !== 'true'); });
  });
  document.querySelectorAll('.has-dropdown > button').forEach(function (b) {
    b.addEventListener('click', function () {
      var li = b.parentNode, open = !li.classList.contains('open');
      li.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.has-dropdown.open').forEach(function (li) { li.classList.remove('open'); li.querySelector('button').setAttribute('aria-expanded', 'false'); li.querySelector('button').focus(); });
    document.querySelectorAll('.menu-btn[aria-expanded="true"]').forEach(function (b) { setMenu(b, false); b.focus(); });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.has-dropdown.open').forEach(function (li) { if (!li.contains(e.target)) { li.classList.remove('open'); li.querySelector('button').setAttribute('aria-expanded', 'false'); } });
  });
})();
