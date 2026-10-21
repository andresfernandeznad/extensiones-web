# Privacidad y legal

La política de privacidad no es un texto decorativo: es una **promesa pública** sobre cómo funcionan las extensiones. Chrome Web Store la revisa, y el RGPD te obliga a cumplirla. Si el código y la política no coinciden, el problema es tuyo, no del texto.

## Qué promete la web

Para todas las extensiones:

| Promesa | Qué significa en el código |
| --- | --- |
| Los datos se quedan en el navegador | Solo `chrome.storage.local`. **No** `chrome.storage.sync`, que sube los datos a la cuenta de Google del usuario. |
| La única conexión externa es Lemon Squeezy | Ninguna `fetch`/XHR/WebSocket a otro dominio. `host_permissions` y la CSP lo deben reflejar. |
| Solo al activar Pro | Sin licencia, la extensión no hace ninguna petición de red propia. |
| Lemon Squeezy recibe la clave y un nombre de instancia | Activación: `license_key` + `instance_name`. Validación: `license_key` + `instance_id`. Nada más en el cuerpo de la petición. |
| Sin analítica ni telemetría | Ni Google Analytics, ni Sentry, ni informes de errores automáticos, ni "ping" de instalación. |
| Sin código remoto | Todo el JS va en el paquete. Nada de `eval`, ni scripts cargados desde una URL. (Manifest V3 ya lo prohíbe.) |
| Se borra al desinstalar | No guardar nada fuera de la extensión: ni cookies propias ni datos en `localStorage` de las webs que visita. |

Promesas específicas:

- **ChatShelf**: no copia el contenido de los mensajes, solo título y URL de las conversaciones que el usuario archiva.
- **PisoRadar**: no consulta los portales en segundo plano. Solo registra lo que el usuario abre.

### Si cambias el comportamiento

Antes de publicar una versión que añada una conexión, un dato nuevo o un tercero:

1. Actualiza la sección correspondiente de la política (todas las páginas e idiomas afectados).
2. Actualiza el formulario de "Privacy practices" de Chrome Web Store.
3. Avísalo en las notas de versión antes de que entre en vigor.
4. Si es un tercero nuevo, revisa si hace falta un contrato de encargado del tratamiento (art. 28 RGPD).

## Fase gratuita y fase de pago

La web tiene dos estados, igual que las extensiones (`WXT_PAYWALL`).

**Fase gratuita (ahora).** Las extensiones no tienen Pro, no hacen ninguna petición de red y no hay nada a la venta. Por eso:

- Las páginas legales van firmadas con la marca **Localware** y su correo, sin nombre, NIF ni dirección. Sin actividad económica no aplica el art. 10 de la LSSI, y como las extensiones no envían ningún dato, el único tratamiento es el de los correos que recibas.
- Las páginas de producto no tienen precios ni botón de compra, y las secciones de licencia, compra y reembolso no existen.
- Las páginas `thanks.html` siguen existiendo (su ruta no cambia), pero solo dicen que Pro todavía no existe.
- En Chrome Web Store la cuenta se declara *non-trader*: sin cobro no hay actividad comercial, así que no se publican dirección ni teléfono.

**Fase de pago (al activar `WXT_PAYWALL=on`).** Antes de publicar la primera versión con cobro:

1. Revierte el commit que pasó la web a la fase gratuita (`git log --grep "fase gratuita"`): vuelven los precios, las secciones de licencia, compra y reembolso, y los marcadores `TODO_NOMBRE`, `TODO_NIF`, `TODO_DIRECCION`, que bloquean el despliegue hasta rellenarlos.
2. Mantén la URL nueva y el correo de Localware al resolver los conflictos.
3. Cambia la declaración de Chrome Web Store a *trader*.
4. Consulta a un gestor el alta en Hacienda y, si procede, en la Seguridad Social.

## Qué cubre cada sección de la política

1. **Responsable**: identidad completa del autónomo (art. 13.1.a RGPD).
2. **Datos en el navegador**: lista exacta por extensión. Tú no eres responsable de lo que nunca recibes, pero hay que explicarlo.
3. **Licencia**: qué se envía, finalidad y base jurídica (contrato, art. 6.1.b). También menciona la IP, porque cualquier petición HTTP la revela.
4. **Compra**: Lemon Squeezy actúa como *merchant of record*. Trata los datos de pago como responsable independiente y te pasa los datos del pedido, que tú sí tratas.
5. **Contacto por correo**: interés legítimo o contrato.
6. **Lo que no hago**: incluye la declaración de "uso limitado" que pide Chrome Web Store.
7. **Conservación**.
8. **Destinatarios y transferencias**: Lemon Squeezy y GitHub, ambos en EE. UU.
9. **Derechos RGPD**: acceso, rectificación, supresión, oposición, limitación, portabilidad y decisiones automatizadas. Plazo de respuesta de un mes. Reclamación ante la AEPD.
10. **Menores**: 14 años, la edad de consentimiento digital en España (art. 7 LOPDGDD).
11. **Cambios**.

## Qué cubren las condiciones

- **Identificación del titular**: la exige el art. 10 de la LSSI-CE a cualquier web con actividad económica.
- **Licencia personal**: una persona, sus dispositivos, hasta el límite de activaciones. No se puede compartir ni revender.
- **Reembolso en 14 días** sin justificación. Es voluntario: el art. 103.m TRLGDCU permitiría excluir el desistimiento en contenido digital, pero se ofrece igualmente. Se tramita desde Lemon Squeezy (Orders → Refund).
- **Sin garantía de compatibilidad futura** con webs de terceros ni con futuras versiones del navegador, con una salvedad: no se pueden limitar los derechos legales del consumidor, y el texto lo dice expresamente.
- **Legislación española**. Si el comprador es consumidor, conserva el fuero de su domicilio y las normas imperativas de su país.

## Pendientes legales (comentarios `<!-- TODO -->`)

- **Nombre de instancia**: confirma qué envía la extensión. Usa algo neutro (`"SafeTabs Chrome"` o un UUID aleatorio). **No** uses el nombre del equipo ni el del usuario: serían datos personales y la política dice lo contrario.
- **Transferencia internacional**: revisa en la política de privacidad de Lemon Squeezy si se acoge al Data Privacy Framework o usa cláusulas contractuales tipo, y nómbralo.

## Lo que no está y por qué

- **Banner de cookies**: la web no usa cookies ni almacenamiento. No hace falta.
- **Enlace a la plataforma europea de resolución de litigios en línea (ODR)**: la plataforma cerró en julio de 2025 y ya no hay que enlazarla.
- **Registro de actividades de tratamiento**: no es una página pública, pero conviene que lo tengas (art. 30 RGPD). Con esta política tienes casi todo el contenido.

## Revisión profesional

Esta documentación y los textos son una base cuidada, no asesoramiento jurídico. Que un abogado los revise antes de empezar a cobrar, sobre todo las secciones de garantía y reembolso.
