// Reads and writes site content. On Vercel it commits to GitHub (which triggers a rebuild);
// in local dev without a GITHUB_TOKEN it reads and writes the files on disk.
import fs from 'node:fs/promises';
import path from 'node:path';
import { cmsEnv } from './env';

export type FileChange = { path: string; content?: string | Buffer; delete?: boolean };

const useGitHub = () => Boolean(cmsEnv.githubToken());
export const storeMode = () => (useGitHub() ? 'github' : import.meta.env.DEV ? 'local' : 'none');

async function gh<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`https://api.github.com/repos/${cmsEnv.githubRepo()}${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${cmsEnv.githubToken()}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} on ${endpoint}: ${(await res.text()).slice(0, 200)}`);
  return res.json() as Promise<T>;
}

function assertSafe(p: string) {
  if (!/^content\/[a-z0-9/_.-]+$/i.test(p) || p.includes('..')) throw new Error(`Refusing to touch ${p}`);
}

export async function readText(p: string): Promise<string> {
  assertSafe(p);
  if (useGitHub()) {
    const data = await gh<{ content: string }>(`/contents/${p}?ref=${cmsEnv.githubBranch()}`);
    return Buffer.from(data.content, 'base64').toString('utf8');
  }
  if (storeMode() === 'local') return fs.readFile(path.resolve(p), 'utf8');
  throw new Error('CMS storage is not configured (set GITHUB_TOKEN).');
}

export async function readBinary(p: string): Promise<Buffer> {
  assertSafe(p);
  if (useGitHub()) {
    const res = await fetch(`https://api.github.com/repos/${cmsEnv.githubRepo()}/contents/${p}?ref=${cmsEnv.githubBranch()}`, {
      headers: { Authorization: `Bearer ${cmsEnv.githubToken()}`, Accept: 'application/vnd.github.raw', 'X-GitHub-Api-Version': '2022-11-28' },
    });
    if (!res.ok) throw new Error(`GitHub ${res.status} reading ${p}`);
    return Buffer.from(await res.arrayBuffer());
  }
  if (storeMode() === 'local') return fs.readFile(path.resolve(p));
  throw new Error('CMS storage is not configured (set GITHUB_TOKEN).');
}

/** File names in a content folder (not recursive). */
export async function listDir(p: string): Promise<string[]> {
  assertSafe(p);
  if (useGitHub()) {
    try {
      const items = await gh<{ name: string; type: string }[]>(`/contents/${p}?ref=${cmsEnv.githubBranch()}`);
      return items.filter((i) => i.type === 'file').map((i) => i.name);
    } catch (e) {
      if (String(e).includes('GitHub 404')) return [];
      throw e;
    }
  }
  if (storeMode() === 'local') {
    const entries = await fs.readdir(path.resolve(p), { withFileTypes: true }).catch(() => []);
    return entries.filter((e) => e.isFile()).map((e) => e.name);
  }
  throw new Error('CMS storage is not configured (set GITHUB_TOKEN).');
}

/** Writes several files as one change (one Git commit on GitHub). */
export async function commit(changes: FileChange[], message: string, editor = ''): Promise<void> {
  changes.forEach((c) => assertSafe(c.path));
  if (useGitHub()) {
    const branch = cmsEnv.githubBranch();
    const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${branch}`);
    const head = await gh<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`);
    const tree = await Promise.all(
      changes.map(async (c) => {
        if (c.delete) return { path: c.path, mode: '100644', type: 'blob', sha: null };
        const buf = Buffer.isBuffer(c.content) ? c.content : Buffer.from(c.content ?? '', 'utf8');
        const blob = await gh<{ sha: string }>('/git/blobs', { method: 'POST', body: JSON.stringify({ content: buf.toString('base64'), encoding: 'base64' }) });
        return { path: c.path, mode: '100644', type: 'blob', sha: blob.sha };
      }),
    );
    const newTree = await gh<{ sha: string }>('/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: head.tree.sha, tree }) });
    const newCommit = await gh<{ sha: string }>('/git/commits', {
      method: 'POST',
      body: JSON.stringify({ message: `${message}\n\nEdited in the VAKS CMS${editor ? ` by ${editor}` : ''}.`, tree: newTree.sha, parents: [ref.object.sha] }),
    });
    await gh(`/git/refs/heads/${branch}`, { method: 'PATCH', body: JSON.stringify({ sha: newCommit.sha }) });
    return;
  }
  if (storeMode() === 'local') {
    for (const c of changes) {
      const abs = path.resolve(c.path);
      if (c.delete) await fs.rm(abs, { force: true });
      else {
        await fs.mkdir(path.dirname(abs), { recursive: true });
        await fs.writeFile(abs, c.content ?? '');
      }
    }
    return;
  }
  throw new Error('CMS storage is not configured (set GITHUB_TOKEN).');
}
