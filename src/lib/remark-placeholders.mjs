// Wraps [bracketed] text in markdown bodies in <span class="placeholder">, keeping the brackets visible.
const RE = /\[[^\]\n]+\]/g;
const HAS = /\[[^\]\n]+\]/;
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function walk(node) {
  if (!node.children) return;
  const out = [];
  for (const child of node.children) {
    if (child.type === 'text' && HAS.test(child.value)) {
      out.push({ type: 'html', value: escape(child.value).replace(RE, (m) => `<span class="placeholder">${m}</span>`) });
    } else {
      walk(child);
      out.push(child);
    }
  }
  node.children = out;
}

export default function remarkPlaceholders() {
  return (tree) => walk(tree);
}
