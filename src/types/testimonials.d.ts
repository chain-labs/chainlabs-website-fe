export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  rating?: number
  featured?: boolean
}

export interface TestimonialCardProps {
  testimonial: Testimonial
  className?: string
}

export interface ScrollingCarouselProps {
  testimonials: Testimonial[]
  speed?: 'slow' | 'normal' | 'fast'
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
}