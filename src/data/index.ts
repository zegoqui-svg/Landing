import { Service, Testimonial, ServiceCategory } from '@/src/types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'corporal',
    title: 'Corporales',
    description: 'Tratamientos especializados para esculpir y modelar tu silueta',
    icon: 'Sparkles',
  },
  {
    id: 'recovery',
    title: 'Recuperación',
    description: 'Cuidado especializado post-operatorio y drenaje linfático',
    icon: 'Heart',
  },
  {
    id: 'facial',
    title: 'Faciales',
    description: 'Tratamientos faciales personalizados según tu tipo de piel',
    icon: 'Sparkle',
  },
  {
    id: 'masajes',
    title: 'Masajes',
    description: 'Masajes terapéuticos para relajación y bienestar',
    icon: 'Flower2',
  },
];

// ... (commented driveImages remains same)

// Local Images - Please place corresponding images in public/images/ folder
const localImages = {
  masajes: '/images/masajes.jpg',
  corporales: '/images/corporales.jpg',
  faciales: '/images/faciales.jpg',
  recovery: '/images/recovery.jpg',
  elsa: '/images/elsa.png',
  hero: '/images/hero.png',
  logo: '/images/logo.png',
};

const images = localImages; // Use local images by default

export const services: Service[] = [
  {
    id: 'reductivos',
    name: 'Reductivos',
    description: 'Tratamiento corporal enfocado en reducir medidas y moldear la silueta mediante técnicas especializadas de masaje.',
    price: '',
    duration: '',
    category: 'corporal',
    image: 'https://images.unsplash.com/photo-1544161515-4af6b1d46bdc?auto=format&fit=crop&q=80&w=800', // Hands on body treatment
  },
  {
    id: 'maderoterapia',
    name: 'Maderoterapia',
    description: 'Técnica ancestral con implementos de madera para modelar tu cuerpo, reducir medidas y eliminar celulitis de forma natural.',
    price: '',
    duration: '',
    category: 'corporal',
    image: 'https://images.unsplash.com/photo-1661780447153-f72566786a34?auto=format&fit=crop&q=80&w=800', // Actual wooden massage tools (Getty)
  },
  {
    id: 'levantamiento-gluteos',
    name: 'Levantamiento de Glúteos',
    description: 'Técnicas especializadas de vacumterapia y masaje para realzar, tonificar y levantar la zona glútea.',
    price: '',
    duration: '',
    category: 'corporal',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=800', // Clinical aesthetic environment
  },
  {
    id: 'tecnicas-colombianas',
    name: 'Técnicas Colombianas',
    description: 'Métodos colombianos de moldeado corporal que combinan diferentes técnicas para resultados visibles y duraderos.',
    price: '',
    duration: '',
    category: 'corporal',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800', // Professional body shaping
  },
  {
    id: 'post-operatorio',
    name: 'Post-operatorio',
    description: 'Cuidado especializado para recuperación rápida y segura después de cirugías estéticas, con técnicas suaves y efectivas.',
    price: '',
    duration: '',
    category: 'recovery',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800', // Clinic treatment room
  },
  {
    id: 'drenaje-linfatico',
    name: 'Drenaje Linfático',
    description: 'Estimulación del sistema linfático para reducir inflamación, eliminar toxinas y mejorar la circulación.',
    price: '',
    duration: '',
    category: 'recovery',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=800', // Gentle medical massage style
  },
  {
    id: 'faciales',
    name: 'Faciales según tipo de piel',
    description: 'Tratamientos faciales completamente personalizados según las necesidades específicas de tu tipo de piel.',
    price: '',
    duration: '',
    category: 'facial',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800', // Facial mask application
  },
  {
    id: 'masaje-relajante',
    name: 'Relajante',
    description: 'Masaje suave y envolvente que alivia tensiones y estrés, promoviendo un estado profundo de relajación.',
    price: '',
    duration: '',
    category: 'masajes',
    image: 'https://images.unsplash.com/photo-1626509653295-474378414212?auto=format&fit=crop&q=80&w=800', // Relaxing atmosphere
  },
  {
    id: 'masaje-descontracturante',
    name: 'Descontracturante',
    description: 'Masaje de presión media a fuerte enfocado en aliviar contracturas musculares, dolor crónico y tensión acumulada.',
    price: '',
    duration: '',
    category: 'masajes',
    image: 'https://images.unsplash.com/photo-1519415510271-e62b4d7598db?auto=format&fit=crop&q=80&w=800', // Trigger point pressure massage
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ana García',
    rating: 5,
    comment: 'La maderoterapia de SILUEL me cambió la vida. En solo 5 sesiones noté una diferencia increíble en mis medidas. Elsa es una profesional excepcional.',
    image: 'https://images.unsplash.com/photo-1590642916589-592bca10dfbf?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    name: 'Patricia Hernández',
    rating: 5,
    comment: 'Después de mi cirugía, el drenaje linfático en SILUEL fue fundamental para mi recuperación. El ambiente es muy relajante y el trato es excelente.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '3',
    name: 'Claudia López',
    rating: 5,
    comment: 'Los faciales son increíbles. Mi piel nunca se había visto tan luminosa. Además, la facilidad para agendar cita por WhatsApp es muy práctica.',
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '4',
    name: 'Sandra Martínez',
    rating: 5,
    comment: 'Me encanta el ambiente tan cálido y profesional. Los masajes descontracturantes me ayudan mucho con el estrés del trabajo. ¡Totalmente recomendada!',
    image: 'https://images.unsplash.com/photo-1563178430-f604ec20387d?auto=format&fit=crop&q=80&w=400',
  },
];

export const whatsappNumber = '523339657478';

export const businessInfo = {
  name: 'SILUEL',
  fullName: 'SILUEL Centro de Terapia y Masaje',
  address: 'Plan de Ayala 1859 INT 28',
  city: 'Guadalajara, Jalisco, México',
  phone: '33 3965 7478',
  email: 'gomezelsa806@gmail.com',
  facebookUrl: 'https://www.facebook.com/profile.php?id=100091949245186',
  instagramUrl: 'https://www.instagram.com/siluel_guadalajara/', // Placeholder based on brand
};

export const expertInfo = {
  name: 'Elsa Gómez',
  title: 'Cosmetóloga & Fundadora',
  bio: 'Cosmetóloga profesional con más de 10 años de experiencia en estética corporal y facial. Especialista en maderoterapia, drenaje linfático, tratamientos post-operatorios y técnicas colombianas. Su enfoque combina el arte de la relajación con resultados visibles y duraderos.',
  philosophy: '"Elige sentirte bien, por dentro y por fuera. Cada tratamiento es una experiencia de renovación personalizada para armonizar cuerpo y mente."',
  image: localImages.elsa,
};

export const heroImage = localImages.hero;
export const logoImage = localImages.logo;