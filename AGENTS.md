# SizeKit Agent Instructions

## Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any Expo/React Native code.

## Product & engineering rules

Follow the always-on Cursor rules in `.cursor/rules/`:

- `sizekit-product.mdc` — identity, positioning, MVP stage
- `sizekit-architecture.mdc` — offline, no backend, no paid/AI APIs, privacy
- `sizekit-monetization.mdc` — free+ads + lifetime Pro (no subscriptions)
- `sizekit-engineering.mdc` — UX, deps, errors, performance, workflow

Hard constraints in short: no backend, no paid APIs, no AI APIs, process files on-device, keep the MVP core compress → save/share flow working before adding extras.
