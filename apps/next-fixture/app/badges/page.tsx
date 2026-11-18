import '@flaut-travel/react-md3e/badge/styles.css';
import '@flaut-travel/react-md3e/icon-button/styles.css';
import '@flaut-travel/react-md3e/button/styles.css';

import Link from 'next/link';
import { Badge, IconButton, ThemeProvider } from '@flaut-travel/react-md3e';
import { BadgeDemo } from './badge-demo/badge-demo.component';

const mailIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M3 4h18v16H3zm2 3v2l7 4 7-4V7l-7 4z" />
  </svg>
);

export default function BadgesPage() {
  return (
    <ThemeProvider colorScheme="light" data-testid="badge-theme">
      <main>
        <h1>Material badges</h1>
        <section>
          <h2>Small and large</h2>
          <div className="fixture-row">
            <IconButton variant="standard" aria-label="Inbox, new notification">
              <Badge data-testid="small-badge">{mailIcon}</Badge>
            </IconButton>
            <IconButton variant="standard" aria-label="Inbox, 7 unread messages">
              <Badge badgeContent={7} data-testid="large-badge">
                {mailIcon}
              </Badge>
            </IconButton>
            <IconButton variant="standard" aria-label="Inbox, 999+ unread messages" aria-describedby="overflow-count">
              <Badge badgeContent={1250} data-testid="overflow-badge">
                {mailIcon}
              </Badge>
            </IconButton>
            <span id="overflow-count" hidden>
              1250 unread messages in total
            </span>
          </div>
        </section>
        <section>
          <h2>Zero, text and standalone badges</h2>
          <div className="fixture-row">
            <Badge badgeContent={0} data-testid="hidden-zero">
              {mailIcon}
            </Badge>
            <Badge badgeContent={0} showZero data-testid="visible-zero">
              {mailIcon}
            </Badge>
            <Badge badgeContent="New" data-testid="text-badge">
              {mailIcon}
            </Badge>
            <Badge badgeContent={12} data-testid="standalone-badge" />
          </div>
          <p>Visible counts belong in each destination’s accessible name; descriptions retain the full count.</p>
        </section>
        <BadgeDemo />
        <ThemeProvider colorScheme="dark" dir="rtl" className="fixture-card" data-testid="rtl-badge-theme">
          <h2>Dark theme and RTL</h2>
          <div className="fixture-row">
            <IconButton variant="standard" aria-label="RTL inbox, new notification">
              <Badge data-testid="rtl-small-badge">{mailIcon}</Badge>
            </IconButton>
            <IconButton variant="standard" aria-label="RTL inbox, 7 unread messages">
              <Badge badgeContent={7} data-testid="rtl-large-badge">
                {mailIcon}
              </Badge>
            </IconButton>
          </div>
        </ThemeProvider>
        <Link href="/">Back to components</Link>
      </main>
    </ThemeProvider>
  );
}
