import { Badge, Surface, ThemeProvider, Typography } from '@flaut-travel/react-md3e';

export default function Page() {
  return (
    <ThemeProvider colorScheme="light">
      <Surface data-testid="automatic-surface">
        <Typography variant="titleLarge" data-testid="automatic-typography">
          Server presentation
        </Typography>
        <Badge badgeContent={3} />
      </Surface>
    </ThemeProvider>
  );
}
