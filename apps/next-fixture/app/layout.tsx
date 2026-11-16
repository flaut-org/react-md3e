import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@flaut-travel/react-md3e/theme/styles.css';
import './globals.css';
import './forest.generated.css';

export const metadata: Metadata = {
  title: 'react-md3e development fixture',
  description: 'Package consumption and streaming checks for react-md3e.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
