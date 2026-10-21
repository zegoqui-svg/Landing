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
