/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'studio-dsz',
    /* nessun WhatsApp: il fisso dello studio */
    whatsapp: { number: '', message: '', ids: [] },
    /* la scheda Google (tabella, 1/10/2026): lunedì–giovedì 10–19, venerdì 10–17, sabato e domenica chiuso */
    hours: {
      0: [], 1: [['10:00', '19:00']], 2: [['10:00', '19:00']], 3: [['10:00', '19:00']], 4: [['10:00', '19:00']], 5: [['10:00', '17:00']], 6: [],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1060,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Studio DSZ: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.cura": "What we do",
      "n.lenti": "The loupes",
      "n.studio": "The practice",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.t1": "Dental practice",
      "h.sopra": "Via Luisa Battistotti Sassi 13, between Viale Corsica and Piazzale Susa",
      "h.testo": "A practice born from a family tradition: gum care first, and then implants, fillings, root canals, orthodontics and hygiene, with Dr Mary De Sury, Dr Alessandro Zussino and their team.",
      "h.voto": "on Google, 116 reviews",
      "h.chi": "Lucia O., in a review on Google (in English: «All the treatments went quickly but without haste, with careful explanations, a lot of skill and just the right amount of pleasant conversation»)",
      "p.testa": "Periodontal chart",
      "p.esempio": "an example",
      "p.titolo": "The probe",
      "p.desc": "Our periodontal chart: six teeth drawn in outline with their numbers, the green line of the gum margin and the millimetre probe, which goes into the groove of one tooth at a time; under each tooth the chart writes down the millimetres.",
      "p.cartella": "Probing depth · mm",
      "p.d0": "Upper arch, from 13 to 23: the probe goes into the groove of each tooth and the chart writes down the millimetres.",
      "p.d1": "Lower arch, from 43 to 33: the same measurement, tooth by tooth.",
      "p.modi": "Which arch",
      "p.b0": "Upper arch",
      "p.b1": "Lower arch",
      "p.nota": "The millimetre probe measures the groove between the tooth and the gum: it is the first step of a periodontal check-up. The numbers here are an example, not anyone’s chart.",
      "s.etichetta": "What we do",
      "s.titolo": "The whole mouth, starting with the gums",
      "s.frase": "On our old website the first heading read «Centre for the diagnosis and treatment of periodontitis». It is still the first line.",
      "s.r1": "Periodontology",
      "s.r1t": "Care of the gums and of the bone that holds the teeth: non-surgical therapy, conservative, resective and regenerative periodontal surgery, plastic surgery of the gums.",
      "s.r2": "Implants",
      "s.r2t": "Implants: conventional, computer-planned, placed right after an extraction or with immediate loading, when the case allows it.",
      "s.r3": "Restorative dentistry",
      "s.r3t": "Fillings and inlays, minimally invasive and aesthetic restorations, whitening.",
      "s.r4": "Endodontics",
      "s.r4t": "Root canal treatments, retreatments, surgical endodontics.",
      "s.r5": "Oral surgery",
      "s.r5t": "Wisdom teeth and impacted teeth, cysts, bone reconstruction.",
      "s.r6": "Prosthetics",
      "s.r6t": "Fixed on natural teeth and on implants, removable, minimally invasive bonded aesthetics.",
      "s.r7": "Professional hygiene",
      "s.r7t": "Professional cleaning and tartar removal, maintenance recalls after gum treatment and after implants.",
      "s.r8": "Orthodontics",
      "s.r8t": "Traditional braces and clear aligners.",
      "s.r9": "The face",
      "s.r9t": "The «Face Care» in our name: aesthetic medicine for the face, with biorevitalisation, fillers, radiofrequency and peels.",
      "s.nota": "No prices here: for a first visit, call the front desk on 02 7000 0218.",
      "a.lenti": "The practice’s magnifying loupes, with their two blue optics, resting on the green surgical cloth.",
      "l.etichetta": "The loupes",
      "l.titolo": "Almost like under a microscope",
      "l.loro": "«With us, prevention is carried out with magnifying loupes that show the enamel almost as under a microscope»",
      "l.fonte": "From our Facebook page",
      "l.testo": "The optics magnify 4.3 times: the enamel, the edge of the gum, the groove where the probe goes in.",
      "l.poi": "«A careful visit with experts in the field can give you the right indications for the therapy that suits you best.»",
      "k.etichetta": "The practice",
      "k.titolo": "The rooms, the front desk, the waiting room",
      "a.acqua": "A treatment room with the aqua-green chair, a plant, the tall window and the radiator.",
      "k.acqua": "The aqua-green room",
      "a.sala": "A treatment room with the chair, the drawers with green stripes and the window.",
      "k.sala": "One of the rooms",
      "a.accoglienza": "The front desk: the curved light-wood counter, the flowers, the orange chairs.",
      "k.accoglienza": "The front desk",
      "a.lime": "The second room, with the lime-green chair and the green glass door.",
      "k.lime": "The lime-green room",
      "a.attesa": "The waiting room with black cantilever chairs and the small table.",
      "k.attesa": "The waiting room",
      "a.panoramico": "The white panoramic X-ray unit, in front of the bookcase.",
      "k.panoramico": "The panoramic unit, for X-rays in the practice",
      "t1.etichetta": "Our story",
      "t1.titolo": "A family tradition",
      "t1.frase": "«Studio DSZ has its origins about thirty years ago, when Dr Mary de Sury and Dr Alessandro Zussino began renewing the practice that Dr Fernando de Sury had to leave for health reasons.»",
      "t1.poi": "«Since then, the effort has always been to practise a dentistry that follows three guiding principles»:",
      "t1.p1": "«To always keep up with the clinical and technological developments of the profession, as long as they are validated by serious scientific studies and not only by pure marketing.»",
      "t1.p2": "«To keep the patient at the centre: there is no single best therapy, but the best one for that patient at that moment.»",
      "t1.p3": "«To carry out treatments that always start from the biological principles at the basis of oral and facial health.»",
      "t1.oggi": "The practice has been on Via Battistotti Sassi for more than sixty-five years. Today: Dr Mary De Sury, Dr Alessandro Zussino, Dr Cesare Lacaita, with the chairside assistants and the front desk.",
      "d.etichetta": "Reviews",
      "d.titolo": "Five stars, one after another",
      "d.voto": "on Google, 116 reviews",
      "d.t26": "Google, 2026",
      "d.t25": "Google, 2025",
      "d.nota": "From the reviews on Google, in Italian, as they were written; we left out the names of the chairside and front-desk staff. The line at the top comes from another patient, also on Google.",
      "d.tutte": "All the reviews on Google",
      "r.etichetta": "Hours and where",
      "r.titolo": "Monday to Friday, by appointment",
      "r.testa": "Front desk",
      "r.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "r.chiuso": "closed",
      "r.nota": "Hours from our Google listing (October 2026). Visits are by appointment: call the front desk.",
      "w.mappa": "Map: Studio DSZ, Via Luisa Battistotti Sassi 13, Milan",
      "w.dove": "Where",
      "w.dovev": "Via Luisa Battistotti Sassi 13, 20133 Milan · buzzer 24, left staircase",
      "w.metro": "By metro",
      "w.metrov": "M4, the blue line: Susa about 500 metres away, Argonne about 600",
      "w.tram": "By tram",
      "w.tramv": "on Viale Corsica, stop Viale Corsica – Via Battistotti Sassi, about 200 metres away",
      "w.bus": "By trolleybus",
      "w.busv": "the 90 and the 91 on Viale Campania, about 300 metres away",
      "w.tel": "Phone",
      "w.mail": "Email",
      "w.social": "Social",
      "f2.piva": "VAT no.",
      "f2.orario": "Monday–Thursday 10 am–7 pm · Friday 10 am–5 pm · Saturday and Sunday closed",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · hours, rating and reviews from the Google listing (October 2026); the photos from their old website and the Google listing; the treatments, the story and their words from their old website and their social pages. We redrew the DSZ mark and the chart ourselves.",
      "f2.su": "Back to the top"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ STUDIO DSZ DE SURY – ZUSSINO — Via Luisa Battistotti Sassi 13 ══════════
     la FIRMA — «la sonda»: la loro cartella parodontale. I denti si disegnano a tratto, la linea verde del margine gengivale scorre da
     sinistra con la gengiva velata sopra, poi la sonda millimetrata entra nel solco di un dente alla volta e la cartella segna i
     millimetri; alla fine la sonda si posa a lato. Arcata superiore (13…23) o inferiore (43…33, la stessa scena capovolta). Lo stato è
     M (l'arcata), T (0…1) e V (0 al suo posto; fino a 1 la cartella esce a destra; da −1 a 0 entra da sinistra la prossima, ancora da
     disegnare). Senza JS e alla fine: arcata superiore, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): la cartella vuota, la
     sonda fuori scena. Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza;
     un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[560,500],"via":600,"fasi":{"denti":{"t":0.03,"d":0.2},"margine":{"t":0.23,"d":0.13},"sonda":{"t":0.38,"d":0.62}},"lungDenti":583,"lungMargine":625,"x":[109,175,245,323,393,459],"yApp":290.5,"ingresso":221.5,"scosta":12,"prof":[[30,40,30,30,30,40],[40,30,30,30,40,30]],"u0":0.07,"u1":0.9,"posa":[522,292],"picco":[0.1461,0.2844,0.4228,0.5611,0.6994,0.8378],"rampa":0.02,"mm":[[2,3,2,2,2,3],[3,2,2,2,3,2]],"modi":[{"nome":"Arcata superiore"},{"nome":"Arcata inferiore"}],"tempi":{"inizio":300,"sonda":7600,"servi":480,"arriva":520,"sondaV":6800}};
  /* la sonda a (M, T, V) — una sola fonte: la usano _dsz_firma.mjs (l'HTML allo stato finale), main.js (via dsz_main.cjs) e la
     prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     La cartella parodontale dello Studio DSZ: sei denti a tratto (13…23 l'arcata superiore, 43…33 l'inferiore, che è la stessa scena
     capovolta), la linea verde del margine gengivale con la gengiva velata sopra, e la sonda millimetrata: entra nel solco di un dente
     alla volta, scende fino in fondo, risale, e nella cartella compare il numero dei millimetri. Alla fine la sonda si posa a lato.
     Col V la cartella esce a destra; la prossima, ancora da disegnare, entra da sinistra. */
  function creaSonda(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w.t + w.d - 1e-9 ? 1 : c01((t - w.t) / w.d); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var q = function (sel) { return svg.querySelector(sel); };
    var servito = q('.servito');
    var per = function (c) { return D.modi.map(function (_, m) { return q('.' + c + '[data-m="' + m + '"]'); }); };
    var denti = per('so-denti'), margine = per('so-margine'), gengiva = per('so-gengiva'), sonde = per('so-sonda');
    var numeri = D.modi.map(function (_, m) { return D.x.map(function (_, k) { return q('.so-n[data-m="' + m + '"][data-k="' + k + '"]'); }); });
    /* dove sta la punta della sonda a U (0…1 della fase), nella scena dell'arcata superiore (l'inferiore è la stessa, capovolta):
       entra dal basso fino al primo dente; per ogni dente si sposta, scende nel solco della sua profondità e risale; poi si posa */
    function punta(m, u) {
      var X = D.x, Y = D.yApp, S = (D.u1 - D.u0) / X.length;
      if (u < D.u0) return [X[0], Y + D.ingresso * (1 - dolce(u / D.u0))];
      if (u >= D.u1) { var p = dolce(c01((u - D.u1) / (1 - D.u1))); return [X[X.length - 1] + (D.posa[0] - X[X.length - 1]) * p, Y + (D.posa[1] - Y) * p]; }
      var k = Math.min(X.length - 1, Math.floor((u - D.u0) / S)), w = (u - D.u0 - k * S) / S;
      var da = X[Math.max(0, k - 1)];
      /* 0–0,3: si sposta al dente, scostandosi un poco dal margine; 0,3–0,8: scende nel solco e risale; poi ferma */
      if (w < 0.3) { var s = w / 0.3; return [da + (X[k] - da) * dolce(s), Y + D.scosta * Math.sin(Math.PI * s) * (k > 0 ? 1 : 0)]; }
      if (w < 0.8) return [X[k], Y - D.prof[m][k] * Math.sin(Math.PI * (w - 0.3) / 0.5)];
      return [X[k], Y];
    }
    function disegna(m, t, v) {
      var F = D.fasi;
      /* 1. i denti si disegnano a tratto */
      denti[m].setAttribute('stroke-dashoffset', r1(D.lungDenti * (1 - dolce(fase(t, F.denti)))));
      /* 2. la linea verde del margine, da sinistra; la gengiva si vela insieme */
      var g = fase(t, F.margine);
      margine[m].setAttribute('stroke-dashoffset', r1(D.lungMargine * (1 - dolce(g))));
      gengiva[m].setAttribute('opacity', r3(dolce(g)));
      /* 3. la sonda misura dente per dente; il numero compare quando la punta tocca il fondo del solco */
      var u = fase(t, F.sonda), p = punta(m, u);
      sonde[m].setAttribute('transform', 'translate(' + r1(p[0]) + ' ' + r1(p[1]) + ')');
      for (var k = 0; k < D.x.length; k++) numeri[m][k].setAttribute('opacity', r3(c01((u - D.picco[k]) / D.rampa)));
      /* col V la cartella esce a destra; la prossima entra da sinistra */
      servito.setAttribute('transform', 'translate(' + r1(D.via * v) + ' 0)');
    }
    var completo = !!servito && denti.concat(margine, gengiva, sonde).every(Boolean) && numeri.every(function (r) { return r.every(Boolean); });
    return { disegna: disegna, punta: punta, pezzi: { denti: denti, sonde: sonde, numeri: numeri }, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('sonda-firma'), svgF = prendi('sondaSvg'), leggiF = prendi('sondaLeggi');
  var SONDA = svgF ? creaSonda(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.sonda__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.sonda__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    SONDA.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) SONDA.disegna(k, 1, 0); });
    SONDA.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta la cartella vuota */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la cartella vuota */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.sonda, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.sonda });
  }
  /* il gesto: scegliere l'arcata. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è,
     la cartella esce a destra, entra da sinistra la prossima da disegnare, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.sondaV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && SONDA && SONDA.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaSonda); } catch (e) {}
    window.__sonda = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__sonda.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta la cartella vuota */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__sonda.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
