# SplashLens App Privacy Labels Draft

This draft is for App Store Connect. Final answers should match the submitted wrapper exactly.

## Initial Store Wrapper Posture

- Account required: No.
- Tracking: No.
- Third-party advertising tracking: No.
- Precise location: No.
- Payment data: No, not in the initial free-core store wrapper.
- Health data: No.
- Contacts: No.
- Browsing history: No.

## Data Types Likely Disclosed

### User Content

Applies when a user chooses to use scanner or notes features.

- Examples: user-selected equipment/test-strip/part photos, service notes, report text.
- Purpose: app functionality.
- Linked to user: No account is required; final disclosure depends on backend logging and device identifiers.
- Used for tracking: No.

### Diagnostics

Applies if the deployed wrapper or hosting stack collects crash or performance data.

- Purpose: app functionality and performance.
- Linked to user: usually no, unless a crash tool links events to identifiers.
- Used for tracking: No.

### Usage Data

Only disclose if analytics are enabled in the submitted wrapper.

- Purpose: product analytics and app functionality.
- Linked to user: should be no for the initial wrapper.
- Used for tracking: No.

## AI Scanner Disclosure

If the user opens the AI scanner and selects/captures an image, the image may be uploaded for analysis. Scanner results are generated as assistance and should be verified by the user.

Recommended reviewer-safe language:

`The app only processes scanner images after the user chooses the scanner flow and provides an image. Scanner images are used to return the requested app result and are not used for advertising tracking.`

## What To Avoid In ASC

- Do not mark payment data collected unless native paid checkout is added.
- Do not mark health/fitness data.
- Do not imply no data leaves device if online scanner is enabled.
- Do not claim completed data deletion workflows unless they are implemented and reachable.

## Public Policy URL

Use:

`https://splashlens.com/privacy.html`
