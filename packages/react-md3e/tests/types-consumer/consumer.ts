import { Calendar, CalendarDay } from '@flaut-travel/react-md3e/calendar';
import { RangeCalendar } from '@flaut-travel/react-md3e/range-calendar';
import type {
  SwitchProps,
  SliderProps,
  SliderRange,
  BadgeProps,
  CalendarProps,
  RangeCalendarProps,
  SkeletonProps,
  DividerProps,
  TooltipProps,
  CollapsibleProps,
  ButtonGroupProps,
  SegmentedButtonProps,
  ButtonSegmentProps,
  BottomSheetProps,
  SideSheetProps,
  SnackbarProps,
  ButtonLinkProps,
  TypographyProps,
  TypographyTokenRole,
  SearchProps,
  SearchBarProps,
  SearchCloseReason,
  SurfaceProps,
  ShapeProps,
  CardProps,
  PopoverPlacement,
  PopoverCloseReason,
  TextFieldProps,
  AutocompleteProps,
  CheckboxProps,
  RadioProps,
  RadioGroupProps,
  AvatarProps,
  AppBarProps,
  ButtonProps,
  IconButtonProps,
  Theme,
  ThemeProviderProps,
  MotionScheme,
  MotionSpring,
  MotionTokens,
} from '@flaut-travel/react-md3e';
import { Skeleton } from '@flaut-travel/react-md3e/skeleton';
import { Divider } from '@flaut-travel/react-md3e/divider';
import { Tooltip } from '@flaut-travel/react-md3e/tooltip';
import { Collapsible } from '@flaut-travel/react-md3e/collapsible';
import { ButtonGroup, ButtonGroupButton } from '@flaut-travel/react-md3e/button-group';
import { SegmentedButton, ButtonSegment } from '@flaut-travel/react-md3e/segmented-button';
import { BottomSheet } from '@flaut-travel/react-md3e/bottom-sheet';
import { SideSheet } from '@flaut-travel/react-md3e/side-sheet';
import { Snackbar } from '@flaut-travel/react-md3e/snackbar';
import { Typography } from '@flaut-travel/react-md3e/typography';
import { Search, SearchBar } from '@flaut-travel/react-md3e/search';
import { Surface } from '@flaut-travel/react-md3e/surface';
import { Shape, shapeVariants } from '@flaut-travel/react-md3e/shape';
import { Card, CardActionArea, CardContent, CardActions, CardMedia } from '@flaut-travel/react-md3e/card';
import { Popover, PopoverClose } from '@flaut-travel/react-md3e/popover';
import { TextField } from '@flaut-travel/react-md3e/text-field';
import { Autocomplete } from '@flaut-travel/react-md3e/autocomplete';
import { Checkbox } from '@flaut-travel/react-md3e/checkbox';
import { Switch } from '@flaut-travel/react-md3e/switch';
import { Slider } from '@flaut-travel/react-md3e/slider';
import { Radio } from '@flaut-travel/react-md3e/radio';
import { RadioGroup } from '@flaut-travel/react-md3e/radio-group';
import { Avatar } from '@flaut-travel/react-md3e/avatar';
import { Badge } from '@flaut-travel/react-md3e/badge';
import { List, ListItem } from '@flaut-travel/react-md3e/list';
import type { ListProps, ListItemProps } from '@flaut-travel/react-md3e/list';
import { Dialog, DialogContent, DialogActions } from '@flaut-travel/react-md3e/dialog';
import type { DialogProps } from '@flaut-travel/react-md3e/dialog';
import { AppBar, Button, IconButton, ThemeProvider } from '@flaut-travel/react-md3e';
import { Button as StandaloneButton } from '@flaut-travel/react-md3e/button';
import { AppBar as StandaloneAppBar } from '@flaut-travel/react-md3e/app-bar';
import { IconButton as StandaloneIconButton } from '@flaut-travel/react-md3e/icon-button';
import { createTheme, themeToCss } from '@flaut-travel/react-md3e/theme';

const theme: Theme = createTheme({ sourceColor: '#386a20' });
const buttonProps: ButtonProps = { variant: 'tonal', endIcon: '→', selected: true };
const providerProps: ThemeProviderProps = { theme, colorScheme: 'dark' };

export const consumer = {
  Switch,
  Slider,
  sliderProps: { label: 'Volume', value: 40, size: 'small', marks: true } satisfies SliderProps,
  sliderRange: [20, 80] satisfies SliderRange,
  switchProps: { checked: true, onChange: (_event, checked) => checked, name: 'notifications' } satisfies SwitchProps,
  Badge,
  badgeProps: { badgeContent: 12, variant: 'large', max: 99 } satisfies BadgeProps,
  Calendar,
  CalendarDay,
  RangeCalendar,
  calendarProps: { defaultValue: '2024-02-29', onChange: (day) => day.day } satisfies CalendarProps,
  rangeCalendarProps: { defaultValue: ['2024-02-29', null], calendars: 2 } satisfies RangeCalendarProps,
  Skeleton,
  Divider,
  Tooltip,
  Collapsible,
  ButtonGroup,
  ButtonGroupButton,
  SegmentedButton,
  ButtonSegment,
  segmentedProps: { 'aria-label': 'View', 'defaultValue': 'week', 'name': 'view' } satisfies SegmentedButtonProps,
  segmentProps: { value: 'week', icon: '▦' } satisfies ButtonSegmentProps,
  BottomSheet,
  SideSheet,
  Snackbar,
  skeletonProps: { variant: 'rounded', animation: 'wave', height: 120 } satisfies SkeletonProps,
  dividerProps: { orientation: 'vertical', flexItem: true } satisfies DividerProps,
  tooltipProps: {
    title: 'Help',
    children: null as unknown as TooltipProps['children'],
    placement: 'bottom-start',
  } satisfies TooltipProps,
  collapsibleProps: { defaultOpen: true, keepMounted: true } satisfies CollapsibleProps,
  groupProps: { 'selectionMode': 'multiple', 'value': ['one'], 'aria-label': 'Options' } satisfies ButtonGroupProps,
  bottomProps: { 'aria-label': 'Options', 'showDragHandle': true, 'variant': 'modal' } satisfies BottomSheetProps,
  sideProps: { 'aria-label': 'Options', 'anchor': 'start', 'variant': 'standard' } satisfies SideSheetProps,
  snackbarProps: { message: 'Saved', autoHideDuration: 6000 } satisfies SnackbarProps,
  linkProps: { href: '/articles', loading: true } satisfies ButtonLinkProps,
  Typography,
  typographyProps: { variant: 'bodyLarge', emphasized: true, component: 'a', href: '/' } satisfies TypographyProps<'a'>,
  typographyTokenRole: 'bodyLargeEmphasized' satisfies TypographyTokenRole,
  Search,
  SearchBar,
  searchProps: { label: 'Search', layout: 'auto', defaultValue: 'Paris' } satisfies SearchProps,
  searchBarProps: { label: 'Search', name: 'q' } satisfies SearchBarProps,
  searchCloseReason: 'backButtonClick' satisfies SearchCloseReason,
  Surface,
  Shape,
  shapeVariants,
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  CardMedia,
  surfaceProps: { shape: 'largeIncreased', elevation: 2, color: 'primaryContainer' } satisfies SurfaceProps,
  shapeProps: { variant: 'flower', color: 'tertiaryContainer' } satisfies ShapeProps,
  cardProps: { variant: 'elevated' } satisfies CardProps,

  Popover,
  PopoverClose,
  popoverPlacement: 'bottom-start' satisfies PopoverPlacement,
  popoverCloseReason: 'clickAway' satisfies PopoverCloseReason,
  TextField,
  Autocomplete,
  textFieldProps: { label: 'Name', variant: 'filled', inputProps: { maxLength: 30 } } satisfies TextFieldProps,
  autocompleteProps: {
    label: 'City',
    options: ['Paris', 'Rome'],
    defaultValue: 'Paris',
    clearOnEscape: true,
    selectOnFocus: true,
  } satisfies AutocompleteProps<string>,
  Checkbox,
  Radio,
  RadioGroup,
  Avatar,
  checkboxProps: {
    name: 'updates',
    indeterminate: true,
    onChange: (_event, checked) => checked,
  } satisfies CheckboxProps,
  radioProps: { value: 'economy' } satisfies RadioProps,
  radioGroupProps: { defaultValue: 'economy', name: 'cabin' } satisfies RadioGroupProps,
  avatarProps: { src: '/avatar.svg', alt: 'Alex', size: 'medium', variant: 'circular' } satisfies AvatarProps,
  List,
  ListItem,
  listProps: { 'selectionMode': 'single', 'aria-label': 'Language', 'defaultValue': 'en' } satisfies ListProps,
  listItemProps: { value: 'en', primary: 'English', leadingKind: 'icon' } satisfies ListItemProps,
  Dialog,
  DialogContent,
  DialogActions,
  dialogProps: { open: false, scroll: 'paper', role: 'alertdialog' } satisfies DialogProps,
  AppBar,
  IconButton,
  StandaloneAppBar,
  StandaloneIconButton,
  appBarProps: { variant: 'largeFlexible', position: 'sticky' } satisfies AppBarProps,
  iconButtonProps: { 'aria-label': 'Save', 'children': '★', 'width': 'wide' } satisfies IconButtonProps,
  Button,
  StandaloneButton,
  ThemeProvider,
  buttonProps,
  providerProps,
  css: themeToCss(theme, { selector: '.brand' }),
};

// @ts-expect-error Public types must remain precise through package declarations.
export const invalidVariant: ButtonProps = { variant: 'contained' };

export const motionScheme: MotionScheme = 'standard';
export const motionTheme = createTheme({ motionScheme });
export const spring: MotionSpring = motionTheme.motion.fast.spatial;
export const motionTokens: MotionTokens = motionTheme.motion;
export const motionProvider: ThemeProviderProps = { theme: motionTheme };
// @ts-expect-error Motion and color schemes have distinct names.
export const invalidMotionScheme: MotionScheme = 'tonalSpot';
// @ts-expect-error Motion schemes accept the two MD3 presets.
export const invalidMotionTheme = createTheme({ motionScheme: 'legacy' });

export const loadingModule = import('@flaut-travel/react-md3e/loading-indicator');
export const progressModule = import('@flaut-travel/react-md3e/progress-indicator');
