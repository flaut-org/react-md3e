/** Small internal glyphs for this family, not a public icon distribution. */
export function SearchIcon({ kind }: { readonly kind: 'search' | 'back' | 'clear' }) {
  const paths = {
    search: 'M10 3a7 7 0 1 0 4.9 12l5.55 5.55 1.4-1.4L16.3 13.6A7 7 0 0 0 10 3m0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10',
    back: 'm10.6 4.6 1.4 1.4-5 5H21v2H7l5 5-1.4 1.4L3.2 12z',
    clear: 'm6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4L12 13.4 6.4 19 5 17.6l5.6-5.6L5 6.4z',
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={paths[kind]} />
    </svg>
  );
}
