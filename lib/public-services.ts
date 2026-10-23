import { WEBSITE_SERVICE } from './contact-request';

// The visible services and the search-engine catalogue use the same content.
export const services = [
  ["01", "Social Media Management", "Confiez vos réseaux sociaux à un interlocuteur qui relie chaque publication à vos objectifs. Je planifie les contenus, pilote leur diffusion et suis les performances pour ajuster votre communication."],
  ["02", "Stratégie digitale", "Sachez quoi dire, à qui et sur quels canaux. Je définis une direction et des priorités pour concentrer vos efforts sur les actions utiles à votre entreprise."],
  ["03", "Communication de marque", "Aidez vos clients à comprendre ce que vous faites et ce qui vous distingue. Je travaille vos messages, votre ton et la cohérence de vos prises de parole."],
  ["04", "Création de contenu", "Donnez à votre audience une raison de s’intéresser à votre offre. Je transforme votre savoir-faire, vos services et vos actualités en textes et visuels adaptés à vos canaux."],
  ["05", "Publicité digitale", "Faites connaître votre offre auprès des publics que vous souhaitez toucher. Je conçois et suis vos campagnes selon un objectif défini, un budget convenu et des indicateurs de performance."],
  ["06", WEBSITE_SERVICE, "Présentez votre activité, développez votre présence en ligne et simplifiez votre quotidien. Je conçois des sites vitrines, des boutiques en ligne et des espaces de gestion adaptés à vos besoins, en m’appuyant sur des outils d’intelligence artificielle."],
] as const;

export function serviceAnchor(number: string) { return `service-${number}`; }
