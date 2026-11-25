---
'@flaut-travel/react-md3e': minor
---

Automatically load extracted component and ThemeProvider CSS through static implementation imports.
Root named imports and component subpaths retain CSS tree-shaking, shared assets and RSC boundaries.
Keep explicit CSS exports for compatibility and add a CSS-free native Node export graph.
Add a /theme-provider subpath for compositions that use only component subpaths.
Next Webpack root imports require Next's optimizePackageImports setting for CSS pruning;
fully qualified component subpaths work without that setting.
