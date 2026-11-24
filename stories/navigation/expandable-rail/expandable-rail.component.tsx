import { useState } from 'react';
import { NavigationRail } from '@flaut-travel/react-md3e/navigation-rail';
import { IconButton } from '@flaut-travel/react-md3e/icon-button';
import { ExtendedFab } from '@flaut-travel/react-md3e/extended-fab';
import { NavigationIcon } from '../navigation-icons/navigation-icons.component';
import { NavigationItems } from '../navigation-items/navigation-items.component';

export function ExpandableRail({ dir = 'ltr' }: { readonly dir?: 'rtl' | 'ltr' }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div dir={dir} style={{ display: 'flex', blockSize: 600 }}>
      <NavigationRail
        id="expandable-navigation"
        aria-label="Expandable destinations"
        defaultValue="home"
        expanded={expanded}
        header={
          <>
            <IconButton
              variant="standard"
              aria-label="Toggle navigation"
              aria-expanded={expanded}
              aria-controls="expandable-navigation"
              onClick={() => setExpanded(!expanded)}
            >
              <NavigationIcon kind="menu" />
            </IconButton>
            <ExtendedFab extended={expanded} lowered startIcon={<NavigationIcon kind="edit" />}>
              Compose
            </ExtendedFab>
          </>
        }
      >
        <NavigationItems />
      </NavigationRail>
      <section
        style={{ flex: 1, padding: 24, background: 'var(--md-sys-color-surface-container-low)', borderRadius: 28 }}
      >
        <h2>Your journeys</h2>
        <p>Navigation expands while content stays in the layout.</p>
      </section>
    </div>
  );
}
