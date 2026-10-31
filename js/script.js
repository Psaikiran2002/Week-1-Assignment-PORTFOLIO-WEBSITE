(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Theme toggle (sun = light theme, moon = dark theme; choice saved when possible)
  const tbtn = $('#theme-btn');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const syncTheme = () => tbtn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
  try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
  syncTheme();
  tbtn.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    syncTheme();
  });

  // Mobile menu
  const menu = $('#menu-btn'), nav = $('#nav');
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', open);
  });

  // "More pages" dropdown
  const more = $('#more-btn'), moreMenu = $('#more-menu');
  const closeMore = focus => { moreMenu.hidden = true; more.setAttribute('aria-expanded', 'false'); if (focus) more.focus(); };
  more.addEventListener('click', () => {
    const open = moreMenu.hidden;
    moreMenu.hidden = !open;
    more.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', e => { if (!e.target.closest('.more')) closeMore(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !moreMenu.hidden) closeMore(true); });

  // Reveal on scroll
  const items = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .12 });
    items.forEach(i => io.observe(i));
  } else items.forEach(i => i.classList.add('in'));

  // Project filter
  $$('.filters button').forEach(b => b.addEventListener('click', () => {
    $$('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b));
    $$('[data-category]').forEach(c => { c.hidden = b.dataset.filter !== 'all' && c.dataset.category !== b.dataset.filter; });
  }));

  // Contact form: validate, then open the visitor's email app
  const form = $('#contact-form');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const s = $('#form-status'), d = new FormData(form);
    const name = d.get('name').trim(), email = d.get('email').trim(), msg = d.get('message').trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || msg.length < 10) {
      s.className = 'status err';
      s.textContent = 'Enter your name, a valid email and a message of at least 10 characters.';
      return;
    }
    s.className = 'status';
    s.textContent = 'Opening your email app with the message ready to send.';
    location.href = 'mailto:saikiran.reddi2002@gmail.com?subject=' + encodeURIComponent('Portfolio enquiry from ' + name) +
      '&body=' + encodeURIComponent(msg + '\n\n' + name + ' (' + email + ')');
  });
})();
