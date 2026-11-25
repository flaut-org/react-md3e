import { hydrateRoot, createRoot } from 'react-dom/client';
import { App } from './root';

const root = document.getElementById('root')!;

if (root.hasChildNodes()) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}
