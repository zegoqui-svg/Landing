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
    image: '/images/masaje-reductivo.jpg',
  },
  {
    id: 'maderoterapia',
    name: 'Maderoterapia',
    description: 'Técnica ancestral con implementos de madera para modelar tu cuerpo, reducir medidas y eliminar celulitis de forma natural.',
    price: '',
    duration: '',
    category: 'corporal',
    image: '/images/maderoterapia.png',
  },
  {
    id: 'levantamiento-gluteos',
    name: 'Levantamiento de Glúteos',
    description: 'Técnicas especializadas de vacumterapia y masaje para realzar, tonificar y levantar la zona glútea.',
    price: '',
    duration: '',
    category: 'corporal',
    image: '/images/levantamiento-gluteos.jpg',
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
    image: '/images/post-operatorio.jpg',
  },
  {
    id: 'drenaje-linfatico',
    name: 'Drenaje Linfático',
    description: 'Estimulación del sistema linfático para reducir inflamación, eliminar toxinas y mejorar la circulación.',
    price: '',
    duration: '',
    category: 'recovery',
    image: '/images/drenaje-linfatico.jpg',
  },
  {
    id: 'faciales',
    name: 'Faciales según tipo de piel',
    description: 'Tratamientos faciales completamente personalizados según las necesidades específicas de tu tipo de piel.',
    price: '',
    duration: '',
    category: 'facial',
    image: '/images/facial.jpg',
  },
  {
    id: 'masaje-relajante',
    name: 'Relajante',
    description: 'Masaje suave y envolvente que alivia tensiones y estrés, promoviendo un estado profundo de relajación.',
    price: '',
    duration: '',
    category: 'masajes',
    image: '/images/masaje-relajante.png',
  },
  {
    id: 'masaje-descontracturante',
    name: 'Descontracturante',
    description: 'Masaje de presión media a fuerte enfocado en aliviar contracturas musculares, dolor crónico y tensión acumulada.',
    price: '',
    duration: '',
    category: 'masajes',
    image: '/images/masaje-descontracturante.png',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ana García',
    rating: 5,
    comment: 'La maderoterapia de SILUEL me cambió la vida. En solo 5 sesiones noté una diferencia increíble en mis medidas. Elsa es una profesional excepcional.',
    image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=400',
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
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '4',
    name: 'Sandra Martínez',
    rating: 5,
    comment: 'Me encanta el ambiente tan cálido y profesional. Los masajes descontracturantes me ayudan mucho con el estrés del trabajo. ¡Totalmente recomendada!',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?auto=format&fit=crop&q=80&w=400',
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