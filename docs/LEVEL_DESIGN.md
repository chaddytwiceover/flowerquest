# Level Design

Every level should eventually have visual identity, gameplay identity, narrative identity, and optional discovery.

## Level Identity

Visual identity: the garden should look recognizable.

Gameplay identity: the level should introduce, emphasize, or remix a specific mechanic.

Narrative identity: something should make the garden feel like a location rather than merely a map.

Optional discovery: secrets or optional exploration should reward curiosity.

Difficulty should increasingly come from combinations of mechanics. Do not make levels harder simply by adding more enemies.

## Campaign Structure

| Level | Purpose |
| --- | --- |
| 1 | Movement and collecting |
| 2 | Patrol timing |
| 3 | Exploration and gates |
| 4 | Multiple objectives |
| 5 | Power Blooms |
| 6 | Moving/environmental hazards |
| 7 | Switch puzzles |
| 8 | Enemy awareness / stealth |
| 9 | Multi-stage adventure challenge |
| 10 | Finale combining learned mechanics |

## Level Change Discipline

Change one level at a time unless the task is explicitly about shared infrastructure or regression testing across levels.

Prefer:

- Add or improve a generic system.
- Validate it in a small test or single level.
- Use it in a later level-specific change.

Avoid:

- Rebuilding all ten levels in one change.
- Adding one-off mechanics in level runtime code.
- Increasing difficulty through clutter.
- Hiding important clues from the player.
