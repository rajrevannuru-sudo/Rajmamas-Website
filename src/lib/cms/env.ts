// Server-only settings for the CMS. Set these in Vercel → Project → Settings → Environment Variables
// (and in .env for local dev). Never commit real values.
// Values are trimmed and stripped of wrapping quotes/backticks, which often sneak in when pasting into Vercel.
const clean = (v: string) => v.trim().replace(/^(['"`])([\s\S]*)\1$/, '$2').trim();
const read = (name: string): string =>
  clean((typeof process !== 'undefined' ? process.env[name] : undefined) ?? (import.meta.env as Record<string, string | undefined>)[name] ?? '');

export const cmsEnv = {
  username: () => read('CMS_USERNAME'),
  password: () => read('CMS_PASSWORD'),
  secret: () => read('CMS_SECRET'),
  githubToken: () => read('GITHUB_TOKEN'),
  githubRepo: () => read('GITHUB_REPO') || 'varun-deg/Rajmamas-Website',
  githubBranch: () => read('GITHUB_BRANCH') || 'main',
};
