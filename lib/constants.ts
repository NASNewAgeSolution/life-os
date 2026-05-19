import type { Section, SectionId } from '@/types'

export const SECTIONS: Record<SectionId, Section> = {
  work: {
    id: 'work',
    label: 'Work',
    icon: '💼',
    color: '#60a5fa',
    bgColor: 'rgba(96, 165, 250, 0.08)',
    borderColor: 'rgba(96, 165, 250, 0.25)',
    gradient: 'from-blue-500/20 to-blue-600/5',
    identityPrefix: 'I am a focused, high-performing professional who',
  },
  health: {
    id: 'health',
    label: 'Health',
    icon: '💚',
    color: '#34d399',
    bgColor: 'rgba(52, 211, 153, 0.08)',
    borderColor: 'rgba(52, 211, 153, 0.25)',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
    identityPrefix: 'I am a healthy, energetic person who',
  },
  finance: {
    id: 'finance',
    label: 'Finance',
    icon: '💰',
    color: '#fbbf24',
    bgColor: 'rgba(251, 191, 36, 0.08)',
    borderColor: 'rgba(251, 191, 36, 0.25)',
    gradient: 'from-amber-500/20 to-amber-600/5',
    identityPrefix: 'I am a financially disciplined person who',
  },
  family: {
    id: 'family',
    label: 'Family',
    icon: '👨‍👩‍👧',
    color: '#c084fc',
    bgColor: 'rgba(192, 132, 252, 0.08)',
    borderColor: 'rgba(192, 132, 252, 0.25)',
    gradient: 'from-purple-500/20 to-purple-600/5',
    identityPrefix: 'I am a loving, present family member who',
  },
  education: {
    id: 'education',
    label: 'Education',
    icon: '📚',
    color: '#22d3ee',
    bgColor: 'rgba(34, 211, 238, 0.08)',
    borderColor: 'rgba(34, 211, 238, 0.25)',
    gradient: 'from-cyan-500/20 to-cyan-600/5',
    identityPrefix: 'I am a lifelong learner who',
  },
  business: {
    id: 'business',
    label: 'Business',
    icon: '🚀',
    color: '#fb923c',
    bgColor: 'rgba(251, 146, 60, 0.08)',
    borderColor: 'rgba(251, 146, 60, 0.25)',
    gradient: 'from-orange-500/20 to-orange-600/5',
    identityPrefix: 'I am an entrepreneurial builder who',
  },
}

export const SECTION_ORDER: SectionId[] = ['work', 'health', 'finance', 'family', 'education', 'business']

export const ATOMIC_HABITS_QUOTES = [
  "You do not rise to the level of your goals. You fall to the level of your systems.",
  "Every action you take is a vote for the type of person you wish to become.",
  "Habits are the compound interest of self-improvement.",
  "The most effective form of learning is practice, not planning.",
  "Success is the product of daily habits—not once-in-a-lifetime transformations.",
  "The secret to getting results that last is to never stop making improvements.",
  "Small habits don't add up, they compound.",
  "You should be far more concerned with your current trajectory than your current results.",
  "Make it obvious. Make it attractive. Make it easy. Make it satisfying.",
  "The best way to change who you are is to change what you do.",
  "Winners and losers have the same goals. Systems separate them.",
  "Fall in love with the process, not the outcome.",
]

export const MOOD_OPTIONS = [
  { value: 'excellent', label: 'Excellent', emoji: '🔥', color: '#34d399' },
  { value: 'good', label: 'Good', emoji: '😊', color: '#60a5fa' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: '#fbbf24' },
  { value: 'bad', label: 'Bad', emoji: '😔', color: '#f87171' },
]

export const ONE_PERCENT_YEAR = Math.pow(1.01, 365).toFixed(1) // 37.8x
export const ONE_PERCENT_MONTH = Math.pow(1.01, 30).toFixed(2) // 1.35x
