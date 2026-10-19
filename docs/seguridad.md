# Seguridad: secretos y datos sensibles

El repositorio es público. Un secreto commiteado se considera **comprometido desde el primer segundo**: hay bots que escanean GitHub en tiempo real buscando claves, y el historial de git conserva todo aunque borres el archivo después.

## Qué no entra nunca en el repositorio

Las reglas completas están en [CLAUDE.md](../CLAUDE.md). En resumen:

| No se commitea | Dónde va en su lugar |
| --- | --- |
| API keys y tokens (Lemon Squeezy, GitHub...) | GitHub → Settings → Secrets and variables → Actions, o una variable de entorno local |
| `.pem` de firma de las extensiones | Gestor de contraseñas o copia de seguridad cifrada, fuera del repo |
| `.env` | Solo en local; en el repo, `.env.example` sin valores reales |
| Datos de clientes (correos, pedidos, licencias) | Solo en Lemon Squeezy |
| Datos bancarios y facturas | En tu gestoría o en tu contabilidad, nunca en git |
| NIF, dirección y otros datos personales | Solo en `site/`, donde la ley exige publicarlos |

## Capas de protección

1. **`.gitignore`**: evita añadir por accidente `.env`, `.pem`, `.key`, `.p12`, `.crx` y claves SSH.
2. **Hook pre-commit**: `scripts/scan-secrets.mjs --staged` revisa lo que vas a commitear y bloquea el commit si encuentra algo. Hay que activarlo una vez por clon:
   ```bash
   git config core.hooksPath .githooks
   ```
3. **CI**: el workflow ejecuta `scripts/scan-secrets.mjs` sobre todo el repositorio antes de publicar. Si encuentra algo, no despliega.
4. **GitHub push protection**: GitHub rechaza el push si detecta tokens de proveedores conocidos.

Ninguna capa es perfecta por sí sola. Por eso hay cuatro.

### Qué detecta el escáner

- **Archivos prohibidos**: `.env*` (salvo `.env.example`), `.pem`, `.key`, `.p12`, `.pfx`, `.jks`, `.crx`, claves SSH, `credentials`, `secrets`.
- **Contenido**: claves privadas, tokens de GitHub, AWS, Google, Stripe y Slack, JWT (las API keys de Lemon Squeezy lo son), asignaciones del tipo `api_key = "..."`, IBAN y números de tarjeta.
- **Fuera de `site/`**: DNI, NIF y NIE.

Para revisar todo el historial, no solo el estado actual:

```bash
node scripts/scan-secrets.mjs --history
```

## Si se filtra un secreto

El orden importa. **Primero se revoca y después se limpia**, porque limpiar el historial no sirve de nada si la clave ya la copió alguien.

1. **Revoca la clave ya** en el servicio afectado:
   - Lemon Squeezy: Settings → API → elimina la clave.
   - GitHub: Settings → Developer settings → revoca el token.
   - `.pem` de una extensión: no se puede revocar. Contacta con el soporte de Chrome Web Store.
2. **Genera una nueva** y guárdala donde corresponde (tabla de arriba).
3. **Revisa los registros** del servicio por si hubo un uso no autorizado.
4. **Limpia el historial** con [git-filter-repo](https://github.com/newren/git-filter-repo) y fuerza el push. Avisa a quien tenga un clon, porque tendrá que volver a clonar.
5. **Si había datos de clientes**: el RGPD (art. 33) obliga a notificarlo a la AEPD en un máximo de 72 horas si hay riesgo para las personas afectadas. Documenta el incidente aunque no lo notifiques.

## Datos personales publicados en la web

Tu nombre, NIF, dirección y correo aparecen en las páginas legales porque la ley obliga. Ten en cuenta que:

- Quedan públicos en la web y en el historial de git.
- Si no quieres publicar tu domicilio particular, puedes usar un domicilio profesional o un servicio de domiciliación. Tiene que ser una dirección donde se pueda contactar contigo.
- Si cambian, actualízalos en todas las páginas. Los antiguos seguirán en el historial: es inevitable y aceptable, porque ya fueron públicos.
