# Accessibility

Accessibility should be implemented incrementally, not treated as final polish.

## Target Settings

Controls:

- movement sensitivity
- visible joystick
- gamepad support
- keyboard support

Visual:

- reduced camera shake
- reduced screen flash
- reduced motion
- larger UI
- high-contrast interactables

Gameplay:

- enemy speed assist
- extended timers
- puzzle hints
- additional invincibility window

Audio:

- master volume
- music volume
- SFX volume
- mute

## Implementation Guidance

Accessibility options should be practical and testable. Prefer settings that map directly to systems: input, camera effects, enemy speed, timers, UI scale, audio buses, and hint display.

When a feature introduces difficulty, time pressure, flashes, camera movement, small UI, or required precision, consider whether an accessibility setting should be part of the same work or follow soon after.
