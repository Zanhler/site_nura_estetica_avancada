(() => {
  const ZAP = '5547988164006';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const linkZap = (msg) => `https://wa.me/${ZAP}?text=${encodeURIComponent(msg)}`;

  /* ---------- flor: troca <use> pelo desenho real (para poder animar o traço) ---------- */
  const simbolo = $('#flor');
  $$('svg.flor').forEach((svg) => { svg.innerHTML = simbolo.innerHTML; });

  /* ---------- links de WhatsApp com mensagem pronta ---------- */
  const ligaZap = (el) => {
    el.href = linkZap(el.dataset.msg || 'Olá, NURA! Gostaria de agendar uma avaliação.');
    el.target = '_blank'; el.rel = 'noopener';
  };
  $$('.js-zap').forEach(ligaZap);

  /* ---------- capa entra ---------- */
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add('pronto'), 60));
  $('#ano').textContent = new Date().getFullYear();

  /* ---------- topo, progresso, botões fixos ---------- */
  const topo = $('#topo'), barra = $('.progresso'), wa = $('.wa'), barraM = $('.barra-m');
  let ultimo = 0;
  const aoRolar = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    barra.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    topo.classList.toggle('rolou', y > 30);
    topo.classList.toggle('some', y > 600 && y > ultimo && !topo.classList.contains('aberto'));
    wa.classList.toggle('mostra', y > 500);
    barraM.classList.toggle('mostra', y > 500);
    ultimo = y;
  };
  addEventListener('scroll', aoRolar, { passive: true }); aoRolar();

  // o botão do WhatsApp se abre sozinho uma vez, para chamar atenção
  setTimeout(() => { wa.classList.add('abre'); setTimeout(() => wa.classList.remove('abre'), 3500); }, 9000);

  const menu = $('.topo__menu');
  menu.addEventListener('click', () => {
    const ab = topo.classList.toggle('aberto');
    menu.setAttribute('aria-expanded', ab);
  });
  $$('.topo__nav a').forEach((a) => a.addEventListener('click', () => { topo.classList.remove('aberto'); menu.setAttribute('aria-expanded', false); }));

  // item do menu ativo
  const ioMenu = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (e.isIntersecting) $$('.topo__nav a').forEach((a) => a.classList.toggle('ativo', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('.topo__nav a').forEach((a) => { const s = $(a.getAttribute('href')); if (s) ioMenu.observe(s); });

  /* ---------- entradas no scroll ---------- */
  const io = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('visivel'); io.unobserve(e.target); }
  }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.js-in, .js-desenha, .hl').forEach((el) => io.observe(el));

  /* ---------- texto que acende palavra por palavra ---------- */
  const blocosP = $$('.js-palavras').map((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="p">${w}</span>`).join(' ');
    return { el, ps: $$('.p', el) };
  });
  const acende = () => {
    blocosP.forEach(({ el, ps }) => {
      const r = el.getBoundingClientRect();
      const ini = innerHeight * 0.85, fim = innerHeight * 0.35;
      const t = Math.min(1, Math.max(0, (ini - r.top) / (ini - fim + r.height * 0.5)));
      const n = Math.round(t * ps.length);
      ps.forEach((p, i) => p.classList.toggle('on', i < n));
    });
  };

  /* ---------- parallax ---------- */
  const para = $$('.js-parallax');
  const move = () => para.forEach((el) => {
    const r = el.getBoundingClientRect();
    const d = (r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.vel || 0);
    el.style.transform = `translate3d(0,${d}px,0)`;
  });

  /* ---------- linha do tempo do método ---------- */
  const etapas = $('#etapas'), itens = $$('.etapa');
  const trilho = () => {
    const r = etapas.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
    etapas.style.setProperty('--prog', p);
    itens.forEach((it) => it.classList.toggle('on', it.getBoundingClientRect().top < innerHeight * 0.62));
  };

  let tic = false;
  const quadro = () => { acende(); trilho(); if (!reduz) move(); tic = false; };
  addEventListener('scroll', () => { if (!tic) { tic = true; requestAnimationFrame(quadro); } }, { passive: true });
  addEventListener('resize', quadro); quadro();

  /* ---------- botões magnéticos ---------- */
  if (!reduz && matchMedia('(hover:hover)').matches) {
    $$('.js-ima').forEach((b) => {
      b.addEventListener('mousemove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--x', (e.clientX - r.left - r.width / 2) * 0.18 + 'px');
        b.style.setProperty('--y', (e.clientY - r.top - r.height / 2) * 0.3 + 'px');
      });
      b.addEventListener('mouseleave', () => { b.style.setProperty('--x', '0px'); b.style.setProperty('--y', '0px'); });
    });
  }

  /* ---------- antes & depois: faixa de cards girando sozinha ---------- */
  const CASOS = [
    { k: 'frontal',       t: 'Estrutura facial',        s: 'Mais estrutura, sem perder quem você é' },
    { k: 'olhar',         t: 'Toxina botulínica',       s: 'Menos marcas, mesma expressão' },
    { k: 'labios',        t: 'Preenchimento labial',    s: 'Proporção sem exageros' },
    { k: 'melasma',       t: 'Tratamento de melasma',   s: 'Controle e manutenção' },
    { k: 'capilar',       t: 'LED capilar',             s: 'Diferença já nas primeiras sessões' },
    { k: 'manchas',       t: 'Clareamento de manchas',  s: 'Tom mais uniforme' },
    { k: 'labios-perfil', t: 'Correção labial',         s: 'Contorno redefinido', p: '80% 50%' },
  ];
  const cartaoBa = (c, oculto) => {
    const pos = c.p ? ` style="object-position:${c.p}"` : '';
    return `
    <article class="caso"${oculto ? ' aria-hidden="true"' : ''}>
      <header class="caso__cab"><h3>${c.t}</h3><p>${c.s}</p></header>
      <div class="caso__par">
        <figure><img${pos} src="img/ba/${c.k}-antes.jpg" alt="${oculto ? '' : c.t + ' — antes'}" draggable="false"><figcaption>Antes</figcaption></figure>
        <figure><img${pos} src="img/ba/${c.k}-depois.jpg" alt="${oculto ? '' : c.t + ' — depois'}" draggable="false"><figcaption>Depois</figcaption></figure>
      </div>
    </article>`;
  };
  const faixaBa = $('#faixaBa');
  // a lista vai duas vezes: o laço anda -50% e emenda sem pulo
  faixaBa.innerHTML = CASOS.map((c) => cartaoBa(c, false)).join('') + CASOS.map((c) => cartaoBa(c, true)).join('');
  faixaBa.style.setProperty('--dur', CASOS.length * 6 + 's');

  /* ---------- tratamentos: abas com foto ---------- */
  const abasT = $$('.trat__abas button'), marcaT = $('.trat__marca');
  const marca = (b) => { marcaT.style.width = b.offsetWidth + 'px'; marcaT.style.transform = `translateX(${b.offsetLeft}px)`; };
  const abreT = (b) => {
    const k = b.dataset.painel;
    abasT.forEach((x) => x.setAttribute('aria-selected', x === b));
    $$('.trat__lista').forEach((l) => { const on = l.dataset.painel === k; l.hidden = !on; l.classList.toggle('on', on); });
    $$('.trat__foto img').forEach((im) => im.classList.toggle('on', im.dataset.painel === k));
    marca(b);
  };
  abasT.forEach((b) => b.addEventListener('click', () => abreT(b)));
  const marcaAtual = () => marca($('.trat__abas [aria-selected=true]'));
  addEventListener('load', marcaAtual);
  addEventListener('resize', marcaAtual);
  document.fonts && document.fonts.ready.then(marcaAtual);
  marcaAtual();

  /* ---------- pré-avaliação ---------- */
  const quiz = $('#quiz'), passos = $$('.quiz__passo', quiz);
  const bAv = $('#qAvancar'), bVo = $('#qVoltar'), qBarra = $('#qBarra'), nome = $('#qNome');
  const resp = { queixas: [], historico: '', periodo: '' };
  let atual = 1;
  const valido = () => (atual === 1 ? resp.queixas.length > 0 : atual === 2 ? !!resp.historico : atual === 3 ? !!resp.periodo : true);
  const render = () => {
    passos.forEach((p) => p.classList.toggle('on', +p.dataset.passo === atual));
    qBarra.style.width = Math.min(100, (atual / 3) * 100) + '%';
    bVo.hidden = atual === 1;
    bAv.style.display = atual === 4 ? 'none' : '';
    bAv.disabled = !valido();
    bAv.firstChild.textContent = atual === 3 ? 'Ver minha pré-avaliação ' : 'Continuar ';
    if (atual === 4) monta();
  };
  $$('.opcoes', quiz).forEach((g) => g.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const campo = g.dataset.nome;
    if (g.hasAttribute('data-multi')) {
      b.classList.toggle('on');
      resp[campo] = $$('button.on', g).map((x) => x.dataset.v);
    } else {
      $$('button', g).forEach((x) => x.classList.toggle('on', x === b));
      resp[campo] = b.dataset.v;
      bAv.disabled = false;
      if (atual === 2) setTimeout(() => { atual = 3; render(); }, 280);
      return;
    }
    bAv.disabled = !valido();
  }));
  bAv.addEventListener('click', () => { if (valido()) { atual++; render(); } });
  bVo.addEventListener('click', () => { atual = Math.max(1, atual - 1); render(); });
  function monta() {
    const n = nome.value.trim();
    $('#qResumo').innerHTML = `
      <dl>
        <dt>O que te incomoda</dt><dd>${resp.queixas.join(', ')}</dd>
        <dt>Histórico</dt><dd>${resp.historico}</dd>
        <dt>Melhor período</dt><dd>${resp.periodo[0].toUpperCase() + resp.periodo.slice(1)}</dd>
      </dl>`;
    const msg = `Olá, NURA! ${n ? `Meu nome é ${n}. ` : ''}Fiz a pré-avaliação no site:\n\n` +
      `• O que me incomoda: ${resp.queixas.join(', ')}\n• ${resp.historico}\n• Melhor período: ${resp.periodo}\n\nGostaria de agendar minha avaliação.`;
    $('#qEnviar').href = linkZap(msg);
  }
  render();

  /* ---------- contador da nota ---------- */
  $$('.js-conta').forEach((el) => {
    new IntersectionObserver((ents, o) => ents.forEach((e) => {
      if (!e.isIntersecting) return; o.disconnect();
      const alvo = parseFloat(el.dataset.alvo), t0 = performance.now();
      const f = (t) => { const k = Math.min(1, (t - t0) / 1400), v = alvo * (1 - Math.pow(1 - k, 3));
        el.textContent = v.toFixed(1).replace('.', ','); if (k < 1) requestAnimationFrame(f); };
      reduz ? (el.textContent = String(alvo).replace('.', ',')) : requestAnimationFrame(f);
    }), { threshold: 0.6 }).observe(el);
  });

  /* ---------- carrossel de depoimentos ---------- */
  const tr = $('.carrossel__trilho');
  const passoC = () => { const c = $('.cartao', tr); return c ? c.offsetWidth + 18 : 300; };
  $$('.carrossel__ctrl button').forEach((b) => b.addEventListener('click', () => tr.scrollBy({ left: passoC() * +b.dataset.dir, behavior: 'smooth' })));
  let px = 0, sx = 0, mexeu = false;
  tr.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; mexeu = true; px = e.clientX; sx = tr.scrollLeft; tr.classList.add('arrasta'); });
  addEventListener('pointermove', (e) => { if (mexeu) tr.scrollLeft = sx - (e.clientX - px); });
  addEventListener('pointerup', () => { if (mexeu) { mexeu = false; tr.classList.remove('arrasta'); } });
  // anda sozinho enquanto ninguém mexe
  let parado = false;
  tr.addEventListener('mouseenter', () => (parado = true));
  tr.addEventListener('mouseleave', () => (parado = false));
  tr.addEventListener('touchstart', () => (parado = true), { passive: true });
  if (!reduz) setInterval(() => {
    if (parado || document.hidden) return;
    const fim = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 8;
    tr.scrollTo({ left: fim ? 0 : tr.scrollLeft + passoC(), behavior: 'smooth' });
  }, 5000);
})();
