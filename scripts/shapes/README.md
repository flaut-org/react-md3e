# Offline Material shape export

Normal package builds need only the pinned Node.js/asdf toolchain. The 35 paths are checked into
`src/tokens/shape-paths.generated.ts`; Linaria encodes them into CSS at build time. No
geometry library or path generation is used by a component at runtime.

`ExportShapes.kt` adapts the original Apache-2.0 AndroidX MaterialShapes definitions at
revision `89d9aa6a5b9fc6e4847002be42f3c6891b091c9e`:
https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialShapes.kt

The adapter removes Compose UI/path/composable functions, replaces Offset/Matrix with local
2D operations and fastMap with map, and exports the existing normalized cubic contours with six
decimal places. Shape coordinates, corner roundings, repetition/mirroring and rotations are retained.
Rounding and normalization use Google's unmodified graphics-shapes JVM artifact. No shape is
approximated with a hand-drawn star or polygon. This exporter supplies exact static cubic contours.

The normal Node/Linaria build derives compatible 256-point polygons from those checked-in paths in
src/styles/shape-morph.ts, with consistent winding/phase and sharp-corner samples. These approximations
support CSS-only morphing; they do not require rerunning the Java exporter. Exact SVG masks remain
available through morph=false. No sampler or animation geometry enters the UI JavaScript graph.

Only maintainers regenerating assets need a temporary Java/Kotlin toolchain. Verified with:

- Zulu OpenJDK 21.0.6 (an isolated temporary installation; no system/asdf configuration change).
- Kotlin compiler 2.1.20, from JetBrains' official release archive.
- `androidx.graphics:graphics-shapes-desktop:1.0.1` from Google's Maven repository.
- `androidx.collection:collection-jvm:1.5.0` from Google's Maven repository.

Pass tool locations explicitly; no global installation is required:

```sh
asdf exec node scripts/shapes/generate.mjs \
  /path/to/java \
  /path/to/kotlinc \
  /path/to/graphics-shapes-desktop-1.0.1.jar \
  /path/to/collection-jvm-1.5.0.jar
```

The script compiles/runs in a temporary directory, cleans that directory in finally, validates the
catalog, and writes formatted paths only when changed. It leaves geometry names in `shape-variants.ts`
as a deliberate public API catalog; keep those names and the Kotlin export list synchronized when
adopting a different upstream revision. Review the rendered gallery and rerun `npm run check` after
regeneration. The package includes the Apache-2.0 license and provenance in THIRD_PARTY_NOTICES.md.

Verified artifact SHA-256 values:

| Artifact                          | SHA-256                                                          |
| --------------------------------- | ---------------------------------------------------------------- |
| Kotlin compiler 2.1.20 ZIP        | a118197b0de55ffab2bc8d5cd03a5e39033cfb53383d6931bc761dec0784891a |
| graphics-shapes-desktop 1.0.1 JAR | f305c1e1ac3eb7d20e54550f48e07b56a96951473dd3fe7bb8913ed0cd3a5e91 |
| collection-jvm 1.5.0 JAR          | 70b35924e4babcdffa37d0e575ee039c56a2d97123342624c48b603233704341 |
