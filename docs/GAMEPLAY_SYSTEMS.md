# Gameplay Systems

This document captures the target shape of future reusable gameplay systems. Do not build all of this at once.

## Objectives

The objective system should eventually support reusable objective types:

- `collect`
- `reach`
- `activate`
- `interact`
- `find`
- `survive`
- `escort`
- `solve`
- `defeat`

Example player-facing structure:

```text
OBJECTIVES
✓ Collect 3 Moonflowers
✓ Activate the fountain
○ Reach the Moon Gate
```

Never create a unique completion system for every new level if the generic objective system can be extended instead.

## Interactions

Create one reusable interaction framework capable of supporting objects such as pressure plates, switches, levers, NPCs, doors, chests, watering points, pushable objects, shrines, checkpoints, teleporters, and quest objects.

All interactions should share predictable concepts:

- `id`
- `type`
- `position`
- `state`
- activation condition
- target
- feedback

## Progression

Progression should initially use local storage. Do not introduce accounts, authentication, cloud saves, or remote databases unless explicitly approved.

Track, over time:

- highest unlocked level
- completed levels
- stars
- secret petals
- best times
- challenge completion
- settings

## Stars

Target structure:

- Star 1: complete the level.
- Star 2: complete the level's exploration goal.
- Star 3: complete the level-specific challenge.

Example challenges: find all secret petals, take no damage, finish under target time, avoid alerting wasps, solve an optional puzzle.

## Secret Petals

Target: three Secret Petals per garden, thirty across ten levels.

Secrets should reward exploration, observation, optional puzzles, clever navigation, or later abilities. Avoid unfair secrets such as arbitrary invisible walls with no visual clue.

## Permanent Abilities

Permanent abilities require explicit approval. Recommended concepts:

- Watering Can: revive plants, grow vines, activate flower mechanisms, create paths.
- Breeze Bell: move lightweight objects, push pollen, redirect certain creatures, activate wind mechanisms.
- Bloom Lantern: reveal hidden objects, illuminate secret areas, reveal magical paths.

Each ability should create multiple gameplay possibilities rather than solve one scripted event.

## Power Blooms

Temporary Power Blooms should remain distinct from permanent abilities. Existing concepts include Swift Seed, Frost Petal, and Heart Leaf.

Improve visual feedback, audio feedback, duration communication, and interactions with level mechanics before continually adding more Power Bloom types.

## Enemies

Enemies should be readable rather than unpredictable.

- Beetle: predictable patrol threat.
- Bee: detection and chase enemy.
- Wasp: territorial high-danger enemy.

Before adding enemy species, improve clarity and depth of existing behaviors. Enemies should communicate state visually when appropriate: idle, patrol, suspicious, alert, chase, cooldown, return, frozen.

## Finale

Level 10 should eventually become a unique multi-stage finale that tests skills from previous gardens. Avoid simply increasing enemy count.

Possible structure:

- Phase 1: avoid hazards.
- Phase 2: activate multiple garden shrines.
- Phase 3: combine abilities.
- Phase 4: restore the corrupted garden.

A boss-like entity is acceptable without requiring conventional combat.
