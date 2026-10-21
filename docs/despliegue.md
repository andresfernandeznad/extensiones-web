# Despliegue

## Cómo funciona

```
push a main ──► job "Check site" ──(ok)──► job "Deploy" ──► GitHub Pages
                 node scripts/check.mjs                      publica site/
pull request ──► job "Check site" (no publica)
```

- Workflow: [`.github/workflows/pages.yml`](../.github/workflows/pages.yml).
- Origen de Pages: **GitHub Actions** (Settings → Pages → Build and deployment → Source).
- Solo se publica la carpeta `site/`.
- Si la comprobación falla, no se publica nada y la versión anterior sigue en línea.
- URL: https://localware.github.io/extensiones-web/

## Primer despliegue

El primer despliegue fallará a propósito en "Check site" hasta que rellenes los datos legales (`TODO_NOMBRE`, `TODO_NIF`, `TODO_DIRECCION`, `TODO_EMAIL`). Así una política de privacidad sin responsable nunca llega a publicarse.

1. Rellena esos datos (ver el checklist del [README](../README.md)).
2. `node scripts/check.mjs` en local: tiene que acabar con "Listo para publicar".
3. Haz commit y push a `main`.
4. En GitHub → Actions, espera a que el workflow termine en verde. El enlace aparece en el job "Deploy".

## Ver el estado

```bash
gh run list --workflow pages.yml --limit 5
```

```bash
gh run view --log-failed
```

Las comprobaciones dejan anotaciones con el archivo y la línea en la pestaña "Summary" de cada ejecución.

## Volver a una versión anterior

GitHub Pages siempre publica el último commit de `main` que pasó las comprobaciones. Para deshacer:

```bash
git revert <commit>
```

```bash
git push
```

También puedes relanzar un despliegue manualmente: Actions → Deploy to GitHub Pages → Run workflow.

## Dominio propio (opcional)

1. En tu proveedor DNS, crea un registro `CNAME` de `www.tudominio.es` a `localware.github.io`.
2. GitHub → Settings → Pages → Custom domain: `www.tudominio.es`, y activa "Enforce HTTPS" cuando esté disponible.
3. En todas las páginas, reemplaza `https://localware.github.io/extensiones-web` por `https://www.tudominio.es` (canonical y hreflang).
4. En `site/404.html`, cambia `/extensiones-web/` por `/`.
5. Actualiza las URLs en Chrome Web Store (política de privacidad, web) y en Lemon Squeezy (redirección tras la compra).

Con dominio propio, la web ya no depende del nombre del repositorio y las URLs de la política quedan estables aunque cambies de alojamiento.

## URLs que hay que dar a terceros

| Dónde | Campo | URL |
| --- | --- | --- |
| Chrome Web Store | Privacy policy | `.../<extensión>/privacy.html` (o `.../<extensión>/es/privacy.html`) |
| Chrome Web Store | Homepage URL | `.../<extensión>/` |
| Lemon Squeezy | Redirect after purchase | `.../<extensión>/thanks.html` |
| Lemon Squeezy | Product description | Enlace a `.../<extensión>/terms.html` |

**No cambies estas rutas** una vez publicadas: GitHub Pages no admite redirecciones del servidor y romperías los enlaces de la tienda.

## Cabeceras y caché

GitHub Pages no permite configurar cabeceras HTTP (CSP, HSTS propio, etc.). Sirve HTTPS y una caché de unos 10 minutos: después de desplegar, los cambios pueden tardar ese tiempo en verse. Si algún día necesitas cabeceras propias, la alternativa es Cloudflare Pages o Netlify, que publican la misma carpeta `site/` sin cambios.
