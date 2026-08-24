# Flower Quest Agent Guide

Monnie's Flower Quest is a portrait-first 2D adventure game about exploration, magical gardens, environmental puzzles, collectibles, abilities, enemy avoidance, secrets, and progression.

North star: Explore -> Discover -> Interact -> Solve -> Collect -> Unlock -> Progress.

Do not turn the project into a complicated RPG, multiplayer game, live-service game, crafting game, loot game, combat-heavy action game, or backend-heavy application.

## Authority

The project owner is Creative Director and Product Owner. Ask for approval before making major decisions about game feel, visual style, difficulty, character appearance, level concepts, story, mechanics, UI/UX, accessibility, scope, or release direction.

Agents own implementation, tests, refactoring, investigation, documentation, and technical risk reporting. Minor implementation decisions are fine when they do not change product direction.

## Mandatory Workflow

For significant tasks:

1. Inspect relevant instructions, existing implementation, reusable systems, tests, regression risks, and whether the feature already partially exists.
2. Plan the goal, current architecture, proposed files/systems, risks, tests, and explicit out-of-scope items.
3. Implement only the approved scope.
4. Validate with `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`. Run relevant gameplay/Playwright checks when available.
5. Report changed files, tests, results, limitations, preview/screenshots when relevant, and Product Owner decisions needed.

Before implementing anything significant, state the scope guard, for example: no level redesign, no Phaser upgrade, no UI overhaul, no save-system changes, no new dependencies, no unrelated level changes.

## Branch Policy

Do not work directly on `main` unless explicitly instructed. Use one dedicated branch per major concept, such as:

- `feat/save-progression`
- `feat/interaction-system`
- `feat/level-7-switch-puzzle`
- `fix/mobile-input-drift`
- `perf/level-asset-loading`
- `refactor/game-scene-runtime`
- `test/level-regression-suite`

Keep changes small to medium and reviewable. Prefer separate PRs for a generic framework and a level that uses it.

## Current Architecture

- App entry and React UI: `src/components/game`
- Phaser runtime: `src/game`
- Main orchestration: `src/game/scenes/GameScene.ts`
- Reusable systems: `src/game/systems`
- Level configuration: `src/game/levels`
- Shared level/game types: `src/game/types.ts`
- QA scripts and smoke tests: `scripts`

`GameScene` should orchestrate gameplay. It should not accumulate every mechanic implementation. If mechanic-specific logic grows, propose extracting it into a reusable system.

Gameplay should become increasingly data-driven. Levels should primarily contain configuration, while reusable behavior lives in systems.

## Product Rules

- Touch is primary. Preserve portrait mobile usability and safe areas.
- UI should feel like a game, not a dashboard.
- Difficulty should come from readable mechanics, not simply more enemies.
- Preserve Monnie's role as the center of the game. Do not radically change her appearance without approval.
- Keep storytelling light: short dialogue, environmental clues, reactions, and concise objectives.
- Do not introduce permanent abilities, accounts, cloud saves, remote databases, new enemy species, major dependencies, or Phaser upgrades without approval.

## Validation Commands

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Use mobile screenshots for HUD, menus, touch input, result screens, level select, settings, or other UI changes. Important portrait baselines: 390x844, 393x852, and 430x932.

## Documentation

Read the focused docs before related work:

- `docs/GAME_VISION.md`
- `docs/ARCHITECTURE.md`
- `docs/GAMEPLAY_SYSTEMS.md`
- `docs/LEVEL_DESIGN.md`
- `docs/UI_UX.md`
- `docs/ACCESSIBILITY.md`
- `docs/ASSET_PIPELINE.md`
- `docs/QA.md`
- `docs/RELEASE.md`
- `docs/ROADMAP.md`
- `docs/CLEANUP_AUDIT.md`
