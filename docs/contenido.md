# Editar contenido

Después de cualquier cambio, ejecuta:

```bash
node scripts/check.mjs
```

## Cambiar un texto o un precio

1. Edita la página en `site/<extensión>/index.html` y, si existe, también su versión en `site/<extensión>/es/index.html`.
2. Si cambias el precio, cámbialo también en Lemon Squeezy. El precio de la web y el del checkout tienen que coincidir, impuestos incluidos.
3. Si cambias el lema (`tagline`), actualiza también la tarjeta de la portada en `site/index.html` y `site/es/index.html`, y el `<title>` de la página.

## Añadir capturas reales

1. Haz capturas de 1280×800 px (el tamaño que pide Chrome Web Store, así puedes reutilizarlas).
2. Guárdalas en `site/<extensión>/img/` como `1.png`, `2.png`... Si pasan de 200 KB, conviértelas a `.webp`.
3. En la página de producto, cambia el `src` de cada `<img>`:
   - Página en inglés: `src="img/1.png"`
   - Página en español: `src="../img/1.png"` (reutiliza las mismas, salvo que tengas capturas con la interfaz en español)
4. Escribe un `alt` que describa lo que se ve, no "captura 1". Deja `width="1280" height="800"`: evitan saltos de diseño mientras carga.
5. Borra el comentario `<!-- TODO: replace the placeholders... -->`.

## Rellenar los enlaces de tienda y compra

| Marcador | Dónde se consigue |
| --- | --- |
| `TODO_<EXT>_ID` | La URL de la ficha en Chrome Web Store: `chromewebstore.google.com/detail/<nombre>/<ID>`. Puedes usar la URL completa. |
| `TODO_TIENDA` | El subdominio de tu tienda: `<tienda>.lemonsqueezy.com` |
| `TODO_<EXT>_CHECKOUT` | Lemon Squeezy → Products → Share → enlace de compra |

En Lemon Squeezy, configura en cada producto:

- **Redirect after purchase** (Confirmation modal → Button link): `https://andresfernandeznad.github.io/extensiones-web/<extensión>/thanks.html` (o `/es/thanks.html`).
- **License keys** activado, con el límite de activaciones que quieras. Las condiciones remiten a "el límite indicado en la compra", así que tiene que mostrarse en el checkout o en la descripción del producto.
- **Precios con impuestos incluidos**. La web dice "impuestos incluidos" y, en España, los precios a consumidores deben mostrarse con IVA.

## Añadir una extensión nueva

Ejemplo: `NuevaExt`, bilingüe.

1. Copia la carpeta de la extensión más parecida:
   ```bash
   cp -r site/safetabs site/nuevaext
   ```
2. En las 8 páginas (`index`, `privacy`, `terms`, `thanks` × 2 idiomas), sustituye el nombre:
   ```bash
   fd -e html . site/nuevaext -x sd 'SafeTabs' 'NuevaExt'
   fd -e html . site/nuevaext -x sd 'safetabs' 'nuevaext'
   ```
3. Reescribe el contenido específico:
   - **Página de producto**: lema, resumen, funciones, capturas, planes y preguntas frecuentes.
   - **Privacidad, sección 2**: la lista exacta de datos que guarda. Tiene que ser verdad (ver [privacidad-y-legal.md](privacidad-y-legal.md)).
   - **Condiciones, sección 7**: de qué webs o funciones del navegador depende.
   - **Gracias**: los pasos reales para activar la licencia.
   - Los marcadores `TODO_SAFETABS_*` pasan a ser `TODO_NUEVAEXT_*`.
4. Añade una tarjeta en `site/index.html` y en `site/es/index.html` (copia un `<li class="card">`).
5. Si la extensión es solo en español, borra la carpeta `es/`, mueve sus páginas a la raíz de la extensión, quita el enlace "English" de la cabecera y los `hreflang` alternativos, y en la portada en inglés añade `<p class="badge">Spanish only · for Spain</p>` como en PisoRadar.
6. Ejecuta `node scripts/check.mjs`.

## Añadir un idioma

Sigue el patrón actual: subcarpeta con el código del idioma (`fr/`). En cada página existente, añade el `<link rel="alternate" hreflang="fr">` y el enlace en el selector de la cabecera. Las versiones traducidas de los textos legales deben indicar que prevalece la versión española.

## Actualizar los textos legales

1. Cambia el texto en **todas** las páginas afectadas (todas las extensiones y todos los idiomas).
2. Actualiza la fecha de "Última actualización" / "Last updated".
3. Añade una entrada en [CHANGELOG.md](../CHANGELOG.md).
4. Si el cambio afecta a cómo se tratan los datos, avísalo en las notas de versión de la extensión **antes** de que entre en vigor. La política se compromete a ello.
