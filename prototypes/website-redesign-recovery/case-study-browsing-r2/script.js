/* Proof Field S3 — behaviour.
 *
 * Three jobs, and one of them is new.
 *
 *   1. Films. Unchanged from S2: a small number play at once, none play under
 *      reduced motion or Save-Data, and each starts at its own offset so eight
 *      regions never march in step.
 *   2. The desktop record. Open in place, close from the ✕, from "All eight",
 *      or from Escape. Focus goes to the record's own heading and comes back to
 *      the tile that opened it.
 *   3. The figure's two states. New here. S2's phase toggle moved a hand-drawn
 *      glyph that read nothing from the record. This one moves the same figure
 *      production already ships, and every value it moves between is read off
 *      the record's own `story.figure` — the from-state and the to-state are
 *      both in the DOM as data, so the toggle cannot drift from the data the
 *      way a hand-authored glyph could.
 *
 * The phone runs none of item 2. There is no open and no close there: the rail
 * is the interface, every record is already whole, and this file only keeps the
 * counter, the segments and the arrows in step with where the rail has got to.
 */
(() => {
  const shell = document.querySelector('.proof-shell');
  if (!shell) return;

  const list = document.querySelector('.region-list');
  const regions = [...document.querySelectorAll('.region')];
  const live = document.querySelector('[data-live]');
  const dock = document.querySelector('.mobile-dock');
  const position = document.querySelector('[data-mobile-position]');
  const segments = [...document.querySelectorAll('[data-rail-segments] i')];
  const phone = window.matchMedia('(max-width: 860px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const total = regions.length;
  const pad = (n) => String(n).padStart(2, '0');

  const announce = (text) => { if (live) live.textContent = text; };
  const regionFor = (id) => regions.find(region => region.dataset.story === id) || null;

  /* ---- films ----------------------------------------------------------- */

  const films = [...document.querySelectorAll('.region-film')];
  let filmBatch = 0;
  let priorityFilm = null;

  const filmMayMove = () => !reducedMotion.matches && !saveData;
  const filmIsVisible = (film) => {
    const box = film.closest('.region').getBoundingClientRect();
    return box.bottom > 0 && box.top < window.innerHeight && box.right > 0 && box.left < window.innerWidth;
  };

  const scheduleFilms = () => {
    const moving = filmMayMove() && document.visibilityState === 'visible';
    shell.dataset.filmMotion = moving ? 'moving' : 'still';
    const visible = films.filter(filmIsVisible);
    const limit = phone.matches ? 2 : 4;
    const ordered = visible.length
      ? visible.map((_, i) => visible[(i + filmBatch) % visible.length])
      : [];
    const active = new Set(
      priorityFilm && visible.includes(priorityFilm)
        ? [priorityFilm, ...ordered.filter(f => f !== priorityFilm).slice(0, limit - 1)]
        : ordered.slice(0, limit)
    );
    films.forEach((film) => {
      if (moving && active.has(film)) film.play().catch(() => {});
      else film.pause();
    });
  };

  films.forEach((film) => {
    const setOffset = () => {
      const offset = Number(film.dataset.offset || 0);
      if (Number.isFinite(film.duration) && film.duration > 0) {
        film.currentTime = Math.min(offset, Math.max(0, film.duration - 0.1));
      }
    };
    if (film.readyState >= 1) setOffset();
    else film.addEventListener('loadedmetadata', setOffset, { once: true });
  });

  setInterval(() => { filmBatch += 1; scheduleFilms(); }, 9000);
  document.addEventListener('visibilitychange', scheduleFilms);
  reducedMotion.addEventListener('change', scheduleFilms);
  scheduleFilms();

  /* ---- the figure's two states ----------------------------------------- */
  /* Every number below is read from the element's own data attributes, which
   * the build writes straight out of `story.figure`. Nothing here is typed by
   * hand, which is the whole point of retiring the glyph. */

  const setFigure = (fig, atResult) => {
    const kind = fig.dataset.fig;

    if (kind === 'span') {
      const resolved = Number(fig.dataset.resolved || 0);
      const now = fig.querySelector('.mm-fig-bar.is-now');
      if (now) now.style.width = `${atResult ? resolved : 2}%`;
      return;
    }

    if (kind === 'focus') {
      const kept = Number(fig.dataset.kept || 0);
      [...fig.querySelectorAll('.mm-fig-marks i')].forEach((mark, i) => {
        mark.className = atResult ? (i < kept ? 'is-kept' : 'is-dim') : '';
      });
      const pair = fig.querySelectorAll('.mm-fig-pair b');
      if (pair.length === 2) pair[1].style.opacity = atResult ? '1' : '.28';
      return;
    }

    if (kind === 'cadence') {
      const from = Number(fig.dataset.from || 0);
      const to = Number(fig.dataset.to || 0);
      const on = atResult ? to : from;
      [...fig.querySelectorAll('.mm-fig-month i')].forEach((cell, i) => {
        cell.className = i < on ? 'is-on' : '';
      });
      return;
    }

    if (kind === 'count') {
      const value = Number(fig.dataset.value || 0);
      const node = fig.querySelector('.mm-fig-value');
      if (node) node.textContent = String(atResult ? value : 0);
      return;
    }

    if (kind === 'offer') {
      const scatter = (fig.dataset.scatter || '').trim().split(/\s+/)
        .map(pair => pair.split(',').map(Number));
      [...fig.querySelectorAll('.mm-fig-mark')].forEach((mark, i) => {
        const start = scatter[i] || [8, 28];
        mark.setAttribute('x', atResult ? String(14 + i * 18.6) : String(start[0]));
        mark.setAttribute('y', atResult ? '28' : String(start[1]));
        mark.setAttribute('width', atResult ? '12' : '4');
        mark.classList.toggle('is-set', atResult);
      });
    }
  };

  const applyPhase = (region, phase) => {
    const atResult = phase !== 'start';
    region.querySelectorAll('[data-fig]').forEach(fig => setFigure(fig, atResult));
    const button = region.querySelector('[data-toggle-phase]');
    if (button) {
      button.textContent = atResult ? 'Show starting point' : 'Show the result';
      button.setAttribute('aria-pressed', atResult ? 'false' : 'true');
    }
  };

  regions.forEach(region => applyPhase(region, 'result'));

  /* ---- the desktop record ----------------------------------------------- */

  let openId = null;
  let returnTo = null;

  const openStory = (id, { focus = true } = {}) => {
    const region = regionFor(id);
    if (!region || phone.matches) return;

    regions.forEach(other => other.classList.toggle('is-selected', other === region));
    /* The panel grows out of the side the tile is already on, so the record a
     * reader clicked does not jump across the field to open. */
    const box = region.getBoundingClientRect();
    const field = list.getBoundingClientRect();
    const onRight = (box.left + box.width / 2) > (field.left + field.width / 2);
    shell.dataset.mode = 'story';
    if (onRight) shell.dataset.side = 'right'; else delete shell.dataset.side;

    openId = id;
    priorityFilm = region.querySelector('.region-film');
    applyPhase(region, 'result');

    if (focus) {
      const heading = region.querySelector('.expanded-head h2');
      if (heading) heading.focus({ preventScroll: true });
    }
    const index = regions.indexOf(region);
    announce(`Record ${pad(index + 1)} of ${pad(total)} open.`);
    scheduleFilms();
  };

  const closeStory = ({ focus = true } = {}) => {
    if (!openId) return;
    const region = regionFor(openId);
    shell.dataset.mode = 'overview';
    delete shell.dataset.side;
    regions.forEach(other => other.classList.remove('is-selected'));
    if (region) applyPhase(region, 'result');
    openId = null;
    priorityFilm = null;
    if (focus) {
      const target = returnTo && returnTo.isConnected ? returnTo : (region && region.querySelector('.region-hit'));
      if (target) target.focus({ preventScroll: true });
    }
    returnTo = null;
    announce('All eight records.');
    scheduleFilms();
  };

  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-open-story]');
    if (opener && !phone.matches) {
      event.preventDefault();
      returnTo = opener;
      openStory(opener.dataset.openStory);
      return;
    }

    if (event.target.closest('[data-close-story]')) {
      event.preventDefault();
      closeStory();
      return;
    }

    const toggle = event.target.closest('[data-toggle-phase]');
    if (toggle) {
      event.preventDefault();
      const region = toggle.closest('.region');
      if (!region) return;
      const next = region.dataset.phase === 'start' ? 'result' : 'start';
      region.dataset.phase = next;
      shell.dataset.phase = next;
      applyPhase(region, next);
      announce(next === 'start' ? 'Showing the starting point.' : 'Showing the result.');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && openId) {
      event.preventDefault();
      closeStory();
    }
  });

  /* ---- the phone rail ---------------------------------------------------- */

  const railIndex = () => {
    if (!list) return 0;
    const middle = list.scrollLeft + list.clientWidth / 2;
    let best = 0;
    let bestGap = Infinity;
    regions.forEach((region, i) => {
      const centre = region.offsetLeft + region.offsetWidth / 2;
      const gap = Math.abs(centre - middle);
      if (gap < bestGap) { bestGap = gap; best = i; }
    });
    return best;
  };

  const syncRail = () => {
    if (!phone.matches) return;
    const i = railIndex();
    if (position) position.textContent = `${pad(i + 1)} / ${pad(total)}`;
    segments.forEach((seg, n) => seg.classList.toggle('is-on', n === i));
    scheduleFilms();
  };

  const railTo = (i) => {
    const region = regions[Math.max(0, Math.min(total - 1, i))];
    if (!region || !list) return;
    list.scrollTo({
      left: region.offsetLeft - (list.clientWidth - region.offsetWidth) / 2,
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
    });
  };

  if (list) {
    let frame = 0;
    list.addEventListener('scroll', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncRail);
    }, { passive: true });
  }

  if (dock) {
    dock.addEventListener('click', (event) => {
      if (event.target.closest('[data-mobile-prev]')) railTo(railIndex() - 1);
      if (event.target.closest('[data-mobile-next]')) railTo(railIndex() + 1);
    });
  }

  /* ---- the record anchor ------------------------------------------------- */
  /* `#record-{id}` is the fallback href on all eight tiles and the deep link
   * production already serves. It now lands inside the field itself rather than
   * in a separate archive, so it has to resolve on both compositions. */

  const goToHash = (options) => {
    const id = (location.hash || '').replace(/^#record-/, '');
    if (!id || id === location.hash) return;
    if (phone.matches) railTo(regions.indexOf(regionFor(id)));
    else openStory(id, options);
  };

  window.addEventListener('hashchange', () => goToHash({ focus: true }));
  window.addEventListener('resize', () => {
    if (phone.matches && openId) closeStory({ focus: false });
    syncRail();
  }, { passive: true });
  phone.addEventListener('change', () => {
    if (phone.matches && openId) closeStory({ focus: false });
    syncRail();
  });

  goToHash({ focus: false });
  syncRail();
})();
