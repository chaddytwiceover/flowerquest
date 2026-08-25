# Asset Pipeline

Prefer reusable assets. Generated artwork must fit the established Flower Quest art direction and should not visibly degrade existing art without Product Owner approval.

## Performance Rules

Mobile performance is mandatory. Consider texture sizes, map dimensions, active sprites, particles, physics bodies, effects, audio, memory, and initial download size.

Target loading model:

```text
BOOT
-> Load shared assets
-> Menu becomes playable
-> Load selected level
-> Optionally preload next level
```

Do not preload all future maps just because they exist.

## Asset Strategy

As the project grows, evaluate:

- sprite sheets
- texture atlases
- compressed images
- optimized audio
- asset manifests
- level-specific asset bundles

Obvious performance regressions should be reported instead of hidden.

Target stable 60 FPS where reasonably achievable on modern phones. Graceful behavior on lower-end hardware is more important than excessive visual effects.
