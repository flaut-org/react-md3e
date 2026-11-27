---
'@flaut-travel/react-md3e': patch
---

Share default breakpoint constants between theme generation and date picker media queries through
a plain TypeScript module. Remove the generated picker media JSON dependency so source checks no
longer require that build artifact. Existing breakpoint values and picker behavior are unchanged.
