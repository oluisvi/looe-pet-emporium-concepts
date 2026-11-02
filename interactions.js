(() => {
  const buttons = [...document.querySelectorAll('[data-concept-button]')];
  const status = document.getElementById('concept-status');
  const labels = { harbour: 'Shop Window', counter: 'Pet Counter', community: 'Looe Pets' };
  const search = document.getElementById('range-search');
  const rangeItems = [...document.querySelectorAll('[data-range-item]')];
  const resultCount = document.getElementById('range-count');
  const emptyState = document.getElementById('range-empty');

  function selectConcept(name, { updateHistory = false, announce = true } = {}) {
    if (!Object.prototype.hasOwnProperty.call(labels, name)) name = 'harbour';
    document.body.dataset.concept = name;
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.conceptButton === name));
    });
    document.title = `Looe Pet Emporium — ${labels[name]}`;
    if (announce) status.textContent = `${labels[name]} direction selected`;
    if (updateHistory) {
      const url = new URL(location.href);
      if (url.searchParams.get('direction') !== name) {
        url.searchParams.set('direction', name);
        history.pushState({ concept: name }, '', url);
      }
    }
  }

  buttons.forEach((button) => button.addEventListener('click', () => {
    selectConcept(button.dataset.conceptButton, { updateHistory: true });
  }));

  function restoreConceptFromHistory() {
    selectConcept(new URL(location.href).searchParams.get('direction') || 'harbour', { announce: true });
  }
  window.addEventListener('popstate', restoreConceptFromHistory);
  selectConcept(new URL(location.href).searchParams.get('direction') || 'harbour', { announce: false });

  function normalize(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('en-GB').trim();
  }

  function filterRange() {
    const query = normalize(search.value);
    let visible = 0;
    rangeItems.forEach((item) => {
      const match = normalize(`${item.dataset.search} ${item.textContent}`).includes(query);
      item.hidden = !match;
      if (match) visible += 1;
    });
    resultCount.textContent = `${visible} ${visible === 1 ? 'area' : 'areas'} to explore`;
    emptyState.hidden = visible !== 0;
  }

  search.addEventListener('input', filterRange);
})();
