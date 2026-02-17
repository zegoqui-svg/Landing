# SILUEL Spa - Landing Page

Landing page profesional para spa de belleza y bienestar con sistema de reservas integrado.

## Caracteristicas

- **Diseño Responsive**: Mobile-first, se adapta a todos los dispositivos
- **Calendario de Reservas**: Integracion con Koalendar sincronizado a Google Calendar
- **WhatsApp Sticky**: Boton flotante para contacto directo
- **Animaciones**: Transiciones suaves con Framer Motion
- **SEO Optimizado**: Meta tags y estructura semantica

## Secciones

1. **Hero**: Imagen atractiva, headline principal, CTAs
2. **Conoce a la Experta**: Perfil de Elsa Gomez con filosofia
3. **Servicios**: 3 categorias con tarjetas interactivas
   - Escultura Corporal (Maderoterapia, Gluteos, Colombianas)
   - Recuperacion (Post-operatorio, Drenaje Linfatico)
   - Piel y Bienestar (Faciales, Masajes)
4. **Testimonios**: Cards con reseñas de clientes
5. **Footer**: Contacto, horarios, redes sociales

## Flujo de Reserva

1. Usuario hace click en "Agendar" en un servicio
2. Modal muestra detalles del servicio
3. Click "Continuar al Calendario"
4. Koalendar embebido muestra disponibilidad real
5. Usuario selecciona fecha/hora e ingresa datos
6. Koalendar crea evento en Google Calendar del spa
7. Dueño recibe notificacion por email

## Configuracion Koalendar

Antes de usar, debes:

1. Crear cuenta en [koalendar.com](https://koalendar.com) (gratis)
2. Conectar tu Google Calendar
3. Configurar tus servicios y horarios
4. Obtener tu URL de reserva (ej: `koalendar.com/e/tu-negocio`)
5. Reemplazar en `BookingModal.tsx`:
   ```typescript
   const koalendarUrl = 'https://koalendar.com/e/tu-negocio';
   ```

## Instalacion

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Construir para produccion
npm run build
```

## Estructura del Proyecto

```
spa-landing/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/
│   │   ├── sections/        # Hero, Services, Testimonials, etc.
│   │   ├── ui/              # Button, Card, Modal, BookingModal
│   │   └── StickyWhatsApp.tsx
│   ├── data/                # Servicios, testimonios, datos
│   └── types/               # TypeScript interfaces
├── public/                  # Imagenes estaticas
└── config files
```

## Personalizacion

### Colores
Editar `tailwind.config.ts`:
```typescript
colors: {
  'siluel': {
    'sand': '#E8DCC4',       // Fondo claro
    'terracotta': '#C17767', // Acento principal
    'sage': '#7D8A74',       // Verde
    'dark': '#3D3D3D',       // Texto
  }
}
```

### Imagenes
Reemplazar URLs en `src/data/index.ts` con tus propias imagenes.

### WhatsApp
Editar numero en `src/data/index.ts`:
```typescript
export const whatsappNumber = '523339657478';
```

## Stack Tecnologico

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React (iconos)

## Proximos Pasos

- [ ] Reemplazar imagenes placeholder por fotos reales
- [ ] Configurar Koalendar con cuenta del negocio
- [ ] Agregar formulario de newsletter
- [ ] Integrar Google Analytics
- [ ] Optimizar imagenes para carga rapida

## Soporte

Para dudas o soporte, contactar a traves de WhatsApp o email.

---

Desarrollado con ❤️ para SILUEL Spa