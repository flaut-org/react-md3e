/** Local sample geometry, not a distributed icon package. */
export function NavigationIcon({
  filled = false,
  kind = 'home',
}: {
  readonly filled?: boolean;
  readonly kind?: 'home' | 'search' | 'saved' | 'mail' | 'menu' | 'edit';
}) {
  const paths = {
    home: 'm3 10 9-7 9 7v10h-6v-6H9v6H3Z',
    search: 'M10.5 3a7.5 7.5 0 1 0 4.65 13.39L21 22l1-1-5.61-5.85A7.5 7.5 0 0 0 10.5 3Z',
    saved: 'M6 3h12v18l-6-4-6 4Z',
    mail: 'M3 5h18v14H3Zm0 0 9 8 9-8',
    menu: 'M3 6h18M3 12h18M3 18h18',
    edit: 'm4 16 12-12 4 4L8 20H4Zm10-10 4 4',
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d={paths[kind]}
        fill={filled && kind !== 'menu' ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
