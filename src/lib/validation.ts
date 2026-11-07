import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es muy largo'),
  
  email: z.string()
    .email('Ingresa un email válido')
    .optional()
    .or(z.literal('')),
  
  phone: z.string()
    .min(10, 'El teléfono debe tener 10 dígitos')
    .max(15, 'Número de teléfono inválido')
    .regex(/^[0-9+\-\s()]+$/, 'Número de teléfono inválido'),
  
  service: z.string()
    .min(1, 'Selecciona un servicio'),
  
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  notes: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/*
 * El horario de SILUEL NO se define aqui. La fuente unica es
 * `businessHours` / `businessHoursSummary` en `src/data/index.ts`, que el
 * modal de reserva, el JSON-LD y el footer ya leen.
 *
 * Antes este archivo exportaba una lista fija `BUSINESS_HOURS`
 * (10:00 AM - 7:00 PM, igual todos los dias) que contradecía al horario
 * publicado: ofrecia una hora despues del cierre del sabado y ocultaba la
 * apertura de las 9:00 AM. Se elimino al pasar el modal a `businessHours`
 * (2026-11-01), pero el export huerfano se quedo en el repo y seguia
 * contradiciendo a la fuente unica para el proximo que lo importara.
 * Si necesitas el horario, importalo de `@/src/data`.
 */
