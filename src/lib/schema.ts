// JSON-LD builders. Everything comes from content/site.json and the collections; nothing is typed twice.
import { site, absoluteUrl } from './site';
import { plain } from './placeholder';

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;
const PERSON_ID = `${site.url}/#founder`;

type Node = Record<string, unknown>;
export type Crumb = { name: string; path: string };

const sameAs = [site.founder.linkedin, site.linkedinCompany].filter(Boolean);

export function baseGraph(): Node[] {
  return [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': ORG_ID,
      name: site.name,
      legalName: site.legalName,
      url: `${site.url}/`,
      logo: `${site.url}/logo.png`,
      image: `${site.url}/logo.png`,
      description: site.description,
      email: site.email,
      telephone: site.phone.replace(/\s/g, ''),
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.address.locality,
        addressRegion: site.address.region,
        addressCountry: site.address.country,
      },
      areaServed: 'Worldwide',
      founder: { '@id': PERSON_ID },
      sameAs: site.linkedinCompany ? [site.linkedinCompany] : [site.founder.linkedin],
    },
    {
      '@type': 'WebSite',
      '@id': SITE_ID,
      url: `${site.url}/`,
      name: site.name,
      inLanguage: 'en-IN',
      publisher: { '@id': ORG_ID },
    },
  ];
}

export function personNode(image: string): Node {
  const f = site.founder;
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: f.name,
    jobTitle: f.jobTitle,
    worksFor: { '@id': ORG_ID },
    image,
    url: absoluteUrl('/about'),
    sameAs,
    knowsAbout: f.expertise,
    address: { '@type': 'PostalAddress', addressLocality: site.address.locality, addressCountry: site.address.country },
  };
}

export function breadcrumbNode(crumbs: Crumb[]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function serviceNode(opts: { name: string; description: string; serviceType: string; path: string }): Node {
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(opts.path)}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: plain(opts.description),
    url: absoluteUrl(opts.path),
    provider: { '@id': ORG_ID },
    areaServed: 'Worldwide',
  };
}

export function faqNode(items: { q: string; a: string }[]): Node {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: plain(i.a) },
    })),
  };
}

export function articleNode(opts: { headline: string; description: string; path: string; image: string }): Node {
  return {
    '@type': 'Article',
    headline: opts.headline,
    description: plain(opts.description),
    url: absoluteUrl(opts.path),
    mainEntityOfPage: absoluteUrl(opts.path),
    image: opts.image,
    inLanguage: 'en-IN',
    author: { '@id': PERSON_ID, '@type': 'Person', name: site.founder.name },
    publisher: { '@id': ORG_ID },
  };
}

export function graph(extra: Node[] = [], withPerson?: string): Node {
  // Person is always referenced by @id from Organization.founder; define it fully on Home and About only.
  const person = withPerson
    ? personNode(withPerson)
    : { '@type': 'Person', '@id': PERSON_ID, name: site.founder.name, sameAs };
  return { '@context': 'https://schema.org', '@graph': [...baseGraph(), person, ...extra] };
}
