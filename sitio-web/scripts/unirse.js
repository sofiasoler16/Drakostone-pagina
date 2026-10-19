/* =========================================================
   UNIRSE A UN GRUPO — lee el código de la URL (?c=CODIGO),
   lo muestra, permite copiarlo y arma el botón "Abrir en la app".
   ========================================================= */
(function () {
  var PAQUETE = 'com.sofiasoler.drakostone';
  var PLAY = 'https://play.google.com/store/apps/details?id=' + PAQUETE;

  var params = new URLSearchParams(location.search);
  var codigo = (params.get('c') || '').trim();
  if (!codigo) return;

  var caja = document.getElementById('codigo-box');
  var boton = document.getElementById('codigo');
  var aviso = document.getElementById('copiado');
  var abrir = document.getElementById('abrir');

  boton.textContent = codigo;
  caja.hidden = false;

  // En Android usamos un "intent": abre la app si está instalada y, si no, va a Google Play.
  var esAndroid = /android/i.test(navigator.userAgent);
  abrir.href = esAndroid
    ? 'intent://unirse?c=' + encodeURIComponent(codigo) +
      '#Intent;scheme=objetivosdragon;package=' + PAQUETE +
      ';S.browser_fallback_url=' + encodeURIComponent(PLAY) + ';end'
    : 'objetivosdragon://unirse?c=' + encodeURIComponent(codigo);
  abrir.hidden = false;

  // Tocar el código lo copia
  boton.addEventListener('click', function () {
    var listo = function () {
      aviso.textContent = '¡Código copiado! ✓';
      setTimeout(function () { aviso.textContent = ''; }, 2200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codigo).then(listo, function () { aviso.textContent = 'Mantené apretado para copiar'; });
    } else {
      aviso.textContent = 'Mantené apretado para copiar';
    }
  });
})();
