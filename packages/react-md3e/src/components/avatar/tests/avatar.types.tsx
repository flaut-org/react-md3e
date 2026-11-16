import { Avatar } from '@flaut-travel/react-md3e/avatar';

export const image = (
  <Avatar src="/avatar.svg" alt="Alex" size="small" imgProps={{ loading: 'lazy', decoding: 'async' }}>
    AM
  </Avatar>
);
// @ts-expect-error only the documented size values are available.
export const invalid = <Avatar size="giant" />;
