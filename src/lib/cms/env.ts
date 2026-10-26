// Server-only settings for the CMS. Set these in Vercel → Project → Settings → Environment Variables
// (and in .env for local dev). Never commit real values.
const read = (name: string): string =>
  (typeof process !== 'undefined' ? process.env[name] : undefined) ?? (import.meta.env as Record<string, string | undefined>)[name] ?? '';

export const cmsEnv = {
  username: () => read('CMS_USERNAME'),
  password: () => read('CMS_PASSWORD'),
  secret: () => read('CMS_SECRET'),
  githubToken: () => read('GITHUB_TOKEN'),
  githubRepo: () => read('GITHUB_REPO') || 'varun-deg/Rajmamas-Website',
  githubBranch: () => read('GITHUB_BRANCH') || 'main',
};
