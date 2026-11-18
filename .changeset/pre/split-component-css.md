---
'@flaut-travel/react-md3e': patch
---

Add explicit per-component CSS exports and a separate theme stylesheet. Component CSS includes its shared dependencies while unused families, including Shape geometry, stay off routes that do not import them. Keep the full stylesheet as a compatibility opt-in and preserve CSS-free server-safe JavaScript exports.
