# Reglas del proyecto

Estas reglas valen para cualquier persona o agente de IA que trabaje en este repositorio. El repositorio es **público**: todo lo que se commitea queda visible en internet y en el historial de git para siempre.

## Regla nº 1: nunca se commitean secretos ni datos sensibles

**Bajo ningún concepto**, ni "temporalmente", ni en una rama, ni en un commit que luego se borre:

- API keys, tokens, contraseñas ni credenciales de ningún servicio (Lemon Squeezy, GitHub, Google, Chrome Web Store, Cloudflare...).
- Claves privadas, certificados ni la `.pem` de firma de las extensiones.
- Archivos `.env` (solo se permite `.env.example` con valores vacíos o ficticios).
- Datos de clientes: correos, nombres, pedidos, claves de licencia reales ni capturas que los muestren.
- Datos bancarios o de pago: IBAN, tarjetas, facturas.
- Documentos de identidad ni datos personales del titular **fuera de `site/`**.

**Única excepción**: el nombre, NIF, dirección y correo del titular dentro de `site/`, en las páginas de privacidad y condiciones. La ley (LSSI-CE art. 10, RGPD art. 13) obliga a publicarlos. En ningún otro sitio: ni en `docs/`, ni en scripts, ni en mensajes de commit.

Si una tarea parece requerir un secreto (por ejemplo, llamar a la API de Lemon Squeezy desde un script), **para y pregunta**. La respuesta correcta son los GitHub Actions secrets o una variable de entorno local que nunca se commitea.

## Cómo se hace cumplir

1. `.gitignore` excluye `.env`, claves y certificados.
2. Hook `pre-commit` (`.githooks/pre-commit`) ejecuta `node scripts/scan-secrets.mjs --staged`. Actívalo en cada clon nuevo con `git config core.hooksPath .githooks`. **Nunca** uses `git commit --no-verify` para saltártelo.
3. CI ejecuta el escáner sobre todos los archivos en cada push y pull request.
4. GitHub secret scanning y push protection están activados en el repositorio.

Si el escáner da un falso positivo, añade `secret-scan:ignore` en esa línea y explica el motivo en el commit. No lo uses para silenciar un secreto real.

Si se filtra un secreto, sigue [docs/seguridad.md](docs/seguridad.md): **primero se revoca**, después se limpia el historial.

## Otras reglas

- Commits con Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`...).
- Sin frameworks, sin JavaScript en `site/` y sin recursos externos (fuentes, analítica, CDNs) sin actualizar antes la política de privacidad. Ver [docs/arquitectura.md](docs/arquitectura.md).
- Los cambios en textos legales se aplican en **todas** las extensiones e idiomas. Ver [docs/contenido.md](docs/contenido.md).
- Antes de hacer push: `node scripts/scan-secrets.mjs` y `node scripts/check.mjs`.
- No cambies rutas ya publicadas: Chrome Web Store y Lemon Squeezy enlazan a ellas.
