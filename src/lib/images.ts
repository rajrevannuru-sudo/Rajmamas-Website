import { getImage } from 'astro:assets';
import founderPhoto from '../assets/images/rajasekhar-revannuru-founder-vaks-consulting.png';
import { site } from './site';

export { founderPhoto };

/** Absolute URL of a 600px JPEG of the founder portrait, for Person schema. */
export async function founderSchemaImage() {
  const img = await getImage({ src: founderPhoto, width: 600, format: 'jpg' });
  return new URL(img.src, site.url).href;
}
