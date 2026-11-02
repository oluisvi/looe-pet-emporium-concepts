(() => {
  const buttons = [...document.querySelectorAll('[data-concept-button]')];
  const views = [...document.querySelectorAll('[data-view]')];
  const status = document.getElementById('concept-status');
  const labels = { harbor: 'Harbor Window', club: 'Pocket Pet Club', counter: 'Supply Counter' };

  function selectConcept(name, { updateHistory = false, announce = true } = {}) {
    if (!labels[name]) name = 'harbor';
    document.body.dataset.concept = name;
    buttons.forEach((button) => {
      const selected = button.dataset.conceptButton === name;
      button.setAttribute('aria-pressed', String(selected));
    });
    views.forEach((view) => { view.hidden = view.dataset.view !== name; });
    document.title = `Looe Pet Emporium — ${labels[name]}`;
    if (announce) status.textContent = `${labels[name]} concept selected`;
    if (updateHistory && location.hash !== `#${name}`) history.pushState({ concept: name }, '', `#${name}`);
  }

  buttons.forEach((button) => button.addEventListener('click', () => {
    selectConcept(button.dataset.conceptButton, { updateHistory: true });
  }));
  window.addEventListener('popstate', () => selectConcept(location.hash.slice(1), { announce: true }));
  window.addEventListener('hashchange', () => selectConcept(location.hash.slice(1), { announce: true }));
  selectConcept(location.hash.slice(1) || 'harbor', { announce: false });
})();
