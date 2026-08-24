# Monnie's Flower Quest (v3)

A cohesive redesign and expansion of **Monnie's Flower Quest** applying modern mobile design principles, sleek floating glassmorphic HUD, full-screen touch vector steering, and strategic Power Blooms across **all 10 levels**.

Guide Monnie through ten handcrafted gardens, collect every bloom, seize power blooms, dodge beetles, bees, and wasps, and unlock the garden gates.

## Key Features

- **10 Playable Levels**: Full progressive campaign from sunny meadows to the Grand Royal Maze.
- **Sleek Minimalist HUD**: Floating frosted glass pills (`[ Level N • 🌸 3/8 ]`, glowing pulse hearts, action controls, and active power-up meters).
- **Invisible Full-Screen Touch**: Zero visual clutter with smooth proportional vector drag controls on mobile and desktop.
- **Strategic Power Blooms**:
  - 🟡 **Swift Seed**: +50% movement speed and speed trails (4.0s).
  - 🔵 **Frost Petal**: Freezes all enemies in place with icy tint (3.0s).
  - 💚 **Heart Leaf**: Restores 1 Heart.
- **Reactive Finite State Machine (FSM) AI**:
  - **Beetles**: Waypoint patrol paths.
  - **Bees 🐝**: Lazy patrol → Alert emote (`!`) → High-speed pursuit → Disengage cooldown.
  - **Wasps 🐝**: Stationary territory guards → Hyper-aggressive burst in zone → Leash return.
- **Web Audio Engine**: Procedural 8-bit / 16-bit chiptunes and responsive SFX (power-up chimes, alerts, freeze crunch).
- **Deployment Ready**: Optimized for Vercel deployment and iframe / demo hosting on `chaddytwiceover.com`.

## Local Development

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:8080`.

## Production Build

```bash
npm run build
```

