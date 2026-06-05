/* ==========================================================
   ALFA MOTORS · Interactions & GSAP animations
   ========================================================== */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     1. Year
  ---------------------------------------------------------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     2. Navbar scroll state + mobile menu
  ---------------------------------------------------------- */
  const nav = $('#nav');
  const burger = $('#navBurger');
  const navMobile = $('#navMobile');

  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger && navMobile) {
    burger.addEventListener('click', () => {
      const open = navMobile.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('a', navMobile).forEach(a => {
      a.addEventListener('click', () => {
        navMobile.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ----------------------------------------------------------
     3. Hero loading carousel (cult-ui port · Alfa Motors)
  ---------------------------------------------------------- */
  const CARS = [
    {
      file: 'VOLKSWAGEN-AMAROK-HIGHLINE-V6-2025-0km.png',
      tag: '0KM · PREMIUM',
      title: 'VW Amarok Highline V6',
      year: '2025',
      specs: [
        { label: 'Km', value: '0' },
        { label: 'Motor', value: 'V6' },
        { label: 'Versión', value: 'Highline' },
        { label: 'Combust.', value: 'Diésel' },
      ],
    },
    {
      file: 'Toyota-Corolla-Cross-2_0-XLi-Año-2024-Solo-19_000kms.png',
      tag: 'PREMIUM · 19.000 KM',
      title: 'Toyota Corolla Cross 2.0 XLi',
      year: '2024',
      specs: [
        { label: 'Km', value: '19.000' },
        { label: 'Motor', value: '2.0' },
        { label: 'Versión', value: 'XLi' },
        { label: 'Tipo', value: 'SUV' },
      ],
    },
    {
      file: 'CHERY-TIGGO-7-PRO-2026.png',
      tag: '0KM · NUEVO',
      title: 'Chery Tiggo 7 Pro',
      year: '2026',
      specs: [
        { label: 'Km', value: '0' },
        { label: 'Versión', value: 'Pro' },
        { label: 'Tipo', value: 'SUV' },
        { label: 'Línea', value: '2026' },
      ],
    },
    {
      file: 'CHEVROLET-TRACKER-2023-82.000kms-PrimeraMano-1_2Turbo-AT.png',
      tag: 'PRIMERA MANO',
      title: 'Chevrolet Tracker',
      year: '2023',
      specs: [
        { label: 'Km', value: '82.000' },
        { label: 'Motor', value: '1.2 T' },
        { label: 'Caja', value: 'AT' },
        { label: 'Histórico', value: '1ª Mano' },
      ],
    },
    {
      file: 'VOLKSWAGEN-GOLF-GTI-2017.png',
      tag: 'SPORT · DESTACADO',
      title: 'VW Golf GTI',
      year: '2017',
      specs: [
        { label: 'Versión', value: 'GTI' },
        { label: 'Motor', value: '2.0 T' },
        { label: 'Combust.', value: 'Nafta' },
        { label: 'Tipo', value: 'Sport' },
      ],
    },
    {
      file: 'Volkswagen-T_cross1_6_Trendline-2021-102000km.png',
      tag: 'USADO · GARANTIZADO',
      title: 'VW T-Cross 1.6 Trendline',
      year: '2021',
      specs: [
        { label: 'Km', value: '102.000' },
        { label: 'Motor', value: '1.6' },
        { label: 'Versión', value: 'Trendline' },
        { label: 'Tipo', value: 'SUV' },
      ],
    },
    {
      file: 'Chevrolet-CruzLT-2018-119000km.png',
      tag: 'USADO · GARANTIZADO',
      title: 'Chevrolet Cruze LT',
      year: '2018',
      specs: [
        { label: 'Km', value: '119.000' },
        { label: 'Versión', value: 'LT' },
        { label: 'Combust.', value: 'Nafta' },
        { label: 'Tipo', value: 'Sedán' },
      ],
    },
    {
      file: 'CITROEN-BERLINGO-HDI-5PLAZAS-2014-147000kms-Diesel.png',
      tag: 'DIÉSEL · 5 PLAZAS',
      title: 'Citroën Berlingo HDI',
      year: '2014',
      specs: [
        { label: 'Km', value: '147.000' },
        { label: 'Motor', value: 'HDI' },
        { label: 'Plazas', value: '5' },
        { label: 'Combust.', value: 'Diésel' },
      ],
    },
    {
      file: 'VOLKSWAGEN-FOX-2006-145000kms.png',
      tag: 'USADO · ACCESIBLE',
      title: 'VW Fox',
      year: '2006',
      specs: [
        { label: 'Km', value: '145.000' },
        { label: 'Combust.', value: 'Nafta' },
        { label: 'Tipo', value: 'Hatch' },
        { label: 'Año', value: '2006' },
      ],
    },
  ];

  const SLIDE_MS = 5000;
  const stack = $('#loaderStack');
  const dotsWrap = $('#heroDots');
  const numEl = $('#loaderCurrent');
  const totalEl = $('#loaderTotal');
  const barEl = $('#loaderBar');
  const tagEl = $('#loaderTag');
  const yearEl2 = $('#loaderYear');
  const titleEl = $('#loaderTitle');
  const specsEl = $('#loaderSpecs');
  const playBtn = $('#loaderPlay');
  const prevBtn = $('#loaderPrev');
  const nextBtn = $('#loaderNext');
  const carouselEl = $('.loader-carousel');

  if (stack && carouselEl) {
    const pad = (n) => String(n).padStart(2, '0');
    let current = 0;
    let timer = null;
    let isPaused = false;

    // Build slides
    CARS.forEach((car, i) => {
      const div = document.createElement('div');
      div.className = 'loader-carousel__slide' + (i === 0 ? ' is-active' : '');
      div.dataset.slide = i;
      div.innerHTML = `<img src="Autos_Imagenes/${car.file}" alt="${car.title} ${car.year}" loading="${i === 0 ? 'eager' : 'lazy'}" />`;
      stack.appendChild(div);
    });

    // Build dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      CARS.forEach((_, i) => {
        const b = document.createElement('button');
        b.className = 'hero__dot' + (i === 0 ? ' is-active' : '');
        b.dataset.go = i;
        b.setAttribute('aria-label', `Vehículo ${i + 1}`);
        b.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsWrap.appendChild(b);
      });
    }

    if (totalEl) totalEl.textContent = pad(CARS.length);

    const slideEls = $$('.loader-carousel__slide', stack);
    const dotEls = dotsWrap ? $$('.hero__dot', dotsWrap) : [];

    const renderInfo = (i) => {
      const car = CARS[i];
      if (tagEl) tagEl.textContent = car.tag;
      if (yearEl2) yearEl2.textContent = car.year;
      if (titleEl) titleEl.textContent = car.title.toUpperCase();
      if (specsEl) {
        specsEl.innerHTML = car.specs.map(s => `<li><strong>${s.value}</strong><span>${s.label}</span></li>`).join('');
      }
      if (numEl) numEl.textContent = pad(i + 1);
    };

    const animateBar = () => {
      if (!barEl) return;
      barEl.style.transition = 'none';
      barEl.style.width = '0%';
      // Force reflow so the next transition runs
      void barEl.offsetWidth;
      barEl.style.transition = `width ${SLIDE_MS}ms linear`;
      barEl.style.width = '100%';
    };

    const goTo = (i) => {
      const next = (i + CARS.length) % CARS.length;
      if (next === current) return;
      slideEls[current]?.classList.remove('is-active');
      dotEls[current]?.classList.remove('is-active');
      current = next;
      slideEls[current]?.classList.add('is-active');
      dotEls[current]?.classList.add('is-active');
      renderInfo(current);
      animateBar();
    };

    const tick = () => goTo(current + 1);

    const startAuto = () => {
      stopAuto();
      if (prefersReduced || isPaused) return;
      animateBar();
      timer = setInterval(tick, SLIDE_MS);
    };
    const stopAuto = () => { if (timer) { clearInterval(timer); timer = null; } };
    const resetAuto = () => { stopAuto(); startAuto(); };

    prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    playBtn?.addEventListener('click', () => {
      isPaused = !isPaused;
      carouselEl.classList.toggle('is-paused', isPaused);
      playBtn.setAttribute('aria-label', isPaused ? 'Reanudar reproducción automática' : 'Pausar reproducción automática');
      if (isPaused) {
        stopAuto();
        if (barEl) {
          const computed = getComputedStyle(barEl).width;
          barEl.style.transition = 'none';
          barEl.style.width = computed;
        }
      } else {
        startAuto();
      }
    });

    // Pause on hover (desktop nicety)
    carouselEl.addEventListener('mouseenter', () => { if (!isPaused) stopAuto(); });
    carouselEl.addEventListener('mouseleave', () => { if (!isPaused) startAuto(); });

    // Init
    renderInfo(0);
    startAuto();
  }

  /* ----------------------------------------------------------
     4. GSAP animations
  ---------------------------------------------------------- */
  if (window.gsap && !prefersReduced) {
    gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance */
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero__eyebrow', { y: 20, opacity: 0, duration: .8 })
      .from('.hero__title-line', { y: 60, opacity: 0, duration: 1, stagger: .12 }, '-=.4')
      .from('.hero__sub', { y: 20, opacity: 0, duration: .8 }, '-=.6')
      .from('.hero__cta .btn', { y: 20, opacity: 0, duration: .6, stagger: .1 }, '-=.5')
      .from('.hero__controls', { y: 10, opacity: 0, duration: .5 }, '-=.4')
      .from('.hero__dash', { y: -20, opacity: 0, duration: .9 }, '-=1.2')
      .from('.hero__scroll', { opacity: 0, duration: .8 }, '-=.4');

    /* Hero car subtle parallax */
    gsap.to('.hero__stage', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    gsap.to('.hero__copy', {
      yPercent: -8,
      opacity: .7,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    /* Glow drift */
    gsap.to('.hero__glow--1', {
      x: 60, y: 30, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
    gsap.to('.hero__glow--2', {
      x: -50, y: -20, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });

    /* Reveal sections */
    $$('.reveal').forEach((el) => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: .9, ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    /* Section titles slight reveal */
    $$('.section-title').forEach((el) => {
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    /* Finance bar fill */
    const bar = $('.finance__panel-bar-fill');
    if (bar) {
      gsap.fromTo(bar,
        { width: '0%' },
        {
          width: '65%', duration: 1.6, ease: 'power3.out',
          scrollTrigger: { trigger: bar, start: 'top 85%' }
        }
      );
    }

    /* CTA final pulse on view */
    gsap.fromTo('.cta-final__title',
      { scale: .94, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-final', start: 'top 70%' }
      }
    );

  } else {
    /* Fallback IntersectionObserver if GSAP missing */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  }

  /* ----------------------------------------------------------
     5. Car expandable screen (cult-ui port)
  ---------------------------------------------------------- */
  const CAR_DETAILS = {
    'amarok-v6-2025': {
      brand: 'Volkswagen',
      model: 'Amarok',
      year: '2025',
      version: 'Highline V6 4x4 AT',
      color: 'Gris Indium',
      fuel: 'Diésel',
      doors: '4',
      transmission: 'Automática 8 vel.',
      engine: '3.0 V6 TDI',
      power: '258 CV',
      km: '0 km',
      tag: '0KM · PREMIUM',
      image: 'Autos_Imagenes/VOLKSWAGEN-AMAROK-HIGHLINE-V6-2025-0km.png',
      title: 'VW Amarok Highline V6',
      subtitle: 'Pickup full equipo · Tracción 4x4 permanente',
      price: 'Consultar',
      waText: 'me interesa la Amarok Highline V6 2025 0km',
    },
    'golf-gti-2017': {
      brand: 'Volkswagen',
      model: 'Golf',
      year: '2017',
      version: 'GTI 2.0 TSI DSG',
      color: 'Blanco Puro',
      fuel: 'Nafta',
      doors: '5',
      transmission: 'Automática DSG',
      engine: '2.0 TSI Turbo',
      power: '220 CV',
      km: '95.000 km',
      tag: 'SPORT · DESTACADO',
      image: 'Autos_Imagenes/VOLKSWAGEN-GOLF-GTI-2017.png',
      title: 'VW Golf GTI',
      subtitle: 'Hot hatch icónico · Llantas deportivas',
      price: 'Consultar',
      waText: 'me interesa el VW Golf GTI 2017',
    },
    'tracker-2023': {
      brand: 'Chevrolet',
      model: 'Tracker',
      year: '2023',
      version: 'Premier 1.2 Turbo AT',
      color: 'Negro Carbón',
      fuel: 'Nafta',
      doors: '5',
      transmission: 'Automática 6 vel.',
      engine: '1.2 Turbo',
      power: '132 CV',
      km: '82.000 km',
      tag: 'PRIMERA MANO',
      image: 'Autos_Imagenes/CHEVROLET-TRACKER-2023-82.000kms-PrimeraMano-1_2Turbo-AT.png',
      title: 'Chevrolet Tracker',
      subtitle: 'SUV compacta · Primera mano con service oficial',
      price: 'Consultar',
      waText: 'me interesa la Chevrolet Tracker 2023',
    },
    'tcross-2021': {
      brand: 'Volkswagen',
      model: 'T-Cross',
      year: '2021',
      version: 'Trendline 1.6 MSI MT',
      color: 'Plata Reflex',
      fuel: 'Nafta',
      doors: '5',
      transmission: 'Manual 5 vel.',
      engine: '1.6 MSI',
      power: '110 CV',
      km: '102.000 km',
      tag: 'USADO · GARANTIZADO',
      image: 'Autos_Imagenes/Volkswagen-T_cross1_6_Trendline-2021-102000km.png',
      title: 'VW T-Cross Trendline',
      subtitle: 'SUV urbana · Llantas de aleación 16"',
      price: 'Consultar',
      waText: 'me interesa la VW T-Cross 2021',
    },
    'cruze-lt-2018': {
      brand: 'Chevrolet',
      model: 'Cruze',
      year: '2018',
      version: 'LT 1.4 Turbo AT',
      color: 'Gris Cosmos',
      fuel: 'Nafta',
      doors: '4',
      transmission: 'Automática 6 vel.',
      engine: '1.4 Turbo',
      power: '153 CV',
      km: '119.000 km',
      tag: 'USADO · GARANTIZADO',
      image: 'Autos_Imagenes/Chevrolet-CruzLT-2018-119000km.png',
      title: 'Chevrolet Cruze LT',
      subtitle: 'Sedán turbo · Confort y equipamiento completo',
      price: 'Consultar',
      waText: 'me interesa el Chevrolet Cruze LT 2018',
    },
    'berlingo-2014': {
      brand: 'Citroën',
      model: 'Berlingo',
      year: '2014',
      version: 'Multispace HDI 5 Plazas',
      color: 'Blanco Banquise',
      fuel: 'Diésel',
      doors: '5',
      transmission: 'Manual 5 vel.',
      engine: '1.6 HDI',
      power: '92 CV',
      km: '147.000 km',
      tag: 'DIÉSEL · 5 PLAZAS',
      image: 'Autos_Imagenes/CITROEN-BERLINGO-HDI-5PLAZAS-2014-147000kms-Diesel.png',
      title: 'Citroën Berlingo HDI',
      subtitle: 'Familiar versátil · Diésel económico',
      price: 'Consultar',
      waText: 'me interesa la Citroen Berlingo 2014',
    },
  };

  const SPEC_ROWS = [
    { key: 'brand',        label: 'Marca' },
    { key: 'model',        label: 'Modelo' },
    { key: 'year',         label: 'Año' },
    { key: 'version',      label: 'Versión' },
    { key: 'color',        label: 'Color' },
    { key: 'fuel',         label: 'Combustible' },
    { key: 'doors',        label: 'Puertas' },
    { key: 'transmission', label: 'Transmisión' },
    { key: 'engine',       label: 'Motor' },
    { key: 'power',        label: 'Potencia' },
    { key: 'km',           label: 'Kilómetros' },
  ];

  const screen = $('#carScreen');
  if (screen) {
    const sImg      = $('#carScreenImg');
    const sTag      = $('#carScreenTag');
    const sTitle    = $('#carScreenTitle');
    const sSubtitle = $('#carScreenSubtitle');
    const sSpecs    = $('#carScreenSpecs');
    const sPrice    = $('#carScreenPrice');
    const sWa       = $('#carScreenWa');
    const sClose    = $('#carScreenClose');

    const openScreen = (id) => {
      const data = CAR_DETAILS[id];
      if (!data) return;

      sImg.src = data.image;
      sImg.alt = `${data.title} ${data.year}`;
      sTag.textContent = data.tag;
      sTitle.textContent = data.title;
      sSubtitle.textContent = data.subtitle;
      sPrice.textContent = data.price;
      sWa.href = `https://wa.me/5491165681106?text=${encodeURIComponent('Hola Alfa Motors, ' + data.waText)}`;

      sSpecs.innerHTML = SPEC_ROWS
        .filter(row => data[row.key])
        .map(row => `<li><span class="label">${row.label}</span><span class="value">${data[row.key]}</span></li>`)
        .join('');

      screen.classList.remove('is-closing');
      screen.classList.add('is-open');
      screen.setAttribute('aria-hidden', 'false');
      document.body.classList.add('has-screen-open');
    };

    const closeScreen = () => {
      if (!screen.classList.contains('is-open')) return;
      screen.classList.add('is-closing');
      setTimeout(() => {
        screen.classList.remove('is-open', 'is-closing');
        screen.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('has-screen-open');
      }, 280);
    };

    // Wire up car cards
    $$('.car-card[data-car-id]').forEach((card) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Ver ficha del vehículo');

      const handleOpen = (e) => {
        // Don't open when clicking the WhatsApp CTA inside the card
        if (e.target.closest('a, button')) return;
        const id = card.getAttribute('data-car-id');
        openScreen(id);
      };
      card.addEventListener('click', handleOpen);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('a, button')) return;
          e.preventDefault();
          openScreen(card.getAttribute('data-car-id'));
        }
      });
    });

    sClose.addEventListener('click', closeScreen);
    screen.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-car-screen-close')) closeScreen();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeScreen();
    });
  }

  /* (Tilt 3D effect removed — clean CSS hover handles cards) */

  /* ----------------------------------------------------------
     6. Smooth scroll for anchor links (manual offset for sticky nav)
  ---------------------------------------------------------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav?.getBoundingClientRect().height || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
