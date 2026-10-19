/* =========================================================
   INICIO — interacciones de la página principal:
   dragón de la portada, pasos "Cómo funciona" con demo,
   carrusel de capturas, desfile de dragones y botón fijo de descarga.
   ========================================================= */
(function () {
  var movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var RUTA = '/imagenes/dragones/original-';

  // Precarga las expresiones para que el cambio sea instantáneo
  ['festejo', 'animo', 'orgullo'].forEach(function (e) { new Image().src = RUTA + e + '.webp'; });

  /* ---------- Dragón de la portada: al tocarlo cambia de cara y de mensaje ---------- */
  var dragon = document.getElementById('dragon');
  var dragonImg = document.getElementById('dragon-img');
  var globo = document.getElementById('globo');
  var frases = [
    { cara: 'animo', texto: '¿Qué vamos a cumplir hoy?' },
    { cara: 'orgullo', texto: '¡Vas muy bien! Seguí así 💪' },
    { cara: 'festejo', texto: '¡Racha de 7 días! 🔥' },
    { cara: 'animo', texto: 'Un pasito por día 🌱' },
    { cara: 'orgullo', texto: 'Cada objetivo suma XP ⚡' },
    { cara: 'festejo', texto: '¡Día perfecto! 🎉' }
  ];
  var indiceFrase = 0;
  if (dragon) {
    dragon.addEventListener('click', function () {
      var f = frases[indiceFrase++ % frases.length];
      dragonImg.src = RUTA + f.cara + '.webp';
      globo.textContent = f.texto;
      dragon.classList.remove('salto'); void dragon.offsetWidth; dragon.classList.add('salto');
      globo.classList.add('cambio');
      setTimeout(function () { globo.classList.remove('cambio'); }, 300);
    });
  }

  /* ---------- Contador animado de la tarjetita "Hoy" ---------- */
  function contarHasta(el, barra, meta) {
    if (!el) return;
    if (movimientoReducido) { el.textContent = meta; barra.style.width = meta + '%'; return; }
    var inicio = null;
    function paso(t) {
      if (!inicio) inicio = t;
      var p = Math.min((t - inicio) / 1400, 1);
      var v = Math.round(meta * (1 - Math.pow(1 - p, 3)));
      el.textContent = v;
      barra.style.width = v + '%';
      if (p < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }
  setTimeout(function () {
    contarHasta(document.getElementById('contador-portada'), document.getElementById('barra-portada'), 85);
  }, 600);

  /* ---------- Pestañas Planificá / Hacé / Medí ---------- */
  var pestanas = Array.prototype.slice.call(document.querySelectorAll('.paso'));
  function activar(tab, enfocar) {
    pestanas.forEach(function (t) {
      var activa = t === tab;
      t.classList.toggle('activo', activa);
      t.setAttribute('aria-selected', String(activa));
      t.tabIndex = activa ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !activa;
      panel.classList.toggle('activo', activa);
    });
    if (enfocar) tab.focus();
  }
  pestanas.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activar(tab); });
    tab.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (dir) activar(pestanas[(i + dir + pestanas.length) % pestanas.length], true);
    });
  });

  /* ---------- Demo de "Hoy": marcar objetivos sube el % ---------- */
  var checks = document.querySelectorAll('.tel-check');
  var demoPct = document.getElementById('demo-porcentaje');
  var demoBarra = document.getElementById('demo-barra');
  var demoMsj = document.getElementById('demo-mensaje');
  var demoDragon = document.getElementById('demo-dragon');
  function actualizarDemo() {
    var hechos = document.querySelectorAll('.tel-check[aria-pressed="true"]').length;
    var pct = Math.round((hechos / checks.length) * 100);
    demoPct.textContent = pct;
    demoBarra.style.width = pct + '%';
    var cara = pct === 100 ? 'festejo' : pct >= 50 ? 'orgullo' : 'animo';
    demoMsj.textContent = pct === 100 ? '¡Día perfecto! 🎉' : pct >= 50 ? '¡Vas muy bien! 💪' : pct > 0 ? '¡Buen comienzo! 🌱' : '¡Arranquemos el día!';
    demoDragon.src = RUTA + cara + '.webp';
    demoDragon.animate && !movimientoReducido && demoDragon.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.15) rotate(-6deg)' }, { transform: 'scale(1)' }],
      { duration: 400, easing: 'ease-out' }
    );
  }
  checks.forEach(function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'));
      actualizarDemo();
    });
  });

  /* ---------- Carrusel de capturas ---------- */
  var pista = document.getElementById('carrusel');
  var puntos = document.getElementById('carrusel-puntos');
  if (pista) {
    var figuras = Array.prototype.slice.call(pista.querySelectorAll('figure'));
    var irA = function (i) {
      var f = figuras[Math.max(0, Math.min(i, figuras.length - 1))];
      pista.scrollTo({ left: f.offsetLeft - (pista.clientWidth - f.clientWidth) / 2, behavior: movimientoReducido ? 'auto' : 'smooth' });
    };
    figuras.forEach(function (_, i) {
      var p = document.createElement('button');
      p.setAttribute('aria-label', 'Ir a la captura ' + (i + 1));
      p.addEventListener('click', function () { irA(i); });
      puntos.appendChild(p);
    });
    var actual = 0;
    var marcar = function () {
      var centro = pista.scrollLeft + pista.clientWidth / 2, mejor = 0, dist = Infinity;
      figuras.forEach(function (f, i) {
        var d = Math.abs(f.offsetLeft + f.clientWidth / 2 - centro);
        if (d < dist) { dist = d; mejor = i; }
      });
      actual = mejor;
      Array.prototype.forEach.call(puntos.children, function (p, i) { p.classList.toggle('activo', i === mejor); });
      figuras.forEach(function (f, i) {
        f.style.transform = i === mejor ? 'scale(1)' : 'scale(.92)';
        f.style.opacity = i === mejor ? '1' : '.6';
      });
    };
    var espera;
    pista.addEventListener('scroll', function () { clearTimeout(espera); espera = setTimeout(marcar, 60); }, { passive: true });
    document.querySelector('.carrusel-flecha.anterior').addEventListener('click', function () { irA(actual - 1); });
    document.querySelector('.carrusel-flecha.siguiente').addEventListener('click', function () { irA(actual + 1); });
    pista.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); irA(actual + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); irA(actual - 1); }
    });
    window.addEventListener('resize', marcar);
    window.addEventListener('load', function () { irA(1); setTimeout(marcar, 400); });
    marcar();
  }

  /* ---------- Desfile infinito de dragones: duplica la lista ---------- */
  var desfile = document.querySelector('.desfile-pista');
  if (desfile && !movimientoReducido) {
    Array.prototype.slice.call(desfile.children).forEach(function (f) {
      var copia = f.cloneNode(true);
      copia.setAttribute('aria-hidden', 'true');
      desfile.appendChild(copia);
    });
  } else if (desfile) {
    desfile.style.flexWrap = 'wrap';
    desfile.style.justifyContent = 'center';
    desfile.style.width = 'auto';
  }

  /* ---------- Botón fijo de descarga: aparece después de la portada ---------- */
  var fija = document.getElementById('descarga-fija');
  var portada = document.querySelector('.portada');
  var cierre = document.querySelector('.cierre');
  if (fija && portada && 'IntersectionObserver' in window) {
    var portadaVisible = true, cierreVisible = false;
    var aplicar = function () { fija.classList.toggle('visible', !portadaVisible && !cierreVisible); };
    new IntersectionObserver(function (e) { portadaVisible = e[0].isIntersecting; aplicar(); }).observe(portada);
    new IntersectionObserver(function (e) { cierreVisible = e[0].isIntersecting; aplicar(); }).observe(cierre);
  }
})();
