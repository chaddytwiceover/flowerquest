# UI and Touch UX

Flower Quest is primarily a portrait mobile game. Touch must be treated as the primary control method.

## UI Philosophy

The interface should feel like a game, not a dashboard. Keep gameplay UI minimal.

Primary HUD priorities:

- objective progress
- health
- important temporary status
- pause/settings

Information that is only occasionally important should appear contextually.

## Touch Rules

Maintain:

- large movement interaction zone
- forgiving input
- no tiny mandatory buttons
- safe-area awareness
- minimal finger obstruction

Frequently used touch targets should be roughly 44x44 CSS pixels or greater.

Movement should support:

- full-screen drag
- optional visible joystick
- keyboard
- gamepad

Future accessibility options may add sensitivity, dead zone, tap-to-move, and left-hand mode.

## Mobile Layout

Test important UI at multiple portrait sizes:

- 390x844
- 393x852
- 430x932
- small Android portrait
- large Android portrait
- desktop

Respect:

```css
env(safe-area-inset-top)
env(safe-area-inset-right)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
```

Avoid placing critical controls against screen edges.

## UI Regression Rule

Never approve a UI change based only on desktop. If changing HUD, menus, buttons, touch input, result screen, level select, or settings, test at mobile dimensions.
