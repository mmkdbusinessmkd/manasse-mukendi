import { WEBSITE_SERVICE } from './contact-request';

export const portfolioFilters = [
  { id: 'selection', label: 'La sélection' },
  { id: 'social', label: 'Réseaux sociaux' },
  { id: 'strategy', label: 'Stratégie' },
  { id: 'web', label: 'Web & solutions' },
] as const;
export type PortfolioFilter = typeof portfolioFilters[number]['id'];
type ProjectCategory = { type: string; website?: string };

export function matchesProjectFilter(project: ProjectCategory, filter: PortfolioFilter) {
  if (filter === 'social') return project.type === 'Social Media';
  if (filter === 'strategy') return project.type === 'Stratégie digitale';
  if (filter === 'web') return Boolean(project.website);
  return true;
}

export function isProjectVisible(project: ProjectCategory, index: number, filter: PortfolioFilter, expanded: boolean) {
  return matchesProjectFilter(project, filter) && (filter !== 'selection' || expanded || index < 4);
}

export function projectService(project: ProjectCategory) {
  if (project.website) return WEBSITE_SERVICE;
  if (project.type === 'Stratégie digitale') return 'Stratégie digitale';
  if (project.type === 'Publicité') return 'Publicité digitale';
  if (project.type === 'Social Media') return 'Création de contenu';
  return 'Communication de marque';
}
