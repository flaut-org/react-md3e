import { motionDuration } from '../../styles/theme-tokens';
import type { StyleObject } from '../../styles/style-object.types';

/** Build-time integer visibility thresholds of the AndroidX slow-effects counter (k=800, damping=1). */
function thresholdTime(count: number, remaining: number) {
  const frequency = Math.sqrt(800);

  for (let milliseconds = 0; milliseconds <= 327; milliseconds += 1) {
    const time = milliseconds / 1000;
    const displacement = count * (1 + frequency * time) * Math.exp(-frequency * time);

    if (displacement <= Math.max(1, remaining)) {
      return milliseconds / 327;
    }
  }

  return 1;
}

/** Only finite 2–6 item configurations are emitted; no spring solver runs in the UI. */
export function fabMenuStaggerStyles() {
  type Delays = Record<'--_fab-menu-open-delay' | '--_fab-menu-close-delay', string>;
  type Configuration = { '--_fab-menu-stagger-end': string } & Record<`& [data-fab-index="${number}"]`, Delays>;

  const styles: Record<`&[data-item-count="${number}"]`, Configuration> = {};

  for (let count = 2; count <= 6; count += 1) {
    const configuration: Configuration = {
      '--_fab-menu-stagger-end': `calc(${motionDuration('effects', 'slow')} * ${thresholdTime(count, 1)})`,
    };

    for (let index = 0; index < count; index += 1) {
      configuration[`& [data-fab-index="${index}"]`] = {
        '--_fab-menu-open-delay': `calc(${motionDuration('effects', 'slow')} * ${thresholdTime(count, index)})`,
        '--_fab-menu-close-delay': `calc(${motionDuration('effects', 'slow')} * ${thresholdTime(count, count - index)})`,
      } satisfies StyleObject;
    }

    styles[`&[data-item-count="${count}"]`] = configuration;
  }

  return styles satisfies StyleObject;
}
