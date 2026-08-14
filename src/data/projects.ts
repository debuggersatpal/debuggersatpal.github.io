export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
  brandColor?: string;
  icon?: string;
  iconImage?: string;
  fallbackText?: string;
}

export const techBadgeColors: Record<string, string> = {
  'Next.js': '#111827',
  'TMDB API': '#032541',
  'Flutter': '#027DFD',
  'Firebase': '#F57C00',
  'Android': '#34A853',
  'Kotlin': '#7F52FF',
  'TypeScript': '#3178C6',
  'Tailwind': '#0EA5E9',
};

export const filterCategories = ['All', 'Web Apps', 'Mobile Apps', 'Tools', 'AI / ML', 'Systems'];

export const projects: Project[] = [
  {
    id: 'moviebase',
    title: 'Moviebase',
    description: 'Discover movies, search, save to watchlist and get details.',
    category: 'Web Apps',
    techStack: ['Next.js', 'TMDB API'],
    brandColor: '#111827',
    fallbackText: 'M',
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: 'resubs',
    title: 'ReSubs',
    description: 'Track and manage recurring subscriptions in one place.',
    category: 'Mobile Apps',
    techStack: ['Flutter', 'Firebase'],
    brandColor: '#3B82F6',
    fallbackText: 'R',
    icon: 'resubs',
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: 'momental',
    title: 'Momental',
    description: 'A meditation and sleep app with custom sounds and tracking.',
    category: 'Mobile Apps',
    techStack: ['Android', 'Kotlin'],
    brandColor: '#1E1B4B',
    fallbackText: 'C',
    icon: 'momental',
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: 'mindtime',
    title: 'MindTime',
    description: 'A simple and pure meditation timer with insights and tracking.',
    category: 'Mobile Apps',
    techStack: ['Android', 'Kotlin'],
    brandColor: '#000000',
    fallbackText: 'MT',
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: 'streamguide',
    title: 'StreamGuide',
    description: 'Find what to watch across your streaming services.',
    category: 'Web Apps',
    techStack: ['TypeScript', 'TMDB API'],
    brandColor: '#F59E0B',
    fallbackText: 'S',
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    description: 'A modern analytics dashboard for business metrics.',
    category: 'Web Apps',
    techStack: ['Next.js', 'Tailwind'],
    brandColor: '#312E81',
    fallbackText: 'AD',
    icon: 'analytics',
    demoUrl: '#',
    githubUrl: '#'
  }
];