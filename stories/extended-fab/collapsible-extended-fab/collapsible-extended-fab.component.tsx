import { useState } from 'react';
import { Button, ExtendedFab } from '@flaut-travel/react-md3e';
import type { ExtendedFabSize } from '@flaut-travel/react-md3e';

export function CollapsibleExtendedFab({ size = 'small' }: { readonly size?: ExtendedFabSize }) {
  const [extended, setExtended] = useState(true);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Button onClick={() => setExtended(!extended)}>Toggle label</Button>
      <ExtendedFab extended={extended} startIcon="+" size={size}>
        Compose message
      </ExtendedFab>
    </div>
  );
}
