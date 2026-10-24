// Ported from design/js/vaks.js: mobile menu toggle, Esc to close.
// The Services item is a link to /services; its dropdown opens on hover and keyboard focus (CSS).
const menuSvg =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
const closeSvg =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

function setMenu(btn: HTMLElement, open: boolean) {
  const menu = document.getElementById(btn.getAttribute('aria-controls') ?? '');
  menu?.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
  btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  btn.innerHTML = open ? closeSvg : menuSvg;
}

document.querySelectorAll<HTMLElement>('.menu-btn').forEach((b) => {
  b.addEventListener('click', () => setMenu(b, b.getAttribute('aria-expanded') !== 'true'));
});

// .dismissed keeps a hover/focus-opened dropdown shut after Esc until the pointer or focus leaves it.
document.querySelectorAll<HTMLElement>('.has-dropdown').forEach((li) => {
  li.addEventListener('mouseleave', () => li.classList.remove('dismissed'));
  li.addEventListener('focusout', (e) => {
    if (!li.contains(e.relatedTarget as Node)) li.classList.remove('dismissed');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll<HTMLElement>('.has-dropdown').forEach((li) => {
    if (!li.matches(':hover, :focus-within')) return;
    li.classList.add('dismissed');
    li.querySelector<HTMLElement>('.nav-link')?.focus();
  });
  document.querySelectorAll<HTMLElement>('.menu-btn[aria-expanded="true"]').forEach((b) => {
    setMenu(b, false);
    b.focus();
  });
});
