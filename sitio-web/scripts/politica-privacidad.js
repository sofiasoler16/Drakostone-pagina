/* =========================================================
   POLÍTICA DE PRIVACIDAD — selector EN/ES, índice que marca
   la sección actual y botón "volver arriba".
   Sin JS se ven los dos idiomas completos (uno abajo del otro).
   ========================================================= */
(function () {
  var main = document.getElementById('contenido');
  var articulos = document.querySelectorAll('article.idioma');
  var botones = document.querySelectorAll('.idiomas button');

  function elegir(idioma, guardar) {
    main.classList.add('solo-un-idioma');
    articulos.forEach(function (a) {
      var esEste = a.getAttribute('data-idioma') === idioma;
      a.classList.toggle('oculto', !esEste);
      a.classList.toggle('mostrar', esEste);
    });
    botones.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-idioma') === idioma)); });
    document.documentElement.lang = idioma;
    document.title = idioma === 'es' ? 'Política de privacidad — Drakostone' : 'Privacy Policy — Drakostone';
    if (guardar) { try { localStorage.setItem('drakostone-idioma', idioma); } catch (e) {} }
  }

  // Idioma inicial: #espanol en la URL > elegido antes > idioma del navegador > inglés
  var guardado = null;
  try { guardado = localStorage.getItem('drakostone-idioma'); } catch (e) {}
  var inicial = /^(en|es)$/.test(guardado || '') ? guardado
    : /^es\b/i.test(navigator.language || '') ? 'es' : 'en';
  if (/^#(espanol|es-)/.test(location.hash)) inicial = 'es';
  if (/^#(english|en-)/.test(location.hash)) inicial = 'en';
  elegir(inicial, false);
  // Si la URL apunta a una sección, vuelve a ir ahí ahora que se ve
  if (location.hash.length > 1) {
    var destino = document.getElementById(location.hash.slice(1));
    if (destino) destino.scrollIntoView();
  }

  botones.forEach(function (b) {
    b.addEventListener('click', function () {
      elegir(b.getAttribute('data-idioma'), true);
      window.scrollTo({ top: 0 });
    });
  });
  document.querySelectorAll('[data-ir-idioma]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      elegir(a.getAttribute('data-ir-idioma'), true);
      window.scrollTo({ top: 0 });
    });
  });

  // En celular el índice arranca cerrado para no ocupar toda la pantalla
  if (window.innerWidth < 960) {
    document.querySelectorAll('.indice details').forEach(function (d) { d.removeAttribute('open'); });
  }
  // Al tocar un ítem del índice en celular, se cierra
  document.querySelectorAll('.indice a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.innerWidth < 960) a.closest('details').removeAttribute('open');
    });
  });

  // Marca en el índice la sección que se está leyendo
  if ('IntersectionObserver' in window) {
    var enlaces = {};
    document.querySelectorAll('.indice a').forEach(function (a) { enlaces[a.getAttribute('href').slice(1)] = a; });
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var a = enlaces[e.target.id];
        if (!a) return;
        a.closest('ol').querySelectorAll('a').forEach(function (x) { x.classList.remove('activo'); });
        a.classList.add('activo');
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    document.querySelectorAll('.texto section[id]').forEach(function (s) { obs.observe(s); });
  }

  // Botón volver arriba
  var arriba = document.getElementById('volver-arriba');
  window.addEventListener('scroll', function () { arriba.classList.toggle('visible', window.scrollY > 700); }, { passive: true });
  arriba.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();
