/* ==========================================================================
   Marina Tarot · Odesa — interactions
   - sticky header
   - mobile drawer
   - floating socials (visible after hero, hidden at footer)
   - scroll reveal + counters + step line
   - accordion
   - tilt / cursor glow on cards
   - UA / RU language switch
   ========================================================================== */
(function () {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // Placeholder links remain clickable without navigating or scrolling.
  document.querySelectorAll('.nav-placeholder').forEach(link => link.addEventListener('click', event => event.preventDefault()));

  /* ---------- header ---------- */
  const header = $('#header');
  // Align the fixed header with the page width, excluding its scrollbar.
  const headerInner = $('.header__inner');
  const heroInner = $('.hero__inner');
  const syncHeaderWidth = () => {
    header.style.width = document.documentElement.clientWidth + 'px';
    if (window.innerWidth <= 1180) {
      const bounds = heroInner.getBoundingClientRect();
      headerInner.style.width = bounds.width + 'px';
      headerInner.style.marginLeft = bounds.left + 'px';
      headerInner.style.marginRight = '0';
    } else {
      headerInner.style.removeProperty('width');
      headerInner.style.removeProperty('margin-left');
      headerInner.style.removeProperty('margin-right');
    }
  };
  syncHeaderWidth();
  new ResizeObserver(syncHeaderWidth).observe(document.documentElement);
  new ResizeObserver(syncHeaderWidth).observe(heroInner);
  window.addEventListener('resize', syncHeaderWidth, { passive: true });
  const onScrollHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- hero fit ---------- */
  // Above 860px (landscape) the hero fills the screen. The description size
  // follows the width (CSS); the heading takes the largest size that keeps
  // three lines and lets the text column fit the available height.
  const heroSection = $('#hero');
  const heroText = $('.hero__text');
  const heroTitle = $('.hero__title');
  // Small viewport height (100svh) does not jump when mobile toolbars hide.
  // Styles for .screen-probe live in css/style.css.
  const screenProbe = document.createElement('div');
  screenProbe.className = 'screen-probe';
  document.body.appendChild(screenProbe);
  const HERO_VARS = ['--hero-title', '--hero-space', '--m-top', '--m-bottom', '--m-gap', '--m-img', '--m-title-k', '--m-title-lh', '--m-title-mb', '--m-eb-mb', '--m-p', '--m-p-lh', '--m-lead-mb'];
  const lerp = (a, b, t) => a + (b - a) * t;

  // Up to 860px the image sits above the text. "t" goes from 0 (comfortable)
  // to 1 (compact): the description shrinks 15.5 → 14.5px, the heading and the
  // spacing tighten, and the image takes whatever height is left.
  const fitHeroMobile = screenH => {
    const set = (name, value) => heroSection.style.setProperty(name, value);
    const pMax = window.innerWidth <= 480 ? 14.5 : 15.5; // phones keep the description at 14.5px
    const apply = t => {
      set('--m-p', lerp(pMax, 14.5, t).toFixed(3) + 'px');
      set('--m-p-lh', lerp(1.65, 1.5, t).toFixed(3));
      set('--m-title-k', lerp(1, 0.8, t).toFixed(3));
      set('--m-title-lh', lerp(1.6, 1.25, t).toFixed(3));
      set('--m-eb-mb', lerp(8, 6, t).toFixed(2) + 'px');
      set('--m-title-mb', lerp(12, 8, t).toFixed(2) + 'px');
      set('--m-lead-mb', lerp(10, 6, t).toFixed(2) + 'px');
      set('--m-gap', lerp(16, 10, t).toFixed(2) + 'px');
      set('--m-top', lerp(12, 8, t).toFixed(2) + 'px');
      set('--m-bottom', lerp(20, 10, t).toFixed(2) + 'px');
    };
    const room = () => {
      const cs = getComputedStyle(heroSection);
      return Math.floor(screenH - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
        - parseFloat(getComputedStyle(heroInner).rowGap) - heroText.offsetHeight) - 1;
    };
    const width = heroInner.clientWidth;
    const imgComfort = Math.min(Math.max(width * 0.72, 200), 340);
    const imgFloor = Math.min(Math.max(width * 0.42, 140), 220);

    heroSection.classList.add('hero--fit');
    apply(0);
    const space = room();
    if (space >= imgComfort) { set('--m-img', space + 'px'); return; }
    apply(1);
    if (room() < imgFloor) { set('--m-img', Math.floor(imgFloor) + 'px'); return; }
    let lo = 0, hi = 1;
    for (let i = 0; i < 10; i++) {
      const t = (lo + hi) / 2;
      apply(t);
      if (room() >= lerp(imgComfort, imgFloor, t)) hi = t; else lo = t;
    }
    apply(hi);
    set('--m-img', Math.floor(room()) + 'px');
  };

  const fitHero = () => {
    HERO_VARS.forEach(name => heroSection.style.removeProperty(name));
    heroSection.classList.remove('hero--fit');
    const screenH = screenProbe.offsetHeight || window.innerHeight;
    if (window.innerWidth <= 860) { fitHeroMobile(screenH); return; }
    if (screenH > window.innerWidth) return;
    const cs = getComputedStyle(heroSection);
    const avail = Math.floor(screenH - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)) - 1;
    const kids = heroText.children;
    const contentH = () => {
      const first = kids[0], last = kids[kids.length - 1];
      return last.offsetTop + last.offsetHeight - first.offsetTop;
    };
    const fits = () => {
      const fontSize = parseFloat(getComputedStyle(heroTitle).fontSize);
      return contentH() <= avail && heroTitle.offsetHeight <= fontSize * 1.6 * 3 + 2;
    };
    let lo = 24, hi = 64;
    for (let i = 0; i < 10; i++) {
      const size = (lo + hi) / 2;
      heroSection.style.setProperty('--hero-title', size.toFixed(2) + 'px');
      if (fits()) lo = size; else hi = size;
    }
    heroSection.style.setProperty('--hero-title', lo.toFixed(2) + 'px');
    // When the heading is limited by the column width, spread the leftover
    // height between the blocks (up to 64px; the rest stays centered).
    const space = Math.min(Math.max(avail - contentH(), 0), 64);
    heroSection.style.setProperty('--hero-space', Math.floor(space) + 'px');
  };
  // Refit only when the width or the small viewport height really changes.
  let fitFrame = 0, fitKey = '';
  const scheduleFit = () => {
    cancelAnimationFrame(fitFrame);
    fitFrame = requestAnimationFrame(() => {
      const key = window.innerWidth + 'x' + screenProbe.offsetHeight;
      if (key !== fitKey) { fitKey = key; fitHero(); }
    });
  };
  fitHero();
  window.addEventListener('resize', scheduleFit, { passive: true });
  // fonts.ready can resolve before the web fonts even start loading, so refit once they arrive too.
  if (document.fonts) {
    document.fonts.ready.then(fitHero);
    document.fonts.addEventListener('loadingdone', fitHero);
  }
  window.addEventListener('load', fitHero);

  /* ---------- drawer ---------- */
  const drawer = $('#drawer');
  const burger = $('#burger');
  const openDrawer = () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  };
  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };
  burger.addEventListener('click', () => drawer.classList.contains('is-open') ? closeDrawer() : openDrawer());
  $$('[data-drawer-close]').forEach(el => el.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 1180) closeDrawer(); });

  /* ---------- floating socials ---------- */
  const floatSocials = $('#floatSocials');
  const hero = $('#hero');
  const footer = $('#footer');
  let pastHero = false, atFooter = false;
  const updateSocials = () => floatSocials.classList.toggle('is-visible', pastHero && !atFooter);

  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; updateSocials(); },
    { threshold: 0, rootMargin: '-80px 0px 0px 0px' }).observe(hero);
  new IntersectionObserver(([e]) => { atFooter = e.isIntersecting; updateSocials(); },
    { threshold: 0.05 }).observe(footer);

  /* ---------- reveal ---------- */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      revealObs.unobserve(e.target);
      $$('[data-count]', e.target).forEach(runCounter);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => revealObs.observe(el));

  const steps = $('.steps');
  if (steps) new IntersectionObserver(([e], obs) => { if (e.isIntersecting) { steps.classList.add('is-in'); obs.disconnect(); } }, { threshold: 0.3 }).observe(steps);

  function runCounter(el) {
    const target = +el.dataset.count;
    const dur = 1400, start = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (el.dataset.prefix || '') + Math.round(target * eased) + (el.dataset.suffix || '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- accordion ---------- */
  $$('.acc').forEach(acc => {
    const btn = $('.acc__btn', acc);
    btn.addEventListener('click', () => {
      const open = acc.classList.contains('is-open');
      $$('.acc.is-open').forEach(o => { o.classList.remove('is-open'); $('.acc__btn', o).setAttribute('aria-expanded', 'false'); });
      if (!open) { acc.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
  const firstAcc = $('.acc');
  if (firstAcc) { firstAcc.classList.add('is-open'); $('.acc__btn', firstAcc).setAttribute('aria-expanded', 'true'); }

  /* ---------- tilt + cursor glow ---------- */
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine) {
    $$('.tilt').forEach(el => {
      const strength = el.classList.contains('card') ? 5 : 7;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * strength}deg) rotateY(${(x - 0.5) * strength}deg) translateY(-4px)`;
        el.style.setProperty('--mx', `${x * 100}%`);
        el.style.setProperty('--my', `${y * 100}%`);
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- active nav on scroll ---------- */
  const navLinks = $$('.nav__link[href^="#"]:not(.nav-placeholder)');
  const sections = navLinks.map(l => $(l.getAttribute('href'))).filter(Boolean);
  if (sections.length) {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' }).observe(sections[sections.length - 1]);
    window.addEventListener('scroll', () => { if (window.scrollY < 300) { navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#top')); } }, { passive: true });
  }

  /* ---------- i18n ---------- */
  const RU = {
    'meta.title': 'Консультация таролога в Одессе — расклады на картах Таро',
    'meta.description': 'Консультация таролога в Одессе и онлайн по Украине. Индивидуальные расклады Таро для важных решений, сложных ситуаций и прогноза возможных изменений.',
    'nav.home': 'Главная', 'nav.taro': 'Раздел', 'nav.astro': 'Раздел', 'nav.proc': 'Раздел',
    'drawer.title': 'Меню',
    'hero.eyebrow': 'Одесса · онлайн по всей Украине',
    'hero.title': 'Консультация <span class="accent">таролога</span> Одесса',
    'hero.p1': 'Карты Таро — это чёткий инструмент анализа и прогнозирования, который помогает разобраться в сложной ситуации, расставить приоритеты и разглядеть будущие перспективы.',
    'hero.p2': 'Глубокая диагностика на Таро позволяет заранее выявить скрытые риски, понять мотивы других людей и осторожно обойти подводные камни. Благодаря этому вы перестаёте действовать вслепую, избавляетесь от тревоги за завтрашний день и принимаете взвешенные решения с ощущением полной уверенности.',
    'stats.title': 'Почему выбирают <span class="accent">именно меня</span>',
    'stats.experience': 'лет опыта', 'stats.clients': 'довольных клиентов', 'stats.privacy': 'конфиденциальность',
    'hero.chip1': 'Очно в Одессе и онлайн', 'hero.chip2': 'Ответ в день обращения',
    'marquee': 'Любовь · Работа · Деньги · Семья · Прогноз · Развитие ·&nbsp;',
    'when.title': 'Когда стоит <span class="accent">обратиться к</span> картам Таро',
    'when.p1': 'Иногда сложно увидеть ситуацию объективно, особенно когда решение касается личной жизни, важных перемен или неопределённого будущего. В таких случаях расклад Таро помогает остановиться, посмотреть на события шире и лучше понять, что происходит сейчас.',
    'when.p2': 'Такой расклад не просто отвечает на отдельный вопрос, а помогает лучше понять саму ситуацию, её причины и возможные направления дальнейшего развития.',
    'when.listTitle': 'К консультации часто обращаются, когда:',
    'when.li1': 'нужно принять важное решение;',
    'when.li2': 'сложно понять причины повторяющихся событий;',
    'when.li3': 'есть ощущение неопределённости или внутреннего сомнения;',
    'when.li4': 'ситуация развивается не так, как ожидалось;',
    'when.li5': 'впереди важные перемены и хочется лучше к ним подготовиться;',
    'when.li6': 'нужно увидеть возможные последствия разных вариантов действий;',
    'when.li7': 'сложно самостоятельно определить, на что сейчас стоит обратить внимание.',
    'dir.title': '<span class="line">С какими темами часто</span> <span class="line">обращаются к <span class="accent">Таро</span></span>',
    'dir.c1t': 'Любовь и отношения',
    'dir.c1p': 'Что на самом деле чувствует партнёр, куда движутся ваши отношения, как распутать конфликт, есть ли перспектива примирения и чего ждать от новых знакомств.',
    'dir.c2t': 'Работа и карьера',
    'dir.c2p': 'Стоит ли менять работу именно сейчас, что принесёт новое предложение, как развивать собственный бизнес и где искать профессиональную реализацию.',
    'dir.c3t': 'Деньги и ресурсы',
    'dir.c3p': 'Почему возник застой в доходах, как выйти из финансовой ямы, где скрыты новые возможности для заработка и какую денежную стратегию выбрать.',
    'dir.c4t': 'Семья и близкие',
    'dir.c4p': 'Как найти общий язык с родными, уладить затяжные споры, наладить контакт с детьми и вернуть покой в дом.',
    'dir.c5t': 'Прогноз на будущее',
    'dir.c5p': 'Чего ждать в ближайший месяц или конкретный период, к каким событиям стоит подготовиться заранее и как не упустить свой шанс.',
    'dir.c6t': 'Личностное развитие',
    'dir.c6p': 'Что тормозит ваше движение вперёд, какие страхи и убеждения мешают расти и на чём сосредоточить внимание, чтобы изменить жизнь к лучшему.',
    'proc.title': '<span class="line">Как проходит</span> <span class="line">консультация <span class="accent">таролога</span></span>',
    'proc.s1t': 'Вы описываете ситуацию',
    'proc.s1p': 'Коротко рассказываете, что произошло и какой момент вызывает больше всего тревоги или вопросов.',
    'proc.s2t': 'Формулируем вопросы',
    'proc.s2p': 'Вместе определяем основные вопросы, чтобы расклад был конкретным и соответствовал вашей ситуации.',
    'proc.s3t': 'Делаю расклад',
    'proc.s3p': 'Подбираю подходящий формат расклада и работаю с картами Таро в соответствии с вашим запросом.',
    'proc.s4t': 'Получаете объяснение',
    'proc.s4p': 'Объясняю значение карт, их взаимосвязь и возможные сценарии развития ситуации.',
    'ben.title': 'При <span class="accent">обращении</span> вы получаете',
    'ben.b1': 'Конфиденциальность', 'ben.b2': 'Индивидуальный расклад', 'ben.b3': 'Глубокая трактовка', 'ben.b4': 'Понятное объяснение',
    'about.title': '<span class="line">Таролог</span> <span class="line">Марина</span>',
    'about.badge': 'лет с картами Таро',
    'about.p1': 'Меня зовут Марина. Более 20 лет я работаю с картами Таро как с инструментом предсказания, анализа жизненных ситуаций и поиска возможных сценариев развития событий.',
    'about.p2': 'За годы практики я имела дело с разными запросами — от личных отношений и семейных вопросов до работы, финансов, сложного выбора и периодов больших перемен.',
    'about.p3': 'Во время консультации моя задача — не просто озвучить значение карт, а помочь вам лучше понять свою ситуацию, увидеть важные детали и возможные последствия разных решений.',
    'about.p4': 'Я работаю спокойно, без запугиваний и категоричных «приговоров». Вы получаете понятную трактовку, индивидуальный подход и полную конфиденциальность.',
    'fmt.title': 'Форматы <span class="accent">консультации</span>',
    'fmt.f1t': 'Очная консультация таролога',
    'fmt.f1p': 'Личная встреча и проведение расклада вживую. Вы можете подробно описать ситуацию, задать дополнительные вопросы и получить трактовку карт непосредственно во время консультации.',
    'fmt.f1btn': 'Написать в Telegram', 'fmt.f1tag': 'Одесса',
    'fmt.f2t': 'Онлайн-консультация таролога',
    'fmt.f2p': 'Консультацию можно пройти дистанционно независимо от вашего города или страны. Вы описываете ситуацию и формулируете вопросы, после чего проводится расклад и предоставляется его подробная трактовка.',
    'fmt.f2btn': 'Написать в Telegram', 'fmt.f2tag': 'Вся Украина',
    'faq.title': '<span class="line">Частые</span> <span class="line accent">вопросы</span> <span class="line">о таро</span>',
    'faq.hint': 'Короткие пояснения помогут лучше понять, как проходит консультация, чего ожидать от расклада и какие моменты стоит учесть заранее.',
    'faq.q1': 'Насколько точно карты Таро предсказывают будущее?',
    'faq.a1': 'Расклад показывает возможное развитие ситуации в соответствии с обстоятельствами, которые существуют на момент консультации. Решения человека и новые события могут менять дальнейший сценарий, поэтому Таро лучше использовать как инструмент прогнозирования и анализа возможных вариантов развития событий.',
    'faq.q2': 'На какой период можно сделать прогноз Таро?',
    'faq.a2': 'Период зависит от самого вопроса. Это может быть ближайший месяц, несколько месяцев или конкретный этап жизни. Чем точнее определён период, тем конкретнее можно построить расклад.',
    'faq.q3': 'Можно ли задавать Таро вопросы, на которые нужен ответ «да» или «нет»?',
    'faq.a3': 'Можно, но более полезными обычно являются открытые вопросы. Вместо простого «Стоит ли мне менять работу?» лучше рассмотреть, что может дать смена работы, какие трудности возможны и что стоит учесть перед решением.',
    'faq.q4': 'Можно ли сделать несколько раскладов на разные темы за одну консультацию?',
    'faq.a4': 'Да, если вопросы связаны между собой или формат консультации позволяет рассмотреть несколько тем. Если запросов много, лучше определить самые важные, чтобы каждый из них можно было рассмотреть достаточно подробно.',
    'faq.q5': 'Как узнать точную стоимость расклада?',
    'faq.a5': 'Стоимость формируется в зависимости от сложности и детализации вашего запроса (от короткого расклада на один деликатный момент до полной часовой консультации). Вы можете описать вашу ситуацию в сообщении, и я предложу оптимальный формат и назову точную цену до начала работы.',
    'foot.desc': 'Консультации таролога в Одессе и онлайн по Украине. Индивидуальные расклады Таро для важных решений, сложных ситуаций и прогноза возможных изменений.',
    'foot.socLabel': 'Социальные сети', 'foot.contactLabel': 'Контакты',
    'foot.city': 'Одесса и весь мир',
    'foot.copy': '© 2026 <span class="accent">ZverinaLev production</span>. Все права защищены.'
  };

  const UK = {};
  $$('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (!(k in UK)) UK[k] = el.innerHTML; });
  $$('[data-i18n-content]').forEach(el => { const k = el.dataset.i18nContent; if (!(k in UK)) UK[k] = el.getAttribute('content'); });

  function setLang(lang) {
    const dict = lang === 'ru' ? RU : UK;
    $$('[data-i18n]').forEach(el => { const v = dict[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    $$('[data-i18n-content]').forEach(el => { const v = dict[el.dataset.i18nContent]; if (v != null) el.setAttribute('content', v); });
    document.documentElement.lang = lang;
    $$('.lang__btn').forEach(b => b.classList.toggle('is-active', b.dataset.lang === lang));
    try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
    fitHero();
  }
  $$('.lang__btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) { /* ignore */ }
  if (saved === 'ru') setLang('ru');
})();

// Keep the starting desktop benefits panel as tall as the consultation card.
(() => {
  const panel = document.querySelector('.benefits__row');
  const steps = document.querySelector('.steps');
  const card = document.querySelector('.formats__grid .format');
  const icon = panel?.querySelector('.benefit__icon');
  if (!panel || !card || !icon) return;
  const desktop = window.matchMedia('(min-width: 1341px)');
  const syncBenefitsHeight = () => {
    if (!desktop.matches) {
      panel.style.removeProperty('--consultation-card-height');
      steps?.style.removeProperty('--consultation-card-height');
      panel.style.removeProperty('--benefits-line-top');
      return;
    }
    panel.style.setProperty('--consultation-card-height', `${card.offsetHeight}px`);
    steps?.style.setProperty('--consultation-card-height', card.offsetHeight + 'px');
    const benefit = icon.closest('.benefit');
    panel.style.setProperty('--benefits-line-top', `${benefit.offsetTop + icon.offsetTop + icon.offsetHeight / 2}px`);
  };
  const observer = new ResizeObserver(syncBenefitsHeight);
  observer.observe(card);
  observer.observe(panel);
  desktop.addEventListener('change', syncBenefitsHeight);
  document.fonts.ready.then(syncBenefitsHeight);
  syncBenefitsHeight();
})();