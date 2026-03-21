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

export const BUSINESS_HOURS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM'
];
