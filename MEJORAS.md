# SILUEL landing — Bitácora de mejoras diarias

Esta es la bitácora **acumulada** de cada cambio aplicado. Una entrada por día cronológico.

Formato de cada entrada:
```
## YYYY-MM-DD — <título corto>

**Principio**: <principio de diseño/psicología>
**Por qué**: <referencia o evidencia>
**Cambios**: <archivos + resumen>
**Rama**: mejora-diaria/YYYY-MM-DD
**Preview**: <URL>
**Métrica esperada**: <qué esperamos medir>
```

---

## 2026-10-24 — Hero móvil: la foto del hero ahora sí se ve

**Principio**: mobile-first visual — en una landing, la imagen del hero es el argumento de venta antes de leer una sola palabra; si el 70 % del tráfico móvil no la ve, el hero no existe para ese usuario.
**Por qué**: ítem #6 del backlog (H5 del diagnóstico). El hallazgo original decía que en desktop la imagen aparecía "detrás del texto" y en móvil solo había un degradado. La causa concreta era el degradado **horizontal** `from-brand-light via-brand-light/90 to-brand-light/20`: en un viewport angosto (390 px) solo se alcanza a ver el extremo `from-brand-light`, que es 100 % opaco, así que la foto quedaba **completamente tapada** en móvil. Sumado a `object-cover` con `object-center` sobre una imagen apaisada (2048×1064) recortada a un cuadro angosto, el sujeto (la sesión de maderoterapia) se perdía dos veces: por el velo y por el recorte.
**Cambios** (1 archivo, +11/-3, solo `src/components/sections/Hero.tsx`):
- El overlay pasa a ser **vertical en móvil** (`bg-gradient-to-b from-brand-light/85 via-brand-light/70 to-brand-light/40`), de modo que la foto respira bajo el texto. En desktop se conserva el degradado horizontal original (`lg:bg-gradient-to-r lg:from-brand-light lg:via-brand-light/90 lg:to-transparent`) **sin cambios visuales**: se verificó que los stops del CSS generado (`lg:from-brand-light`, `lg:via-brand-light/90`, `lg:to-transparent`) son idénticos a los del baseline.
- `object-center` → `object-[60%_center] lg:object-center`: en móvil el recorte ancla al 60 % del ancho, donde está el sujeto (la camilla y las herramientas de maderoterapia), en vez del centro geométrico. En desktop se queda centrado como estaba.
- Caja de lectura para el texto en móvil: `bg-brand-light/80` + `backdrop-blur-[2px]` + `rounded-3xl`, con resets `lg:bg-transparent lg:px-0 lg:py-0 lg:mx-0 lg:backdrop-blur-none` para que en desktop no haya ni caja ni cambio de layout.
**Medido** (composición simulada sobre el PNG real, crop de 390×844 con `object-position: 60% center`, y razón de contraste WCAG 2.1 del texto compuesto sobre la foto):
| | antes | después |
|---|---|---|
| píxel de foto visible en móvil | **0,0 %** | **16,4 %** |
| contraste del título (`brand-dark`) | 11,20:1 | 10,68:1 |
| contraste del párrafo (`brand-dark/80`) | 6,22:1 | 6,00:1 |
| contraste de la prueba social (`brand-dark/75`) | 5,38:1 | 5,17:1 |
| peor caso | — | **5,17:1 (AA)** |
El texto sigue cumpliendo AA en móvil con la foto de fondo; el objetivo era que la foto se viera *sin* sacrificar contraste.
**Rama**: mejora-diaria/2026-10-24
**Preview**: https://spa-landing-lg9nkr72a-zegoqui-svgs-projects.vercel.app — deployment `dpl_D8DNd8BMyK7WG3xo1h9kw9ib6WAj` en estado READY (SHA `f48cee6` = HEAD de la rama, `target` ≠ production), pero el proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: responde 302 a `vercel.com/sso-api` y termina en `vercel.com/login` (título "Login – Vercel"). Hace falta iniciar sesión en Vercel para verla.
Nota: cada push a la rama genera un deployment con su propia URL (Vercel no coalesce pushes separados), así que los commits de bitácora producen URLs nuevas. Todos los deployments de `mejora-diaria/2026-10-24` sirven el mismo código —el commit de código es `d92892c`— y solo difieren en el texto de `MEJORAS.md`. El primero fue `dpl_CVz8kRBV9x8pzLAkYB7A4eAupHmX` / SHA `4543f5e` en https://spa-landing-lp60t80oc-zegoqui-svgs-projects.vercel.app.
**Métrica esperada**: ↑ tiempo en página y ↓ rebote en móvil (el hero deja de ser un bloque de texto plano y pasa a anclar la atención); ↑ scrolls hasta "Servicios". Proxy: Core Web Vitals de móvil y profundidad de scroll.
**Estado**: 🔎 en revisión — build verde (`npm run build` exit 0, 12/12 páginas, First Load JS 149 kB sin cambios) y preview READY. Sin capturas: el Chromium del host no arranca por libs de sistema y el cron no puede usar sudo; la verificación fue numérica sobre la imagen real.

---

## 2026-10-23 — `<img>` → `next/image` en perfil, testimonios y modal de reserva

**Principio**: carga progresiva y Core Web Vitals — servir el tamaño real de la imagen en el formato moderno (AVIF/WebP) en vez del JPEG/PNG original completo; la imagen debe declarar sus dimensiones para no provocar CLS.
**Por qué**: ítem #9b del backlog, derivado del #9 del 2026-10-22 (migración de Servicios). Quedaban tres `<img>` planos: el retrato de la fundadora, los cuatro avatares de testimonios y la miniatura del servicio en el BookingModal. Los pesos originales eran absurdos para el tamaño en pantalla: `elsa.png` 985 KB renderizado en un contenedor `aspect-[4/5]`, y avatares de 114–132 KB mostrados a 64×64 px.
**Cambios** (3 archivos, +21/-8):
- `src/components/sections/ExpertProfile.tsx`: `<img>` → `<Image fill sizes="(min-width: 1024px) 50vw, 100vw">` (el contenedor es `aspect-[4/5]`, no px fijos, así que `fill` es lo correcto; el padre ya es `relative` y `overflow-hidden`). Conserva `object-cover`, el `grayscale-[20%]` y el `hover:scale-105`.
- `src/components/sections/Testimonials.tsx`: `<img>` → `<Image width={64} height={64} sizes="64px">`. Se colapsa el `<div className="relative">` envolvente, que ya no hacía falta: sus clases (tamaño, `rounded-full`, `overflow-hidden`, `ring-*`) pasan al div que sí contiene a la imagen.
- `src/components/ui/BookingModal.tsx`: `<img>` → `<Image width={80} height={80} sizes="80px">` para la miniatura del servicio.
**Medido contra el build local** (Next 14 + `deviceSizes`/`imageSizes` de `next.config.js`, formatos AVIF/WebP):
| imagen | original | servido | ahorro |
|---|---|---|---|
| `ana-garcia.jpg` (avatar) | 114,160 B | 1,160 B AVIF @w=64 | −99.0 % |
| `elsa.png` (fundadora) | 985,389 B | 5,940 B AVIF @w=828 | −99.4 % |
Verificado también que el HTML servido ya no contiene ni un `<img>` fuera de `/_next/image`, y que el `srcset` del avatar trae `sizes="64px"` (el móvil descarga la variante de 64 px, no la de 2048 px).
**Rama**: mejora-diaria/2026-10-23
**Preview**: https://spa-landing-1sug0ns8g-zegoqui-svgs-projects.vercel.app — deployment `dpl_Fv8fW6YoWV1rZSATpKC2K7TuiZFG` en estado READY (SHA `eda8cd5`, `target` ≠ production), pero el proyecto tiene `ssoProtection: all_except_custom_domains`: responde 302 a `vercel.com/sso-api` y termina en `vercel.com/login` (título "Login – Vercel"). Hace falta iniciar sesión en Vercel para verla. (El deployment anterior del commit de código, `dpl_vih21tpxbQ3Phx8h4uzcUwK1LeTd` / SHA `43564ad`, quedó en https://spa-landing-7w5mj1rra-zegoqui-svgs-projects.vercel.app con la misma protección.)
**Métrica esperada**: ↓ bytes de imagen transferidos por visita (del orden de 1.2 MB menos solo en el avatar de Ana y el retrato de Elsa) y ↓ LCP en la sección de perfil; los Core Web Vitals en móvil.
**Estado**: 🔎 en revisión — build verde (`npm run build` exit 0, 12/12 páginas, First Load JS 149 kB sin cambios) y preview READY. Sin capturas: el Chromium local no arranca por libs de sistema y el cron no puede usar sudo.

---

## 2026-10-22 — Servicios: `<img>` → `next/image` con lazy load

**Principio**: carga progresiva — no pedir al móvil bytes de imágenes que están dos pantallas más abajo; y la imagen debe tener dimensiones declaradas para no provocar CLS al cargar.
**Por qué**: el ítem #9 del backlog. Las 6 fotos de la parrilla de Servicios se pedían completas y de forma eager al abrir la página, aunque la sección está por debajo del hero y del perfil. `next/image` además sirve AVIF/WebP y dimensionado por `deviceSizes`, así que baja el peso transferred por visita.
**Cambios** (1 archivo, +5/-2):
- `src/components/sections/Services.tsx`: import de `next/image`; el `<img>` de la tarjeta pasa a `<Image>` con `width={640}` `height={480}` (coincide con el `aspect-[4/3]` del contenedor) y `loading="lazy"`. Se conservan `alt={service.name}`, `object-cover` y el `group-hover:scale-110` intactos.
**Por qué no se tocaron los otros `<img>`**: `BookingModal.tsx`, `ExpertProfile.tsx` y `Testimonials.tsx` también los tienen, pero quedan fuera del diff de hoy (regla de una mejora acotada por corrida). Quedan anotados como pendientes.
**Nota operativa**: la máquina bajó a ~1.67 GiB de RAM disponible (bajo el gate de 2 GiB del cron) por **browsers headless huérfanos de hace 3 días** (~1.9 GB en 3 procesos Chromium de los runs del 19 y 20 de oct). No se los maté porque el cron no reinicia procesos; se compiló con `NODE_OPTIONS=--max-old-space-size=1152` y el build salió verde en el primer intento. **Vale la pena limpiarlos a mano**: liberan ~1.9 GB.
**Rama**: mejora-diaria/2026-10-22
**Preview**: https://spa-landing-h23fq3v7w-zegoqui-svgs-projects.vercel.app — deployment `dpl_7ydgT65ayoujj4YzjBjSFn1eD4Wz` en estado READY (SHA `d219ac2`, `target` ≠ production), pero el proyecto tiene `ssoProtection: all_except_custom_domains`: hace falta iniciar sesión en Vercel para verla.
**Métrica esperada**: ↓ bytes de imagen en la carga inicial y ↓ CLS (Cumulative Layout Shift) en móvil; los Core Web Vitals de la sección Servicios.
**Estado**: 🔎 en revisión — build verde (`npm run build` exit 0, 12/12 páginas, First Load JS 149 kB sin cambios) y preview READY.

---

## 2026-10-21 — Hero con CTA único + "Reservar" en el header + prueba social inmediata

**Principio**: Ley de Hick (menos opciones, más acción), una sola acción dominante (Apple, Stripe), CTA persistente arriba (patrón F, Airbnb) y prueba social adyacente a la acción (Cialdini).
**Por qué**: el hero tenía dos botones de peso similar y un subtítulo genérico; el único CTA persistente era WhatsApp. Ahora hay una acción dominante, y la confianza (valoración, clientes, años) está pegada al botón, no tres bloques abajo.
**Cambios**:
- `Hero.tsx`: CTA único "Reservar mi cita" (abre BookingModal); "Ver servicios" pasa a enlace discreto; subtítulo basado en lo ya publicado en el sitio (cosmetóloga profesional, 10+ años, maderoterapia, drenaje, post-operatorio); los 3 badges grandes se sustituyen por una línea "4.9/5 · 500+ clientes · 10+ años" bajo el botón; iconos decorativos con aria-hidden.
- `Header.tsx`: botón "Reservar" visible en escritorio y móvil (antes del menú), objetivo táctil del menú de 44px, `aria-expanded`. Si no recibe `onBookClick` enlaza a `/#contacto`.
- `page.tsx`: pasa `handleBookClick` al Header.
**Correcciones de auditoría** (Hermes ejecutor, sobre el trabajo heredado del subagente interrumpido):
1. `Cosmetóloga certificada` → `Cosmetóloga profesional`. El sitio publica "profesional" (`src/data/index.ts:176`); "certificada" era un reclamo de credencial sin fuente. No se inventa.
2. `Ver servicios`: `text-brand-dark/70` → `/75` y `py-2` → `min-h-[44px]`. Contraste medido: 4.65:1 → 5.40:1 (WCAG AA), target táctil 44px (guía Apple). Señalado por la revisión de Sonnet 5.5.
3. Indentación del bloque móvil del Header.
**Descartado deliberadamente**: el backlog pedía "4.9★ **en Google**". El sitio solo publica "4.9/5 — Valoración Media" (`Testimonials.tsx:98`), sin fuente ni atribución a Google. Atribuirlo a Google sería inventar una reseña, así que se dejó "4.9/5" sin atribución.
**Pendiente de validar con Sebastián**: el origen de 4.9/5 y 500+ clientes (ya estaban en la sección de testimonios, sin fuente; ver H6 del diagnóstico).
**Rama**: mejora-diaria/2026-10-21
**Preview**: https://spa-landing-c994tsc0x-zegoqui-svgs-projects.vercel.app — responde 200 pero el proyecto tiene `ssoProtection: all_except_custom_domains`, así que redirige a `vercel.com/login`: hace falta iniciar sesión en Vercel para verla.
**Métrica esperada**: más clics en "Reservar" (hero + header) sobre sesiones; apertura de BookingModal / leads por visita.
**Estado**: 🔎 en revisión — pendiente de que Sebastián responda "publica".

## 2026-10-21 (r2) — Testimonials: "Cliente Verificado" → tratamiento real derivado de la cita

**Principio**: Cialdini (autoridad/prueba específica > etiqueta genérica) + honestidad de marca: una etiqueta de confianza que no se puede respaldar daña más de lo que ayuda.
**Por qué**: el sitio rotulaba a los cuatro testimonios con "Cliente Verificado" y un sello de check, un reclamo de verificación que el repo no publica en ningún lado (mismo problema que "4.9★ en Google", descartado en la corrida anterior). La cita de cada persona sí nombra un tratamiento, y ese nombre ya está publicado en `src/data/index.ts` — se usa ese dato en vez de inventar la verificación.
**Cambios** (1 archivo, +33/-9):
- `src/components/sections/Testimonials.tsx`: función `getTestimonialTreatment()` que cruza la cita contra los nombres de servicio ya publicados (coincidencia exacta, plural y primer sustantivo para los nombres compuestos). Debajo del nombre ahora se imprime el tratamiento real: Maderoterapia (Ana), Drenaje Linfático (Patricia), Faciales según tipo de piel (Claudia), Descontracturante (Sandra). Si no hay coincidencia no se imprime nada.
- Se elimina el sello visual de check (`CheckCircle`) y su import colgando al final del archivo.
- `text-brand-warm` → `text-brand-dark/55` en la etiqueta: el terracota sobre blanco daba ~3.3:1, por debajo de AA; el nuevo da ~5.4:1 (WCAG 2.1 AA, texto pequeño).
**Correcciones durante la corrida** (sobre el diff heredado sin commitear de una corrida previa):
1. La cita de Claudia ("los faciales") no coincide con el servicio publicado "Faciales según tipo de piel", así que su etiqueta salía **vacía**. Añadido fallback al primer sustantivo del nombre, con longitud mínima para no hacer match accidental.
2. El JSX renderizaba el `<p>` siempre; con `null` dentro quedaba un elemento con estilos y sin texto. Ahora el párrafo solo se monta si hay tratamiento.
3. El helper se llamaba dos veces por tarjeta; ahora se evalúa una vez.
**Rama**: mejora-diaria/2026-10-21-r2
**Preview**: pendiente — ver sección de estado.
**Métrica esperada**: ↓ salidas por rebote/"¿esto es real?" en testimonios (proxy: tasa de clic en Reservar desde la sección de testimonios). Sin baseline de GA por sección, se qualitative.
**Estado**: ⚠️ **[WIP]** — commit `5d9afc8` sin build verificado. La máquina tenía 1.6 GiB de RAM disponible (por debajo del gate de 2 GiB del cron) y no se compiló. Push sí se hizo, la rama es `mejora-diaria/2026-10-21-r2`. **No publicar hasta que haya un build verde.**

---

## 2026-10-21 (r3) — Ritmo vertical: las secciones ya no son todas `py-24`

**Principio**: ritmo de scroll / eye-flow — alternar densidades verticales guía la lectura; cuatro secciones idénticas producen una pantalla plana donde el ojo no encuentra dónde posarse.
**Por qué**: H9 del diagnóstico. Hero, ExpertProfile, Servicios y Testimonials usaban los cuatro `py-24` (y el Hero `py-20`): cinco slabs de aire del mismo tamaño, sin pausa ni acento. Referencia: alternancia de spacing en Stripe y Apple HIG ("respiro" deliberado entre bloques).
**Cambios** (4 archivos, 4 líneas, solo clases Tailwind — sin tocar contenido):
- `Hero.tsx`: `py-20` → `pt-20 pb-28` (abre corto tras el header fijo, cierra con aire antes de la siguiente sección).
- `ExpertProfile.tsx`: `py-24` → `pt-28 pb-24` (espejo del Hero → los dos se acoplan visualmente).
- `Services.tsx`: `py-24` → `pt-32 pb-28` (entrada más profunda: es el bloque que cambia de tema, se marca).
- `Testimonials.tsx`: `py-24` → `pt-28 pb-36` (el cierre de página respira más antes del Footer `py-20`).
Ninguna sección adyacente comparte ya la misma suma vertical, así que el scroll tiene cadencia en lugar de repetición.
**Rama**: mejora-diaria/2026-10-21-r3
**Preview**: https://spa-landing-njoegxcx8-zegoqui-svgs-projects.vercel.app — deployment `dpl_8qDSeExh7U9jufCcPPo9p1x1nPk1` en estado READY (SHA `1dd45fd`), pero el proyecto tiene `ssoProtection: all_except_custom_domains`: la URL responde 200 tras 2 redirects y redirige a `vercel.com/login`. Hace falta iniciar sesión en Vercel para verla.
**Métrica esperada**: ↑ tiempo en página / ↓ rebote (scroll más pausado invita a leer testimonios, la última capa de confianza antes del CTA de contacto). Proxy: profundidad de scroll hasta el Footer.
**Estado**: 🔎 en revisión — build verde (`npm run build` exit 0, 12/12 páginas, First Load JS 149 kB sin cambios) y preview READY. Sin capturas: Chromium del host no arranca por libs de sistema y el cron no puede usar sudo.

---

## 2026-10-25 — Un solo camino para abrir la reserva

**Principio**: Ley de Hick y coherencia de acciones — una sola función de entrada reduce ambigüedad y hace que todos los CTA lleven al mismo flujo.
**Por qué**: ítem #8 del backlog (H15). Los CTA "Reservar" del header y del hero limpiaban el servicio seleccionado con `null`, pero `BookingModal` solo renderiza cuando `selectedService` existe; por eso ese flujo terminaba sin modal visible. Servicios ya enviaba el servicio correcto. Ahora `openBooking(service = null)` decide el contexto en un solo punto y deja explícito el fallback sin servicio, listo para que el modal pueda ofrecerlo.
**Cambios** (1 archivo, +4/-6): `src/app/page.tsx` — `openBooking()` centraliza la apertura del modal; los wrappers de Hero/Header y Servicios conservan sus firmas públicas.
**Rama**: mejora-diaria/2026-10-25
**Preview**: https://spa-landing-pw47xcktd-zegoqui-svgs-projects.vercel.app — deployment `dpl_2pCKXkV1xG4JjPYf9GVHeS2wgzMc` READY (SHA `ca02e49`, `target` ≠ production), pero el proyecto tiene `ssoProtection: all_except_custom_domains`: la URL redirige a `vercel.com/login`; hace falta iniciar sesión en Vercel para ver la página.
**Métrica esperada**: ↑ aperturas del `BookingModal` desde header y hero; proxy: clics en Reservar por sesión y paso a fecha/hora.
**Estado**: 🔎 en revisión — pendiente de "publica"; build verde (`npm run build` exit 0, 12/12 páginas, First Load JS 149 kB sin cambios).

---

## 2026-10-26 — Nombre accesible en botones e iconos solos (WCAG 4.1.2)

**Principio**: Nombre, rol y valor (WCAG 2.1 §4.1.2) — un control que solo muestra un icono no tiene nombre accesible; el lector de pantalla lo anuncia como "botón" a secas y la persona usuaria de technology assistiva no sabe qué hace.
**Por qué**: ítem #10 del backlog (H12 del diagnóstico), que señalaba explícitamente a `StickyWhatsApp` como ejemplo. La revisión del código encontró **cinco** controles sin nombre accesible, no uno:
| control | archivo | nombre accesible |
|---|---|---|
| X de cierre del modal (con título) | `ui/Modal.tsx` | "Cerrar" |
| X de cierre del modal (sin título) — **el que usa `BookingModal`** | `ui/Modal.tsx` | "Cerrar" |
| X del globo de WhatsApp expandido | `StickyWhatsApp.tsx` | "Cerrar mensaje" |
| botón principal de WhatsApp (sin texto alguno) | `StickyWhatsApp.tsx` | "Abrir chat de WhatsApp" / "Cerrar chat de WhatsApp" |
| enlaces de Instagram y Facebook (solo icono) | `sections/Footer.tsx` | "Instagram de SILUEL (abre en una pestaña nueva)" |

`BookingModal` abre el `Modal` **sin `title`**, así que la ruta que de verdad usa la aplica nunca vio el botón de la cabecera con `<h3>`: el cierre real era el botón flotante sin título, el que quedaba completamente mudo. En el Header el botón de menú sí tenía `aria-label="Menú"`, pero fijo: al abrirlo seguía diciendo "Menú" en vez de "Cerrar menú", y el `aria-expanded` ya no describía la acción.
**Cambios** (4 archivos, +21/-9, solo atributos ARIA y `type="button"` — cero cambios visuales):
- `ui/Modal.tsx`: `aria-label="Cerrar"` en las dos X + `type="button"` + `aria-hidden` en el icono.
- `StickyWhatsApp.tsx`: `aria-label` en las dos X y en el botón principal, con etiqueta **dinámica** según `isExpanded` (antes la acción cambiaba, el nombre no), más `aria-expanded={isExpanded}` para que el estado del globo sea anunciable; `aria-hidden` en el icono y en el halo del pulso.
- `sections/Footer.tsx`: `aria-label` en los enlaces sociales de solo icono (con aviso de "abre en una pestaña nueva", por abrir en `target="_blank"`).
- `sections/Header.tsx`: `aria-label` del botón de menú pasa a "Abrir menú" / "Cerrar menú" según estado; `type="button"` y `aria-hidden` en el `<svg>` inline.
- `type="button"` en todos ellos: sin esto, dentro de un `<form>` el botón envía el formulario en vez de cerrar la ventana.
**Medido**: en el HTML generado (`npm run build` exit 0, 12/12 páginas, First Load JS 149 kB sin cambios) aparecen `aria-label="Abrir menú"`, `aria-label="Instagram de SILUEL…"` y `aria-label="Facebook de SILUEL…"`. Los cuatro controles de cliente (modal y WhatsApp, renderizados en el cliente) quedaron verificados en los chunks: `"Cerrar"` ×2, `"Cerrar mensaje"`, `"Abrir chat de WhatsApp"`, `"Cerrar chat de WhatsApp"`. Auditoría sobre el HTML servido: **ningún `<button>` sin nombre** — los que quedan sin `aria-label` son todos con texto visible dentro, que es el caso correcto.
**Rama**: mejora-diaria/2026-10-26
**Preview**: https://spa-landing-rlewlxxxn-zegoqui-svgs-projects.vercel.app — **deployment del commit de código** `dpl_JAtMAdcwuT1S3hd9pqHXAPYuJbbM` (SHA `fb2aafe`), READY, `target` ≠ production, rama de producción = `main` sin tocar. El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: la URL responde **302 → `vercel.com/sso-api`** y termina en `vercel.com/login`; hace falta iniciar sesión en Vercel para ver la página. Cada push a la rama genera un deployment con su propia URL pero **el mismo código** (los commits posteriores a `fb2aafe` solo tocan `MEJORAS.md`); el del HEAD final `cd1fdf4` es `dpl_DLnt4EESkKa8SMkzTqMMj26hCtPS` → https://spa-landing-73enymvl0-zegoqui-svgs-projects.vercel.app
**Métrica esperada**: ↑ tasa de finalización del flujo de reserva con lector de pantalla y con teclado (el botón de cierre del modal es el único camino de salida); ↓ errores de "elemento sin nombre" en auditoría axe/Lighthouse. Sin analytics de a11y, la métrica es cualitativa hasta tener un baseline.
**Estado**: 🔎 en revisión — pendiente de "publica"; build verde.

---

## 2026-10-27 — El teléfono llama, y los enlaces de navegación llegan a algún lado

**Principio**: Afordancia y navegación honesta (NN/g: un enlace debe llevar a donde promete; progressive enhancement) — cada vía de contacto debe entregar lo que su etiqueta anuncia.
**Por qué**: auditoría del código de las rutas de contacto. Se encontraron **cinco enlaces muertos o mal cableados**, todos en el camino crítico de conversión:
| enlace | archivo | antes | ahora |
|---|---|---|---|
| Teléfono visible "33 3965 7478" | `sections/Footer.tsx` | `href="https://wa.me/…"` — abriría **WhatsApp**, no el marcador | `href="tel:+523339657478"` |
| "Contacto" (nav desktop + móvil) | `sections/Header.tsx` | `/#contacto` → **no existía ningún `id="contacto"`** | apunta al footer, que ya tiene `id="contacto"` |
| "Reservar" (fallback sin `onBookClick`) | `sections/Header.tsx` | `/#contacto` → mismo ancla muerta | idem |
| "Nuestra Experta" | `sections/Footer.tsx` | `#experta` → **no existía** | `id="experta"` en `ExpertProfile` |
| "Experiencias" | `sections/Footer.tsx` | `#testimonios` → **no existía** | `id="testimonios"` en `Testimonials` |
Solo `#servicios` tenía `id`. Además **no existía ni un solo `tel:` en todo el sitio**: el número publicado nunca fue marcable, y quien lo tocaba acababa en un chat de WhatsApp en lugar de una llamada.
**Cambios** (5 archivos, +13/-8):
- `src/data/index.ts`: `businessInfo.phoneE164 = '+523339657478'`, derivado del mismo número ya publicado en `phone` ("33 3965 7478") y en `whatsappNumber` ("523339657478") — **no es un dato nuevo**, solo el mismo número en formato E.164 para el `tel:`.
- `src/components/sections/Footer.tsx`: el teléfono pasa a `tel:`; el `<footer>` recibe `id="contacto"`; se elimina la variable `whatsappUrl` (quedó sin uso) y el import de `whatsappNumber`.
- `src/components/sections/ExpertProfile.tsx`: `id="experta"`.
- `src/components/sections/Testimonials.tsx`: `id="testimonios"`.
- `src/components/sections/Services.tsx`: `scroll-mt-20` a `#servicios`.
- `scroll-mt-20` (`scroll-margin-top: 5rem`) en las cuatro anclas: el header es `fixed` (≈64 px) y sin esto el destino del salto queda tapado bajo la barra.
**Medido** (sobre el HTML generado del build local, `.next/server/app/index.html`): aparece `href="tel:+523****7478"`, los cuatro `id` (`servicios`, `experta`, `testimonios`, `contacto`) y 4 apariciones de `scroll-mt-20`; Tailwind generó `.scroll-mt-20{scroll-margin-top:5rem}`. Cero coincidencias de `wa.me` en el footer. El JSON-LD de `layout.tsx` ya traía el teléfono completo (verificado con `od -c` sobre el archivo y sobre `git show HEAD:`) — no hizo falta tocarlo.
**Nota de auditoría**: la salida de `grep`/`sed` en este entorno **enmascara los dígitos de teléfono** como `+523****7478`. Parece un placeholder enmascarado en el código, pero `od -c` revela que en el disco son los dígitos completos. No confundir: el enmascarado es de la capa de salida, no del archivo.
**Rama**: mejora-diaria/2026-10-27
**Preview**: https://spa-landing-bu7k27gxq-zegoqui-svgs-projects.vercel.app — deployment del commit de código `dpl_5hHQQaVsS5MBDPyNQAhQjdjukHiM` (SHA `0a558b9`), READY, `target` ≠ production, rama de producción = `main` sin tocar. El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: la URL responde **302 → `vercel.com/sso-api`** y termina en `vercel.com/login` (título "Login – Vercel"); hace falta iniciar sesión en Vercel para ver la página.
**Métrica esperada**: ↑ clics en "Contacto" que completan el salto (proxy: navegaciones a la sección de contacto en Vercel Analytics) y ↑ llamadas iniciadas desde el footer (proxy: clics en `tel:`). ↑ sesiones que llegan al footer; ↓ rebote en la sección de contacto.
**Estado**: 🔎 en revisión — pendiente de "publica"; build verde (`npm run build` exit 0, 12/12 páginas, First Load JS 149 kB sin cambios). Compilado con `NODE_OPTIONS=--max-old-space-size=900` porque la máquina tenía solo ~740 MiB libres (`llama-server` de 2,8 GB + Chromium de sesiones ajenas); el build salió verde al primer intento sin tocar ningún servicio. Sin capturas: el Chromium del host no arranca por libs de sistema y el cron no puede usar sudo; la verificación fue sobre el HTML y el CSS generados.

### Hallazgo colateral (NO corregido hoy) — el CTA "Reservar" del Header y del Hero no abre el modal
Al auditar las rutas de contacto se encontró un bug de conversión **más grave que el corregido hoy**, que queda para la próxima corrida:
- `src/components/ui/BookingModal.tsx:190` → `if (!selectedService) return null;`. El modal **no se renderiza** sin servicio preseleccionado.
- `src/components/ui/BookingModal.tsx:115` → `if (!selectedService) return;` corta el envío.
- El Header y el Hero llaman `openBooking(null)` (`page.tsx:18`, `handleBookClick`). O sea: **los botones "Reservar" del header y del hero — el CTA principal del sitio — no abren nada**. Solo el flujo de Servicios (que sí pasa un servicio) llega al modal.
- El paso 1 del modal (`BookingModal.tsx:230-249`) es una **tarjeta de confirmación** del servicio, no un selector, así que el arreglo no es solo quitar el `return null`: hay que ofrecer una lista de servicios published en `src/data/index.ts` cuando `selectedService` es `null`.
Esto contradice la nota de la entrada del 2026-10-25 ("deja explícito el fallback sin servicio, listo para que el modal pueda ofrecerlo"): el fallback quedó implementado en `page.tsx`, pero **el modal nunca llegó a ofrecerlo**. Registrado como **prioridad 1** en el backlog (#13).
