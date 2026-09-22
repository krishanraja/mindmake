(() => {
  const items = [...document.querySelectorAll('[data-reveal]')];
  const heroDeck = document.querySelector('[data-reveal="hero-deck"]');
  const motionToggle = document.querySelector('.motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;

  const reveal = item => {
    if (!item || item.classList.contains('is-revealed')) return;
    item.classList.add('is-revealed');
    item.addEventListener('transitionend', () => { item.style.willChange = 'auto'; }, { once: true });
  };

  const syncMotionState = () => {
    document.documentElement.classList.toggle('motion-paused', motionToggle?.getAttribute('aria-pressed') === 'true');
  };

  if (reduced || saveData) {
    items.forEach(reveal);
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .38, rootMargin: '0px 0px -8% 0px' });

    items.filter(item => item !== heroDeck).forEach(item => observer.observe(item));
    const revealHeroOnScroll = () => {
      if (scrollY >= Math.min(72, innerHeight * .07)) {
        reveal(heroDeck);
        removeEventListener('scroll', revealHeroOnScroll);
      }
    };
    addEventListener('scroll', revealHeroOnScroll, { passive: true });
    revealHeroOnScroll();
  }

  syncMotionState();
  motionToggle?.addEventListener('click', syncMotionState);

  const benefitsRoot = document.querySelector('[data-benefits]');
  const benefits = [...document.querySelectorAll('[data-benefit]')];
  const benefitCount = document.querySelector('[data-benefit-count]');
  const benefitStatus = document.querySelector('[data-benefit-status]');
  let benefitIndex = 0;
  let benefitTimer = 0;
  let benefitIntroTimer = 0;
  let benefitHasDemonstrated = false;
  let benefitVisible = false;
  let benefitHeld = false;

  const benefitMotionAllowed = () => !reduced && !saveData && motionToggle?.getAttribute('aria-pressed') !== 'true' && !document.hidden;
  const stopBenefits = () => {
    clearTimeout(benefitIntroTimer);
    clearInterval(benefitTimer);
    benefitIntroTimer = 0;
    benefitTimer = 0;
  };
  const showBenefit = (rawIndex, announce = false) => {
    benefitIndex = (Number(rawIndex) + benefits.length) % benefits.length;
    benefits.forEach((benefit, index) => {
      benefit.classList.toggle('is-active', index === benefitIndex);
      benefit.setAttribute('aria-hidden', String(index !== benefitIndex));
    });
    benefitsRoot?.style.setProperty('--benefit-index', String(benefitIndex));
    if (benefitCount) benefitCount.textContent = String(benefitIndex + 1).padStart(2, '0');
    if (announce && benefitStatus) benefitStatus.textContent = `Benefit ${benefitIndex + 1} of ${benefits.length}: ${benefits[benefitIndex].innerText}`;
  };
  const startBenefits = (demonstrate = false) => {
    stopBenefits();
    if (!benefitVisible || benefitHeld || !benefitMotionAllowed()) return;
    const beginSteadyRotation = () => {
      if (!benefitVisible || benefitHeld || !benefitMotionAllowed()) return;
      benefitTimer = setInterval(() => showBenefit(benefitIndex + 1), 6200);
    };
    if (demonstrate && !benefitHasDemonstrated) {
      benefitIntroTimer = setTimeout(() => {
        if (!benefitVisible || benefitHeld || !benefitMotionAllowed()) return;
        benefitHasDemonstrated = true;
        showBenefit(benefitIndex + 1);
        beginSteadyRotation();
      }, 900);
      return;
    }
    beginSteadyRotation();
  };
  const chooseBenefit = index => { showBenefit(index, true); startBenefits(); };
  document.querySelector('[data-benefit-prev]')?.addEventListener('click', () => chooseBenefit(benefitIndex - 1));
  document.querySelector('[data-benefit-next]')?.addEventListener('click', () => chooseBenefit(benefitIndex + 1));
  benefitsRoot?.addEventListener('focusin', () => { benefitHeld = true; stopBenefits(); });
  benefitsRoot?.addEventListener('focusout', () => { benefitHeld = false; startBenefits(); });
  motionToggle?.addEventListener('click', startBenefits);
  document.addEventListener('visibilitychange', startBenefits);
  if (benefitsRoot) {
    new IntersectionObserver(entries => {
      benefitVisible = entries[0]?.isIntersecting === true;
      benefitVisible ? startBenefits(true) : stopBenefits();
    }, { threshold: .32 }).observe(benefitsRoot);
  }
  showBenefit(0);
})();


