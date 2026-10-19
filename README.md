# Drakostone — sitio web

Sitio de la app Drakostone: https://drakostone.solersofia.com
HTML, CSS y JS puros (sin compilar). Lo publica Vercel con cada push a `main`.

> ⚙️ En Vercel → Settings → Build and Deployment → **Root Directory = `sitio-web`**.

## Estructura

```
sitio-web/
  index.html                  → Inicio (presentación de la app)           /
  politica-privacidad/        → Política de privacidad EN/ES              /politica-privacidad
  unirse/                     → Link de invitación a un grupo (?c=CODIGO)  /unirse/?c=ABC123
  404.html                    → Página "no encontrada"
  .well-known/assetlinks.json → Hace que los links /unirse abran la app en Android
  estilos/                    → base.css (compartido) + un archivo por página
  scripts/                    → comun.js (compartido) + un archivo por página
  imagenes/                   → logo/, capturas/, dragones/, compartir/ (vista previa en WhatsApp)
  vercel.json, robots.txt, sitemap.xml
```

Cada página es un `index.html` dentro de una carpeta con su nombre: así la URL queda limpia.

## ⚠️ No romper

- **URLs**: `/politica-privacidad`, `/unirse/` y `/.well-known/assetlinks.json` las usan la app y Google.
- **Google OAuth**: el inicio tiene que explicar qué hace la app y enlazar a la política; la política
  tiene que seguir nombrando los scopes de Calendar y el párrafo de "Limited Use".
- El `<meta name="google-site-verification">` del inicio y de la política.

## Probar en la compu

```
cd sitio-web && python3 -m http.server 8000
```

y abrir http://localhost:8000
