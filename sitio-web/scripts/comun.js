/* =========================================================
   COMÚN — comportamiento compartido por todas las páginas:
   menú del celular, sombra del encabezado, aparecer al bajar y año del pie.
   ========================================================= */
(function () {
  var html = document.documentElement;

  // Menú del celular (botón hamburguesa)
  var boton = document.getElementById('boton-menu');
  var menu = document.getElementById('menu-movil');
  if (boton && menu) {
    var cerrar = function () {
      html.classList.remove('menu-abierto');
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Abrir menú');
    };
    boton.addEventListener('click', function () {
      var abierto = html.classList.toggle('menu-abierto');
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) cerrar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 900) cerrar(); });
  }

  // Sombra del encabezado cuando se baja
  var encabezado = document.getElementById('encabezado');
  if (encabezado) {
    var revisar = function () { encabezado.classList.toggle('con-sombra', window.scrollY > 8); };
    window.addEventListener('scroll', revisar, { passive: true });
    revisar();
  }

  // Elementos que aparecen al entrar en pantalla
  var elementos = document.querySelectorAll('.aparecer');
  if ('IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    elementos.forEach(function (el) { observador.observe(el); });
  } else {
    elementos.forEach(function (el) { el.classList.add('visible'); });
  }

  // Año actual en el pie
  document.querySelectorAll('.anio').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
