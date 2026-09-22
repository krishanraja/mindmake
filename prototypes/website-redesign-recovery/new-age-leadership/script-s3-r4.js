(() => {
  const root = document.querySelector('[data-reach]');
  if (!root) return;
  const sticky = root.querySelector('.reach-sticky');
  const copies = [...root.querySelectorAll('[data-reach-copy]')];
  const panels = [...root.querySelectorAll('[data-reach-panel]')];
  let phase = '';

  const setPhase = next => {
    if (phase === next) return;
    phase = next;
    copies.forEach(copy => {
      const active = copy.dataset.reachCopy === phase;
      copy.classList.toggle('is-active', active);
      copy.setAttribute('aria-hidden', String(!active));
    });
    panels.forEach(panel => {
      const active = panel.dataset.reachPanel === phase;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', String(!active));
    });
  };

  const update = () => {
    const rect = root.getBoundingClientRect();
    const distance = Math.max(1, root.offsetHeight - sticky.offsetHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / distance));
    root.style.setProperty('--reach-progress', String(progress));
    setPhase(progress < .48 ? 'boundary' : 'organisation');
  };

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
})();

