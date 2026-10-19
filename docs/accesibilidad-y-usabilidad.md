# Accesibilidad y usabilidad

Objetivo: cumplir WCAG 2.2 nivel AA. Además de ser lo correcto, la Ley 11/2023 y el Acta Europea de Accesibilidad afectan al comercio electrónico dirigido a consumidores.

## Qué está garantizado

| Aspecto | Cómo |
| --- | --- |
| Navegación por teclado | Todo son enlaces y `<details>` nativos. Enlace "Saltar al contenido" como primer elemento con foco. |
| Foco visible | `:focus-visible` con un contorno de 3 px de color distinto al de los enlaces. |
| Estructura | Un `<h1>` por página, jerarquía de encabezados sin saltos, `<header>`, `<nav>`, `<main>` y `<footer>`. |
| Idioma | `lang` en `<html>`. El texto en otro idioma se marca con `lang` (PisoRadar en la portada inglesa, el enlace "English"). |
| Imágenes | `alt` descriptivo y `width`/`height` para evitar saltos de diseño. |
| Enlaces repetidos | "Learn more" y "Chrome Web Store" incluyen el nombre de la extensión en texto oculto (`.visually-hidden`) para lectores de pantalla. |
| Preguntas frecuentes | `<details>`/`<summary>`: accesibles y operables sin JavaScript. |
| Contraste | Texto principal y secundario por encima de 4,5:1 en modo claro y oscuro. |
| Modo oscuro | Automático según el sistema (`prefers-color-scheme`). |
| Movimiento | El desplazamiento suave solo se activa si el usuario no ha pedido reducir el movimiento. |
| Zoom y móvil | Unidades relativas, sin anchos fijos. Funciona al 200 % de zoom y desde 320 px de ancho. |

## Decisiones de usabilidad

- **Página de producto**: arriba, lo que hace y el botón de instalar gratis. El precio va después de las capturas, porque primero tiene que entenderse el valor. "Ver Pro" lleva directamente al precio.
- **Gratis primero**: el botón principal es "Añadir a Chrome — gratis". Comprar Pro tiene su propio botón destacado en la tarjeta Pro.
- **Resumen en la política de privacidad**: cuatro frases arriba para quien no va a leer el texto entero. El detalle viene después.
- **Página de gracias**: pasos numerados, el formato de la clave para que el usuario la reconozca y una sección "Si algo falla" con los errores típicos. Así se ahorran correos de soporte.
- **Pie de página**: en cada página de extensión enlaza a su privacidad y sus condiciones. Chrome Web Store y Lemon Squeezy las piden accesibles.

## Cómo probar

1. **Teclado**: recorre cada tipo de página solo con Tab, Mayús+Tab, Intro y Espacio. El foco tiene que verse siempre y seguir el orden visual.
2. **Lector de pantalla**: NVDA (Windows) o VoiceOver (macOS). Revisa la lista de encabezados y la de enlaces (Insert+F7 en NVDA): cada enlace tiene que entenderse fuera de contexto.
3. **Lighthouse**: en Chrome, DevTools → Lighthouse → Accessibility y Best Practices. Objetivo: 100.
4. **Zoom**: al 200 % no puede haber desplazamiento horizontal.
5. **Modo oscuro**: DevTools → Rendering → Emulate `prefers-color-scheme: dark`.
6. `node scripts/check.mjs` cubre automáticamente `lang`, `<title>`, un `<h1>` por página y `alt` en las imágenes.

## Al añadir contenido

- No uses una imagen para mostrar texto.
- No digas "haz clic aquí": el texto del enlace tiene que describir el destino.
- Si añades colores, comprueba el contraste en los dos modos (por ejemplo, con el selector de color de DevTools).
- Si añades JavaScript algún día, la página tiene que seguir funcionando sin él.
