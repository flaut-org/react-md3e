import { connection } from 'next/server';
import {
  LoadingIndicator,
  ProgressIndicator,
  Search,
  SearchBar,
  Skeleton,
  Divider,
  Tooltip,
  ButtonGroup,
  ButtonGroupButton,
  Collapsible,
  BottomSheet,
  SideSheet,
  Snackbar,
  Typography,
  Surface,
  Shape,
  Card,
  CardContent,
  Menu,
  MenuItem,
  Popover,
  PopoverClose,
  TextField,
  Autocomplete,
  Avatar,
  Badge,
  Checkbox,
  Switch,
  Slider,
  Radio,
  RadioGroup,
  AppBar,
  List,
  ListItem,
  Button,
  IconButton,
  Calendar,
  RangeCalendar,
} from '@flaut-travel/react-md3e';
import { ScopedDialogDemo } from '../../../components/scoped-dialog-demo/scoped-dialog-demo.component';

export async function RequestTimeContent() {
  await connection();
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 750);
  });

  return (
    <div data-fixture="streaming-ready">
      <Menu trigger={<Button>Streamed menu</Button>} data-testid="streamed-menu">
        <MenuItem>Streamed command</MenuItem>
      </Menu>
      <p>
        Streamed inbox, 12 unread messages <Badge badgeContent={12} data-testid="streamed-badge" />
      </p>
      <Slider label="Streamed volume" defaultValue={35} data-testid="streamed-slider" />
      <Calendar aria-label="Streamed calendar" defaultValue="2024-02-29" today="2024-02-29" />
      <RangeCalendar
        aria-label="Streamed range calendar"
        defaultValue={['2024-02-27', '2024-03-04']}
        today="2024-02-29"
      />
      <LoadingIndicator variant="contained" aria-label="Streamed loading" data-testid="streamed-loading-indicator" />
      <ProgressIndicator
        value={65}
        appearance="wavy"
        aria-label="Streamed progress"
        data-testid="streamed-progress-indicator"
      />
      <Skeleton width={160} data-testid="streamed-skeleton" />
      <Divider data-testid="streamed-divider" />
      <Tooltip title="Streamed tooltip">
        <Button>Streamed tooltip action</Button>
      </Tooltip>
      <Collapsible trigger={<Button>Streamed disclosure</Button>}>
        <p>Streamed details</p>
      </Collapsible>
      <ButtonGroup aria-label="Streamed choices">
        <ButtonGroupButton value="one">Choice one</ButtonGroupButton>
      </ButtonGroup>
      <BottomSheet aria-label="Streamed bottom sheet" trigger={<Button>Streamed bottom sheet</Button>}>
        <p>Streamed sheet content</p>
      </BottomSheet>
      <SideSheet aria-label="Streamed side sheet" trigger={<Button>Streamed side sheet</Button>}>
        <p>Streamed side content</p>
      </SideSheet>
      <Snackbar message="Streamed notification" />
      <Typography component="h2" variant="headlineSmall" emphasized data-testid="streamed-typography">
        Streamed typography
      </Typography>
      <SearchBar label="Streamed search bar" defaultValue="Streamed query" />
      <Search label="Streamed search">
        <p>Streamed search results</p>
      </Search>
      <AppBar
        title="Streamed collection"
        position="static"
        actions={
          <IconButton aria-label="Streamed icon" variant="standard">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M11 5h2v14h-2zM5 11h14v2H5z" />
            </svg>
          </IconButton>
        }
      />
      <List data-testid="streamed-list">
        <ListItem primary="Streamed list row" secondary="Server-created content" />
      </List>
      <Avatar alt="Streamed avatar" data-testid="streamed-avatar">
        SA
      </Avatar>
      <label>
        <Checkbox defaultChecked /> Streamed checkbox
      </label>
      <label>
        <Switch aria-label="Streamed notifications" defaultChecked /> Streamed notifications
      </label>
      <RadioGroup aria-label="Streamed radios" defaultValue="one">
        <label>
          <Radio value="one" /> Streamed radio
        </label>
      </RadioGroup>
      <TextField label="Streamed name" defaultValue="Alex" />
      <Autocomplete label="Streamed destination" options={['Paris', 'Rome']} defaultValue="Rome" />
      <Popover aria-label="Streamed options" trigger={<Button>Streamed popover</Button>}>
        <TextField label="Streamed popover note" />
        <PopoverClose variant="text">Done</PopoverClose>
      </Popover>
      <Surface data-testid="streamed-surface" color="secondaryContainer">
        <Card variant="outlined" data-testid="streamed-card">
          <CardContent>Streamed card content</CardContent>
        </Card>
        <Shape variant="flower" aria-label="Streamed illustration" />
      </Surface>
      <Button>Streamed action</Button>
      <ScopedDialogDemo />
    </div>
  );
}
