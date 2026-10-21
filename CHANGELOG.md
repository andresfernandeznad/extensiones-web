# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Las fechas de los textos legales se actualizan en las propias páginas.

## [Sin publicar]

### Cambiado

- Fase gratuita: la web se firma con la marca Localware y su correo de contacto, sin nombre, NIF ni dirección.
- Sin precios, botones de compra ni secciones de licencia, compra y reembolso; las páginas de gracias explican que Pro todavía no existe.
- La política de privacidad ya no menciona Lemon Squeezy (las extensiones no se conectan a ningún servidor) y añade Gmail como servicio de correo.
- Nueva URL: `localware.github.io/extensiones-web/`.

### Añadido

- Reglas para no commitear secretos ni datos sensibles (`CLAUDE.md`, `docs/seguridad.md`).
- `scripts/scan-secrets.mjs`, hook pre-commit y paso de escaneo en CI.
- `.gitignore` ampliado con `.env`, claves y certificados.

## [1.0.0] - 2026-10-19

### Añadido

- Portada en inglés y español con SafeTabs, ChatShelf y PisoRadar.
- Por extensión: página de producto, política de privacidad, condiciones de uso y página de gracias tras la compra.
- SafeTabs y ChatShelf en inglés y español; PisoRadar solo en español, para España.
- Política de privacidad: almacenamiento solo local, verificación de licencia con Lemon Squeezy, derechos RGPD.
- Condiciones: licencia personal, reembolso en 14 días, sin garantía de compatibilidad futura, legislación española.
- `scripts/check.mjs`: comprobación de enlaces, accesibilidad básica y datos pendientes.
- Despliegue automático a GitHub Pages, bloqueado mientras falten los datos legales.
- Documentación en `docs/`.
