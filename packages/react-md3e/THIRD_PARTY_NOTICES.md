# Third-party notices

The separate `dist/theme.js` build includes Material Color Utilities 0.4.0 by Google LLC, licensed
under Apache License 2.0. The original license is included in
`licenses/material-color-utilities.txt`; source license comments are retained in the bundle. Source:
https://github.com/material-foundation/material-color-utilities

Button size, type-scale, and motion measurements reference AndroidX Material3 tokens, Copyright 2024
The Android Open Source Project, Apache License 2.0. Source revision and CSS adaptations are
documented in the repository's `docs/components/button.md`.

Linear ProgressIndicator's indeterminate animation parameters adapt MUI LinearProgress,
Copyright (c) 2014 Call-Em-All, MIT License. The original license is included in
licenses/mui-material.txt. The source revision is 5eb2eeeb399f5b4edfee73a77deabdbe8ebef275:
https://github.com/mui/material-ui/blob/5eb2eeeb399f5b4edfee73a77deabdbe8ebef275/packages/mui-material/src/LinearProgress/LinearProgress.js
Only the keyframe positions, easing and cycle timing are adapted. The React/SVG implementation,
typed CSS variables and track masking are independent; MUI and Emotion are not dependencies.

The 35 static Shape masks in dist/styles.css derive from AndroidX MaterialShapes, Copyright 2024
The Android Open Source Project, at revision 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e, using
androidx.graphics:graphics-shapes-desktop:1.0.1 (Apache License 2.0). The license is included in
licenses/androidx-material-shapes.txt. The offline export adapter and provenance live in
scripts/shapes in the repository. No AndroidX geometry implementation runs in the browser.
Source: https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialShapes.kt
