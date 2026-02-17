export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: 'corporal' | 'recovery' | 'facial' | 'masajes';
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  image: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
}