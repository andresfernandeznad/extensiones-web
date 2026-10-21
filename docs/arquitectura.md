# Arquitectura y decisiones

## Objetivo

Una web pequeña, rápida y fácil de mantener que dé soporte comercial y legal a varias extensiones de navegador. Tiene que estar disponible siempre, porque Chrome Web Store y Lemon Squeezy enlazan a ella.

## Decisiones

### HTML y CSS, sin frameworks ni JavaScript

- **Por qué**: son páginas de contenido que casi no cambian. Un framework añadiría dependencias, un paso de build y más superficie de fallos sin aportar nada.
- **Coste**: no hay plantillas. La cabecera, el pie y los textos legales se repiten en cada página (ver "Duplicación").

### Todo lo publicable vive en `site/`

- **Por qué**: el workflow publica solo `site/`. La documentación, los scripts y la configuración del repositorio no acaban en la web.
- **Regla**: si un archivo tiene que ser accesible desde el navegador, va en `site/`. Si no, fuera.

### Rutas relativas

- Todos los enlaces internos son relativos (`../assets/style.css`, `privacy.html`). La web funciona igual en `localware.github.io/extensiones-web/`, en local o con un dominio propio, sin tocar nada.
- **Excepción**: `404.html`. GitHub Pages la sirve desde cualquier URL que no exista, así que sus enlaces son absolutos (`/extensiones-web/`). Si cambias a dominio propio, actualízalos (ver [despliegue.md](despliegue.md)).
- Las etiquetas `<link rel="canonical">` y `hreflang` usan URLs absolutas porque así lo exigen los buscadores.

### Idiomas

| Contenido | Ruta inglés | Ruta español |
| --- | --- | --- |
| Inicio | `/` | `/es/` |
| Extensión bilingüe | `/<ext>/` | `/<ext>/es/` |
| Extensión solo en español | — | `/<ext>/` |

- Cada página declara su idioma en `<html lang>` y enlaza a su equivalente con `hreflang`.
- Las versiones en inglés de los textos legales indican que, si hay diferencias, prevalece la española, porque la ley aplicable es la española.
- PisoRadar no tiene selector de idioma. En la portada en inglés aparece marcada como "Spanish only · for Spain" y su enlace lleva `hreflang="es"`.

### Duplicación

Los textos legales son casi iguales en todas las extensiones, pero cada página los lleva completos.

- **Ventaja**: cada página es autónoma, se lee y se edita sin herramientas, y no hay build.
- **Inconveniente**: un cambio legal hay que repetirlo en todas las páginas (`privacy.html` y `terms.html` de cada extensión e idioma). Revisa siempre todas.
- **Cuándo replantearlo**: a partir de unas 5 extensiones o si los cambios legales se vuelven frecuentes. La alternativa natural es Jekyll, que GitHub Pages incluye: plantillas y variables (`site.contact_email`) sin instalar nada en el servidor. El precio es depender de Ruby para previsualizar en local.

### Comprobaciones antes de publicar

[`scripts/check.mjs`](../scripts/check.mjs) es un script de Node sin dependencias. Separa dos niveles:

- **Errores** (bloquean el despliegue): datos legales sin rellenar, enlaces o anclas rotos, páginas sin `lang`, sin `<title>`, sin exactamente un `<h1>` o con imágenes sin `alt`.
- **Avisos**: IDs de tienda y de compra pendientes y comentarios `<!-- TODO -->`.

La separación es intencionada: Chrome Web Store exige la URL de la política de privacidad antes de publicar la extensión, así que la web tiene que poder salir sin esos IDs.

### Sin cookies, sin analítica, sin recursos externos

La web no carga fuentes, scripts ni imágenes de terceros. Por eso no necesita banner de cookies, y la política de privacidad puede afirmar que no hay seguimiento. **No añadas analítica ni recursos externos sin actualizar antes la política** (ver [privacidad-y-legal.md](privacidad-y-legal.md)).

## Estructura de una página

```
<a class="skip">                 Saltar al contenido
<header class="site-header">     Marca + selector de idioma
<main id="main" class="wrap">    Contenido
<footer class="site-footer">     Inicio, privacidad y condiciones de la extensión, contacto
```

## CSS

Un único archivo, [`site/assets/style.css`](../site/assets/style.css):

- Colores en variables de `:root`, redefinidas en `@media (prefers-color-scheme: dark)`.
- Rejillas con `auto-fit`/`auto-fill` y `minmax`: se adaptan del móvil al escritorio sin media queries.
- Clases principales: `.hero`, `.cards`, `.grid-2`, `.grid-3`, `.shots`, `.plans`, `.plan-pro`, `.prose` (textos largos), `.summary`, `.btn`, `.btn-secondary`, `.badge`, `.visually-hidden`.
