# QA and Testing

A task is complete only when requested behavior works, architecture remains understandable, TypeScript passes, lint passes, relevant tests pass, production build succeeds, mobile behavior is considered, regressions have been checked, documentation is updated when necessary, and the Product Owner can review the result.

## Required Validation

Run at minimum:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Run relevant Playwright/gameplay tests when available.

Failures must be resolved or clearly reported before the task is considered complete.

## Gameplay Regression Targets

Regression testing should eventually cover all ten levels. Each level should verify:

- loads
- player spawns
- movement works
- collectibles spawn
- objectives initialize
- hazards initialize
- damage works
- gate logic works
- completion works
- restart works
- pause works
- resume works
- next level loads

Specific mechanics need their own tests.

Example pressure plate checks:

- inactive initially
- activates when player enters
- linked gate responds
- state resets correctly
- restart restores initial state

## Visual Regression

Use screenshots where UI or level presentation changes. Capture key states such as start screen, level start, active gameplay, pause menu, win screen, loss screen, level select, and settings.

Mobile screenshots are preferred for mobile UI changes.

## Performance Testing

Performance-sensitive changes should inspect frame stability, initial loading time, memory use, asset size, and number of active game objects.

Report obvious regressions.

## Review Questions

After every meaningful feature, present the Product Owner with simple questions:

- Gameplay: does this feel fun?
- Clarity: did you understand what to do?
- Controls: did anything feel awkward?
- Difficulty: too easy, fair, or frustrating?
- Art: does it look like Flower Quest?
- Feedback: did the game clearly respond to your actions?
- Performance: did you notice stuttering or delays?
- Approval: keep, revise, or remove?
