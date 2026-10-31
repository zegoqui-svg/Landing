/**
 * Tokens de movimiento derivados de la skill `apple-design` (Emil Kowalski).
 *
 * La skill modela el muelle con dos parámetros:
 *   - `damping`  → cuánto rebota (1.0 = crítico, sin rebote)
 *   - `response` → cuánto tarda en asentarse (en segundos)
 *
 * Framer Motion expone esa misma pareja como `duration` + `bounce`
 * (`bounce` = 1 - damping). Estos tokens son la traducción directa de la
 * tabla "Concrete values Apple ships" de la skill:
 *
 *   | Interaction      | Damping | Response |
 *   | Move / reposition |  1.0   |   0.4    |
 *   | Drawer / sheet    |  0.8   |   0.3    |
 *
 * Nota: `duration` está en SEGUNDOS (no milisegundos) en la API pública
 * de Framer Motion v11; verificado empíricamente contra el generador.
 */

import type { Transition } from 'framer-motion';

/**
 * Muelle por defecto de la interfaz: amortiguado crítico, sin rebote.
 * Es lo que la skill recomienda para "casi todo" (§4: "Start most UI at
 * damping 1.0"). Move / reposition: damping 1.0, response 0.4.
 */
export const SPRING_UI: Transition = {
  type: 'spring',
  duration: 0.4,
  bounce: 0,
};

/**
 * Muelle de superficie (hoja, panel): un punto de rebote, porque sí
 * viene de un gesto con momento. Drawer / sheet: damping 0.8, response 0.3.
 */
export const SPRING_SHEET: Transition = {
  type: 'spring',
  duration: 0.3,
  bounce: 0.2,
};

/**
 * Muelle rápido para cambios pequeños (iconos, chips, estados).
 * Amortiguado crítico y respuesta más corta.
 */
export const SPRING_SNAP: Transition = {
  type: 'spring',
  duration: 0.25,
  bounce: 0,
};

/**
 * Curva de salida equivalente a un muelle crítico, para CSS puro.
 * Se usa donde Framer Motion no aplica (p. ej. `transition` en CSS).
 */
export const EASE_SPRING = [0.32, 0.72, 0, 1] as const;
