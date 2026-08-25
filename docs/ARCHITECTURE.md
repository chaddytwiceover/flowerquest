# Architecture

Flower Quest should become increasingly data-driven. Gameplay capabilities should live in reusable systems, and levels should primarily contain configuration.

Preferred:

```ts
interactions: [
  {
    type: "pressure-plate",
    id: "plate-a",
    x: 500,
    y: 850,
    activates: ["gate-a"],
  },
]
```

Avoid large blocks of level-specific special cases inside runtime code.

## Current Layout

- `src/game/scenes/GameScene.ts`: Phaser gameplay orchestration.
- `src/game/systems`: reusable gameplay systems such as collectibles, hazards, objectives, powerups, water, obstacles, lives, exit, and world.
- `src/game/levels`: level definitions for the current ten levels.
- `src/game/types.ts`: shared level and gameplay types.
- `src/components/game`: React shell, HUD, start/result/pause UI, joystick, and game canvas.
- `scripts`: QA, smoke, migration, and browser helper scripts.

## GameScene Rule

`GameScene` should orchestrate gameplay:

```text
GameScene
-> PlayerSystem
-> ObjectiveSystem
-> InteractionSystem
-> EnemySystem
-> ProgressionSystem
-> EffectsSystem
```

It should not eventually contain the implementation for every gameplay mechanic. If it begins accumulating large mechanic-specific sections, propose an incremental extraction.

## Target Systems

Introduce these only when needed:

- Player
- Input
- Movement
- Interactions
- Objectives
- Collectibles
- Hazards
- Enemies
- Power-ups
- Abilities
- Doors / Gates
- Switches
- Dialogue
- Secrets
- Progression
- Save Data
- Audio
- Effects
- Accessibility
- Level Runtime
- Testing

## Dependency Policy

Do not add dependencies casually. Before adding one, answer:

1. Can Phaser already do this?
2. Can browser APIs already do this?
3. Can existing project dependencies do this?
4. Is maintaining the dependency justified?

Prefer simple internal code for small problems. Large specialized capabilities may justify dependencies when they clearly reduce risk or complexity.

## Cleanup Policy

Cleanup should be incremental and separate from gameplay work. Candidates include unused authentication, database code, server code, packages, generated scaffolding, UI libraries, and historical app-builder hooks.

Never delete infrastructure merely because it appears unused. First verify references and build behavior.

## Phaser Migration

Migration from Phaser 3 to Phaser 4 should be a dedicated project phase. Do not combine it with new levels, new mechanics, UI redesign, or finale work.

Required sequence: baseline tests -> migration branch -> compile -> automated regression suite -> manual mobile playtest -> fix regressions -> merge.
