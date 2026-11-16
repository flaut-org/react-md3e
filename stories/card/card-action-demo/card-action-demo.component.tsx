import { useState } from 'react';
import { Button, Card, CardActions, CardActionArea, CardContent, CardMedia } from '@flaut-org/react-md3e';
import landscape from '../assets/card-landscape.svg';

export function CardActionDemo() {
  const [opened, setOpened] = useState(0);
  const [saved, setSaved] = useState(0);

  return (
    <>
      <Card variant="elevated" className="surface-example-card">
        <CardActionArea onClick={() => setOpened((value) => value + 1)}>
          <CardMedia src={landscape} alt="" />
          <CardContent>
            <h2 className="surface-example-title">Mountain escape</h2>
            <p className="surface-example-description">An alpine lake and a quiet weekend.</p>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button variant="text" onClick={() => setSaved((value) => value + 1)}>
            Save trip
          </Button>
        </CardActions>
      </Card>
      <p>
        Opened: {opened}; Saved: {saved}
      </p>
    </>
  );
}
