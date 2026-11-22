(() => {
  const track = document.getElementById('testimonial-track');
  const dotsHost = document.getElementById('carousel-dots');
  if (track && dotsHost) {
    const cards = [...track.querySelectorAll('.testimonial-card')];
    const count = document.getElementById('carousel-count');
    let perView = window.matchMedia('(max-width: 680px)').matches ? 1 : 2;
    let activeGroup = 0;
    let updateTimer;

    const groupCount = () => Math.ceil(cards.length / perView);
    const cardStep = () => {
      if (!cards[0]) return 0;
      const style = getComputedStyle(track);
      return cards[0].getBoundingClientRect().width + parseFloat(style.columnGap || style.gap || '0');
    };
    const updateCount = () => {
      const first = activeGroup * perView + 1;
      const last = Math.min(first + perView - 1, cards.length);
      count.textContent = `${String(first).padStart(2, '0')}-${String(last).padStart(2, '0')} / ${cards.length}`;
      [...dotsHost.children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === activeGroup)));
    };
    const makeDots = () => {
      dotsHost.replaceChildren();
      for (let i = 0; i < groupCount(); i += 1) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Mostrar depoimentos ${i * perView + 1} a ${Math.min((i + 1) * perView, cards.length)}`);
        dot.addEventListener('click', () => goTo(i));
        dotsHost.append(dot);
      }
      updateCount();
    };
    const goTo = (group) => {
      activeGroup = (group + groupCount()) % groupCount();
      track.scrollTo({ left: activeGroup * perView * cardStep(), behavior: 'smooth' });
      updateCount();
    };
    document.querySelectorAll('.carousel-arrow').forEach(button => {
      button.addEventListener('click', () => goTo(activeGroup + (button.dataset.direction === 'next' ? 1 : -1)));
    });
    track.addEventListener('scroll', () => {
      window.clearTimeout(updateTimer);
      updateTimer = window.setTimeout(() => {
        const step = cardStep();
        if (!step) return;
        activeGroup = Math.max(0, Math.min(groupCount() - 1, Math.round(track.scrollLeft / step / perView)));
        updateCount();
      }, 90);
    }, { passive: true });
    track.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(activeGroup + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(activeGroup - 1); }
    });
    window.addEventListener('resize', () => {
      const nextPerView = window.matchMedia('(max-width: 680px)').matches ? 1 : 2;
      if (nextPerView !== perView) {
        perView = nextPerView;
        activeGroup = Math.min(activeGroup, groupCount() - 1);
        makeDots();
        track.scrollTo({ left: activeGroup * perView * cardStep(), behavior: 'instant' });
      }
    });
    makeDots();
  }

  const start = Date.parse('2026-11-25T03:00:00Z'); // 25/11, 00h em Bras�lia
  const end = Date.parse('2026-12-01T03:00:00Z'); // ap�s 30/11, 23h59 em Bras�lia
  const status = document.getElementById('offer-status');
  const statusText = status?.querySelector('span:last-child');
  const priceNodes = document.querySelectorAll('[data-price]');
  const contextNodes = document.querySelectorAll('[data-context]');
  const nextNodes = document.querySelectorAll('[data-next]');
  const checkoutButtons = document.querySelectorAll('.button-plan');

  const renderOffer = () => {
    const now = Date.now();
    const ended = now >= end;
    const later = now >= start;
    if (status && statusText) {
      status.classList.toggle('is-current', !ended);
      status.classList.toggle('is-ended', ended);
      statusText.textContent = ended
        ? 'Esta edi��o da Black foi encerrada.'
        : later
          ? 'Condi��o vigente at� 30/11/2026, �s 23h59 (hor�rio de Bras�lia).'
          : 'Condi��o de agilidade vigente at� 24/11/2026, �s 23h59 (hor�rio de Bras�lia).';
    }
    const values = later ? { annual: 'R$ 2.897', lifetime: 'R$ 3.697' } : { annual: 'R$ 2.597', lifetime: 'R$ 3.397' };
    priceNodes.forEach(node => { node.textContent = ended ? 'Oferta encerrada' : values[node.dataset.price]; });
    contextNodes.forEach(node => {
      node.textContent = ended ? 'Per�odo encerrado em 30/11/2026' : later ? 'At� 30/11/2026, �s 23h59 (Bras�lia)' : 'At� 24/11/2026, �s 23h59 (Bras�lia)';
    });
    nextNodes.forEach(node => { node.textContent = ended ? 'A p�gina apresenta as condi��es desta edi��o.' : later ? 'Pre�o vigente at� o encerramento da Black' : `A partir de 25/11: ${node.dataset.next === 'annual' ? 'R$ 2.897' : 'R$ 3.697'}`; });
    checkoutButtons.forEach(button => {
      button.textContent = ended ? 'Oferta encerrada' : 'Checkout oficial pendente';
      button.setAttribute('aria-label', ended ? 'Oferta encerrada' : 'Checkout oficial ainda n�o conectado');
    });
  };
  renderOffer();
  window.setInterval(renderOffer, 60_000);
})();

