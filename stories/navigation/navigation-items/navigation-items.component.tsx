import { NavigationItem } from '@flaut-travel/react-md3e/navigation-bar';
import { Badge } from '@flaut-travel/react-md3e/badge';
import { NavigationIcon } from '../navigation-icons/navigation-icons.component';

export function NavigationItems({
  links = false,
  disabled = false,
}: {
  readonly links?: boolean;
  readonly disabled?: boolean;
}) {
  return (
    <>
      <NavigationItem
        value="home"
        icon={<NavigationIcon />}
        selectedIcon={<NavigationIcon filled />}
        {...(links ? { href: '#home' } : {})}
      >
        Home
      </NavigationItem>
      <NavigationItem
        value="search"
        icon={<NavigationIcon kind="search" />}
        disabled={disabled}
        {...(links ? { href: '#search' } : {})}
      >
        Explore
      </NavigationItem>
      <NavigationItem
        value="saved"
        icon={<NavigationIcon kind="saved" />}
        selectedIcon={<NavigationIcon kind="saved" filled />}
        badge={<Badge badgeContent={3} />}
        {...(links ? { href: '#saved' } : {})}
      >
        Saved
      </NavigationItem>
    </>
  );
}
