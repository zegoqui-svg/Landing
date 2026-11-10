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

## 2026-11-10 — Iconos decorativos y estado de las pestañas: la a11y del repo, completa

**Principio**: nombre, rol y valor (WCAG 2.1 §4.1.2) — un icono decorativo no debe anunciarse; un icono que **es** información debe tener nombre propio; y un control que cambia de estado debe anunciar cuál es el activo.
**Por qué**: continuación de la auditoría de iconos abierta el 2026-11-09, que dejó el patrón a medio hacer y un defecto hermano detectado. El 2026-11-09 corrigió el caso de los iconos **informativos** (la valoración de los testimonios, que se perdía en el lector de pantalla). Quedaban dos lados sin cubrir: los iconos **decorativos** que se anunciaban como ruido, y los controles de filtrado cuyo estado activo no se anunciaba. Causa raíz ya verificada: los SVG de `lucide-react` v0.475.0 **no traen `role` ni `aria-hidden` por defecto**.
**Cambios** (4 archivos, +22/-16 netas — solo atributos ARIA y `type="button"`, **cero cambios visuales**):
- `src/components/sections/Services.tsx`: las 4 pestañas de categoría (que filtran los servicios) reciben `aria-pressed={activeCategory === category.id}`, para que el lector de pantalla anuncie cuál está activa — antes el estado activo **no se comunicaba en absoluto**. Sus 4 iconos dinámicos (del `iconMap`), el `ArrowRight` de "Ver detalles" y el `Calendar` de "Reservar Cita" → `aria-hidden="true"` (el texto contiguo ya dice lo mismo). Se añade `type="button"`.
- `src/components/ui/BookingModal.tsx`: `Calendar`/`Clock`/`MessageCircle`/`Check`/`AlertCircle` decorativos → `aria-hidden="true"`. **Dos excepciones, que no son ruido y por eso llevan nombre propio**: el `Loader2` del estado "Guardando" (`role="img"` + `aria-label="Guardando tu información"` — es el único indicador de que se está guardando) y el `Check` del indicador de pasos (`aria-label="Paso N completado: <etiqueta>"`, porque **reemplaza al número del paso**: sin nombre, el lector de pantalla anunciaba "gráfico" y se perdía qué paso se había completado). El número del paso en su forma normal pasa a `<span aria-hidden="true">`.
- `src/components/sections/Hero.tsx`: la `Star` del badge "Centro Premium de Terapia y Masaje" → `aria-hidden="true"` (el texto contiguo ya lleva el significado) y el `<svg>` del subrayado de "por dentro" → `aria-hidden="true" focusable="false"`.
- `src/components/StickyWhatsApp.tsx`: el `MessageCircle` del enlace "Chatear ahora" → `aria-hidden="true"`.
**Medido**: iconos de `lucide-react` usados en `src/` **32/32** tienen ahora una decisión explícita de accesibilidad (antes 19/32); `<svg>` en el HTML de la home **54/54 con `aria-hidden`** salvo los 4 grupos de valoración, que llevan `role="img"` + nombre accesible; `aria-pressed` en las pestañas 0 → **4** (1 `true` + 3 `false`); `role="img"` con nombre accesible **4** (las valoraciones, intactas del 2026-11-09); en los chunks de cliente aparecen "Guardando tu información" y "Paso N completado". 19/19 páginas; 150 kB First Load JS sin cambios; `tsc --noEmit` limpio; `git diff --check` sin observaciones. Build verde en local (`npm run build` exit 0, `Compiled successfully`, 19/19) con `NODE_OPTIONS=--max-old-space-size=1000` — la máquina bajó a **1.93 GiB libres**, por debajo del gate de 2 GiB del cron, por procesos ajenos (Chromium de sesiones ajenas, `claude`, `node`); no se tocaron esos procesos: se compiló con tope de heap y un watchdog que aborta si la memoria cae de 350 MiB. Sin capturas: el Chromium del host no arranca por libs de sistema.
**Rama**: mejora-diaria/2026-11-10
**Preview**: pendiente — ver sección de estado.
**Métrica esperada**: ↓ ruido en el lector de pantalla (cada icono decorativo que se anuncia es una interrupción en la lectura del CTA y del formulario de reserva) y ↑ comprensión del flujo: la pestaña activa y el paso completado del modal ahora se anuncian. Proxy: auditoría axe/Lighthouse (menos nodos con rol `graphics-document` o sin nombre) y tasa de finalización del flujo de reserva con lector de pantalla.
**Estado**: 🔎 en revisión, pendiente "publica".

---

## 2026-11-08 — Modal de reserva: foco atrapado, Escape y retorno al CTA

**Principio**: foco visible y predecible — la persona que abre un diálogo debe poder recorrer sus controles, cerrarlo con teclado y volver al botón que lo abrió.
**Por qué**: WCAG 2.1, criterios 2.1.2 (sin trampa de teclado), 2.4.3 (orden del foco) y 2.1.1 (teclado).
**Cambios**: 1 archivo (`src/components/ui/Modal.tsx`): el panel es el elemento `role="dialog"` y recibe el foco al abrir; Tab/Shift+Tab quedan dentro del modal; Escape cierra; al cerrar, el foco vuelve al control previo.
**Rama**: mejora-diaria/2026-11-08
**Preview**: https://spa-landing-4vj2nbzdm-zegoqui-svgs-projects.vercel.app (deployment `dpl_HqgunXVDjuCbKnbiPJ5iZZo33wSh`, READY, `target` ≠ production; ⚠️ pide login de Vercel, `ssoProtection`)
**Métrica esperada**: menor abandono en el flujo de reserva; más envíos completados por teclado y menor tiempo hasta el primer campo.
**Estado**: 🔎 en revisión, pendiente "publica"

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

---

## 2026-10-28 — El CTA "Reservar" del header y del hero ya abre el modal

**Principio**: Reduce la fricción del camino principal (NN/g: menos pasos para la acción dominante; Ley de Hick aplicada al flujo de conversión) — el CTA principal del sitio no puede terminar en un callejón sin salida; y honestidad de estado: el modal muestra lo que el usuario pidió, no una pantalla vacía.
**Por qué**: ítem #13 del backlog, **prioridad 1**, y el hallazgo colateral que la entrada del 2026-10-27 dejó anotado. El bug era real y estaba en el camino crítico de conversión: `BookingModal.tsx` hacía `if (!selectedService) return null;`, de modo que el Header y el Hero — que llaman `openBooking(null)` (`page.tsx:18`) — **no abrían nada**. Solo el flujo de Servicios (que sí pasa un servicio) llegaba al modal. Además el `handleSubmit` cortaba en seco (`if (!selectedService) return;`), así que el flujo sin servicio no solo no abría: si se llegaba al paso 2, el envío moría en silencio.
**Cambios** (1 archivo, +87/-26, solo `src/components/ui/BookingModal.tsx`):
- Se elimina el guard `if (!selectedService) return null;`: el modal ahora se renderiza siempre que `isOpen`.
- Nuevo estado interno `chosenService` (inicializa en `selectedService`) y `isPicking` **derivado** (`chosenService === null`) en vez de estado con `useEffect`. La derivación es deliberada: un `useEffect` que fija el estado en `isOpen` hace que el primer render (SSR e hidratación) muestre la rama equivocada. Con estado derivado, el primer render ya es el correcto y no hay desajuste de hidratación.
- Paso 1 del modal tiene ahora dos modos:
  - **Sin servicio** (CTA del header/hero): un selector con las **9** tarjetas de servicio de `src/data/index.ts` (miniatura `next/image` 56 px, nombre y descripción con `line-clamp-2`), en grid de 1 columna en móvil y 2 en `sm`.
  - **Con servicio** (flujo de Servicios): la tarjeta de confirmación y la lista "Qué incluye" que ya existían, sin cambios visuales.
- Botón "Cambiar el servicio" (nuevo, `min-h-[44px]`) en la rama de confirmación: devuelve al selector. Así el modal nunca atrapa al usuario en un servicio que no quiere.
- `handleSubmit`, el cuerpo del POST a `/api/leads` (`service: chosenService.id`), el evento `lead_captured`/`fbq('track','Lead')` y el mensaje de WhatsApp pasan a usar `chosenService`. Si aun así no hay servicio, ahora **falla de forma visible** ("Elige un servicio para continuar") en vez de cortar en silencio.
- `handleClose` limpia `chosenService` para que la siguiente apertura arranque en el contexto correcto.
**Medido** (render SSR real del componente con los dos contextos, sobre el HTML generado del build; se eliminaron los payloads RSC para aislar el DOM):
| | sin servicio (`openBooking(null)`) | con servicio (flujo de Servicios) |
|---|---|---|
| heading "¿Qué te gustaría reservar?" | **1** | 0 |
| "Elige el tratamiento para tu cita" | **1** | 0 |
| grid de servicios (`grid-cols-1 sm:grid-cols-2`) | **1** | 0 |
| miniaturas de servicio (`sizes="56px"`) | **9** | 0 |
| servicios nombrados | **9/9** | 1 (solo el elegido) |
| tarjeta "Qué incluye" | **0** | 1 |
| imagen de confirmación (`sizes="80px"`) | 0 | **1** (Maderoterapia) |
| "Cambiar el servicio" | 0 | **1** |
| botón "Continuar" | 0 | **1** |
Se confirmó también que el guard `if (!selectedService) return null` ya no existe en el archivo. La página de verificación (`src/app/verify-modal/`) se usó solo como banco de pruebas y **se eliminó antes del commit**: el diff final es de un solo archivo.
**Rama**: mejora-diaria/2026-10-28
**Preview**: https://spa-landing-5hvkkd5j8-zegoqui-svgs-projects.vercel.app — deployment `dpl_iurE6ZpDPP1pp6RVW5R6ZN4HLokG` en estado READY (SHA `1348e12`, `target` ≠ production, rama de producción = `main` sin tocar). El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: la URL responde **302 → `vercel.com/sso-api`** y termina en `vercel.com/login` (título "Login – Vercel"); hace falta iniciar sesión en Vercel para ver la página.
**Métrica esperada**: ↑ aperturas del `BookingModal` desde el CTA del header y del hero (hoy son clics que no abren nada, así que el baseline es 0); ↑ leads por visita; ↓ rebote en el CTA principal. Proxy: eventos `lead_captured` con `lead_source: booking_modal` frente al total de clics en "Reservar".
**Estado**: 🔎 en revisión — build verde (`npm run build` exit 0, 12/12 páginas, First Load JS 149 kB sin cambios). Sin capturas: el Chromium del host no arranca por libs de sistema (`libatk-1.0.so.0`) y el cron no puede usar sudo; la verificación fue sobre el HTML renderizado por el propio build de Next.

---

## 2026-10-29 — El pie de página ya no promete políticas que no existen

**Principio**: honestidad de navegación (NN/g: un enlace debe llevar a donde anuncia) — un enlace a `#` promete una política legal y no entrega nada; es peor que no ofrecerlo.
**Por qué**: ítem #12 del backlog. `Footer.tsx` mostraba tres enlaces al pie — "Legal", "Cookies" y "Privacidad" — con `href="#"`, es decir, tres enlaces muertos en la última línea que el usuario ve. No hay documentos legales publicados en el repo, así que no se inventaron URLs ni se crearon páginas vacías: se quitaron los enlaces que no tienen destino real y se sustituyeron por dos acciones que sí llevan a alguna parte — "Contacto" (marcador del teléfono ya publicado) y "Experiencias" (ancla de testimonios).
**Cambios** (1 archivo, +6/-3, solo `src/components/sections/Footer.tsx`): los tres enlaces muertos se eliminan y el bloque de enlaces del pie pasa a "Contacto" (`tel:` con `businessInfo.phoneE164`) y "Experiencias" (`#testimonios`). Cero cambios visuales en el resto del footer; no se agregan dependencias ni material nuevo.
**Medido** (sobre el HTML generado del build local, `.next/server/app/index.html`): "Legal", "Cookies" y "Privacidad" aparecen **0 veces**; `href="#testimonios"` aparece 2 veces (nav + footer) y `href="tel:` 2 veces (datos de contacto + footer). `git diff --check` sin observaciones.
**Rama**: mejora-diaria/2026-10-29
**Preview**: https://spa-landing-hcco1qckg-zegoqui-svgs-projects.vercel.app — deployment `dpl_3NUEodsExkpKKddEppk6B5TnTXKu` en estado READY (SHA `a846654`, `target` ≠ production, rama de producción = `main` sin tocar). El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: la URL responde **302 → `vercel.com/sso-api`**; hace falta iniciar sesión en Vercel para ver la página.
**Métrica esperada**: ↓ clics en enlaces sin destino (proxy: clics salientes con URL vacía en Vercel Analytics); ↑ clics en "Contacto" y "Experiencias" desde el footer; ↑ llamadas iniciadas vía `tel:`.
**Estado**: 🔎 en revisión — pendiente de "publica"; build verde (`npm run build` exit 0, 12/12 páginas, First Load JS 149 kB sin cambios). Sin capturas: el Chromium del host no arranca por libs de sistema y el cron no puede usar sudo.

---

## 2026-10-30 — El modal deja de prometer lo que no está publicado

**Principio**: honestidad de marca (NN/g "Honest UX") — un bloque que se presenta como dato específico de cada tratamiento pero dice lo mismo para los nueve es contenido decorativo que además promete algo que la marca puede no cumplir; la información que sí se publica vale más que la que se inventa.
**Por qué**: auditoría de las cadenas de contenido del repo (no había ítem de backlog que encajara: el #4 sigue bloqueado por falta de la URL real de Google Reviews y el #7 por falta de material filmado). Al revisar `src/components/ui/BookingModal.tsx` se encontró un bloque "Qué incluye" que **no existe en ninguna fuente**: `src/data/index.ts` no publica un campo `includes`, el tablero `siluel` no lo tiene y la bóveda no lo menciona. Las cinco promesas —"Evaluación inicial personalizada", "Tratamiento completo del servicio", "Aromaterapia personalizada", "Bebida de bienvenida", "Consejos post-tratamiento"— eran un array hardcodeado **idéntico para los 9 servicios**, mostrado justo debajo de la tarjeta de confirmación del servicio, es decir, con apariencia de dato propio de cada tratamiento. Una clienta que reserva "Post-operatorio" o "Drenaje Linfático" leía que su sesión incluye una "Bebida de bienvenida" y "Aromaterapia personalizada": promesas que la marca nunca publicó (regla dura #4).
**Cambios** (1 archivo, +26/-11, solo `src/components/ui/BookingModal.tsx`):
- Se elimina el array de cinco promesas inventadas y el heading "Qué incluye".
- El bloque pasa a **"En qué consiste tu tratamiento"** y muestra la **categoría publicada** del servicio elegido (título + descripción de `serviceCategories` en `src/data/index.ts`): por ejemplo, para Post-operatorio → "Recuperación — Cuidado especializado post-operatorio y drenaje linfático". Es información real, distinta por servicio y ya publicada en el repo.
- `chosenCategory` se **deriva** (`serviceCategories.find(c => c.id === chosenService.category)`), no se fija en estado: mismo criterio que `isPicking` del 2026-10-28, para que el primer render (SSR e hidratación) ya sea el correcto.
- El bloque solo se monta si hay servicio y categoría (`chosenService && chosenCategory`), así que nunca queda un encabezado sin contenido debajo.
- Import de `serviceCategories` añadido a `src/data`.
**Medido** (render SSR real del componente con `post-operatorio` preseleccionado, sobre el HTML generado del build, aislando el DOM de los payloads RSC):
| | antes | después |
|---|---|---|
| heading del bloque | "Qué incluye" | "En qué consiste tu tratamiento" |
| "Aromaterapia personalizada" | 1 | **0** |
| "Bebida de bienvenida" | 1 | **0** |
| "Evaluación inicial personalizada" | 1 | **0** |
| "Consejos post-tratamiento" | 1 | **0** |
| categoría publicada (Recuperación) | — | **1** |
| descripción de la categoría | — | **1** ("Cuidado especializado post-operatorio y drenaje linfático") |
| "Continuar" / "Cambiar el servicio" | 1 / 1 | 1 / 1 (flujo intacto) |
En el HTML de la landing (`.next/server/app/index.html`) y en los chunks de cliente (`.next/static/chunks/`) las tres cadenas inventadas aparecen **0 veces**. Las 2 apariciones de "Qué incluye" que quedan en el HTML son del **FAQ JSON-LD** de `layout.tsx` ("¿Qué incluye el tratamiento post-operatorio?"), que es contenido publicado y no se tocó. Se comprobó que los 9 servicios resuelven su categoría (`corporal` ×4, `recovery` ×2, `facial` ×1, `masajes` ×2), y que `price` y `duration` están vacíos en los 9 — por eso no se publican. La página de verificación `src/app/verify-modal/` se eliminó antes del commit: el diff final es de un solo archivo.
**Rama**: mejora-diaria/2026-10-30
**Preview**: https://spa-landing-1pqpsqs4e-zegoqui-svgs-projects.vercel.app — deployment `dpl_62aeyi86dD5zE6NqzzCW6Jsrm5dk` del commit **de código** `a068831` (SHA `a068831790a8`, ref `mejora-diaria/2026-10-30`), estado READY, `target` ≠ production, rama de producción = `main` sin tocar. El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: la URL responde **302 → `vercel.com/sso-api`** y termina en `vercel.com/login` (título "Login – Vercel"); hace falta iniciar sesión en Vercel para ver la página. (El commit de bitácora genera su propio deployment con otra URL, pero sirve el mismo código.)
**Métrica esperada**: ↓ abandonment en el paso 1 del modal y ↑ confianza percibida: el bloque ya no hace promesas que SILUEL no puede respaldar. Proxy:↓ salidas por rebote justo después de abrir el modal (evento de apertura → paso 2 "Continuar"); ↑ completitud del flujo de reserva. Cualitativa hasta tener baseline de analítica por paso.
**Estado**: 🔎 en revisión — pendiente de "publica"; build verde (`npm run build` exit 0, 12/12 páginas, First Load JS 149 kB sin cambios), compilado con `NODE_OPTIONS=--max-old-space-size=1280` porque la máquina bajó a ~2.3 GiB libres (por encima del gate de 2 GiB, bajo el de 2.56 GiB). Sin capturas: el Chromium del host no arranca por libs de sistema y el cron no puede usar sudo; la verificación fue sobre el HTML renderizado por el propio build de Next.
**Pendiente anotado**: los ítems #4 (link a reseñas de Google) y #7 (video en el Hero) siguen bloqueados por falta de material real — se necesitan la URL de Google Reviews y un video filmado de la sala/Elsa. No se inventaron.

---

## 2026-10-31 — El blog deja de tener 7 enlaces rotos en "Leer más"

**Principio**: honestidad de navegación (NN/g: un enlace debe llevar a donde promete) + deuda de contenido (DRY: una sola fuente de verdad) — un catálogo que anuncia 11 artículos y entrega 4 es peor que un catálogo de 4, porque cada clic fallido es una promesa rota y una señal de confianza perdida en la página que más texto tiene del sitio.
**Por qué**: auditoría de las rutas internas del repo (no había ítem de backlog que encajara: el #4 sigue bloqueado por falta de la URL real de Google Reviews y el #7 por falta de material filmado). Al cruzar el listado del índice del blog con las páginas realmente generadas aparecieron **dos defectos encadenados**:
| | antes | después |
|---|---|---|
| artículos en el índice `/blog` | 11 | 11 |
| páginas de artículo generadas | **4** | **11** |
| enlaces "Leer más" que dan **404** | **7 de 11 (64 %)** | **0** |
| entradas del `sitemap.xml` | 2 (una con slug inexistente) | 13 (todas reales) |

La causa raíz era la **duplicación del listado**: `src/app/blog/page.tsx` tenía los 11 artículos (con `title`, `excerpt`, `image`, `date`, `category`), mientras `src/app/blog/[slug]/page.tsx` tenía un mapa aparte con solo 4 (los únicos con cuerpo de artículo). Los 7 restantes existían en el índice pero no en el enrutador, así que `/blog/<slug>` caía en `notFound()`. El `sitemap.ts` no conocía esa duplicación: era una lista escrita a mano con 2 entradas, y una de ellas —`/blog/maderoterapia-beneficios`— no correspondía a ningún slug real (el real es `beneficios-maderoterapia`), mientras las otras 10 URLs válidas no se anunciaban.
**Cambios** (4 archivos, +335/-260 netos; el grueso es *reubicación* de contenido ya existente, no copy nuevo):
- **`src/data/blog.ts` (nuevo, 266 líneas)**: fuente única de verdad con los 11 artículos. Se movió tal cual el array del índice y los 4 cuerpos de artículo. Cada artículo lleva además `readTime` y, para los 7 sin cuerpo, `relatedServices` / `relatedCategory` (ids de los servicios y categorías **ya publicados** en `src/data/index.ts`).
- **`src/app/blog/page.tsx`**: importa `blogPosts` de `@/src/data/blog` en vez de declarar su propio array (‑91 líneas). Cero cambios visuales.
- **`src/app/blog/[slug]/page.tsx`**: usa `blogPostBySlug` y `generateStaticParams` sobre los 11. Para los 7 que no tienen cuerpo publicado, `buildBodyFromPublishedData()` arma el artículo con **su propio `excerpt`** + la **descripción real del servicio publicado** + la **categoría publicada** + el CTA. No se inventó copy: todo sale de `src/data/index.ts` o del propio artículo.
- **`src/app/sitemap.ts`**: se genera desde `blogPosts`, con `lastModified` igual a la fecha real del artículo. Desaparecen el slug fantasma y las 9 URLs que faltaban.
**Medido** (sobre el build local, `.next/server/app/blog/`):
| | antes | después |
|---|---|---|
| `.html` generados en `/blog/*` | 4 | **11** |
| enlaces "Leer más" en el índice sin página | **7** | **0** |
| páginas generadas sin enlace en el índice | 0 | **0** |
| `<loc>` en `sitemap.xml` | 3 (1 fantasma) | **13** (todos reales) |
| `sitemap.xml` con slug sin página | 1 | **0** |
| páginas estáticas generadas | 12 | **19** |
| First Load JS | 149 kB | 149 kB (sin cambios) |
Las 7 páginas nuevas no son cascarones: cada una renderiza `h1` + 3 `h2` + 5–7 `<p>` (~27 kB de HTML). Verificado sobre el HTML generado que cada una nombra el servicio y la categoría reales de `src/data/index.ts` ("Reductivos", "Maderoterapia", "Corporales", etc.), no texto genérico.
**Integridad del copy**: se comprobó campo por campo que los 11 artículos siguen con su metadata **verbatim** respecto a los dos archivos originales (55 campos: `title`, `excerpt`, `image`, `date`, `category`) y que los 4 cuerpos de artículo se movieron **verbatim** línea por línea. En la primera pasada se corrigió por error un "and" en inglés a "y" en el excerpt de *Celulitis*: la verificación lo detectó y se revirtió al texto original.
**Rama**: mejora-diaria/2026-10-31 (base `mejora-diaria/2026-10-30`, nunca `main`)
**Preview**: https://spa-landing-git-mejora-diaria-2026-10-31-zegoqui-svgs-projects.vercel.app — deployment `dpl_5BBUEmPZbgUm8p7Frg1QKYNp28MJ` del commit `7d3029c` (SHA `7d3029ce1af36f6f15b0cc246c262552fed6df6b`, ref `mejora-diaria/2026-10-31`), estado **READY**, `target` = null (≠ production), rama de producción = `main` intacto en `91f9e54`. El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: la URL responde **200 pero redirige** (2 saltos) a `vercel.com/login` (título "Login – Vercel"); hace falta iniciar sesión en Vercel para ver la página.
**Métrica esperada**: ↓ rebote y ↓ salidas por rebote desde `/blog` (7 de cada 11 clics hoy terminan en 404); ↑ páginas indexadas por Google (el `sitemap.xml` pasa de 3 URLs —una rota— a 13 reales, y las 11 páginas pasan de 4 estáticas a 11); ↑ lectura hasta el CTA de WhatsApp al final de un artículo. Proxy: cobertura de `sitemap.xml` en Search Console, y clics salientes a `wa.me` originados en `/blog/*`.
**Estado**: 🔎 en revisión — pendiente de "publica"; build verde (`npm run build` exit 0, 19/19 páginas estáticas, First Load JS 149 kB sin cambios). Sin capturas: el Chromium del host no arranca por libs de sistema y el cron no puede usar sudo; la verificación fue sobre el HTML renderizado por el propio build de Next.
**Pendiente anotado** (no corregido hoy, por no ser copy publicable sin decisión de Sebastián):
- El excerpt de *Celulitis: Causas y Tratamientos Efectivos* dice "Understanding cellulit and los mejores tratamientos…": está en inglés, con una palabra mal escrita ("cellulit") y "and" en medio de la frase en español. Es el texto publicado desde el inicio; se dejó **verbatim** y se corrige solo con aprobación.
- La meta de verificación de Google en `src/app/layout.tsx` es el placeholder literal `google-site-verification-code` (no es un token real). No se tocó porque la etiqueta no sirve de nada sin el código verdadero, que solo tiene Sebastián.
- `businessInfo.instagramUrl` conserva el comentario `// Placeholder based on brand`. La URL responde 200, pero Instagram sirve un shell JS tanto para perfiles existentes como inexistentes, así que **no se pudo confirmar** que la cuenta exista: no se quitó ni se afirmar nada sin prueba.

---

## 2026-10-31 (r2) — El excerpt de Celulitis en español y sin meta de verificación falsa

**Principio**: honestidad de contenido + honestidad técnica — una tarjeta de blog que mezcla dos idiomas y una palabra mal escrita se lee como un error de la marca, y una etiqueta `<meta name="google-site-verification">` con un valor inventado es una afirmación técnica falsa: o es el código real de Search Console o no debe estar ahí.
**Por qué**: la entrada anterior de este mismo día (corrección de los 7 enlaces rotos del blog) dejó **anotados como pendientes** estos dos defectos, sin tocarlos, porque uno es copy publicado y el otro necesita un valor que solo tiene Sebastián: *"El excerpt de Celulitis… está en español con un fragmento en inglés y 'cellulit' mal escrito… se corrige solo con aprobación"* y *"La meta de verificación de Google… es el placeholder literal `google-site-verification-code` (no es un token real). O se consigue el código verdadero de Search Console o se quita la etiqueta"*. Esta corrida es **la aprobación explícita de Sebastián** para el texto en español y para **quitar** la etiqueta (no para inventar un token). Cierra los dos pendientes; el tercero (`businessInfo.instagramUrl`) sigue abierto porque requiere evidencia que no se tiene.
**Cambios** (2 archivos, +1/-4 netos; solo `src/data/blog.ts` y `src/app/layout.tsx`):
- **`src/data/blog.ts`**: el excerpt de *Celulitis: Causas y Tratamientos Efectivos* pasa de `"Understanding cellulit and los mejores tratamientos para reducir su apariencia de forma duradera."` a `"Entiende qué es la celulitis y los mejores tratamientos para reducir su apariencia de forma duradera."`. El artículo no tiene cuerpo propio (se arma con `buildBodyFromPublishedData()` a partir de su excerpt + la descripción y la categoría ya publicadas), así que el arreglo sirve **tanto** para la tarjeta del índice `/blog` **como** para el primer párrafo del artículo: una sola línea de datos corrige las dos apariciones.
- **`src/app/layout.tsx`**: se elimina el objeto `verification` completo (`verification.google: 'google-site-verification-code'`). Como era su única clave, el objeto quedaba vacío y `Metadata` no lo acepta vacío: se quita el bloque entero, no solo la etiqueta. **No** se pone un token nuevo — un código de Search Console inventado sería el mismo defecto con otro disfraz.
**Medido** (sobre el build local, `.next/` generado por este commit):
| | antes | después |
|---|---|---|
| `grep -rn "cellulit" src` | 1 (inglés, mal escrito) | **0** |
| `grep -rn "Understanding" src` | 1 | **0** |
| `grep -rn "google-site-verification" src` | 1 | **0** |
| `grep -rn "verification" src` | 3 (el objeto + la etiqueta) | **0** |
| "Entiende qué es la celulitis…" en el HTML del artículo | 0 | **4** (DOM + payload RSC) |
| "Understanding cellulit…" en el HTML del artículo | 4 | **0** |
| `google-site-verification` en todo `.next/` | presente | **0** |
| `<meta name="robots" content="index, follow"/>` | presente | **presente** (sin cambio) |
| páginas estáticas generadas | 19 | **19** |
| First Load JS | 149 kB | **149 kB** (sin cambios) |
Los otros 10 excerpts de `src/data/blog.ts` se compararon campo por campo contra `HEAD`: **sin cambios**. El único `meta` que sale del `<head>` es el de verificación; `robots`, `openGraph`, `twitter` y los dos JSON-LD (`BeautySalon`, `FAQPage`) siguen igual.
**Rama**: mejora-diaria/2026-10-31 (base `mejora-diaria/2026-10-30`, nunca `main`) · commit de código `f903911` + commit de bitácora
**Preview**: https://spa-landing-8utz9pxfc-zegoqui-svgs-projects.vercel.app — deployment `dpl_8xT97dsTupdiGEmpBrRfd2uFp7vt` del commit **de código** `f903911` (SHA `f903911c45abcd14002eed49ad1f9f9848ef2da4`, ref `mejora-diaria/2026-10-31`), estado **READY**, `target` = null (≠ production), rama de producción = `main` intacto en `91f9e54`. El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: la URL responde **302 → `vercel.com/sso-api`** (verificado sin seguir el redirect); hace falta iniciar sesión en Vercel para ver la página.
**Métrica esperada**: ↓ sensación de error/abandono en la tarjeta de Celulitis del blog (proxy: clics en "Leer más" de esa tarjeta vs. el resto del índice — la única que hoy mostraba copy en dos idiomas); en SEO, la eliminación de la etiqueta falsa **no** cambia el rastreo (no había sitio verificado que perder) y evita un token inválido en el `<head>` de las 19 páginas. Cualitativa: no se publica nada hasta que Sebastián responda "publica".
**Estado**: 🔎 en revisión — pendiente de "publica"; build verde (`npm run build` exit 0, 19/19 páginas, First Load JS 149 kB sin cambios), compilado con `NODE_OPTIONS=--max-old-space-size=1280` porque la máquina bajó a ~2.3 GiB libres. Sin capturas: el Chromium del host no arranca por libs de sistema y no se usa sudo; la verificación fue sobre el HTML renderizado por el propio build de Next. La línea `[CRON_REPORT_ERROR] Dynamic server usage: Route /api/cron/report…` que aparece durante el build es informativa de una route dinámica (no es un fallo): el exit code es 0 y las 19/19 páginas se generaron.
**Pendiente anotado** (sigue abierto, no se corrigió): `businessInfo.instagramUrl` conserva el comentario `// Placeholder based on brand`; Instagram sirve un shell JS igual para perfiles existentes e inexistentes, así que no se puede confirmar la cuenta. **No se quitó ni se afirmó nada sin prueba.**

---

## 2026-10-31 — Movimiento, materiales y accesibilidad con la skill apple-design

**Principio**: interfaz fluida (skill `apple-design`, Emil Kowalski, MIT): respuesta al tocar, movimiento solo con transform/opacity, materiales translúcidos, tipografía con tracking por tamaño y respeto a las preferencias de accesibilidad.
**Reglas aplicadas (regla de la skill → archivo)**:
- §1 Respuesta en pointer-down (`active:scale`, 75 ms; retorno 300 ms): `src/components/ui/Button.tsx`, `sections/Header.tsx` (botón Reservar y menú), `ui/Modal.tsx` (cerrar), `StickyWhatsApp.tsx` (Chatear ahora; el botón flotante usa `whileTap`).
- §4 Muelles críticos (damping 1.0 / response 0.4) y curvas cubic-bezier equivalentes: `src/lib/motion.ts` (SPRING_UI, SPRING_SHEET, SPRING_SNAP), variables `--ease-spring*` y `.ease-spring` en `globals.css`.
- §7 Entrada y salida por la misma ruta, con salida animada (`AnimatePresence`): menú móvil en `Header.tsx`, `Modal.tsx`, chat flotante en `StickyWhatsApp.tsx` (origen abajo-derecha, junto al botón).
- §11 Solo `transform`/`opacity` en todo lo nuevo (`appleEnter`, `appleSwap`, `revealIn`, `applePulse`, transiciones `transition-[transform,...]`).
- §12 Materiales con `backdrop-filter`: `.material-bar` (cabecera, `Header.tsx`), `.material-veil` (velo de lectura del hero en móvil, `Hero.tsx`), `.material-soft` (frase de la fundadora, `ExpertProfile.tsx`).
- §14 Movimiento reducido: bloque `@media (prefers-reduced-motion: reduce)` en `globals.css` (apaga `.enter`, `.panel-swap`, `.reveal*`, `.pulse-ring`, transiciones a 120 ms), `useReducedMotion` en Header, Modal y StickyWhatsApp (cross-fade corto), `motion-reduce:` en botones y estrellas de Testimonials. Transparencia reducida y contraste alto: `@media (prefers-reduced-transparency: reduce)` y `(prefers-contrast: more)` vuelven opacos los materiales.
- §15 Tipografía: tracking negativo y interlineado cerrado en títulos grandes (`Hero.tsx` h1 -0.02em / 1.05; h2 de `Services`, `Testimonials`, `ExpertProfile` -0.015em / 1.1), `font-optical-sizing` y `text-wrap: balance` en `globals.css`.
- Reveal al hacer scroll sin bloquear contenido: `.reveal*` con `animation-timeline: view()` (solo CSS; sin soporte, el contenido se ve igual). Aplicado en el grid del `Footer.tsx`; el resto de secciones ya traía su `whileInView`.
- Objetivos táctiles de 44 px: botones (`Button.tsx`, Header, Modal, StickyWhatsApp) y enlaces del menú móvil.
**No se cambió**: textos, precios, teléfonos, enlaces ni imágenes (verificado con `git diff -w` contra la base: ningún href ni texto distinto).
**Rama**: mejora-diaria/2026-10-31-apple (base mejora-diaria/2026-10-31; main intacto en 91f9e54)
**Build**: 19/19 páginas; ruta `/` 149 kB -> 150 kB de First Load JS (+0,7 %). `tsc --noEmit` limpio; `next lint` con los mismos 6 errores `react/no-unescaped-entities` que ya tenía la base.
**Preview**: pendiente (la rama no se ha subido al remoto).

---

## 2026-11-01 — El modal de reserva ya ofrece el horario real de SILUEL

**Principio**: honestidad de la disponibilidad (NN/g "Honest UX") — un selector de horas es una promesa de horario: ofrecer una cita a las 7:00 PM de un sábado, cuando el centro cierra a las 6:00 PM, es peor que no ofrecer horario; y una sola fuente de verdad (DRY) para lo que el sitio publica y lo que el modal permite.
**Por qué**: auditoría del flujo de reserva (los ítems #4 y #7 del backlog siguen bloqueados por material real). El sitio **publica** su horario en el JSON-LD `openingHoursSpecification` de `src/app/layout.tsx`: lunes a viernes 09:00–20:00 y sábado 09:00–18:00, domingo cerrado. Pero el modal de reserva usaba una lista fija (`BUSINESS_HOURS`) que no tenía nada que ver con ese horario:
| | antes | después |
|---|---|---|
| horarios ofrecidos | lista fija 10:00 AM–7:00 PM, igual todos los días | derivados del horario publicado, **por día** |
| sábado 7:00 PM | **se ofrecía** (el centro cierra a las 6:00 PM) | no existe (último inicio 5:00 PM) |
| apertura 9:00 AM | **no se ofrecía** | sí (lunes a sábado) |
| domingo | el input nativo "Otro día" lo permitía | se descarta: el centro está cerrado |
| horario visible en pantalla | nunca se mostraba | "Horario: Lunes a viernes 9:00 AM - 8:00 PM · Sábados 9:00 AM - 6:00 PM" |
| día y hora al enviar | opcionales: la cita podía llegar a WhatsApp sin disponibilidad | obligatorios, y la hora debe ser una de las disponibles para ese día |
| fuente del horario | dos (JSON-LD vs lista del modal) | una (`businessHours` en `src/data/index.ts`) |
**Interpretación declarada**: el último inicio permitido es **una hora antes del cierre** (no se ofrece una cita que empieza cuando el centro ya cerró). Los horarios y el cierre son los publicados; solo se aplica esa regla de último inicio. Si Sebastián prefiere otro criterio (p. ej. cierre incluido), es un cambio de una línea en `getSlotsForDay`.
**Cambios** (3 archivos, +80 netas):
- **`src/data/index.ts`**: nuevo `businessHours` — el horario publicado, indexado por día de la semana (`null` = cerrado) — más `businessHoursSummary` para mostrarlo en la interfaz. Es la **misma** información que ya estaba hardcodeada en el JSON-LD; no se cambió ningún valor publicado.
- **`src/app/layout.tsx`**: el `openingHoursSpecification` del JSON-LD ahora se arma con `businessHours` en vez de una lista propia. Se conserva el agrupamiento original (lunes a viernes / sábado) y **los valores no cambian**: sigue siendo 09:00–20:00 y 09:00–18:00.
- **`src/components/ui/BookingModal.tsx`**: los horarios se derivan del día elegido (`getSlotsForDay` + `weekdayOf`); el input "Otro día" descarta los domingos; el `min` del input pasa a fecha **local** (`toLocaleDateString('en-CA')`) porque `toISOString()` usa UTC y en México podía adelantar un día y bloquear el día de hoy; al cambiar de día se limpia la hora; y `validateForm` exige día + hora válidos para el día.
**Medido**:
| | resultado |
|---|---|
| slots lunes (cierre 8:00 PM) | 9:00 AM … 7:00 PM (11) |
| slots sábado (cierre 6:00 PM) | 9:00 AM … 5:00 PM (9) |
| domingo | cerrado, sin slots |
| algún slot ≥ horario de cierre | **0** (comprobado slot por slot contra el cierre publicado) |
| JSON-LD `openingHoursSpecification` | Mon–Fri 09:00–20:00 · Sat 09:00–18:00 (**idéntico** al anterior) |
| lista fija `BUSINESS_HOURS` | **0 apariciones** en los chunks; la lista vieja ya no existe |
| resumen del horario en los chunks | presente ("Horario: Lunes a viernes 9:00 AM - 8:00 PM · Sábados 9:00 AM - 6:00 PM") |
| `sitemap.xml` | 13 `<loc>`, sin cambios |
| páginas estáticas | 19/19 |
| First Load JS | 150 kB (sin cambios respecto a la base) |
**Rama**: mejora-diaria/2026-11-01 (base mejora-diaria/2026-10-31-apple; `main` intacto en 50a86ce)
**Preview**: https://spa-landing-3dn7b2b1r-zegoqui-svgs-projects.vercel.app — deployment `dpl_9rG2XEL9xEpG2qzDjSGZuqb1ckEi` del commit de código `c28c7df` (SHA `c28c7dfe446354b6e6e2a2ab6e50748fb1df93eb`, ref `mejora-diaria/2026-11-01`), estado **READY**, `target` ≠ production. El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: la URL responde **302 → `vercel.com/sso-api`** y termina en `vercel.com/login` (título "Login – Vercel"); hace falta iniciar sesión en Vercel para ver la página.
**Métrica esperada**: ↑ citas completadas sin correcciones por horario (proxy: ↓ mensajes de WhatsApp que llegan sin día u hora, y ↑ pasos del modal completados hasta el envío); ↓ solicitudes de cita en días/horas que el centro no atiende. Cualitativa hasta tener baseline de analítica por paso.
**Estado**: 🔎 en revisión — pendiente de "publica"; build verde (`npm run build` exit 0, 19/19 páginas, 150 kB First Load JS sin cambios), compilado con `NODE_OPTIONS=--max-old-space-size=1280` porque la máquina bajó a ~2.08 GiB libres (por encima del gate de 2 GiB, bajo el de 2.56 GiB). `tsc --noEmit` limpio. Sin capturas: el Chromium del host no arranca por libs de sistema (`libatk-1.0.so.0`) y el cron no puede usar sudo; la verificación fue sobre la lógica pura (test de slots), el HTML generado y los chunks del bundle.
**Nota operativa**: el repo `Landing` está enlazado a **dos** proyectos de Vercel (`spa-landing` y `ash-guard-vision`), así que cada push a la rama genera un preview en ambos. No se tocó ni se promoted a producción ninguno de los dos; `ash-guard-vision` sigue siendo el proyecto hermano intocable de este cron.

---

## 2026-11-02 — Las fotos de las tarjetas de servicio ya no se descargan 5 veces más grandes de lo que se ven

**Principio**: entregar solo los píxeles que el ojo puede ver (RUM / "performance budget" de web.dev y el propio Next.js Image: el atributo `sizes` es la promesa que haces al navegador sobre el tamaño real de la imagen en pantalla; sin ella, `next/image` asume que ocupa todo el ancho del viewport).
**Por qué**: auditoría de la carga de imágenes, hecha porque los dos ítems que quedaban (#4 y #7) siguen bloqueados por material real. Las 9 tarjetas de "Nuestros Servicios" y las 11 del índice de blog usaban `<Image>` **sin atributo `sizes`**. En Next.js 14, la ausencia de `sizes` equivale a `sizes="100vw"`: el navegador cree que la imagen puede medir 1440 px de ancho y, en una pantalla con DPR 2, elige el candidato de **1920 o 2048 px** de la escalera `deviceSizes`. Pero la tarjeta real mide **384 px** (grid de 3 columnas en un `max-w-7xl`). El sitio estaba pidiendo, y descargando, imágenes de 1920–2048 px para mostrarlas en 384 px.
**Cambios** (2 archivos, +2 netas):
- **`src/components/sections/Services.tsx`**: `sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 384px"` en la imagen de la tarjeta de servicio.
- **`src/app/blog/page.tsx`**: el mismo `sizes` en la imagen de la miniatura del índice de blog (misma retícula de 3 columnas).
No se tocó `[slug]/page.tsx`: su portada es a sangre completa (`h-[50vh]` sobre todo el viewport), donde `100vw` ya es el valor correcto.
**Medido** (pedido real del navegador a 1440 px con DPR 2, sobre el build y un servidor `next start` local; el tamaño de cada respuesta se midió con el optimizador de Next):
| imagen | fuente | antes pedía | ahora pide | upscale | bytes antes → ahora |
|---|---|---|---|---|---|
| `masaje-reductivo.jpg` | 492 px | 2048 | **828** | 4.16× → **1.68×** | — |
| `levantamiento-gluteos.jpg` | 715 px | 2048 | **828** | 2.86× → **1.16×** | — |
| `hero.png` (miniatura de blog) | 2048 px | 2048 | **828** | 1.00× → **0.40×** | 2 905 085 B → **377 516 B** |
| `corporales.jpg` | 1067 px | 2048 | **828** | 1.93× → 0.78× | 58 082 B → **36 383 B** |
| `faciales.jpg` | 1061 px | 2048 | **828** | 1.93× → 0.78× | 91 784 B → **58 818 B** |
| `masajes.jpg` | 964 px | 2048 | **828** | 2.12× → 0.86× | 45 816 B → **32 569 B** |
| `maderoterapia.png` | 1280 px | 2048 | **828** | 1.60× → 0.65× | 59 683 B → **27 647 B** |
| **total de las 8 imágenes medidas** | | | | | 3 238 710 B → **611 193 B (−81.1 %)** |
Ningún `srcset` deja de ofrecer candidatos grandes: lo que cambia es **cuál elige el navegador**, que es donde estaba el desperdicio. Las fuentes más pequeñas que el ancho pedido (p. ej. `masaje-reductivo.jpg`, 492 px) siguen devolviéndose sin ampliar, porque `sharp` no escala más allá del original.
**Efecto secundario útil**: al dejar de pedir anchos absurdos, `hero.png` —que pesa 3,1 MB como PNG— baja de 2,9 MB a 378 kB en la miniatura de blog, sin tocar el archivo original.
**Rama**: mejora-diaria/2026-11-02 (base mejora-diaria/2026-11-01; `main` intacto en 50a86ce)
**Preview**: https://spa-landing-6p6rsotvl-zegoqui-svgs-projects.vercel.app — deployment `dpl_FmHPFFBazzGWcgoVvv1PnwBmHMiK` del commit de bitácora `69da3d7` (HEAD de la rama; **sirve el mismo código** que `dpl_9RF5uj9ExuBYoGopXZDDSjcEPhbT`, del commit de código `15d1584`), estado **READY**, `target` ≠ production. El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: la URL responde **302 → `vercel.com/sso-api`** (confirmado sin seguir redirects), así que hace falta iniciar sesión en Vercel para ver la página.
**Métrica esperada**: ↓ bytes de imagen en la landing y en `/blog` (proxy medible: peso total de las imágenes de las tarjetas, −81 % en la muestra); ↓ LCP y CLS de la home y del índice de blog en móviles y en pantallas con DPR 2; la ↑ de calidad visual es colateral (imágenes menos sobreescaladas).
**Estado**: 🔎 en revisión — pendiente de "publica"; build verde (`npm run build` exit 0, 19/19 páginas, First Load JS 150 kB sin cambios) con `NODE_OPTIONS=--max-old-space-size=1280`; `tsc --noEmit` limpio. Sin capturas: el Chromium del host no arranca por libs de sistema (`libatk-1.0.so.0`) y el cron no puede usar sudo; la verificación fue sobre el HTML servido por `next start`, los bytes reales devueltos por el optimizador de Next y las dimensiones de cada fuente.
**Nota operativa**: el repo `Landing` está enlazado a dos proyectos de Vercel (`spa-landing` y `ash-guard-vision`), así que cada push a la rama genera un preview en ambos. No se tocó ni se promovió a producción ninguno de los dos.
---

## 2026-11-03 — La vista previa al compartir pesa 96 kB en vez de 3,1 MB

**Principio**: entregar a cada consumidor el formato que realmente consume (la misma lógica del `sizes` del 2026-11-02, aplicada al canal social): una vista previa compartida es una imagen que se descarga y se muestra en un móvil, no un asset de escritorio.
**Por qué**: auditoría de la ruta de compartir (los ítems #4 y #7 siguen bloqueados por material real). Los metadatos de OpenGraph apuntaban a `/images/hero.png`, pero ese canal **no pasa por el optimizador de Next**: Facebook, WhatsApp, LinkedIn y X piden la URL cruda. Medido sobre `next start` local con `User-Agent: facebookexternalhit/1.1`:

| | lo que recibía el rastreador | |
|---|---|---|
| URL de `og:image` | `/images/hero.png` → `image/png` | **3 111 418 B** |
| navegador moderno (AVIF) | `/images/hero.png` vía `/_next/image` | 47 432 B (1920 px) |

Es decir, el visitante de escritorio recibía 47 kB y el rastreador social recibía 3,1 MB por la **misma** página. Además los metadatos declaraban `og:image:width=1200` y `og:image:height=630` mientras el archivo real medía **2048×1064** — dimensiones falsas, que es justo lo que un rastreador usa para decidir el recorte.
**Cambios** (2 archivos, +21/-6 netas en código + 1 asset nuevo):
- **`public/images/og-image.jpg`** (nuevo): la **misma** foto ya publicada del hero, recortada a 1200×630 y recomprimida en JPEG q92. Sin dependencias nuevas: se generó con PIL 12.3.0 (ya instalado en el sistema) y se verificó visualmente con el modelo de visión. El recorte se hace a la izquierda de la marca de agua blanca que trae la foto de origen (rombo de 11×8 px en x 1991–2001, y 1005–1012): el recorte resultante no contiene **ningún** píxel blanco puro (comprobado pixel a pixel). Tono de color y sujeto (las herramientas de madera de maderoterapia sobre la espalda) idénticos al original — el tinte verdoso de la foto es del archivo de origen, no de la conversión.
- **`src/app/layout.tsx`**: nueva constante `OG_IMAGE` (una sola fuente para URL, ancho, alto y alt) y las tres referencias pasan a usarla: `openGraph.images[0]`, `twitter.images[0]` y el campo `image` del JSON-LD `BeautySalon`. Cero cambios en el copy, en los datos de negocio ni en el resto de los metadatos.
**Medido**:

| | antes | después |
|---|---|---|
| peso de `og:image` | 3 111 418 B (PNG 2048×1064) | **96 926 B** (JPEG 1200×630) — **−96,9 %** |
| dimensiones reales vs declaradas | 2048×1064 vs 1200×630 (**no coincidían**) | **1200×630 vs 1200×630 (coinciden)** |
| respuesta del servidor | 200 `image/png` | 200 `image/jpeg` |
| `og:image` que apunta a `hero.png` | 1 | **0** |
| páginas que emiten la nueva `og:image` | — | **12** (home + índice + 10 artículos) |
| `hero.png` en el hero de la home | sin cambios | sin cambios (**no se tocó**: el navegador moderno ya recibía AVIF de 47 kB) |
| First Load JS | 150 kB | 150 kB (sin cambios) |

Build verde (`npm run build` exit 0, 19/19 páginas, 150 kB First Load JS sin cambios) con `NODE_OPTIONS=--max-old-space-size=1280`; `tsc --noEmit` limpio. Verificado sobre el HTML del build y sobre el archivo servido por `next start`.
**Rama**: mejora-diaria/2026-11-03 (base mejora-diaria/2026-11-02; `main` intacto en 50a86ce)
**Preview**: https://spa-landing-pu214xee5-zegoqui-svgs-projects.vercel.app — deployment `dpl_DcLQ8f9jy3g5dEkNFZgrgRKWCso2` del commit `533bc0b` (SHA `533bc0b343ea52dcbca7fc2cd386535515abfdd6`, ref `mejora-diaria/2026-11-03`), estado **READY**, `target` ≠ production. El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: la URL responde **302 → `vercel.com/sso-api`** (confirmado sin seguir redirects) y termina en `vercel.com/login`; hace falta iniciar sesión en Vercel para ver la página. El build en Vercel fue verificado por el log de la API: `Compiled successfully`, `Generating static pages (19/19)`, `Build Completed`, **0 errores reales** (solo avisos de npm/Browserslist) y First Load JS 150 kB, igual que el build local.
**Métrica esperada**: ↓ peso de la vista previa compartida (de 3,1 MB a 97 kB por vista previa) y ↑ tasa de carga correcta de la miniatura en WhatsApp/Facebook/LinkedIn (proxy: tiempo hasta que la miniatura aparece en el chat, antes dominado por una descarga de 3,1 MB); metadatos `og:image` con dimensiones reales, lo que reduce el recorte incorrecto que hacen los rastreadores. Sin efecto esperado en el LCP de la home: ese canal ya recibía AVIF de 47 kB.
**Estado**: 🔎 en revisión — pendiente de "publica".
**Nota operativa**: el repo `Landing` está enlazado a dos proyectos de Vercel (`spa-landing` y `ash-guard-vision`), así que cada push a la rama genera un preview en ambos. No se tocó ni se promovió a producción ninguno de los dos.

---

## 2026-11-04 — El FAQ que Google muestra ya no promete cosas que SILUEL no publica

**Principio**: honestidad de marca + honestidad de datos estructurados (NN/g "Honest UX"; schema.org `FAQPage` es **contenido publicado**, no una nota interna) — un rich result es texto visible en la página de resultados: si promete algo que la marca no puede respaldar, es una promesa rota en la primera pantalla de búsqueda, con más visibilidad que la landing misma.
**Por qué**: auditoría de las cadenas de contenido del repo (los ítems #4 y #7 siguen bloqueados por material real). El JSON-LD `FAQPage` de `src/app/layout.tsx` es la **única superficie del sitio que nunca se había auditado**: 8 preguntas y respuestas que el sitio no renderiza como HTML visible, pero que Google sí extrae y muestra bajo el título. Al cruzar las 8 respuestas contra `src/data/index.ts`, `src/data/blog.ts`, el tablero `siluel` y la bóveda, **3 de las 8 afirmaban cosas que no están publicadas en ninguna parte**:
| # | respuesta | afirmación sin respaldo | dónde se publica hoy |
|---|---|---|---|
| 3 | "¿Qué incluye el tratamiento post-operatorio?" | "incluye drenaje linfático especializado, masajes suaves y técnicas de recuperación" | **ninguna** — es literalmente el bloque "Qué incluye" que el 2026-10-30 borró del modal por ser inventado |
| 5 | "¿Dónde está ubicado SILUEL…?" | "Cerca de la zona centro, con fácil acceso y **estacionamiento disponible**" | **ninguna** — no hay dato de estacionamiento en el repo, ni en el tablero, ni en la bóveda |
| 7 | "¿Qué tipo de faciales ofrecen en SILUEL?" | "Incluye **limpieza profunda, hidratación, tratamiento anti-edad, luminosidad** y más" | **ninguna** — el servicio publicado solo dice "personalizados según tu tipo de piel" |

El caso 3 es el más grave: el 2026-10-30 se eliminó del `BookingModal` un array de cinco promesas **idéntico para los 9 servicios** por no estar respaldado, y la mitad de ese texto seguía publicado — invisible para el auditor del modal — en el JSON-LD que Google muestra. Es el mismo defecto, en la superficie que quedó fuera de la revisión anterior.
**Cambios** (1 archivo, +3/-3 netas, solo `src/app/layout.tsx`):
- Pregunta 3: la respuesta pasa a la **descripción publicada** del servicio en `src/data/index.ts` ("Cuidado especializado para una recuperación rápida y segura después de cirugías estéticas, con técnicas suaves y efectivas"), sin enumerar lo que la sesión "incluye".
- Pregunta 5: se quitan "Cerca de la zona centro, con fácil acceso y estacionamiento disponible". Conserva la dirección publicada (`Plan de Ayala 1859, INT 28, Guadalajara, Jalisco`), que sí viene de `businessInfo`.
- Pregunta 7: se quitan "limpieza profunda, hidratación, tratamiento anti-edad, luminosidad y más". Conserva lo publicado: faciales personalizados según el tipo de piel, adaptados a las necesidades de tu piel.
- Las **preguntas no se tocaron** (siguen siendo las 8 mismas), ni el `@type`, ni el resto de las 5 respuestas que sí están respaldadas, ni el JSON-LD `BeautySalon`, ni el copy visible del sitio. Cero cambios visuales.
**Medido** (sobre el build local, `.next/server/app/index.html`):
| | antes | después |
|---|---|---|
| respuestas con afirmaciones sin respaldo | **3 de 8** | **0 de 8** |
| "estacionamiento disponible" en `src/` | 1 | **0** |
| "anti-edad" en `src/` | 1 | **0** |
| "limpieza profunda" en `src/` | 1 | **0** |
| "drenaje linfático especializado" en `src/` | 1 | **0** |
| preguntas (`"@type": "Question"`) en el HTML | 8 | **8** (sin pérdida) |
| respuestas (`"@type": "Answer"`) en el HTML | 8 | **8** (sin pérdida) |
| las 3 respuestas corregidas presentes en el HTML | — | 3/3 |
| páginas estáticas generadas | 19 | **19** |
| First Load JS | 150 kB | **150 kB** (sin cambios) |
Las 5 respuestas no tocadas se compararon una por una contra `HEAD`: **sin cambios**. `grep -rn` sobre todo `src/` no encuentra ninguna de las 4 cadenas inventadas, y el HTML generado contiene las 3 respuestas corregidas. `tsc --noEmit` limpio (exit 0).
**Rama**: mejora-diaria/2026-11-04 (base mejora-diaria/2026-11-03, commit `4409fc0`; `main` intacto en `50a86ce`)
**Preview**: https://spa-landing-pahba9vss-zegoqui-svgs-projects.vercel.app — deployment `dpl_Ec6UUbG4Nm2yGeLwybwn166KDPGf` del commit de código `ea8a19d` (SHA `ea8a19d997929ff5f61cac78b6c3b4cc1c2ae905`, ref `mejora-diaria/2026-11-04`), estado **READY**, `target` = null (≠ production), rama de producción = `main` sin tocar. El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: la URL responde **302 → `vercel.com/sso-api`** (confirmado sin seguir redirects) y termina en `vercel.com/login` (título "Login – Vercel"); hace falta iniciar sesión en Vercel para ver la página. El build en Vercel fue verificado por el log de la API: `Compiled successfully`, `Generating static pages (19/19)`, `Build Completed`, **0 errores reales** (la única línea con "error" es el aviso informativo `DYNAMIC_SERVER_USAGE` de la route dinámica `/api/cron/report`, el mismo de las corridas anteriores).
**Métrica esperada**: ↑ confianza y ↑ tasa de clics desde la página de resultados: el rich result de Google deja de mostrar promesas que la marca no puede respaldar (estacionamiento, anti-edad, "qué incluye"). Proxy: ↑ clics orgánicos desde la SERP (Search Console) y ↓ rebote de quienes llegan desde el FAQ de Google esperando algo que el sitio no publica. Cualitativa hasta tener baseline de Search Console.
**Estado**: 🔎 en revisión — pendiente de "publica"; build verde (`npm run build` exit 0, 19/19 páginas, 150 kB First Load JS sin cambios) con `NODE_OPTIONS` sin tope (la máquina tenía 2891 MiB libres, por encima del gate de 2.56 GiB). Sin capturas: el Chromium del host no arranca por libs de sistema (`libatk-1.0.so.0`) y el cron no puede usar sudo; la verificación fue sobre el HTML renderizado por el propio build de Next.
**Nota operativa**: el repo `Landing` está enlazado a dos proyectos de Vercel (`spa-landing` y `ash-guard-vision`), así que cada push a la rama genera un preview en ambos. No se tocó ni se promovió a producción ninguno de los dos.

---

## 2026-11-05 — El horario del footer ya sale de la fuente única

**Principio**: una sola fuente de verdad (DRY) + consistencia de la promesa de disponibilidad — el horario que el sitio publica en tres sitios distintos es una promesa operativa repetida; si cada copia se edita por separado, tarde o temprano dos de ellas contradicen a las demás y el sitio ofrece horas que el centro no atiende.
**Por qué**: candidato de auditoría que el backlog dejó anotado el 2026-11-04 (nota de estado): *"El footer publica el horario en un formato propio… en vez de usar `businessHoursSummary` de `src/data/index.ts`, que es la fuente única que se creó el 2026-11-01. Los valores coinciden hoy, así que no hay contradicción visible, pero son dos representaciones del mismo dato."* Ese día no se corrigió por ser una mejora de una línea demasiado chica; hoy es el ítem acotado que queda sin tomar.
**El defecto**: existían **tres** representaciones del mismo horario, y solo una era la canónica:
| superficie | fuente | formato |
|---|---|---|
| JSON-LD `openingHoursSpecification` | `businessHours` (array) | `09:00`–`20:00` / `09:00`–`18:00` |
| Modal de reserva, paso 2 | `businessHoursSummary` | "Lunes a viernes 9:00 AM - 8:00 PM · Sábados 9:00 AM - 6:00 PM" |
| **Footer** | **cadena escrita a mano en el JSX** | **"L-V: 9am - 8pm \| S: 9am - 6pm"** |
El footer era el **único** que no leía de los datos: su texto no existía en ningún archivo de datos, así que ningún cambio de horario en `src/data/index.ts` lo habría movido. Además su formato abreviado ("9am") es el único del sitio que no usa el formato de 12 h con "AM/PM" del modal, de modo que era también el único que se leía distinto al mismo dato en la misma página.
**Cambios** (1 archivo, +2/-2 netas, solo `src/components/sections/Footer.tsx`):
- Import: `import { businessInfo }` → `import { businessInfo, businessHoursSummary }`.
- El `<span>` del reloj pasa de la cadena literal `"L-V: 9am - 8pm | S: 9am - 6pm"` a `{businessHoursSummary}`.
**El horario publicado no cambia ni un minuto**: `"L-V: 9am - 8pm | S: 9am - 6pm"` y `"Lunes a viernes 9:00 AM - 8:00 PM · Sábados 9:00 AM - 6:00 PM"` describen **exactamente** el mismo horario que el array `businessHours` (lunes a viernes 09:00–20:00, sábado 09:00–18:00). Lo único que cambia es de dónde sale el texto y cómo está escrito.
**Medido** (sobre el build local, `.next/server/app/index.html`):
| | antes | después |
|---|---|---|
| `"L-V: 9am"` en el HTML y en los chunks | 1 (footer) | **0** |
| `"Lunes a viernes 9:00 AM - 8:00 PM · Sábados 9:00 AM - 6:00 PM"` en el HTML | 1 (solo el modal) | **2** (modal + footer) |
| representaciones distintas del mismo dato | 3 | **1** (`businessHours`) |
| bloques `<li>` del footer | 3 (dirección, teléfono, horario) | 3 (sin pérdida) |
| páginas estáticas generadas | 19 | **19** |
| First Load JS | 150 kB | **150 kB** (sin cambios) |
Verificado sobre el HTML generado que el `<span>` del reloj (`lucide-clock`) contiene la cadena canónica, que el JSON-LD sigue publicando `Mon–Fri 09:00–20:00` y `Sat 09:00–18:00` **sin cambios**, y que dirección y teléfono del footer quedaron verbatim. `tsc --noEmit` limpio (exit 0).
**Rama**: mejora-diaria/2026-11-05 (base mejora-diaria/2026-11-04, commit `6265982`; `main` intacto en `50a86ce`) · commit de código `70cb699` + commit de bitácora `dd8eaa1` (HEAD)
**Preview**: https://spa-landing-knjgqzqwx-zegoqui-svgs-projects.vercel.app — deployment `dpl_5v7XTo5vJN8hxspabfrzRqF6mGsY` del commit de bitácora `dd8eaa1` (SHA `dd8eaa17ee02180842a0e39fbd864f6a8b455841`, ref `mejora-diaria/2026-11-05`), estado **READY**, `target` = null (≠ production), rama de producción = `main` intacto en `50a86ce`. El commit de código `70cb699` es ancestro del SHA desplegado, así que **el preview sí sirve el cambio** (verificado: `git show dd8eaa1:src/components/sections/Footer.tsx` contiene `businessHoursSummary`). El deployment anterior del commit `29b149b` (`dpl_2D5ZQSvtkcZHabo4ovYbFVnexp44`) sirve **el mismo código** en https://spa-landing-d7pidkerp-zegoqui-svgs-projects.vercel.app — Vercel no coalesce pushes, así que cada commit genera su propia URL. El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: la URL responde **302 → `vercel.com/sso-api`** (verificado sin seguir redirects) y termina en `vercel.com/login` (título "Login – Vercel"); hace falta iniciar sesión en Vercel para ver la página. El build en Vercel fue verificado por el log de la API: `Compiled successfully`, `Generating static pages (19/19)`, `Build Completed`, **sin "Failed to compile"**.
**Métrica esperada**: ↓ riesgo de que el footer contradiga al modal o al JSON-LD cuando cambie el horario (el footer ya no puede quedar desactualizado en silencio). En el usuario, el horario del footer pasa de un formato abreviado ("9am") al mismo formato de 12 h del modal, así que las dos menciones del horario en la página se leen igual. Cualitativa: no cambia ningún KPI de conversión; es una mejora de mantenibilidad y de consistencia de la promesa de disponibilidad.
**Estado**: 🔎 en revisión — pendiente de "publica"; build verde (`npm run build` exit 0, 19/19 páginas, 150 kB First Load JS sin cambios) con `NODE_OPTIONS=--max-old-space-size=1024`: la máquina tenía **1177 MiB** libres, por debajo del gate de 2 GiB del cron, y el swap estaba **agotado** (4095/4095 MiB). Se compiló con el tope de heap como mitigación y el build salió verde al primer intento. Los ~2.5 GB de Chromium que presionan la RAM llevan ~14 h en ejecución bajo un padre vivo (sesión activa ajena), así que **no se tocaron** (regla dura #5). Sin capturas: el Chromium del host no arranca por libs de sistema y el cron no puede usar sudo; la verificación fue sobre el HTML renderizado por el propio build de Next.

---

## 2026-11-06 — Fuera los reclamos de certificación que SILUEL no publica

**Principio**: honestidad de marca (NN/g "Honest UX") — un reclamo de **credencial** ("Certificación Internacional", "Técnicas certificadas") es una afirmación específica y verificable sobre la acreditación profesional; la clienta puede comprobarla y, si no la encuentra, la marca pierde credibility en el bloque exacto donde debería ganarla. La misma regla que el 2026-10-21 aplicó al cambiar "Cosmetóloga **certificada**" → "Cosmetóloga **profesional**": si la credencial no está publicada, no se afirma.
**Por qué**: auditoría de las cadenas de contenido del repo (los ítems #4 y #7 siguen bloqueados por material real). La sección "Nuestra Experta" (`src/components/sections/ExpertProfile.tsx`) renderiza cuatro badges con `CheckCircle`, escritos a mano en el JSX. **Dos de los cuatro eran reclamos de credencial sin ninguna fuente**:
| badge | ¿respaldado? |
|---|---|
| "Tratamientos personalizados" | sí — los servicios publicados dicen "personalizados según tu tipo de piel" / "completamente personalizados" |
| **"Técnicas certificadas"** | **no** — no aparece en `src/data/index.ts`, ni en la bóveda, ni en el tablero `siluel` |
| **"Certificación Internacional"** | **no** — ídem |
| "Ambiente exclusivo" | claim de posicionamiento/experiencia, no verificable como credencial (se deja, anotado abajo) |

El rastro del "Certificación Internacional" sí existe, pero como **insumo a verificar, no como hecho verificado**: la tarea T4 del tablero `siluel` ("Diferenciadores SILUEL vs competencia") lo listaba como uno de los cinco *diferenciadores crudos* a cristalizar, y el entregable de esa tarea ya no está en disco (`/home/sebastian/siluel-projects` no existe). El run summary de T4 además dice "sin promesas médicas absolutas". En el repo, la única credencial publicada es `expertInfo.bio`: *"Cosmetóloga profesional con más de 10 años de experiencia… Especialista en maderoterapia, drenaje linfático, tratamientos post-operatorios y técnicas colombianas"*. Es decir: el sitio **sí** publica preparación, y lo publica en singular.
**Cambios** (2 archivos, +3/-3 netas):
- **`src/components/sections/ExpertProfile.tsx`**: los dos badges de certificación se sustituyen por dos claims **verbatim de `expertInfo.bio`**: "Técnicas certificadas" → "Más de 10 años de experiencia"; "Certificación Internacional" → "Especialista en maderoterapia y drenaje linfático". La retícula 2×2 y los `CheckCircle` quedan intactos: cero cambios visuales. Los dos badges conservados ya estaban respaldados ("Tratamientos personalizados" por las descripciones de servicio; "Ambiente exclusivo" es posicionamiento, no credencial).
- **`src/data/blog.ts`**: el artículo *Por qué el Drenaje Linfático es Esencial después de una Cirugía* decía "Contamos con especialistas entrenadas en drenaje linfático post-operatorio" — **plural** para un negocio que publica **una sola profesional** (`expertInfo`: Elsa Gómez, Cosmetóloga & Fundadora). Ahora: "Contamos con **una especialista entrenada** en drenaje linfático post-operatorio". Mismo defecto de clase (afirmación de plantilla profesional sin respaldo).
**Medido** (sobre el build local, `.next/server/app/`):
| | antes | después |
|---|---|---|
| `certificad*` / `Certificación` en `src/` | 2 | **0** |
| `certificad*` en los chunks de cliente | 2 | **0** |
| "Técnicas certificadas" en el HTML de la home | 1 | **0** |
| "Certificación Internacional" en el HTML de la home | 1 | **0** |
| "Más de 10 años de experiencia" en el HTML | 0 | **1** |
| "Especialista en maderoterapia y drenaje linfático" en el HTML | 0 | **1** |
| badges de `CheckCircle` en la sección | 4 | 4 (sin pérdida) |
| "especialistas entrenadas" en el HTML del artículo | 1 | **0** |
| "una especialista entrenada" en el HTML del artículo | 0 | **2** (DOM + payload RSC) |
| páginas estáticas generadas | 19 | **19** |
| First Load JS | 150 kB | **150 kB** (sin cambios) |
`tsc --noEmit` limpio (exit 0). Build en Vercel verificado por su log de API: `Compiled successfully`, `Generating static pages (19/19)`, **sin "Failed to compile"**.
**Rama**: mejora-diaria/2026-11-06 (base mejora-diaria/2026-11-05, commit `8943cdb`; `main` intacto en `50a86ce`) · commit de código `6edea35`
**Preview**: https://spa-landing-iapmp9sev-zegoqui-svgs-projects.vercel.app — deployment `dpl_Fdeqowh9egKWQRQqEhKPwGqMuyGP` del commit `6edea35` (SHA `6edea3568a1d`, ref `mejora-diaria/2026-11-06`), estado **READY**, `target` = null (≠ production), rama de producción = `main` intacto en `50a86ce` (deployment `dpl_DTpxebR37GcaFjH2FL4hK7kqJL3H`). El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: la URL responde **302 → `vercel.com/sso-api`** (verificado sin seguir redirects) y termina en `vercel.com/login` (título "Login – Vercel"); hace falta iniciar sesión en Vercel para ver la página.
**Métrica esperada**: ↑ confianza y ↓ riesgo reputacional en la sección de la fundadora: la marca deja de mostrar una acreditación que no puede exhibir y sustituye dos huecos por dos hechos verificables (años de experiencia y especialidad técnica), sin perder ninguno de los cuatro badges. Proxy: ↓ salidas por rebote desde la sección "Nuestra Experta" y ↑ clics en "Reservar" originados ahí. Cualitativa hasta tener baseline de analítica por sección. **Nota**: este cambio **no** mejora un KPI de forma medible en el corto plazo; su valor es eliminar un reclamo de credencial no sostenido, que es exactamente el tipo de defecto que el resto de las corridas viene corrigiendo (ítems #14, #19 y el "Cliente Verificado" del 2026-10-21).
**Estado**: 🔎 en revisión — pendiente de "publica"; build verde (`npm run build` exit 0, 19/19 páginas, 150 kB First Load JS sin cambios) con `NODE_OPTIONS=--max-old-space-size=1024`: la máquina tenía **1729 MiB** libres, por debajo del gate de 2 GiB del cron, y el swap **agotado** (4095/4095 MiB). Se compiló con el tope de heap como mitigación (Pitfall 23) y el build salió verde al primer intento. Los ~2.4 GB de Chromium que presionan la RAM pertenecen a sesiones ajenas vivas, así que **no se tocaron** (regla dura #5). Sin capturas: el Chromium del host no arranca por libs de sistema y el cron no puede usar sudo; la verificación fue sobre el HTML renderizado por el propio build de Next.
**Pendiente anotado** (no corregido hoy): "Ambiente exclusivo" (badge conservado) no tiene fuente publicada — se dejó por ser un claim de posicionamiento/experiencia y no una credencial verificable; si Sebastián prefiere, se puede sustituir por un dato publicado. El artículo `cuantas-sesiones-maderoterapia` sigue diciendo "5 sesiones: Reducción de 1-3 cm", una cifra **sin fuente publicada** (es el único dato en centímetros de todo el repo); requiere decisión de Sebastián.

---

## 2026-11-07 — Fuera el export huérfano del horario que contradecía al publicado

**Principio**: **fuente única de verdad** (DRY aplicado al dato que el negocio promete). Un dato que se publica de tres formas distintas no está "publicado": está *prometido tres veces*, y la clienta que reserve un sábado a las 7 PM y se encuentre con la puerta cerrada no le perdona a la web que el dato viniera de un archivo muerto.
**Por qué**: auditoría de la fuente única del horario, hecha porque los ítems #4 y #7 siguen bloqueados por material real. El 2026-11-01 (ítem #16) movió el modal de reserva a `businessHours` de `src/data/index.ts` y dejó de usar la lista fija `BUSINESS_HOURS`. Ese commit quitó **el consumidor** (`BookingModal.tsx`), pero **dejó el export en el repo**: `src/lib/validation.ts` seguía exportando `BUSINESS_HOURS = ['10:00 AM' … '7:00 PM']`, la lista que ofrecía una hora después del cierre del sábado y ocultaba la apertura de las 9:00 AM. El backlog llegó a registrar "`BUSINESS_HOURS` → **0** apariciones en los chunks" — verdad, pero medida **sobre el render**, no sobre el código: el export seguía vivo en el repo, y `src/lib/validation.ts` es un archivo vivo (lo importa `/api/leads` para el `leadSchema`). Bastaba que el próximo que tocara el horario lo importara para reintroducir, sin que nadie lo notara, exactamente el bug que ese mismo ítem había arreglado.
**Cambios** (1 archivo, +13/-5 netas — solo `src/lib/validation.ts`):
- Se elimina el export `BUSINESS_HOURS` (4 líneas de datos + el array de 10 horas).
- Se deja en su lugar un comentario que dice **dónde** está la fuente única (`businessHours` / `businessHoursSummary` en `src/data/index.ts`, que el modal, el JSON-LD y el footer ya leen) y **por qué** se quitó, para que el próximo que busque el horario no lo vuelva a escribir aquí.
- **Cero cambios en lo que el sitio publica**: no se tocó ningún componente, ni `src/data/index.ts`, ni el modal, ni el JSON-LD.
**Medido** (sobre el build local, `.next/server/app/` y `.next/static/`):
| | antes | después |
|---|---|---|
| exports de `BUSINESS_HOURS` en `src/` | 1 (datos) | **0** (solo queda nombrado en el comentario) |
| `"10:00 AM"` en el HTML renderizado | 0 | **0** |
| `"7:00 PM"` en el HTML renderizado | 0 | **0** |
| `"10:00 AM"` / `"7:00 PM"` en los chunks de cliente | 0 / 0 | **0 / 0** |
| representaciones distintas del horario en `src/` | 2 (`businessHours` + `BUSINESS_HOURS`) | **1** (`businessHours`) |
| horario canónico "Lunes a viernes 9:00 AM - 8:00 PM" en el HTML | 1 | **1** (sin cambio) |
| JSON-LD `openingHoursSpecification` | Mon–Fri 09:00–20:00, Sat 09:00–18:00 | **igual** (verificado parseando el bloque `ld+json`) |
| dirección en el JSON-LD | "Plan de Ayala 1859, INT 28, Guadalajara, Jalisco, 45130" | **igual** |
| preguntas del FAQ JSON-LD | 8 | **8** (sin pérdida) |
| páginas estáticas generadas | 19 | **19** |
| First Load JS | 150 kB | **150 kB** (sin cambios) |
`tsc --noEmit` limpio (exit 0). Build en Vercel verificado por su log de API: `Compiled successfully`, `Generating static pages (19/19)`, `Build Completed`, **sin "Failed to compile"**.
**Rama**: mejora-diaria/2026-11-07 (base mejora-diaria/2026-11-06, commit `d0a9d63`; `main` intacto en `50a86ce`) · commit de código `c156dd9`
**Preview**: https://spa-landing-1qcpeettz-zegoqui-svgs-projects.vercel.app — deployment `dpl_H9fQRBxDuHEaGXCcEDfhr8ssaRbD` del commit de bitácora `013d08f` (SHA `013d08f76f3a2f8c4df87336dcea20670487b183`, ref `mejora-diaria/2026-11-07`), estado **READY**, `target` = null (≠ production). El commit de **código** `c156dd9` tiene su propio deployment, `dpl_8JpxySyJ8QphTwYQKgv7rCrFXVD5` (https://spa-landing-pabuitxw7-zegoqui-svgs-projects.vercel.app), también READY y con el mismo código servido (el commit intermedio solo toca `MEJORAS.md`). La producción de `spa-landing` sigue en `dpl_DTpxebR37GcaFjH2FL4hK7kqJL3H` (sha `50a86ce`, ref `main`), intacta. El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: ambas URLs responden **302 → `vercel.com/sso-api`** (verificado sin seguir redirects) y terminan en `vercel.com/login` (título "Login – Vercel"); **hace falta iniciar sesión en Vercel para ver la página**.
**Métrica esperada**: ↓ riesgo de que el horario vuelva a contradecirse en silencio. Hoy el sitio muestra un solo horario, pero el repo guardaba una segunda lista con el horario viejo; el próximo cambio de horarios habría tenido que acordarse de actualizarla también (y nadie lo hizo la primera vez, porque nadie la veía). Proxy medible: el número de representaciones del horario en `src/` (2 → **1**) y el de slots del modal que caen fuera del horario publicado (0 → **0**, se mantiene). En el usuario, **cero cambio visible**: la página publicada es idéntica antes y después de este commit.
**Estado**: 🔎 en revisión — pendiente de "publica"; build verde (`npm run build` exit 0, 19/19 páginas, 150 kB First Load JS sin cambios) con `NODE_OPTIONS=--max-old-space-size=1024`: la máquina tenía **788 MiB** libres, por debajo del gate de 2 GiB del cron, y el swap casi agotado (4093/4095 MiB). Se compiló con el tope de heap como mitigación (Pitfall 23) y el build salió verde al primer intento. Los ~1.7 GB de Chromium que presionan la RAM (dos procesos de 37 h y 62 h) pertenecen a sesiones ajenas vivas, así que **no se tocaron** (regla dura #5). Sin capturas: el Chromium del host no arranca por libs de sistema y el cron no puede usar sudo; la verificación fue sobre el HTML renderizado por el propio build de Next.
**Pendiente anotado** (no corregido hoy, siguen requiriendo decisión de Sebastián): el FAQ del JSON-LD dice "se recomienda un **mínimo de 10 sesiones**" mientras el artículo publicado `cuantas-sesiones-maderoterapia` da rangos por objetivo (10-15 reducir medidas, 12-18 celulitis, 1-2 al mes de mantenimiento); y ese mismo artículo afirma "**5 sesiones: Reducción de 1-3 cm**", la única cifra en centímetros de todo el repo, sin fuente publicada. Además, `src/lib/validation.ts` sigue siendo el sitio natural donde un futuro `BUSINESS_HOURS` podría reaparecer: si algún día se decide centralizar ahí, debe re-exportarse desde `@/src/data`, nunca hardcodearse.

---

## 2026-11-09 — La valoración de los testimonios por fin se anuncia

**Principio**: contenido no textual con nombre, rol y valor (WCAG 2.1 §1.1.1 y §4.1.2) — un icono decorativo debe ocultarse al lector de pantalla; una **valoración**, en cambio, es información: si no tiene nombre accesible, no existe para quien navega con lector de pantalla.
**Por qué**: auditoría de iconos del repo (los ítems #4 y #7 siguen bloqueados por material real). La corrida del 2026-10-26 ya había corregido el caso hermano —"controles de solo icono **sin** nombre accesible" (botones y enlaces)— pero dejó el caso simétrico: **iconos que sí deberían tener nombre, yaui iconos decorativos que se anuncian como ruido**. La causa raíz es técnica y verificable: los SVG de `lucide-react` v0.475.0 **no traen `role` ni `aria-hidden` por defecto** (verificado en `node_modules/lucide-react/dist/esm/defaultAttributes.js`: solo `xmlns`, `width`, `height`, `viewBox`, `fill`, `stroke`, `strokeWidth`, `strokeLinecap`, `strokeLinejoin`). Sin `aria-hidden="true"`, un lector de pantalla anuncia el `<svg>` como "gráfico" sin nombre.
El defecto con pérdida real de información estaba en las valoraciones: las 5 estrellas de cada testimonio (las 4 de `testimonials` en `src/data/index.ts`, todas con `rating: 5`) se renderizaban como **cinco SVG anónimos**, sin `role`, sin `aria-label` y sin `aria-hidden`. El lector de pantalla anunciaba "gráfico, gráfico, gráfico, gráfico, gráfico" y **el valor de la valoración se perdía por completo**: la clienta que navega con lector de pantalla no sabía si era una reseña de 5 estrellas o de 1. La estrella del bloque agregado "4.9/5" tenía el mismo problema.
**Cambios** (3 archivos, +21/-12 netas, **solo atributos ARIA — cero cambios visuales**):
- **`src/components/sections/Testimonials.tsx`**: el grupo de estrellas de cada testimonio pasa a `role="img"` + `aria-label={`Valoracion: ${testimonial.rating} de 5 estrellas`}` (el nombre se **deriva del dato publicado**, no se inventa), y las 5 estrellas de dentro quedan `aria-hidden="true"` (decorativas dentro de un grupo que ya tiene nombre). La `Quote` decorativa y la estrella del bloque agregado "4.9/5" —ahí el texto "4.9/5" ya lleva el valor— pasan a `aria-hidden="true"`.
- **`src/components/sections/ExpertProfile.tsx`**: `Award` (badge "10+"), `CheckCircle` (los 4 checks de la retícula) y `Quote` → `aria-hidden="true"`. En los tres casos el texto contiguo ya dice lo mismo, así que el icono es puro adorno.
- **`src/components/sections/Footer.tsx`**: `Sparkles`, `MapPin`, `Phone` y `Clock` → `aria-hidden="true"`. Los tres últimos **sí** tienen significado (marcan dirección, teléfono y horario), pero el dato ya está escrito justo al lado: el icono solo duplicaba la etiqueta y generaba ruido de announced.
**Medido** (sobre el HTML generado del build local, `.next/server/app/index.html`):
| | antes | después |
|---|---|---|
| grupos de valoración con `role="img"` + nombre accesible | **0** | **4** (`"Valoracion: 5 de 5 estrellas"`, uno por testimonio) |
| estrellas con `aria-hidden="true"` | 1 (la del hero con la prueba social) | **22** (20 de testimonios + hero + agregado "4.9/5") |
| `role="img"` en toda la landing | 0 | **4** |
| `Quote` decorativa sin `aria-hidden` | 2 (Testimonials + ExpertProfile) | **0** |
| iconos del footer sin `aria-hidden` (`MapPin`/`Phone`/`Clock`/`Sparkles`) | 4 | **0** |
| `CheckCircle` sin `aria-hidden` | 1 | **0** |
| páginas estáticas generadas | 19 | **19** |
| First Load JS | 150 kB | **150 kB** (sin cambios) |
Verificado que el HTML generado contiene los 4 `aria-label="Valoracion: 5 de 5 estrellas"` (el valor sale de `testimonial.rating`, o sea de `src/data/index.ts`), que **ningún** `<svg class="lucide…">` de estos tres archivos queda sin `aria-hidden` ni `role="img"`, y que `git diff --check` no reporta nada. `tsc --noEmit` limpio (exit 0). Cero cambios de texto, de datos de negocio, de clases CSS o de estructura: el diff es 100 % atributos ARIA.
**Rama**: mejora-diaria/2026-11-09 (base mejora-diaria/2026-11-08, commit `4901fa8`; `main` intacto en `50a86ce`) · commit `bc25e07`
**Preview**: https://spa-landing-git-mejora-diaria-2026-11-09-zegoqui-svgs-projects.vercel.app — deployment `dpl_N19azFj8q5o31Qvv2fXjPQvrLd4y` (SHA `bc25e07f892dd9acef41db40f656180e772d3add`, ref `mejora-diaria/2026-11-09`), estado **READY**, `target` = null (≠ production). Build en Vercel verificado por su log de API: `Compiled successfully`, `Generating static pages (19/19)`, **sin "Failed to compile"**. La producción de `spa-landing` sigue en `dpl_DTpxebR37GcaFjH2FL4hK7kqJL3H` (sha `50a86ce`, ref `main`), intacta — verificado además que producción sigue emitiendo el `og:image` viejo (`/images/hero.png`), o sea que **no se promovió nada**. El proyecto tiene `ssoProtection: {"deploymentType": "all_except_custom_domains"}`: la URL del preview responde **302 → `vercel.com/sso-api`** y termina en `vercel.com/login` (título "Login – Vercel"); **hace falta iniciar sesión en Vercel para ver la página**.
**Métrica esperada**: ↑ comprehension de la prueba social con lector de pantalla (la valoración pasa de ser inaudible a anunciar su valor). Proxy: ↓rolle de usuarios de lector de pantalla en la sección de testimonios y ↑ clic en "Reservar" originado ahí. Cualitativa hasta tener baseline de analítica por sección; el cambio no altera el render visual, así que cualquier delta de conversión es atribuible solo al nombre accesible.
**Estado**: 🔎 en revisión — pendiente de "publica"; build verde (`npm run build` exit 0, 19/19 páginas, 150 kB First Load JS sin cambios) con `NODE_OPTIONS=--max-old-space-size=1024`: la máquina tenía **1304 MiB** libres, por debajo del gate de 2 GiB del cron, y el swap **agotado** (4095/4095 MiB). Se compiló con el tope de heap como mitigación (Pitfall 23) y el build salió verde al primer intento. Los ~1.5 GB de Chromium que presionan la RAM (dos procesos de 4 días) y un `node` de 780 MB pertenecen a sesiones ajenas vivas, así que **no se tocaron** (regla dura #5). Sin capturas: el Chromium del host no arranca por libs de sistema y el cron no puede usar sudo; la verificación fue sobre el HTML renderizado por el propio build de Next.
**Pendiente anotado** (mismo patrón, en otros 4 archivos — queda para la próxima corrida): quedan **13 iconos** sin `aria-hidden` en `src/components/sections/Hero.tsx` (la estrella del badge "Centro Premium"), `src/components/sections/Services.tsx` (el `ArrowRight` de "Ver detalles", el `Calendar` del botón "Reservar Cita" y los 4 iconos dinámicos de las pestañas de categoría, que salen de `iconMap`), `src/components/StickyWhatsApp.tsx` (el `MessageCircle` de "Chatear ahora") y `src/components/ui/BookingModal.tsx` (10 iconos: `Check` del indicador de pasos, `Calendar`/`Clock`/`MessageCircle` del formulario, `Check`/`AlertCircle` de los estados de éxito y error, y el `Loader2` del estado "Guardando"). En este último hay dos casos que **no** son ruido y requieren un nombre propio: el `Loader2` (es el único indicador de "estamos guardando") y el `Check` del indicador de pasos (reemplaza al número del paso, así que el paso completado deja de anunciarse). Además, las pestañas de categoría de `Services.tsx` son botones que filtran contenido y **no** tienen `aria-pressed`, así que su estado activo no se anuncia: es un defecto de la misma familia, pero de otra corrida.
