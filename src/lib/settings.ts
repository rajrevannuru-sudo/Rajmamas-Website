// Analytics / search-console integrations from content/settings.json (edited in the CMS).
// Every value is pattern-checked so nothing other than a plain ID can reach the page.
import raw from '../../content/settings.json';

export const integrationFields = [
  { key: 'googleSiteVerification', label: 'Google Search Console verification', pattern: /^[A-Za-z0-9_-]{10,100}$/, example: 'abc123XYZ…' },
  { key: 'ga4MeasurementId', label: 'Google Analytics 4 measurement ID', pattern: /^G-[A-Z0-9]{4,16}$/, example: 'G-XXXXXXXXXX' },
  { key: 'gtmContainerId', label: 'Google Tag Manager container ID', pattern: /^GTM-[A-Z0-9]{4,12}$/, example: 'GTM-XXXXXXX' },
  { key: 'bingSiteVerification', label: 'Bing Webmaster Tools verification', pattern: /^[A-Za-z0-9]{10,64}$/, example: '0123456789ABCDEF…' },
  { key: 'clarityProjectId', label: 'Microsoft Clarity project ID', pattern: /^[a-z0-9]{6,20}$/, example: 'abcd1234ef' },
] as const;

export type IntegrationKey = (typeof integrationFields)[number]['key'];

const data = raw as Record<string, string>;
export const integrations = Object.fromEntries(
  integrationFields.map((f) => {
    const value = (data[f.key] ?? '').trim();
    return [f.key, f.pattern.test(value) ? value : ''];
  }),
) as Record<IntegrationKey, string>;
