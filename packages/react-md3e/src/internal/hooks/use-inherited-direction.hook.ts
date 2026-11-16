import { useLayoutEffect, useRef, useState } from 'react';

/** Read explicit HTML direction without computing theme styles. */
export function useInheritedDirection(dir?: string) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [inherited, setInherited] = useState<string>();

  useLayoutEffect(() => {
    setInherited(anchorRef.current?.closest('[dir]')?.getAttribute('dir') ?? undefined);
  }, []);

  return { anchorRef, direction: dir ?? inherited };
}
