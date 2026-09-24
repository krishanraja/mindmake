(() => {
  const root = document.documentElement;
  const menu = document.querySelector('#site-menu');
  const menuButton = document.querySelector('.menu-control');
  const closeMenu = () => {
    root.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-hidden', 'true');
  };
  menuButton?.addEventListener('click', () => {
    const opening = !root.classList.contains('menu-open');
    root.classList.toggle('menu-open', opening);
    menuButton.setAttribute('aria-expanded', String(opening));
    menu?.setAttribute('aria-hidden', String(!opening));
  });
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  const setAuthorityPhase = (phase) => {
    document.querySelectorAll('[data-authority-phase]').forEach((panel) => {
      const active = panel.dataset.authorityPhase === phase;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', String(!active));
    });
    document.querySelectorAll('[data-authority-instrument]').forEach((panel) => {
      const active = panel.dataset.authorityInstrument === phase;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', String(!active));
    });
    document.querySelectorAll('[data-phase]').forEach((button) => {
      const active = button.dataset.phase === phase;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  document.querySelectorAll('[data-phase]').forEach((button) => button.addEventListener('click', () => setAuthorityPhase(button.dataset.phase)));

  const practicePanels = [...document.querySelectorAll('[data-practice-panel]')];
  const practiceTabs = [...document.querySelectorAll('[data-practice-tab]')];
  const setPractice = (index) => {
    practicePanels.forEach((panel, item) => {
      const active = item === index;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', String(!active));
    });
    practiceTabs.forEach((tab, item) => {
      const active = item === index;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
  };
  practiceTabs.forEach((tab, index) => tab.addEventListener('click', () => setPractice(index)));

  const setRoute = (route) => {
    document.querySelectorAll('[data-route]').forEach((button) => {
      const active = button.dataset.route === route;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-route-outcome]').forEach((panel) => {
      const active = panel.dataset.routeOutcome === route;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', String(!active));
    });
    const start = document.querySelector('[data-start]');
    if (start) start.href = `/start?route=${route}`;
  };
  document.querySelectorAll('[data-route]').forEach((button) => button.addEventListener('click', () => setRoute(button.dataset.route)));
  document.querySelectorAll('[data-open-route]').forEach((link) => link.addEventListener('click', () => setRoute(link.dataset.openRoute)));
})();
