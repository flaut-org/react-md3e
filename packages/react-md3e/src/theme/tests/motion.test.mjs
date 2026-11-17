import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createTheme, themeToCss } from '@flaut-travel/react-md3e/theme';

const speeds = ['fast', 'default', 'slow'];
const kinds = ['spatial', 'effects'];
const values = (spring) => spring.easing.slice(7, -1).split(',').map(Number);

function atTime(spring, seconds) {
  const samples = values(spring);
  const index = ((seconds * 1000) / spring.duration) * (samples.length - 1);
  const start = Math.floor(index);

  return samples[start] + (samples[start + 1] - samples[start]) * (index - start);
}

test('motion provides both official six-spring schemes independently of the palette variant', () => {
  const expressive = createTheme();
  const standard = createTheme({ motionScheme: 'standard' });
  const expressivePalette = createTheme({ variant: 'expressive', motionScheme: 'standard' });

  assert.equal(expressive.motionScheme, 'expressive');
  assert.equal(standard.motionScheme, 'standard');
  assert.equal(expressivePalette.motionScheme, 'standard');
  assert.deepEqual(standard.schemes, expressive.schemes);
  assert.deepEqual(expressivePalette.motion, standard.motion);
  assert.deepEqual(JSON.parse(JSON.stringify(standard)), standard);
  assert.ok(Object.isFrozen(standard.motion.fast.spatial));

  for (const [index, speed] of speeds.entries()) {
    assert.equal(expressive.motion[speed].spatial.stiffness, [800, 380, 200][index]);
    assert.equal(expressive.motion[speed].spatial.damping, [0.6, 0.8, 0.8][index]);
    assert.equal(standard.motion[speed].spatial.stiffness, [1400, 700, 300][index]);
    assert.equal(standard.motion[speed].spatial.damping, 0.9);
    assert.equal(expressive.motion[speed].effects.stiffness, [3800, 1600, 800][index]);
    assert.equal(expressive.motion[speed].effects.damping, 1);
    assert.deepEqual(standard.motion[speed].effects, expressive.motion[speed].effects);
    assert.ok(standard.motion[speed].spatial.duration < expressive.motion[speed].spatial.duration);
  }

  assert.ok(expressive.motion.fast.spatial.duration < expressive.motion.default.spatial.duration);
  assert.ok(expressive.motion.default.spatial.duration < expressive.motion.slow.spatial.duration);
});

test('compiled curves preserve spring overshoot, monotonic effects, endpoints, and numerical accuracy', () => {
  for (const motionScheme of ['expressive', 'standard']) {
    const theme = createTheme({ motionScheme });

    for (const speed of speeds) {
      for (const kind of kinds) {
        const spring = theme.motion[speed][kind];
        const samples = values(spring);

        assert.equal(samples.length, 81);
        assert.equal(samples[0], 0);
        assert.equal(samples.at(-1), 1);
        assert.ok(samples.every(Number.isFinite));
        assert.ok(Number.isInteger(spring.duration) && spring.duration > 0 && spring.duration < 1000);

        if (kind === 'effects') {
          assert.ok(
            samples.every((value, index) => value >= 0 && value <= 1 && (index === 0 || value >= samples[index - 1])),
          );
        }
      }
    }
  }

  const expressive = createTheme().motion;
  const standard = createTheme({ motionScheme: 'standard' }).motion;

  // Independent unit-step reference points: expressive fast peak and critical default effect at t=0.1s.
  assert.ok(Math.abs(atTime(expressive.fast.spatial, 0.13884) - 1.09478) < 0.003);
  assert.ok(Math.abs(atTime(expressive.default.effects, 0.1) - 0.90842) < 0.003);
  assert.ok(Math.max(...values(expressive.fast.spatial)) > 1.09);
  assert.ok(Math.max(...values(standard.fast.spatial)) < 1.002);
});

test('all motion CSS tokens export as static CSS and malformed scheme choices are rejected', () => {
  const theme = createTheme({ motionScheme: 'standard' });
  const css = themeToCss(theme, { selector: '.standard' });

  for (const speed of speeds) {
    for (const kind of kinds) {
      const prefix = `--md-sys-motion-spring-${speed}-${kind}`;
      const spring = theme.motion[speed][kind];

      assert.equal(theme.cssVariables[`${prefix}-duration`], `${spring.duration}ms`);
      assert.equal(theme.cssVariables[`${prefix}-easing`], spring.easing);
      assert.equal(theme.cssVariables[`${prefix}-stiffness`], String(spring.stiffness));
      assert.equal(theme.cssVariables[`${prefix}-damping`], String(spring.damping));
      assert.ok(css.includes(`${prefix}-duration: ${spring.duration}ms;`));
      assert.ok(css.includes(`${prefix}-easing: linear(`));
    }
  }

  for (const motionScheme of ['legacy', '', 42, {}, []]) {
    assert.throws(() => createTheme({ motionScheme }), /motionScheme/);
  }
});
