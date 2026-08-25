# Cleanup Audit

This audit records Phase 2 cleanup decisions. Cleanup should remain incremental and separate from gameplay changes.

## Removed

- `src/lib/multiplayer`: removed because it was unreferenced by app code, scripts, and docs except for its own exports. Multiplayer is explicitly out of scope for Flower Quest.
- Package metadata name: changed from the historical `app-builder-workspace` label to `flowerquest`.

## Deferred

Authentication and database infrastructure remain in place for now.

Reasons:

- `src/routes/__root.tsx` imports `AuthProvider`.
- `src/routes/login.tsx` imports auth client helpers.
- `src/routes/api/auth/$.ts` routes requests to Better Auth.
- `vite.config.ts` bootstraps PGLite during dev.
- `npm run build` runs database migration and PGLite asset copy scripts.

This still looks broader than Flower Quest ultimately needs, but it is not clearly unused yet. Removing it safely should be a dedicated cleanup branch with route rewiring, dependency removal, lockfile updates, and browser/build validation.

## Future Candidates

- Auth route, login route, Better Auth client/server modules, and auth dependencies.
- PGLite/Neon database fallback and migration scripts.
- Unused UI dependencies from the app-builder starter.
- Historical browser-smoke naming that still uses app-builder-oriented screenshot defaults.
- Generated `.vercel/output` tracking strategy.

Before deleting any candidate, verify references, typecheck, tests, production build, and at least one browser gameplay smoke run.
