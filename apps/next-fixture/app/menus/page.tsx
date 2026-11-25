import {
  Button,
  Menu,
  MenuItem,
  MenuDivider,
  MenuGroup,
  MenuSubmenu,
  MenuCheckboxItem,
  ThemeProvider,
} from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import { MenuDemo } from './menu-demo/menu-demo.component';

const forest = createTheme({ sourceColor: '#386a20', typography: { plainFontFamily: 'Arial, sans-serif' } });
const material = createTheme({ sourceColor: '#6750a4', variant: 'tonalSpot' });

export default function MenusPage() {
  return (
    <ThemeProvider theme={forest} colorScheme="light">
      <main>
        <h1>Material 3 Expressive menus</h1>
        <section>
          <h2>Server composition</h2>
          <Menu trigger={<Button>Server menu</Button>} data-testid="server-menu">
            <MenuItem leading="☆" trailing="⌘K">
              Create document
            </MenuItem>
            <MenuItem disabled>Unavailable command</MenuItem>
            <MenuDivider />
            <MenuItem href="#destination">Go to destination</MenuItem>
          </Menu>
        </section>
        <ThemeProvider theme={material} colorScheme="light">
          <section>
            <h2>Vertical menu with gap</h2>
            <Menu
              trigger={<Button>Vertical menu with gap</Button>}
              layout="grouped"
              style={{ width: 216 }}
              data-testid="gap-menu"
            >
              <MenuGroup aria-label="Main actions">
                <MenuItem leading="◎">Item 1</MenuItem>
                <MenuItem leading="▣" trailing="⌘C">
                  Item 2
                </MenuItem>
                <MenuItem leading="✎" selected>
                  Item 3
                </MenuItem>
              </MenuGroup>
              <MenuGroup aria-label="More actions">
                <MenuSubmenu label="Item 4" leading="☁" data-testid="gap-submenu">
                  <MenuItem>Send to device</MenuItem>
                  <MenuItem>Copy cloud link</MenuItem>
                </MenuSubmenu>
              </MenuGroup>
            </Menu>
            <Menu
              trigger={<Button>Vibrant menu with gap</Button>}
              layout="grouped"
              variant="vibrant"
              data-testid="vibrant-gap-menu"
            >
              <MenuGroup label="View">
                <MenuCheckboxItem defaultChecked>Show details</MenuCheckboxItem>
              </MenuGroup>
              <MenuGroup label="Actions">
                <MenuItem>Refresh content</MenuItem>
              </MenuGroup>
            </Menu>
          </section>
        </ThemeProvider>
        <MenuDemo />
        <ThemeProvider colorScheme="dark" data-testid="menu-dark-theme">
          <Menu trigger={<Button>Dark menu</Button>} variant="vibrant" data-testid="dark-menu">
            <MenuItem>Dark command</MenuItem>
            <MenuItem selected>Selected destination</MenuItem>
          </Menu>
        </ThemeProvider>
        <div id="destination">Destination</div>
        <a href="/">Back to package consumer</a>
      </main>
    </ThemeProvider>
  );
}
