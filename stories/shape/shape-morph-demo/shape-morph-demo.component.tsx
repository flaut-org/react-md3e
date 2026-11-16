import { useState } from 'react';
import { Button, Shape, shapeVariants } from '@flaut-org/react-md3e';
import type { ShapeSize, ShapeVariant } from '@flaut-org/react-md3e';
import landscape from '../../card/assets/card-landscape.svg';

export function ShapeMorphDemo() {
  const [variant, setVariant] = useState<ShapeVariant>('circle');
  const [morph, setMorph] = useState(true);
  const [size, setSize] = useState<ShapeSize>('large');

  return (
    <div data-testid="shape-morph-demo" className="shape-morph-demo">
      <div className="shape-morph-examples">
        <Shape
          variant={variant}
          morph={morph}
          size={size}
          aria-label="Morphing illustration"
          data-testid="morphing-shape"
        />
        <Shape variant={variant} morph={morph} size={size} aria-label="Morphing landscape" data-testid="morphing-image">
          <img src={landscape} alt="" />
        </Shape>
        <Shape variant={variant} morph={false} size={size} data-testid="morph-target" />
      </div>
      <label className="shape-morph-field">
        Shape target
        <select value={variant} onChange={(event) => setVariant(event.target.value as ShapeVariant)}>
          {shapeVariants.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <div className="shape-morph-actions">
        <Button variant="tonal" onClick={() => setVariant('circle')}>
          Circle
        </Button>
        <Button variant="tonal" onClick={() => setVariant('flower')}>
          Flower
        </Button>
        <Button variant="tonal" onClick={() => setVariant('heart')}>
          Heart
        </Button>
        <Button variant="tonal" onClick={() => setVariant('pixelTriangle')}>
          Pixel triangle
        </Button>
        <Button variant="outlined" onClick={() => setMorph((enabled) => !enabled)}>
          {morph ? 'Disable morphing' : 'Enable morphing'}
        </Button>
        <Button variant="text" onClick={() => setSize((current) => (current === 'large' ? 'small' : 'large'))}>
          Toggle shape size
        </Button>
      </div>
      <p role="status">Current shape: {variant}</p>
      <p>The final silhouette is also shown with its exact static SVG mask.</p>
    </div>
  );
}
