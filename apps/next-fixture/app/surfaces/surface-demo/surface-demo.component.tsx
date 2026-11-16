'use client';

import { useRef, useState } from 'react';
import {
  Button,
  Surface,
  Shape,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  CardActionArea,
  Checkbox,
} from '@flaut-travel/react-md3e';

export function SurfaceDemo() {
  const [opened, setOpened] = useState(0);
  const [saved, setSaved] = useState(0);
  const [submitted, setSubmitted] = useState(0);
  const [dragged, setDragged] = useState(false);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  return (
    <section>
      <h2>Primary and independent actions</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted((value) => value + 1);
        }}
      >
        <Card
          component="article"
          ref={cardRef}
          variant="elevated"
          dragged={dragged}
          data-testid="action-card"
          className="surface-example-card"
        >
          <CardActionArea
            ref={actionRef}

            onClick={() => setOpened((value) => value + 1)}
          >
            <CardMedia src="/card-landscape.svg" alt="" />
            <CardContent>
              <h3 className="surface-example-title">Mountain escape</h3>
              <p className="surface-example-description">A quiet lake above the clouds.</p>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button variant="text" onClick={() => setSaved((value) => value + 1)}>
              Save trip
            </Button>
          </CardActions>
        </Card>
        <Button type="submit">Submit booking</Button>
      </form>
      <p data-testid="surface-action-count">
        Opened: {opened}; Saved: {saved}; Submitted: {submitted}
      </p>
      <Button onClick={() => setDragged((value) => !value)}>Toggle drag appearance</Button>
      <div className="surface-example-grid">
        <Card data-testid="disabled-card">
          <CardActionArea disabled onClick={() => setOpened((value) => value + 1)}>
            <CardContent>Unavailable journey</CardContent>
          </CardActionArea>
        </Card>
        <Card>
          <CardActionArea disableRipple onClick={() => setOpened((value) => value + 1)}>
            <CardContent>No ripple journey</CardContent>
          </CardActionArea>
        </Card>
        <Card>
          <CardActionArea href="#booking-details" ref={linkRef}>
            <CardContent>Read mountain guide</CardContent>
          </CardActionArea>
        </Card>
        <Card>
          <CardActionArea href="#unavailable" disabled onClick={() => setOpened((value) => value + 1)}>
            <CardContent>Unavailable guide</CardContent>
          </CardActionArea>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <label>
              <Checkbox /> Include breakfast
            </label>
          </CardContent>
        </Card>
      </div>
      <Surface ref={surfaceRef} data-testid="surface-ref" className="surface-example-pad">
        <Shape ref={shapeRef} variant="flower" aria-label="Ref illustration" data-testid="shape-ref" />
      </Surface>
      <Button
        onClick={() => {
          surfaceRef.current?.setAttribute('data-ref-checked', 'true');
          shapeRef.current?.setAttribute('data-ref-checked', 'true');
          cardRef.current?.setAttribute('data-ref-checked', 'true');
          actionRef.current?.setAttribute('data-ref-checked', 'true');
          linkRef.current?.setAttribute('data-ref-checked', 'true');
        }}
      >
        Check surface refs
      </Button>
      <p id="booking-details">Mountain guide details.</p>
    </section>
  );
}
