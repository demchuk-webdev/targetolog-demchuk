(function () {
  // Hero entrance: double rAF гарантує що браузер намалював початковий стан перед transition
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.add('hero-loaded');
    });
  });

  // Fade-in on scroll
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('visible');
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    // Double rAF: без нього елементи що вже у viewport можуть пропустити transition
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.querySelectorAll('.fade-in').forEach(function (el) {
          observer.observe(el);
        });
      });
    });
  }

  // Reading progress bar (article pages only)
  var bar = document.getElementById('progress-bar');
  if (bar) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY || window.pageYOffset;
      var total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = total > 0 ? Math.min(100, (scrolled / total) * 100) + '%' : '0%';
    }, { passive: true });
  }

  // Back to top
  var btn = document.getElementById('back-to-top');
  if (btn) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY || window.pageYOffset;
      btn.classList.toggle('visible', y > 400);
    }, { passive: true });
    btn.addEventListener('click', function () {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    });
  }

  // Share bar (article pages only)
  var article = document.querySelector('.article');
  if (article) {
    var ICONS = {
      tg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.4 2.9 11.7c-1 .4-1 1.7.1 2l4.8 1.5 1.9 5.7c.2.7 1.1 1 1.7.4l2.6-2.5 4.7 3.4c.7.5 1.6.1 1.8-.7l3.2-15.2c.2-1-.7-1.8-1.6-1.4zM9.5 14.4 17 7.6l-6 8-2.5 4.3v-5.5z"/></svg>',
      x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-7.3 8.3L23 22h-6.8l-5.3-6.9L4.9 22H2l7.8-8.9L1.6 2h7l4.8 6.3L18.9 2zm-1.2 18h1.7L7.1 3.7H5.3L17.7 20z"/></svg>',
      in: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.3 18.3v-7H6v7h2.3zM7.1 10a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6zm11.2 8.3v-4c0-2.1-.6-3.5-2.9-3.5-1.2 0-2 .7-2.3 1.3v-1.1H11v7h2.3v-3.5c0-.9.2-1.8 1.3-1.8s1.2 1 1.2 1.9v3.4h2.5z"/></svg>',
      link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>'
    };
    var url = location.href.split('#')[0];
    var title = document.title;
    var bar = document.createElement('div');
    bar.className = 'share';
    var label = document.createElement('span');
    label.className = 'share-label';
    label.textContent = 'Поділитися';
    bar.appendChild(label);

    [
      ['Telegram', 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title), ICONS.tg],
      ['X', 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title), ICONS.x],
      ['LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url), ICONS.in]
    ].forEach(function (s) {
      var a = document.createElement('a');
      a.href = s[1];
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('aria-label', 'Поділитися в ' + s[0]);
      a.innerHTML = s[2] + '<span>' + s[0] + '</span>';
      bar.appendChild(a);
    });

    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.setAttribute('aria-label', 'Скопіювати посилання');
    copyBtn.innerHTML = ICONS.link + '<span>Копіювати</span>';
    copyBtn.addEventListener('click', function () {
      var span = copyBtn.querySelector('span');
      function ok() {
        span.textContent = 'Скопійовано';
        copyBtn.classList.add('copied');
        setTimeout(function () {
          span.textContent = 'Копіювати';
          copyBtn.classList.remove('copied');
        }, 2000);
      }
      try {
        navigator.clipboard.writeText(url).then(ok, fallback);
      } catch (e) {
        fallback();
      }
      function fallback() {
        var t = document.createElement('textarea');
        t.value = url;
        t.style.position = 'fixed';
        t.style.opacity = '0';
        document.body.appendChild(t);
        t.select();
        try { document.execCommand('copy'); ok(); } catch (e2) {}
        document.body.removeChild(t);
      }
    });
    bar.appendChild(copyBtn);

    var related = article.querySelector('.related');
    if (related) {
      article.insertBefore(bar, related);
    } else {
      article.appendChild(bar);
    }

    // Comments (giscus). Вмикається після встановлення giscus-додатку на репозиторій:
    // github.com/apps/giscus → потім поставити GISCUS_ENABLED = true.
    var GISCUS_ENABLED = true;
    if (GISCUS_ENABLED) {
      var box = document.createElement('section');
      box.className = 'comments';
      box.setAttribute('aria-label', 'Коментарі');
      var ct = document.createElement('p');
      ct.className = 'comments-title';
      ct.textContent = 'Коментарі';
      box.appendChild(ct);
      var g = document.createElement('script');
      g.src = 'https://giscus.app/client.js';
      g.async = true;
      g.crossOrigin = 'anonymous';
      var data = {
        'data-repo': 'demchuk-webdev/targetolog-demchuk',
        'data-repo-id': 'R_kgDOSsV8Vg',
        'data-category': 'Announcements',
        'data-category-id': 'DIC_kwDOSsV8Vs4C-oQV',
        'data-mapping': 'pathname',
        'data-strict': '0',
        'data-reactions-enabled': '1',
        'data-emit-metadata': '0',
        'data-input-position': 'top',
        'data-theme': 'noborder_dark',
        'data-lang': 'uk'
      };
      Object.keys(data).forEach(function (k) { g.setAttribute(k, data[k]); });
      box.appendChild(g);
      var anchor = related || article;
      anchor.parentNode.insertBefore(box, anchor.nextSibling);
    }
  }
})();

