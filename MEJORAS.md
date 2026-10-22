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
