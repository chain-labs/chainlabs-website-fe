export interface CaseStudyCard {
  title: string
  description: string
  src: string
  logo: string
  logoAlt: string
  ctaText: string
  ctaLink: string
  content: () => React.ReactNode
}

export interface CaseStudyState {
  active: CaseStudyCard | boolean | null
}

export interface CaseStudyActions {
  setActive: (card: CaseStudyCard | boolean | null) => void
}

export interface CaseStudyChallenge {
  title: string
  description: string
}

export interface CaseStudySolution {
  title: string
  description: string
}

export interface CaseStudyResults {
  title: string
  metrics: string[]
}

export interface CaseStudyContent {
  overview: string
  challenge: CaseStudyChallenge
  solution: CaseStudySolution
  results: CaseStudyResults
}