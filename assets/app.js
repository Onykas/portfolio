// ===== Accessibility panel =====
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    var fab = document.getElementById('a11yFab');
    var panel = document.getElementById('a11yPanel');
    if (!fab || !panel) return;
    var STORE_KEY = 'lf-a11y';
    function load(){ try{ return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }catch(e){ return {}; } }
    function save(state){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }catch(e){} }
    var state = load();

    var CLASS_MAP = { dyslexic:'a11y-dyslexic', contrast:'a11y-contrast', underline:'a11y-underline', colorblind:'a11y-cb', reduceMotion:'a11y-reduce-motion' };

    function applyAll(){
      Object.keys(CLASS_MAP).forEach(function(key){
        document.documentElement.classList.toggle(CLASS_MAP[key], !!state[key]);
        var sw = panel.querySelector('[data-a11y="' + key + '"]');
        if (sw) sw.classList.toggle('on', !!state[key]);
      });
      document.documentElement.classList.toggle('a11y-text-lg', state.textsize === 'lg');
      document.documentElement.classList.toggle('a11y-text-xl', state.textsize === 'xl');
      panel.querySelectorAll('[data-textsize]').forEach(function(btn){
        btn.classList.toggle('active', (state.textsize || '') === btn.getAttribute('data-textsize'));
      });
    }
    applyAll();

    fab.addEventListener('click', function(e){ e.stopPropagation(); panel.classList.toggle('open'); });
    document.addEventListener('click', function(e){
      if (!panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) panel.classList.remove('open');
    });
    panel.querySelectorAll('[data-a11y]').forEach(function(sw){
      sw.addEventListener('click', function(){
        var key = sw.getAttribute('data-a11y');
        state[key] = !state[key];
        save(state); applyAll();
      });
    });
    panel.querySelectorAll('[data-textsize]').forEach(function(btn){
      btn.addEventListener('click', function(){
        state.textsize = btn.getAttribute('data-textsize') || '';
        save(state); applyAll();
      });
    });
  });
})();

// ===== Chat assistant (scripted FAQ, not a live AI) =====
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    var fab = document.getElementById('chatFab');
    var panel = document.getElementById('chatPanel');
    var body = document.getElementById('chatBody');
    var input = document.getElementById('chatInput');
    var send = document.getElementById('chatSend');
    if (!fab || !panel || !body || !input || !send) return;

    var KB = [
      { keys:['qui est olga','qui es olga','c\'est qui olga','qui es-tu','qui êtes-vous','présente','presente-toi','présente-toi','te présenter'],
        a:"Olga Sangupamba Nika, 23 ans, étudiante en Master 2 Nouvelles Technologies de l'Information et de la Communication à Montbéliard. Elle est développeuse Full-Stack & UX/UI, passionnée par le numérique et la recherche appliquée. Le détail est sur la page À propos." },
      { keys:['competence','compétence','skill','techno','stack','sait faire','maitrise','maîtrise'],
        a:"Ses compétences sont réparties en 4 familles : Full-Stack (React, React Native, Node.js, FastAPI, Flutter...), Bases de données, UX/UI & Recherche, et Gestion & Création. Détail complet dans À propos → Compétences." },
      { keys:['aide','aider','apport','apporter','pourquoi','recruter','embaucher','pourquoi toi','pourquoi elle','forces','qualités','qualites'],
        a:"Elle peut aider sur la conception et le développement d'applications web, mobiles et logicielles de bout en bout, ainsi que sur la recherche UX/UI. Ses qualités mises en avant sur le site : rigueur, curiosité, esprit d'équipe et résolution de problèmes." },
      { keys:['disponib','alternance','stage libre','septembre'], a:"Elle recherche actuellement un stage de fin d'année pour son Master 2. Les infos précises sont sur la page Contact." },
      { keys:['contact','email','mail','joindre','linkedin'], a:"Le plus simple est la page Contact : formulaire, email et LinkedIn y sont listés." },
      { keys:['projet','portfolio','github'], a:"Ses projets couvrent le développement web et mobile : MarketNaYo (marketplace mobile avec paiement mobile money), NOVA (marketplace boutiques × clients) et Nexus Jeunesses (plateforme événementielle complète, en ligne sur nexusjeunesses.org). Tout est sur la page Portfolio, avec un lien GitHub pour chacun." },
      { keys:['stage','entreprise','experience','expérience'], a:"Trois stages sont détaillés dans Portfolio → Mes Stages : Stagiaire chercheuse UX/UI Design, Stagiaire informatique, et Stagiaire enseignante en informatique." },
      { keys:['passion','loisir','hobby'], a:"Dessin, voyages, cuisine du monde, un peu de piano, et un engagement associatif (trésorière). Tout est sur la page Passions." },
      { keys:['cv','curriculum'], a:"Le CV complet est consultable et téléchargeable depuis la page CV." },
      { keys:['age','âge','ans'], a:"Olga a 23 ans." },
      { keys:['etude','étude','formation','master','ecole','école'], a:"Elle est actuellement en Master 2 Nouvelles Technologies de l'Information et de la Communication." },
      { keys:['ou','où','ville','besan','montbeliard','montbéliard','localisation','habite'], a:"Elle est basée à Montbéliard, France." },
      { keys:['bonjour','salut','hello','coucou'], a:"Bonjour ! Demande-moi qui est Olga, ses compétences, en quoi elle peut aider, sa disponibilité, ses projets ou comment la contacter." }
    ];
    var FALLBACK = "Je ne réponds qu'à des questions basiques sur Olga (qui elle est, ses compétences, ses projets, sa disponibilité, comment la contacter...). Pour le reste, le mieux est d'écrire directement via la page Contact.";

    function answer(text){
      var q = text.toLowerCase();
      for (var i = 0; i < KB.length; i++) {
        for (var j = 0; j < KB[i].keys.length; j++) {
          if (q.indexOf(KB[i].keys[j]) !== -1) return KB[i].a;
        }
      }
      return FALLBACK;
    }

    function addMsg(text, who){
      var el = document.createElement('div');
      el.className = 'chat-msg ' + who;
      el.textContent = text;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }

    function ask(text){
      text = (text || '').trim();
      if (!text) return;
      addMsg(text, 'user');
      input.value = '';
      setTimeout(function(){ addMsg(answer(text), 'bot'); }, 350);
    }

    fab.addEventListener('click', function(e){
      e.stopPropagation();
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) input.focus();
    });
    send.addEventListener('click', function(){ ask(input.value); });
    input.addEventListener('keydown', function(e){ if (e.key === 'Enter') ask(input.value); });
    document.querySelectorAll('.chat-chip').forEach(function(chip){
      chip.addEventListener('click', function(){
        var map = { competences:'Quelles sont tes compétences ?', disponibilite:'Es-tu disponible pour un stage ?', contact:'Comment te contacter ?', projets:'Quels sont tes projets ?' };
        ask(map[chip.getAttribute('data-q')] || chip.textContent);
      });
    });
  });
})();

// ===== Hero typewriter (home) =====
(function initHeroTypewriter(){
  document.addEventListener('DOMContentLoaded', function(){
    var words = document.querySelectorAll('.hero-name .type-word[data-text]');
    if (!words.length) return;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      words.forEach(function(w){ w.textContent = w.getAttribute('data-text') || ''; });
      return;
    }
    function typeWord(i){
      if (i >= words.length) return;
      var word = words[i];
      var text = word.getAttribute('data-text') || '';
      word.textContent = '';
      word.classList.add('typing');
      var c = 0;
      (function step(){
        if (c < text.length) {
          word.textContent += text.charAt(c); c++;
          setTimeout(step, 90);
        } else {
          word.classList.remove('typing');
          setTimeout(function(){ typeWord(i + 1); }, 250);
        }
      })();
    }
    setTimeout(function(){ typeWord(0); }, 400);
  });
})();

// ===== Scroll hint (home) =====
(function initScrollHint(){
  document.addEventListener('DOMContentLoaded', function(){
    var hint = document.getElementById('scrollHint');
    if (!hint) return;
    window.addEventListener('scroll', function(){
      hint.classList.toggle('hidden', window.scrollY > 200);
    }, { passive:true });
    hint.addEventListener('click', function(){
      var target = document.getElementById('apercu');
      if (target) target.scrollIntoView({ behavior:'smooth' });
    });
  });
})();

// ===== Nav dropdowns (click to open, not a direct link) =====
(function initNavDropdowns(){
  document.addEventListener('DOMContentLoaded', function(){
    var items = Array.prototype.slice.call(document.querySelectorAll('.primary-nav .nav-item'));
    if (!items.length) return;

    function closeAll(){
      items.forEach(function(item){
        item.classList.remove('open');
        var t = item.querySelector('.nav-link');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }

    items.forEach(function(item){
      var trigger = item.querySelector('.nav-link');
      if (!trigger) return;
      trigger.addEventListener('click', function(e){
        e.preventDefault();
        var willOpen = !item.classList.contains('open');
        closeAll();
        if (willOpen) {
          item.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
      item.addEventListener('mouseenter', function(){
        items.forEach(function(other){
          if (other === item) return;
          other.classList.remove('open');
          var t = other.querySelector('.nav-link');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      });
    });

    document.querySelectorAll('.nav-dropdown a').forEach(function(a){
      a.addEventListener('click', closeAll);
    });

    document.addEventListener('click', function(e){
      var insideOpenItem = items.some(function(item){ return item.contains(e.target); });
      if (!insideOpenItem) closeAll();
    });
  });
})();

// ===== Hero particle network =====
(function initHeroCanvas(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.hero-canvas').forEach(setupParticleCanvas);
  });

  function setupParticleCanvas(canvas){
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ctx = canvas.getContext('2d');
    var section = canvas.parentElement;
    var w, h, nodes = [], dpr = Math.min(window.devicePixelRatio || 1, 2);
    var running = true;

    function resize(){
      w = section.offsetWidth;
      h = section.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function Node(){
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.r = 2;
    }
    Node.prototype.update = function(){
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    };
    Node.prototype.draw = function(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(229,71,59,0.85)';
      ctx.fill();
    };

    function seed(){
      var count = w < 640 ? 45 : 90;
      nodes = [];
      for (var i = 0; i < count; i++) nodes.push(new Node());
    }

    function frame(){
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      nodes.forEach(function(n){ n.update(); n.draw(); });
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.strokeStyle = 'rgba(229,71,59,' + (1 - d / 140) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }

    resize();
    seed();

    if (reduceMotion) {
      nodes.forEach(function(n){ n.draw(); });
    } else {
      frame();
    }

    var resizeTimer;
    window.addEventListener('resize', function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function(){
        resize();
        seed();
        if (reduceMotion) { ctx.clearRect(0, 0, w, h); nodes.forEach(function(n){ n.draw(); }); }
      }, 200);
    });

    document.addEventListener('visibilitychange', function(){
      running = !document.hidden;
      if (running && !reduceMotion) frame();
    });
  }
})();

// ===== Theme (dark/light) =====
(function initTheme(){
  var root = document.documentElement;

  function currentTheme(){
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function setTheme(theme, persist){
    root.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
    if (persist) {
      try { localStorage.setItem('lf-theme', theme); } catch(e){}
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('#themeToggle, #themeToggleMobile').forEach(function(btn){
      btn.addEventListener('click', function(){
        setTheme(currentTheme() === 'light' ? 'dark' : 'light', true);
      });
    });
  });
})();

// ===== Language switcher =====
(function initLang(){
  var SUPPORTED = ['fr', 'en', 'es', 'de'];
  var LABELS = { fr: 'FR', en: 'EN', es: 'ES', de: 'DE' };

  function getLang(){
    var stored = null;
    try { stored = localStorage.getItem('lf-lang'); } catch(e){}
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    return 'fr';
  }

  function applyLang(lang, persist){
    if (SUPPORTED.indexOf(lang) === -1) lang = 'fr';
    var dict = (window.LF_I18N && window.LF_I18N[lang]) || {};
    var fallback = (window.LF_I18N && window.LF_I18N.fr) || {};

    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      var text = dict[key] !== undefined ? dict[key] : fallback[key];
      if (text !== undefined) el.textContent = text;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function(el){
      var key = el.getAttribute('data-i18n-html');
      var html = dict[key] !== undefined ? dict[key] : fallback[key];
      if (html !== undefined) el.innerHTML = html;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
      var key = el.getAttribute('data-i18n-placeholder');
      var text = dict[key] !== undefined ? dict[key] : fallback[key];
      if (text !== undefined) el.setAttribute('placeholder', text);
    });

    document.documentElement.setAttribute('lang', lang);

    var currentLabel = document.getElementById('langCurrent');
    if (currentLabel) currentLabel.textContent = LABELS[lang];

    document.querySelectorAll('.lang-dropdown button, .mobile-lang button').forEach(function(btn){
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    if (persist) {
      try { localStorage.setItem('lf-lang', lang); } catch(e){}
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    applyLang(getLang(), false);

    document.querySelectorAll('[data-lang]').forEach(function(btn){
      btn.addEventListener('click', function(){
        applyLang(btn.getAttribute('data-lang'), true);
        var switchEl = document.getElementById('langSwitch');
        if (switchEl) switchEl.classList.remove('open');
      });
    });

    var langSwitch = document.getElementById('langSwitch');
    var langBtn = document.getElementById('langBtn');
    if (langSwitch && langBtn) {
      langBtn.addEventListener('click', function(e){
        e.stopPropagation();
        var open = langSwitch.classList.toggle('open');
        langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', function(e){
        if (!langSwitch.contains(e.target)) {
          langSwitch.classList.remove('open');
          langBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
})();

// ===== About page: floating section menu =====
(function initFloatMenu(){
  document.addEventListener('DOMContentLoaded', function(){
    var trigger = document.getElementById('afmTrigger');
    var links = document.getElementById('afmLinks');
    if (!trigger || !links) return;

    trigger.addEventListener('click', function(){
      trigger.classList.toggle('open');
      links.classList.toggle('open');
    });
    document.querySelectorAll('.afm-link').forEach(function(a){
      a.addEventListener('click', function(){
        trigger.classList.remove('open');
        links.classList.remove('open');
      });
    });

    var afmLinks = document.querySelectorAll('.afm-link[data-sec]');
    var targets = Array.prototype.slice.call(afmLinks).map(function(a){
      return document.getElementById(a.getAttribute('data-sec'));
    }).filter(Boolean);
    if (!targets.length) return;

    function setActive(){
      var current = targets[0];
      targets.forEach(function(t){ if (window.scrollY >= t.offsetTop - 260) current = t; });
      afmLinks.forEach(function(a){ a.classList.toggle('active', current && a.getAttribute('data-sec') === current.id); });
    }
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  });
})();

// ===== About page: generic slide carousel (experiences, recommendations) =====
(function initCarousels(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('[data-carousel]').forEach(function(root){
      var track = root.querySelector('[data-carousel-track]');
      var slides = track ? track.children : [];
      var total = slides.length;
      if (!track || !total) return;
      var prev = root.querySelector('[data-carousel-prev]');
      var next = root.querySelector('[data-carousel-next]');
      var dots = root.querySelectorAll('[data-carousel-dot]');
      var counterCur = root.querySelector('[data-carousel-cur]');
      var idx = 0;

      function go(i){
        idx = (i + total) % total;
        track.style.transform = 'translateX(-' + (idx * 100) + '%)';
        dots.forEach(function(d, j){ d.classList.toggle('active', j === idx); });
        if (counterCur) counterCur.textContent = idx + 1;
      }
      if (prev) prev.addEventListener('click', function(){ go(idx - 1); });
      if (next) next.addEventListener('click', function(){ go(idx + 1); });
      dots.forEach(function(d, i){ d.addEventListener('click', function(){ go(i); }); });

      var touchStartX = 0;
      track.addEventListener('touchstart', function(e){ touchStartX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', function(e){
        var diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) go(diff > 0 ? idx + 1 : idx - 1);
      });
      go(0);
    });
  });
})();

// ===== About page: card stacks (skills filter + soft skills) =====
(function initCardStacks(){
  document.addEventListener('DOMContentLoaded', function(){
    // Skills: filter buttons AND clicking a peeking card both pick which category is shown
    var skillCards = document.querySelectorAll('.skill-category');
    var filterBtns = document.querySelectorAll('.filter-skill-btn');
    if (skillCards.length && filterBtns.length) {
      var skillIdx = 0;
      function showCategory(cat){
        skillCards.forEach(function(c, i){
          var isActive = cat === 'all' ? c === skillCards[0] : c.getAttribute('data-category') === cat;
          c.classList.toggle('active', isActive);
          if (isActive) skillIdx = i;
        });
        filterBtns.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-filter') === cat); });
      }
      filterBtns.forEach(function(b){
        b.addEventListener('click', function(){ showCategory(b.getAttribute('data-filter')); });
      });
      skillCards.forEach(function(c, i){
        c.addEventListener('click', function(){
          if (c.classList.contains('active')) {
            var next = skillCards[(i + 1) % skillCards.length];
            showCategory(next.getAttribute('data-category'));
          } else {
            showCategory(c.getAttribute('data-category'));
          }
        });
      });
      showCategory('all');
    }

    // Soft skills: click any card to bring it to front (cycle)
    var softCards = document.querySelectorAll('.soft-skill-card');
    if (softCards.length) {
      var current = 0;
      function showSoft(i){
        current = (i + softCards.length) % softCards.length;
        softCards.forEach(function(c, j){ c.classList.toggle('active', j === current); });
      }
      softCards.forEach(function(c, i){
        c.addEventListener('click', function(){ if (i !== current) showSoft(i); else showSoft(current + 1); });
      });
      showSoft(0);
      var wrap = softCards[0].closest('.soft-skills-grid');
      if (wrap) {
        var t;
        wrap.addEventListener('mouseenter', function(){ clearInterval(t); });
        wrap.addEventListener('mouseleave', function(){ t = setInterval(function(){ showSoft(current + 1); }, 4000); });
        t = setInterval(function(){ showSoft(current + 1); }, 4000);
      }
    }
  });
})();
