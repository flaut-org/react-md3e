import { createRef } from 'react';
import { Card, CardContent, CardMedia, CardActionArea, CardActions } from '@flaut-travel/react-md3e/card';

export const card = (
  <Card component="article" ref={createRef<HTMLElement>()} variant="elevated">
    <CardMedia src="/lake.svg" alt="Lake" />
    <CardContent>Trip details</CardContent>
    <CardActions>Actions</CardActions>
  </Card>
);
export const button = (
  <CardActionArea ref={createRef<HTMLButtonElement>()} type="submit" name="trip" value="mountains">
    Book
  </CardActionArea>
);
export const link = (
  <CardActionArea href="/trip" ref={createRef<HTMLAnchorElement>()} target="_blank" rel="noreferrer">
    Read guide
  </CardActionArea>
);
// @ts-expect-error Card has native MD3 variant names.
export const legacyCard = <Card variant="elevation" />;
// @ts-expect-error the variant owns elevation.
export const customElevation = <Card elevation={5} />;
// @ts-expect-error meaningful media must explicitly choose alt, including empty decorative alt.
export const unnamedMedia = <CardMedia src="/lake.svg" />;
// @ts-expect-error anchors expose an anchor ref.
export const wrongLinkRef = <CardActionArea href="/trip" ref={createRef<HTMLButtonElement>()} />;
