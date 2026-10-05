import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.join(process.cwd(), 'public', 'figma-home');
await mkdir(outDir, { recursive: true });

// Generated from the connected Figma Home frame (node 43:160).
// These MCP asset URLs are temporary; once downloaded, the local files remain yours.
const assets = {
  'featured.png': 'https://www.figma.com/api/mcp/asset/d030fca2-ddeb-49a0-9419-709ed3f5991a/4c35e.png',
  'background.png': 'https://www.figma.com/api/mcp/asset/d030fca2-ddeb-49a0-9419-709ed3f5991a/ebda9.png',
  'masthead.png': 'https://www.figma.com/api/mcp/asset/d030fca2-ddeb-49a0-9419-709ed3f5991a/93d5f.png',
  'about.png': 'https://www.figma.com/api/mcp/asset/d030fca2-ddeb-49a0-9419-709ed3f5991a/7d50c.png',
  'theory.png': 'https://www.figma.com/api/mcp/asset/d030fca2-ddeb-49a0-9419-709ed3f5991a/5fb61.png',
  'developer.png': 'https://www.figma.com/api/mcp/asset/d030fca2-ddeb-49a0-9419-709ed3f5991a/85b2a.png',
  'exhibition.png': 'https://www.figma.com/api/mcp/asset/d030fca2-ddeb-49a0-9419-709ed3f5991a/70ef1.png',
  'figma-extra-chatgpt.png': 'https://www.figma.com/api/mcp/asset/d030fca2-ddeb-49a0-9419-709ed3f5991a/b54fd.png',
  'figma-logo-word.png': 'https://www.figma.com/api/mcp/asset/d030fca2-ddeb-49a0-9419-709ed3f5991a/a5381.png',
  'figma-extra-a.png': 'https://www.figma.com/api/mcp/asset/d030fca2-ddeb-49a0-9419-709ed3f5991a/cbc9a.png',
  'discover.png': 'https://www.figma.com/api/mcp/asset/d030fca2-ddeb-49a0-9419-709ed3f5991a/0daf0.png',
};

for (const [name, url] of Object.entries(assets)) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Không tải được ${name}: ${response.status} ${response.statusText}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(outDir, name), bytes);
  console.log(`✓ ${name} (${Math.round(bytes.length / 1024)} KB)`);
}

console.log('\nĐã đồng bộ asset Figma vào public/figma-home/.');
