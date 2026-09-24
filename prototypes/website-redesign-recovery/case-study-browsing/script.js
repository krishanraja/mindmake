(() => {
  const stories = [
    {
      id: 'day-one', short: 'Day one', title: 'Land the answer in a day, then leave',
      result: "A day's work, and a partner signed the month after.",
      outcome: 'Two quarters of argument over build or partner ended in one day in the room. The partner agreement was signed the following month.',
      before: 'Two quarters refereeing the argument', after: 'One day in the room', kind: 'span',
      film: 'ready-for-decision', offset: 1.4, filmPosition: '51% 52%'
    },
    {
      id: 'sellable-expertise', short: 'Sellable expertise', title: 'Turn expertise into something clients can buy',
      result: 'Expertise became an offer people could buy.',
      outcome: 'A respected advisory firm turned its ideas into a clear offer and a plan to launch it.',
      before: 'Ideas everyone respected', after: 'One offer, and a plan to launch it', kind: 'offer',
      film: 'communications-compose', offset: 3.8, filmPosition: '61% 48%'
    },
    {
      id: 'simple-product', short: 'Simple product', title: 'Make the product simple enough to sell',
      result: 'Two pilots signed during the work.',
      outcome: 'The position and price were rebuilt in 30 days. The first two pilots were signed during the work.',
      before: 'Inside the thirty days', after: '2 pilots signed', kind: 'pilots',
      film: 'opportunities-resolve', offset: 6.2, filmPosition: '50% 49%'
    },
    {
      id: 'hand-back', short: 'Hand it back', title: 'Rebuild the business, then hand it back',
      result: "The business was rebuilt and left in the founder's hands.",
      outcome: 'An eight-week rebuild covered the brand, offers, lead capture, content and outreach. Five videos shipped in week one.',
      before: '5 videos shipped in week one of eight', after: "Left in the founder's hands", kind: 'handoff',
      film: 'quiet-workshop-growth', offset: 8.6, filmPosition: '48% 47%'
    },
    {
      id: 'own-system', short: 'Own the system', title: 'Own the system instead of renting the operator',
      result: 'Publishing moved from monthly to most days.',
      outcome: 'A founder-owned content system cut publishing time from days to under an hour. Publishing moved from about monthly to most days.',
      before: 'About once a month', after: 'Most days', kind: 'cadence',
      film: 'evidence-connects', offset: 10.8, filmPosition: '44% 45%'
    },
    {
      id: 'team-decides', short: 'Team decides', title: 'Change how the team decides',
      result: 'Fourteen vendors became three decisions.',
      outcome: 'A publisher moved from 14 competing AI vendors to three decisions. Its own team then shipped the chosen work with no new hires.',
      before: 'Fourteen competing vendors', after: 'Three decisions', kind: 'decisions',
      film: 'signals-arrive', offset: 13.2, filmPosition: '36% 52%'
    },
    {
      id: 'business-first', short: 'Business first', title: 'Tie every AI choice back to the business',
      result: 'Eleven tools stopped. One useful system went live.',
      outcome: 'Eleven of fourteen tools were stopped. The budget was kept and the first working system went live inside 90 days.',
      before: 'Fourteen tools running', after: 'Three kept, eleven stopped', kind: 'switches',
      film: 'ready-for-decision', offset: 15.4, filmPosition: '74% 50%'
    },
    {
      id: 'market-moves', short: 'Market moves', title: 'Change direction before the market moves',
      result: 'A new sales path led to a paid publisher test.',
      outcome: 'A data company changed how it sold as AI changed the web. The work led to a paid test with a major US publisher.',
      before: 'Selling the way the old web paid', after: 'A paid test with a major US publisher', kind: 'route',
      film: 'signals-arrive', offset: 17.1, filmPosition: '74% 54%'
    }
  ];

  const shell = document.querySelector('.proof-shell');
  const list = document.querySelector('.region-list');
  const dock = document.querySelector('.mobile-dock');
  const live = document.querySelector('[data-live]');
  let selected = null;
  let phase = 'result';
  let focusIndex = 0;
  let originIndex = 0;

  const esc = (value) => value.replace(/[&<>"']/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[character]));
  const nodes = (count, className) => Array.from({ length: count }, (_, index) => `<i class="${className}${index > 2 ? ' is-off' : ''}" style="--i:${index}"></i>`).join('');

  const glyph = (story, large = false) => {
    const view = large ? '0 0 520 240' : '0 0 220 74';
    const stroke = 'currentColor';
    const mint = '#87e7bd';
    const paper = '#eadcc1';
    const scale = large ? 1 : .42;
    const body = {
      span: `<g class="phase-a" fill="none" stroke="${stroke}" stroke-width="${large ? 4 : 2}"><path d="M${large?32:14} ${large?86:29}H${large?464:202}"/><path d="M${large?32:14} ${large?68:21}V${large?104:37}M${large?464:202} ${large?68:21}V${large?104:37}"/></g><g class="phase-b travel"><rect x="${large?394:170}" y="${large?124:43}" width="${large?70:30}" height="${large?45:16}" fill="${mint}"/><circle cx="${large?486:211}" cy="${large?146:51}" r="${large?10:4}" fill="${paper}"/></g>`,
      offer: `<g class="phase-a" fill="none" stroke="${stroke}" stroke-width="${large?3:1.5}">${[0,1,2,3].map(i=>`<path d="M${large?36:16} ${large?58+i*30:18+i*11}C${large?170:72} ${large?40+i*24:14+i*9} ${large?250:110} ${large?70+i*20:25+i*8} ${large?310:134} ${large?110:38}"/>`).join('')}</g><g class="phase-b travel"><rect x="${large?310:134}" y="${large?76:26}" width="${large?168:72}" height="${large?92:32}" rx="${large?3:1}" fill="none" stroke="${mint}" stroke-width="${large?4:2}"/><path d="M${large?326:141} ${large?104:36}H${large?456:197}M${large?326:141} ${large?128:45}H${large?426:184}" stroke="${mint}" stroke-width="${large?3:1.5}"/></g>`,
      pilots: `<path class="phase-a" d="M${large?60:26} ${large?176:59}A${large?150:64} ${large?150:50} 0 0 1 ${large?460:198} ${large?176:59}" fill="none" stroke="${stroke}" stroke-width="${large?4:2}"/><g class="phase-b travel" fill="none" stroke="${mint}" stroke-width="${large?5:2}"><circle cx="${large?220:94}" cy="${large?116:39}" r="${large?34:13}"/><circle cx="${large?340:146}" cy="${large?96:33}" r="${large?34:13}"/><path d="M${large?204:87} ${large?116:39}l${large?12:5} ${large?12:5} ${large?22:-10} ${large?-26:9}M${large?324:139} ${large?96:33}l${large?12:5} ${large?12:5} ${large?22:-10} ${large?-26:9}"/></g>`,
      handoff: `<g class="phase-a" stroke="${stroke}" stroke-width="${large?3:1.5}"><path d="M${large?38:16} ${large?164:56}H${large?476:205}"/>${Array.from({length:8},(_,i)=>`<path d="M${large?52+i*54:22+i*23} ${large?152:52}V${large?176:60}"/>`).join('')}${Array.from({length:5},(_,i)=>`<circle cx="${large?52+i*17:22+i*8}" cy="${large?124:42}" r="${large?7:3}" fill="${paper}"/>`).join('')}</g><g class="phase-b travel" fill="none" stroke="${mint}" stroke-width="${large?5:2}"><circle cx="${large?410:176}" cy="${large?96:33}" r="${large?28:12}"/><path d="M${large?382:164} ${large?96:33}H${large?260:112}v${large?26:9}h${large?42:18}"/></g>`,
      cadence: `<g class="phase-a" fill="none" stroke="${stroke}" stroke-width="${large?4:2}"><path d="M${large?36:15} ${large?144:49}H${large?484:208}"/><path d="M${large?94:40} ${large?144:49}V${large?70:24}"/></g><g class="phase-b" stroke="${mint}" stroke-width="${large?4:2}"><path d="M${large?36:15} ${large?144:49}H${large?484:208}"/>${Array.from({length:10},(_,i)=>`<path d="M${large?180+i*28:77+i*12} ${large?144:49}V${large?(i%3===0?68:92):(i%3===0?23:31)}"/>`).join('')}</g>`,
      decisions: `<g class="phase-a" fill="${paper}" opacity=".75">${Array.from({length:14},(_,i)=>{const a=(i/14)*Math.PI*2;const x=(large?258:110)+Math.cos(a)*(large?150:60);const y=(large?120:37)+Math.sin(a)*(large?80:25);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${large?5:2.2}"/>`}).join('')}</g><g class="phase-b travel" fill="none" stroke="${mint}" stroke-width="${large?7:3}"><path d="M${large?258:110} ${large?120:37}L${large?420:181} ${large?54:18}"/><path d="M${large?258:110} ${large?120:37}L${large?438:189} ${large?120:37}"/><path d="M${large?258:110} ${large?120:37}L${large?420:181} ${large?188:63}"/></g>`,
      switches: `<g transform="translate(${large?45:19} ${large?54:17})">${Array.from({length:14},(_,i)=>{const x=(i%7)*(large?58:24);const y=Math.floor(i/7)*(large?84:28);const off=i>2;return `<g class="switch ${off?'is-off':''}" transform="translate(${x} ${y})"><rect width="${large?34:14}" height="${large?58:20}" rx="${large?4:2}" fill="none" stroke="${off?stroke:mint}" stroke-width="${large?3:1.5}"/><circle cx="${large?17:7}" cy="${large?16:6}" r="${large?6:2.5}" fill="${off?paper:mint}"/></g>`}).join('')}</g>`,
      route: `<g fill="none" stroke-width="${large?5:2}"><path class="phase-a" d="M${large?36:15} ${large?120:40}H${large?472:203}" stroke="${stroke}"/><path class="phase-b" d="M${large?36:15} ${large?120:40}H${large?210:90}Q${large?270:116} ${large?120:40} ${large?304:131} ${large?72:24}H${large?472:203}" stroke="${mint}"/><circle class="travel" cx="${large?444:191}" cy="${large?72:24}" r="${large?12:5}" fill="${mint}" stroke="none"/></g>`
    }[story.kind];
    return `<svg viewBox="${view}" aria-hidden="true" focusable="false">${body}</svg>`;
  };

  const regionMarkup = (story, index) => `
    <li class="region" data-index="${index}" data-story="${story.id}">
      <video class="region-film" muted loop playsinline preload="metadata" aria-hidden="true" tabindex="-1" data-offset="${story.offset}" style="object-position:${story.filmPosition}" poster="./media/${story.film}-loop-r01-20s-720p-web-sealed-poster.webp">
        <source src="../../../src/assets/films/sep2026/${story.film}-loop-r01-20s-720p-web-sealed.mp4" type="video/mp4" />
      </video>
      <button class="region-hit" type="button" aria-expanded="false" aria-controls="detail-${story.id}" data-open-story="${story.id}">
        <span class="region-kicker"><b>${String(index + 1).padStart(2,'0')}</b><span>Recorded change</span></span>
        <span class="region-copy"><small>${esc(story.short)}</small><strong>${esc(story.result)}</strong></span>
        <span class="region-glyph phase-result">${glyph(story)}</span>
      </button>
      <section class="expanded phase-result" id="detail-${story.id}" aria-labelledby="title-${story.id}" hidden>
        <header class="expanded-head">
          <p>${String(index + 1).padStart(2,'0')} / 08 · ${esc(story.title)}</p>
          <h2 id="title-${story.id}" tabindex="-1">${esc(story.result)}</h2>
        </header>
        <div class="expanded-visual">
          <div class="mechanism">${glyph(story, true)}</div>
          <div class="endpoint-labels"><span>${esc(story.before)}</span><span>${esc(story.after)}</span></div>
        </div>
        <div class="expanded-copy">
          <p>${esc(story.outcome)}</p>
          <p class="truth-line">The drawing shows the kind of recorded change, not its size.</p>
        </div>
        <footer class="expanded-actions">
          <div>
            <button type="button" data-toggle-phase>Show starting point</button>
            <a href="/case-studies#${story.id}">Read the full case</a>
          </div>
          <span class="position">Case archive · ${String(index + 1).padStart(2,'0')} of 08</span>
          <button type="button" data-close-story>All eight</button>
        </footer>
      </section>
    </li>`;

  list.innerHTML = stories.map(regionMarkup).join('');
  const regions = [...document.querySelectorAll('.region')];
  const openButtons = [...document.querySelectorAll('[data-open-story]')];
  const films = [...document.querySelectorAll('.region-film')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  let saveData = Boolean(connection?.saveData);
  let filmBatch = 0;
  let priorityFilm = null;

  const isCompact = () => matchMedia('(max-width: 860px)').matches;
  const filmMayMove = () => !reducedMotion.matches && !saveData;
  const filmIsVisible = (film) => {
    const region = film.closest('.region');
    const hit = region?.querySelector('.region-hit');
    if (!region || !hit || getComputedStyle(region).display === 'none' || getComputedStyle(hit).display === 'none') return false;
    const rect = region.getBoundingClientRect();
    return rect.right > 0 && rect.bottom > 0 && rect.left < innerWidth && rect.top < innerHeight;
  };
  const syncFilms = () => {
    const moving = filmMayMove() && document.visibilityState === 'visible';
    shell.dataset.filmMotion = moving ? 'moving' : 'still';
    const visibleFilms = films.filter(filmIsVisible);
    const limit = isCompact() ? 2 : 4;
    const ordered = visibleFilms.length ? visibleFilms.map((_, index) => visibleFilms[(index + filmBatch) % visibleFilms.length]) : [];
    const active = new Set(priorityFilm && visibleFilms.includes(priorityFilm) ? [priorityFilm, ...ordered.filter(film => film !== priorityFilm).slice(0, limit - 1)] : ordered.slice(0, limit));
    films.forEach(film => {
      const shouldPlay = moving && active.has(film);
      film.classList.toggle('is-moving', shouldPlay);
      if (shouldPlay) film.play().catch(() => {});
      else film.pause();
    });
  };
  films.forEach(film => {
    const setOffset = () => {
      const offset = Number(film.dataset.offset || 0);
      if (Number.isFinite(film.duration) && film.duration > 0) film.currentTime = Math.min(offset, Math.max(0, film.duration - .1));
    };
    if (film.readyState >= 1) setOffset();
    else film.addEventListener('loadedmetadata', setOffset, { once:true });
    film.addEventListener('canplay', syncFilms, { once:true });
  });
  const filmObserver = new IntersectionObserver(syncFilms, { rootMargin:'80px' });
  regions.forEach(region => filmObserver.observe(region));
  regions.forEach(region => {
    const film = region.querySelector('.region-film');
    region.addEventListener('pointerenter', () => { priorityFilm = film; syncFilms(); });
    region.addEventListener('pointerleave', () => { if (priorityFilm === film) priorityFilm = null; syncFilms(); });
    region.addEventListener('focusin', () => { priorityFilm = film; syncFilms(); });
    region.addEventListener('focusout', () => { if (priorityFilm === film) priorityFilm = null; syncFilms(); });
  });
  window.setInterval(() => {
    if (!filmMayMove() || document.visibilityState !== 'visible' || priorityFilm) return;
    filmBatch += isCompact() ? 2 : 4;
    syncFilms();
  }, 6000);
  reducedMotion.addEventListener?.('change', syncFilms);
  connection?.addEventListener?.('change', () => { saveData = Boolean(connection.saveData); syncFilms(); });
  document.addEventListener('visibilitychange', syncFilms);
  const hashState = () => {
    const match = location.hash.match(/^#story=([^&]+)(?:&phase=(start|result))?$/);
    if (!match) return { story: null, phase: 'result' };
    return { story: stories.some(item => item.id === match[1]) ? match[1] : null, phase: match[2] || 'result' };
  };

  const setRoving = (index) => {
    focusIndex = Math.max(0, Math.min(stories.length - 1, index));
    openButtons.forEach((button, buttonIndex) => button.tabIndex = buttonIndex === focusIndex ? 0 : -1);
  };

  const animateLayout = (mutate) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return mutate();
    const before = new Map(regions.map(region => [region, region.getBoundingClientRect()]));
    mutate();
    requestAnimationFrame(() => {
      regions.forEach(region => {
        if (getComputedStyle(region).display === 'none') return;
        const first = before.get(region);
        const last = region.getBoundingClientRect();
        if (!first || !last.width || !last.height) return;
        const dx = first.left - last.left;
        const dy = first.top - last.top;
        const sx = first.width / last.width;
        const sy = first.height / last.height;
        region.animate([
          { transformOrigin: '0 0', transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})` },
          { transformOrigin: '0 0', transform: 'none' }
        ], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' });
      });
    });
  };

  const writeUrl = (story, nextPhase, mode = 'push') => {
    const url = story ? `#story=${story}&phase=${nextPhase}` : '#overview';
    history[mode === 'replace' ? 'replaceState' : 'pushState']({ story, phase: nextPhase }, '', url);
  };

  const applyPhase = (nextPhase, announce = true) => {
    phase = nextPhase;
    shell.dataset.phase = phase;
    const selectedRegion = selected ? document.querySelector(`[data-story="${selected}"]`) : null;
    if (selectedRegion) {
      const expanded = selectedRegion.querySelector('.expanded');
      expanded.classList.toggle('phase-start', phase === 'start');
      expanded.classList.toggle('phase-result', phase === 'result');
      const button = expanded.querySelector('[data-toggle-phase]');
      button.textContent = phase === 'result' ? 'Show starting point' : 'Show recorded result';
      if (announce) live.textContent = `${stories.find(story => story.id === selected).short}: ${phase === 'result' ? 'recorded result' : 'starting point'}.`;
    }
  };

  const openStory = (id, nextPhase = 'result', options = {}) => {
    const index = stories.findIndex(story => story.id === id);
    if (index < 0) return;
    originIndex = options.originIndex ?? index;
    selected = id;
    phase = nextPhase;
    const side = index === 1 || index === 2 || index === 4 || index === 7 ? 'right' : 'left';
    const update = () => {
      shell.dataset.mode = 'story';
      shell.dataset.side = side;
      dock.hidden = !isCompact();
      regions.forEach((region, regionIndex) => {
        const active = region.dataset.story === id;
        region.classList.toggle('is-selected', active);
        region.querySelector('.region-hit').setAttribute('aria-expanded', String(active));
        const expanded = region.querySelector('.expanded');
        expanded.hidden = !active;
        region.querySelector('.region-hit').tabIndex = active ? -1 : 0;
        if (!active) region.style.order = String(regionIndex < index ? regionIndex : regionIndex - 1);
      });
      document.querySelector('[data-mobile-position]').textContent = `${String(index + 1).padStart(2,'0')} / 08`;
      applyPhase(phase, false);
    };
    animateLayout(update);
    requestAnimationFrame(syncFilms);
    if (!options.fromHistory) writeUrl(id, phase, options.replace ? 'replace' : 'push');
    sessionStorage.setItem('mindmake-proof-field', JSON.stringify({ story: id, phase, originIndex }));
    requestAnimationFrame(() => document.querySelector(`#title-${id}`).focus({ preventScroll: true }));
    live.textContent = `Opened case ${index + 1} of 8: ${stories[index].result}`;
  };

  const closeStory = (options = {}) => {
    const target = originIndex;
    const update = () => {
      selected = null;
      phase = 'result';
      shell.dataset.mode = 'overview';
      shell.dataset.phase = 'result';
      delete shell.dataset.side;
      dock.hidden = true;
      regions.forEach(region => {
        region.classList.remove('is-selected');
        region.style.order = '';
        region.querySelector('.region-hit').setAttribute('aria-expanded','false');
        region.querySelector('.expanded').hidden = true;
      });
      setRoving(target);
    };
    animateLayout(update);
    requestAnimationFrame(syncFilms);
    if (!options.fromHistory) writeUrl(null, 'result', options.replace ? 'replace' : 'push');
    requestAnimationFrame(() => openButtons[target].focus({ preventScroll: true }));
    live.textContent = 'Returned to all eight case studies.';
  };

  const moveSpatially = (current, direction) => {
    const currentRect = openButtons[current].getBoundingClientRect();
    const cx = currentRect.left + currentRect.width / 2;
    const cy = currentRect.top + currentRect.height / 2;
    const candidates = openButtons.map((button, index) => {
      if (index === current) return null;
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const valid = direction === 'left' ? dx < -4 : direction === 'right' ? dx > 4 : direction === 'up' ? dy < -4 : dy > 4;
      if (!valid) return null;
      const primary = direction === 'left' || direction === 'right' ? Math.abs(dx) : Math.abs(dy);
      const secondary = direction === 'left' || direction === 'right' ? Math.abs(dy) : Math.abs(dx);
      return { index, score: primary + secondary * 1.8 };
    }).filter(Boolean).sort((a,b) => a.score - b.score);
    return candidates[0]?.index ?? current;
  };

  openButtons.forEach((button, index) => {
    button.addEventListener('click', () => openStory(button.dataset.openStory, 'result', { originIndex:index }));
    button.addEventListener('focus', () => setRoving(index));
    button.addEventListener('keydown', event => {
      let target = null;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = stories.length - 1;
      if (/^[1-8]$/.test(event.key)) target = Number(event.key) - 1;
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) target = moveSpatially(index, event.key.replace('Arrow','').toLowerCase());
      if (target === null) return;
      event.preventDefault();
      setRoving(target);
      openButtons[target].focus();
    });
  });

  list.addEventListener('click', event => {
    const toggle = event.target.closest('[data-toggle-phase]');
    const close = event.target.closest('[data-close-story]');
    if (toggle && selected) {
      applyPhase(phase === 'result' ? 'start' : 'result');
      writeUrl(selected, phase, 'replace');
      sessionStorage.setItem('mindmake-proof-field', JSON.stringify({ story:selected, phase, originIndex }));
    }
    if (close) closeStory();
  });

  document.querySelector('[data-mobile-back]').addEventListener('click', () => closeStory());
  document.querySelector('[data-mobile-prev]').addEventListener('click', () => {
    if (!selected) return;
    const index = stories.findIndex(story => story.id === selected);
    const next = (index - 1 + stories.length) % stories.length;
    openStory(stories[next].id, 'result', { originIndex: next });
  });
  document.querySelector('[data-mobile-next]').addEventListener('click', () => {
    if (!selected) return;
    const index = stories.findIndex(story => story.id === selected);
    const next = (index + 1) % stories.length;
    openStory(stories[next].id, 'result', { originIndex: next });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && selected) {
      event.preventDefault();
      closeStory();
    }
  });

  window.addEventListener('popstate', () => {
    const state = hashState();
    if (state.story) openStory(state.story, state.phase, { fromHistory:true, originIndex:stories.findIndex(story => story.id === state.story) });
    else closeStory({ fromHistory:true });
  });

  window.addEventListener('resize', () => { dock.hidden = !(selected && isCompact()); syncFilms(); });

  setRoving(0);
  const initial = hashState();
  if (initial.story) openStory(initial.story, initial.phase, { fromHistory:true, originIndex:stories.findIndex(story => story.id === initial.story) });
  else history.replaceState({ story:null, phase:'result' }, '', '#overview');
  syncFilms();
})();
