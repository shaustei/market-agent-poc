(() => {
  const STAMP_TEXT = '07.09.2026 · 10:00';
  function apply() {
    const root = document.getElementById('holdings');
    if (!root || root.children.length !== 12) return false;
    const chip = document.getElementById('content-state-chip');
    const text = document.getElementById('content-state');
    if (text) text.textContent = `Inhalte: ${STAMP_TEXT}`;
    if (chip) {
      chip.classList.remove('status-ok','status-error','status-closed');
      chip.classList.add('status-partial');
      chip.title = 'Teilaktualisierung: 12 Holdings technisch vollständig geladen; Inhaltsstand 07.09.2026 · 10:00.';
    }
    const footer = document.querySelector('footer.shell');
    if (footer) footer.textContent = 'Market Agent · Datenstand 07.09.2026 · 10:00 · Quellen in jedem Eintrag';
    return true;
  }
  [400,1200,3000,7000,15000].forEach(ms => setTimeout(apply, ms));
  document.addEventListener('click', () => setTimeout(apply, 0));
  window.addEventListener('pageshow', () => setTimeout(apply, 100));
})();
