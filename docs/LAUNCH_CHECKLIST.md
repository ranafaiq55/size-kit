# SizeKit — Launch checklist (Play Store + Ads)

Use this when the Compress MVP works reliably on Android devices.

## Now (while building)

- [x] On-device photo processing (no upload)
- [x] Clear permission rationale copy
- [x] Privacy policy draft in `docs/PRIVACY_POLICY.md`
- [x] `AdService` stub (no live ads yet)
- [x] Android package id: `com.sizekit.app`

## Before first Play upload

1. Create a **Google Play Developer** account (~$25 one-time).
2. Host the privacy policy at a public HTTPS URL (GitHub Pages is fine).
   - Suggested path from this repo: enable Pages from `/docs` or a `gh-pages` branch with `privacy.html` generated from `PRIVACY_POLICY.md`.
   - Update the URL in `src/screens/SettingsScreen.tsx` if it differs.
3. Create the Play Console app with package `com.sizekit.app`.
4. Complete **Data safety**, content rating, store listing, screenshots.
5. Build a release AAB with EAS or a local release build.

## Before turning on ads (money)

1. Create an **AdMob** account (same Google account is fine).
2. Add the Android app in AdMob (`com.sizekit.app`).
3. Create ad units (start with one banner + one interstitial).
4. Update privacy policy to describe ads / advertising ID.
5. Wire AdMob into `src/services/adService.ts` (replace no-op).
6. Add UMP consent form for EU/UK users.
7. Test with AdMob **test** unit IDs before production IDs.
8. Submit a Play update; wait for policy review if required.

## Do not do yet

- Live AdMob SDK with production IDs
- Subscriptions
- Backend / analytics SDKs without discussion
