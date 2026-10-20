import { z } from 'zod';
import { SHOW_PILOT_PROGRAM, PILOT_PROGRAM_OPTION } from './pilot-program';

export const WEBSITE_SERVICE = 'Création de sites & solutions digitales';
export const requestServices = ['J’ai besoin de conseils pour choisir', 'Social Media Management', 'Stratégie digitale', 'Communication de marque', 'Création de contenu', 'Publicité digitale', WEBSITE_SERVICE];
export const requestStatuses = { nouveau: 'Nouvelle', en_cours: 'En cours', contacte: 'Contact pris', archive: 'Archivée' } as const;
export type RequestStatus = keyof typeof requestStatuses;
const short = (max: number) => z.string().trim().max(max).default('');
export function normalizePhone(value: string) {
  const compact = value.replace(/[\s().-]/g, '').replace(/^00/, '+');
  return /^\+[1-9]\d{7,14}$/.test(compact) ? compact : '';
}
export const requestSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().max(254).email().transform(v => v.toLowerCase()),
  phone: z.string().max(40).transform(normalizePhone).refine(Boolean, 'Indiquez votre numéro avec son indicatif pays, par exemple +243…'),
  service: z.string().refine(v => requestServices.includes(v) || (SHOW_PILOT_PROGRAM && v === PILOT_PROGRAM_OPTION)),
  message: short(5000),
  entreprise: short(160), secteur: short(160), site_ou_reseaux: short(1000),
  probleme_communication: short(3000), motivation_programme: short(3000),
}).superRefine((v, ctx) => {
  const required = v.service === PILOT_PROGRAM_OPTION
    ? ['entreprise', 'secteur', 'probleme_communication', 'motivation_programme'] as const
    : ['message'] as const;
  for (const key of required) if (!v[key]) ctx.addIssue({ code: 'custom', path: [key], message: 'Ce champ est obligatoire.' });
}).transform(v => v.service === PILOT_PROGRAM_OPTION ? v : { ...v, entreprise: '', secteur: '', site_ou_reseaux: '', probleme_communication: '', motivation_programme: '' });
export type ContactRequest = z.output<typeof requestSchema>;
export const requestLabels: Record<keyof ContactRequest, string> = {
  name: 'Nom', email: 'E-mail', phone: 'Téléphone / WhatsApp', service: 'Accompagnement', message: 'Votre projet',
  entreprise: 'Entreprise', secteur: 'Secteur d’activité', site_ou_reseaux: 'Site ou réseaux sociaux',
  probleme_communication: 'Problème de communication', motivation_programme: 'Motivation',
};
export function replyLinks(request: Pick<ContactRequest, 'name' | 'email' | 'phone' | 'service'>) {
  const text = `Bonjour ${request.name},\n\nMerci pour votre demande concernant « ${request.service} ». Je suis Manassé Mukendi. Quand seriez-vous disponible pour en discuter ?\n\nBien à vous,\nManassé Mukendi`;
  return {
    email: `mailto:${encodeURIComponent(request.email)}?subject=${encodeURIComponent('Votre demande — Manassé Mukendi')}&body=${encodeURIComponent(text)}`,
    whatsapp: normalizePhone(request.phone) ? `https://wa.me/${normalizePhone(request.phone).slice(1)}?text=${encodeURIComponent(text)}` : null,
  };
}
