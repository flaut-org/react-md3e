---
'@flaut-travel/react-md3e': minor
---

Add localized section masks to date and range fields, with automatic digit advancement, section selection,
deletion and clipboard editing while preserving Temporal validation. Keep empty labels stationary when
calendar buttons receive focus and keep calendar height stable across year/month/day transitions.

Add Popover's optional collisionStrategy="shift" and use it to keep docked calendar grids fully visible,
including inside dialogs. Fall back to modal/input presentation when the viewport cannot fit a complete
calendar. Render range preview dashes continuously across each week without cell-boundary seams.
