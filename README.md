# Web de extensiones

Web pública de mis extensiones de navegador: **SafeTabs**, **ChatShelf** y **PisoRadar**.

Publicada en **https://andresfernandeznad.github.io/extensiones-web/**

## Para qué sirve

Cada extensión necesita una web por tres motivos:

1. **Chrome Web Store** exige una URL pública de política de privacidad para publicar extensiones que manejan datos de usuario.
2. **Lemon Squeezy** necesita una página de producto, unas condiciones y una página a la que redirigir después de la compra (`thanks.html`), donde se explica cómo activar la clave de licencia.
3. **Usuarios y potenciales compradores** buscan qué hace la extensión, cuánto cuesta y qué pasa con sus datos.

## Qué hay

| Página | Para qué |
| --- | --- |
| Inicio (`/`, `/es/`) | Lista las extensiones con enlace a Chrome Web Store |
| `<extensión>/` | Página de producto: qué hace, capturas, precio y preguntas frecuentes |
| `<extensión>/privacy.html` | Política de privacidad (es la URL que va en Chrome Web Store) |
| `<extensión>/terms.html` | Condiciones de uso: licencia personal, reembolso, ley aplicable |
| `<extensión>/thanks.html` | Página de gracias tras la compra, con los pasos para pegar la licencia. No se indexa |

SafeTabs y ChatShelf están en inglés (raíz de su carpeta) y en español (subcarpeta `es/`). PisoRadar solo está en español porque es para el mercado español.

## Principios

- **Sin frameworks ni JavaScript**: HTML y CSS. Carga en un instante, funciona en cualquier navegador y no hay dependencias que mantener.
- **Accesible**: HTML semántico, navegación por teclado, contraste suficiente, modo oscuro y respeto a `prefers-reduced-motion`.
- **Honesta**: la política de privacidad describe exactamente lo que hacen las extensiones. Consulta [docs/privacidad-y-legal.md](docs/privacidad-y-legal.md) antes de cambiar el comportamiento de una extensión.

## Seguridad: nunca se commitean secretos

El repositorio es público. **Nunca, bajo ningún concepto**, se commitean API keys, tokens, contraseñas, claves privadas (incluida la `.pem` de las extensiones), archivos `.env`, datos de clientes ni datos bancarios. La única excepción son los datos del titular que la ley obliga a publicar en las páginas legales de `site/`.

Lo hacen cumplir `.gitignore`, un hook pre-commit, CI y la push protection de GitHub. Reglas completas en [CLAUDE.md](CLAUDE.md) y qué hacer si algo se filtra en [docs/seguridad.md](docs/seguridad.md).

## Inicio rápido

Requisitos: Python 3 (para servir en local) y Node 18 o superior (para las comprobaciones).

Nada más clonar, activa el hook que bloquea secretos:

```bash
git config core.hooksPath .githooks
```

```bash
python -m http.server 8080 -d site
```

Abre http://localhost:8080. Los enlaces usan rutas de carpeta (`safetabs/`), así que hace falta un servidor: abrir los archivos con doble clic no funciona.

```bash
node scripts/check.mjs
```

Comprueba enlaces, accesibilidad básica y datos pendientes. Es la misma comprobación que se ejecuta antes de cada despliegue.

## Antes de publicar: checklist

El despliegue **se bloquea automáticamente** mientras falten los datos legales. Sin ellos, la política de privacidad y las condiciones no son válidas.

- [ ] `TODO_NOMBRE`: tu nombre completo
- [ ] `TODO_NIF`: tu NIF
- [ ] `TODO_DIRECCION`: tu dirección postal (el texto ya añade "España")
- [ ] `TODO_EMAIL`: correo de contacto

Estos datos no bloquean el despliegue, pero hay que completarlos en cuanto existan:

- [ ] `TODO_SAFETABS_ID`, `TODO_CHATSHELF_ID`, `TODO_PISORADAR_ID`: ID de cada extensión en Chrome Web Store
- [ ] `TODO_TIENDA` y `TODO_*_CHECKOUT`: tienda y enlaces de compra de Lemon Squeezy
- [ ] Comentarios `<!-- TODO -->`: capturas reales, pasos de activación según la interfaz real, cómo se genera el nombre de instancia y el mecanismo de transferencia internacional de Lemon Squeezy

¿Por qué esa separación? Chrome Web Store pide la URL de la política de privacidad **antes** de publicar la extensión. Si los ID de la tienda bloquearan el despliegue, nunca podrías publicar ninguna de las dos cosas.

Para reemplazar un dato en todas las páginas:

```bash
fd -e html . site -x sd 'TODO_EMAIL' 'hola@tudominio.es'
```

`node scripts/check.mjs --strict` también falla con los avisos. Úsalo para confirmar que no queda nada pendiente.

## Publicación

Cada push a `main` ejecuta [el workflow](.github/workflows/pages.yml): primero las comprobaciones y, si pasan, publica la carpeta `site/` en GitHub Pages. Los pull requests solo ejecutan las comprobaciones. Detalles en [docs/despliegue.md](docs/despliegue.md).

## Estructura

```
site/                     Todo lo que se publica
  index.html              Inicio (inglés)
  es/index.html           Inicio (español)
  404.html                Página de error (bilingüe)
  assets/                 style.css, favicon.svg, placeholder.svg
  safetabs/               index, privacy, terms, thanks (inglés)
  safetabs/es/            lo mismo en español
  chatshelf/  chatshelf/es/
  pisoradar/              solo español
scripts/check.mjs         Comprobaciones previas al despliegue
scripts/scan-secrets.mjs  Escáner de secretos y datos sensibles
.githooks/pre-commit      Ejecuta el escáner antes de cada commit
.github/workflows/        Despliegue a GitHub Pages
docs/                     Documentación
```

## Documentación

- [Arquitectura y decisiones](docs/arquitectura.md): por qué está hecha así y qué compromisos implica.
- [Editar contenido](docs/contenido.md): cambiar textos y precios, añadir capturas o una extensión nueva.
- [Privacidad y legal](docs/privacidad-y-legal.md): qué promete la web y qué pueden y no pueden hacer las extensiones.
- [Accesibilidad y usabilidad](docs/accesibilidad-y-usabilidad.md): qué se garantiza y cómo probarlo.
- [Seguridad](docs/seguridad.md): secretos, datos sensibles y qué hacer ante una filtración.
- [Despliegue](docs/despliegue.md): GitHub Pages, comprobaciones, dominio propio y cómo deshacer una publicación.
- [Changelog](CHANGELOG.md)

## Aviso

Los textos legales son una base cuidada, no asesoramiento jurídico. Que los revise un profesional antes de empezar a vender.

## Licencia

© 2026 TODO_NOMBRE. Todos los derechos reservados.

