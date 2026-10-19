# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Las fechas de los textos legales se actualizan en las propias páginas.

## [Sin publicar]

### Cambiado

- Plan Pro oculto en las páginas de producto y en la portada mientras las extensiones están en acceso anticipado (marcadores `<!--PRO … PRO-->`, ver `docs/contenido.md`).
- Privacidad: el nombre de instancia que se envía a Lemon Squeezy queda descrito ("<Extensión> <Navegador>", sin datos personales).
- Privacidad de SafeTabs: también guarda qué pestañas están fijadas y el nombre y color de los grupos de pestañas.
- Privacidad de PisoRadar: también guarda el título del anuncio y el número de habitaciones.
- Páginas de gracias: pasos de activación según la interfaz real (⚙ → Ajustes → Pro).

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
