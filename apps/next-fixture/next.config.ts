import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const config: NextConfig = {
  poweredByHeader: false,
  // The fixture follows the repository's hand-written AGENTS.md.
  agentRules: false,
  reactStrictMode: true,
  // Webpack's RSC traversal otherwise collects every barrel export's CSS before pruning.
  experimental: {
    optimizePackageImports: process.env.MD3E_DISABLE_IMPORT_OPTIMIZATION === '1' ? [] : ['@flaut-travel/react-md3e'],
  },
  turbopack: { root: workspaceRoot },
};

export default config;
