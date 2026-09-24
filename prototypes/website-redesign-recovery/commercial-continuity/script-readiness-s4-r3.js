const protectedStart = document.querySelector('#start-here');
const protectedDialog = document.querySelector('#decision-dialog');
const protectedShell = document.querySelector('.balance-shell');

let protectedPagePosition = { x: 0, y: 0, shellX: 0, shellY: 0 };

function rememberPagePosition() {
  protectedPagePosition = {
    x: window.scrollX,
    y: window.scrollY,
    shellX: protectedShell?.scrollLeft || 0,
    shellY: protectedShell?.scrollTop || 0,
  };
}

function restorePagePosition() {
  if (protectedShell && (Math.abs(protectedShell.scrollLeft - protectedPagePosition.shellX) >= 1 || Math.abs(protectedShell.scrollTop - protectedPagePosition.shellY) >= 1)) {
    protectedShell.scrollTo({ left: protectedPagePosition.shellX, top: protectedPagePosition.shellY, behavior: 'auto' });
  }
  if (Math.abs(window.scrollX - protectedPagePosition.x) >= 1 || Math.abs(window.scrollY - protectedPagePosition.y) >= 1) {
    window.scrollTo({ left: protectedPagePosition.x, top: protectedPagePosition.y, behavior: 'auto' });
  }
}

function settlePagePosition() {
  restorePagePosition();
  queueMicrotask(restorePagePosition);
  requestAnimationFrame(() => {
    restorePagePosition();
    requestAnimationFrame(restorePagePosition);
  });
  setTimeout(restorePagePosition, 0);
  setTimeout(restorePagePosition, 80);
}

function restorePageAndTriggerFocus() {
  restorePagePosition();
  protectedStart?.focus({ preventScroll: true });
}

protectedStart?.addEventListener('click', () => {
  rememberPagePosition();
  settlePagePosition();
}, { capture: true });

document.addEventListener('scroll', () => {
  if (protectedDialog?.open) requestAnimationFrame(restorePagePosition);
}, { capture: true, passive: true });

protectedDialog?.addEventListener('close', () => {
  restorePageAndTriggerFocus();
  requestAnimationFrame(() => {
    restorePageAndTriggerFocus();
    requestAnimationFrame(restorePageAndTriggerFocus);
  });
  setTimeout(restorePageAndTriggerFocus, 80);
});

protectedDialog?.addEventListener('cancel', () => {
  requestAnimationFrame(restorePageAndTriggerFocus);
});

if (protectedDialog) {
  new MutationObserver(() => {
    if (protectedDialog.open) settlePagePosition();
  }).observe(protectedDialog, { attributes: true, attributeFilter: ['open'] });
}

document.documentElement.dataset.decisionBalanceScrollLock = 'true';
