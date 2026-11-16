import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const config: NextConfig = {
  poweredByHeader: false,
  // The fixture follows the repository's hand-written AGENTS.md.
  agentRules: false,
  reactStrictMode: true,
  turbopack: { root: workspaceRoot },
};

export default config;
