export const SITE_URL = 'https://www.manasse-mukendi.com';
export const PROFILE_IMAGE = '/images/manasse-portrait-2026.png';
export const PROFILE_TITLE = 'Consultant en marketing et communication digitale';

// The owner, the page and its representative image share explicit identities.
export const profileStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person', '@id': `${SITE_URL}/#manasse-mukendi`,
      name: 'Manassé Mukendi', jobTitle: PROFILE_TITLE, url: `${SITE_URL}/`,
      image: { '@id': `${SITE_URL}/#portrait` },
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
      name: 'Manassé Mukendi', url: `${SITE_URL}/`, inLanguage: 'fr',
      publisher: { '@id': `${SITE_URL}/#manasse-mukendi` },
    },
    {
      '@type': 'ProfilePage', '@id': `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`, name: 'Manassé Mukendi / Marketing et Communication Digitale',
      inLanguage: 'fr', isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: { '@id': `${SITE_URL}/#manasse-mukendi` },
      primaryImageOfPage: { '@id': `${SITE_URL}/#portrait` },
    },
  ],
};
