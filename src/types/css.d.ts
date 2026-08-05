// Ambient declarations for stylesheet imports, so side-effect CSS imports
// (globals.css, highlight.js themes) type-check in editors running newer
// TypeScript versions that flag untyped side-effect imports.
declare module '*.css';
