import { chipLeading, chipIconFrame, chipGlyph, chipLabel, chipAvatar, chipTrailing } from '../chip.styles';
import type { ChipProps } from '../chip.types';

/** Passive slot presentation; CSS selects the checkmark without scaling or replacing label glyphs. */
export function ChipContent({ label, kind, icon, avatar, trailingIcon, selectedIcon }: ChipProps) {
  return (
    <>
      {(icon != null || avatar != null || kind === 'filter') && (
        <span className={chipLeading} data-md3-chip-leading="" aria-hidden="true">
          <span className={chipIconFrame}>
            <span
              className={avatar != null ? chipAvatar : chipGlyph}
              data-md3-chip-original-icon=""
              data-md3-chip-avatar={avatar != null ? '' : undefined}
            >
              {avatar ?? icon}
            </span>
            {kind === 'filter' && (
              <span className={chipGlyph} data-md3-chip-check="">
                {selectedIcon ?? (
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  </svg>
                )}
              </span>
            )}
          </span>
        </span>
      )}
      <span className={chipLabel} data-md3-chip-label="">
        {label}
      </span>
      {trailingIcon != null && (
        <span className={chipTrailing} aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </>
  );
}
