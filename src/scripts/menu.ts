// Ported from design/js/vaks.js: mobile menu, Services dropdown (click for touch/keyboard), Esc and outside click close.
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

// .dismissed keeps a hover/focus-opened dropdown shut after Esc until the pointer or focus leaves it.
function closeDropdown(li: Element, focus = false) {
  li.classList.remove('open');
  if (focus) li.classList.add('dismissed');
  const btn = li.querySelector('button');
  btn?.setAttribute('aria-expanded', 'false');
  if (focus) btn?.focus();
}

document.querySelectorAll<HTMLElement>('.menu-btn').forEach((b) => {
  b.addEventListener('click', () => setMenu(b, b.getAttribute('aria-expanded') !== 'true'));
});

document.querySelectorAll<HTMLElement>('.has-dropdown > button').forEach((b) => {
  b.addEventListener('click', () => {
    const li = b.parentElement!;
    const open = !li.classList.contains('open');
    li.classList.toggle('open', open);
    li.classList.remove('dismissed');
    b.setAttribute('aria-expanded', String(open));
  });
  const li = b.parentElement!;
  li.addEventListener('mouseleave', () => li.classList.remove('dismissed'));
  li.addEventListener('focusout', (e) => {
    if (!li.contains(e.relatedTarget as Node)) li.classList.remove('dismissed');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.has-dropdown.open').forEach((li) => closeDropdown(li, true));
  document.querySelectorAll<HTMLElement>('.menu-btn[aria-expanded="true"]').forEach((b) => {
    setMenu(b, false);
    b.focus();
  });
});

document.addEventListener('click', (e) => {
  document.querySelectorAll('.has-dropdown.open').forEach((li) => {
    if (!li.contains(e.target as Node)) closeDropdown(li);
  });
});
