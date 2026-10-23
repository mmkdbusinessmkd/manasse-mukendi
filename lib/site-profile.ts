import { services, serviceAnchor } from './public-services';

export const SITE_URL = 'https://www.manasse-mukendi.com';
export const PROFILE_IMAGE = '/images/manasse-portrait-2026.png';
export const PROFILE_TITLE = 'Consultant en marketing et communication digitale';
export const SITE_TITLE = 'Manassé Mukendi / Marketing et Communication Digitale';
export const SITE_DESCRIPTION = 'Manassé Mukendi, consultant en marketing et communication digitale : stratégie, réseaux sociaux, contenus et création web, en RDC et à l’international.';

// The owner, the page and its representative image share explicit identities.
export const profileStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person', '@id': `${SITE_URL}/#manasse-mukendi`,
      name: 'Manassé Mukendi', jobTitle: PROFILE_TITLE, url: `${SITE_URL}/`,
      description: SITE_DESCRIPTION,
      image: { '@id': `${SITE_URL}/#portrait` },
      knowsAbout: ['Marketing digital', 'Stratégie de communication', 'Gestion des réseaux sociaux', 'Création de contenus', 'Publicité digitale', 'Création de sites web assistée par IA'],
      hasOfferCatalog: { '@id': `${SITE_URL}/#catalogue-services` },
      contactPoint: { '@type': 'ContactPoint', contactType: 'Demandes de projet', url: `${SITE_URL}/#contact`, availableLanguage: ['fr'] },
      sameAs: [
        'https://www.linkedin.com/in/manass%C3%A9-mukendi-75412b295/',
        'https://www.instagram.com/sir_manasse_mukendi/',
        'https://www.facebook.com/manasse.mkd',
      ],
    },
    {
      '@type': 'ImageObject', '@id': `${SITE_URL}/#portrait`,
      url: `${SITE_URL}${PROFILE_IMAGE}`, contentUrl: `${SITE_URL}${PROFILE_IMAGE}`,
      width: 1086, height: 1448,
      caption: 'Manassé Mukendi, consultant en marketing et communication digitale',
      about: { '@id': `${SITE_URL}/#manasse-mukendi` },
      representativeOfPage: true,
    },
    {
      '@type': 'WebSite', '@id': `${SITE_URL}/#website`,
      name: 'Manassé Mukendi', alternateName: 'Manasse Mukendi', url: `${SITE_URL}/`, inLanguage: 'fr',
      publisher: { '@id': `${SITE_URL}/#manasse-mukendi` },
    },
    {
      '@type': 'ProfilePage', '@id': `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`, name: SITE_TITLE, description: SITE_DESCRIPTION,
      inLanguage: 'fr', isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: { '@id': `${SITE_URL}/#manasse-mukendi` },
      primaryImageOfPage: { '@id': `${SITE_URL}/#portrait` },
    },
    {
      '@type': 'OfferCatalog', '@id': `${SITE_URL}/#catalogue-services`,
      name: 'Marketing, communication digitale et création web',
      itemListElement: services.map(([number]) => ({
        '@type': 'Offer', itemOffered: { '@id': `${SITE_URL}/#${serviceAnchor(number)}` },
      })),
    },
    ...services.map(([number, name, description]) => ({
      '@type': 'Service', '@id': `${SITE_URL}/#${serviceAnchor(number)}`,
      url: `${SITE_URL}/#${serviceAnchor(number)}`, name, description,
      serviceType: number === '01' ? 'Gestion des réseaux sociaux (Social Media Management)' : name,
      provider: { '@id': `${SITE_URL}/#manasse-mukendi` },
      areaServed: 'RDC et international',
      audience: { '@type': 'Audience', audienceType: 'Entreprises, institutions et marques personnelles' },
      availableChannel: { '@type': 'ServiceChannel', serviceUrl: `${SITE_URL}/#contact`, availableLanguage: ['fr'] },
    })),
  ],
};
