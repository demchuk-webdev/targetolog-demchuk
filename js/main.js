(function () {
  // Fade-in: якщо IntersectionObserver не підтримується (старий Safari) - одразу показуємо всі елементи
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

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
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
})();

