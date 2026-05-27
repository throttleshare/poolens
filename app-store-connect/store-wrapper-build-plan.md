# SplashLens iOS Store Wrapper Build Plan

## Target

Build a native iOS wrapper around:

`https://app.splashlens.com/?store=ios`

## Required Behavior

- Opens directly into SplashLens.
- Uses SplashLens public brand; PoolLens may only appear as formerly/merged context if visible.
- No account required for core use.
- Manual lookup, calculators, guides, checklists, and notes are usable after first load.
- Online scanner tools clearly require internet.
- Camera/photo permissions are requested only when the user starts scanner flow.
- Privacy/support links are reachable.
- Store-wrapper mode hides direct Stripe checkout and web-subscription CTAs.

## Suggested Native Setup

- Use Capacitor or an equivalent iOS WebView wrapper.
- Bundle ID: use the developer-account-safe namespace, suggested `com.belowzeromedia.splashlens` if available.
- App name: `SplashLens Field Tools`.
- Enable camera/photo permissions only if scanner flow is included.
- Add permission usage copy that says images are selected for scanner analysis.

## Pre-Submission QA

1. Fresh install on simulator.
2. Launch online and verify home screen loads.
3. Open error lookup.
4. Open calculator.
5. Create a service note with fake data.
6. Open scanner and confirm permission prompt timing.
7. Toggle network off after first load and verify manual/core flows remain usable.
8. Confirm `store=ios` mode does not show direct Stripe checkout CTAs.
9. Confirm privacy URL opens.
10. Capture screenshots from clean fake data.

## Stop Conditions

Do not submit if:

- Old PoolLens branding dominates the app.
- Direct Stripe/web subscription buttons appear in iOS wrapper mode.
- Scanner can run unlimited anonymous production requests without metering.
- Route Ready appears as completed certification without real modules and certificate verification.
- Privacy links fail.
