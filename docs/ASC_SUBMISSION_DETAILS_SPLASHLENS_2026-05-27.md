# SplashLens App Store Connect Submission Packet

Generated: 2026-05-27

This is the Mac handoff packet for creating the SplashLens iOS wrapper record in App Store Connect. It should stay aligned with the live PWA at `https://app.splashlens.com/?store=ios`.

## Verdict

SplashLens now has the App Store Connect packet that was missing from the portfolio promise lane.

Use this packet for metadata, privacy labels, screenshots, and reviewer notes. Do not submit paid entitlement, unlimited AI, or Route Ready certificate claims until native billing, production metering, and certificate verification are actually built.

## Apple Lane

- App name: `SplashLens Field Tools`
- Subtitle: `Pool tech codes and notes`
- Suggested bundle ID: `com.belowzeromedia.splashlens`
- Suggested SKU: `splashlens-ios-2026`
- Primary category: `Utilities`
- Secondary category: `Productivity`
- Pricing: Free
- Initial purchase model: no in-app purchases
- Wrapper URL: `https://app.splashlens.com/?store=ios`
- Marketing URL: `https://splashlens.com`
- Support URL: `https://splashlens.com`
- Privacy URL: `https://splashlens.com/privacy.html`
- Age rating target: 4+

If the Apple developer account already has a different bundle namespace, use the account-approved namespace instead of the suggested bundle ID.

## Product Promise

SplashLens is a pool-service field reference app for technicians who need fast lookup, job notes, and lightweight field tools.

Built promises:

- Error-code lookup and reference workflows.
- Chemical dosing calculators and service math.
- Service notes and report-style field records.
- Filter guides, checklists, and offline app shell after first load.
- Optional online AI scanner for equipment displays, pool parts, and test strips.

Careful promises:

- AI scans are assistance only and require verification.
- Route Ready is a pilot/planned training layer unless modules and certificate verification are present in the submitted build.
- Affiliate/search links are convenience links and must be disclosed as such.

Do not promise:

- Unlimited AI scanning.
- Completed training certificates.
- Manufacturer endorsement.
- Guaranteed diagnosis, repair, or chemical safety.
- Paid entitlement features before native billing and metering are production-ready.

## ASC Metadata Files

The text files for App Store Connect are in:

- `app-store-connect/metadata/en-US/name.txt`
- `app-store-connect/metadata/en-US/subtitle.txt`
- `app-store-connect/metadata/en-US/promotional_text.txt`
- `app-store-connect/metadata/en-US/description.txt`
- `app-store-connect/metadata/en-US/keywords.txt`
- `app-store-connect/metadata/en-US/support_url.txt`
- `app-store-connect/metadata/en-US/marketing_url.txt`
- `app-store-connect/metadata/en-US/privacy_url.txt`

## App Review Notes

Use:

- `app-store-connect/review_notes.txt`

Reviewer framing:

- This is a free utility/reference wrapper around the SplashLens PWA.
- No account is required for core use.
- Manual tools work offline after first load.
- Camera/photo access is user-initiated and only used for the optional AI scanner.
- Online AI scan features require internet access.
- Store wrapper mode must not show direct Stripe checkout or web-subscription CTAs.

## Screenshot Plan

Use:

- `app-store-connect/screenshot-plan.md`

Required shots:

1. Home/rescue quick actions.
2. Error-code lookup result.
3. Chemical dosing calculator.
4. AI scanner mode selector or scan result with verification language visible.
5. PartSnap/search workflow with convenience-link posture.
6. Service note/report screen.

Avoid screenshots that imply completed certificates, official manufacturer status, or paid native subscription unlocks.

## Privacy Labels

Use:

- `app-store-connect/privacy-nutrition-labels.md`

Initial disclosure posture:

- No account required.
- No tracking.
- No precise location.
- No payment data collected by the initial store wrapper.
- Local service notes may be stored on device/browser storage.
- User-selected images may be uploaded for online AI scanner analysis.
- AI scanner data is for app functionality, not advertising tracking.

## Store Wrapper Build Plan

Use:

- `app-store-connect/store-wrapper-build-plan.md`

Mac should build a native iOS wrapper around:

`https://app.splashlens.com/?store=ios`

Before submission, Mac must verify:

- The app opens directly into SplashLens, not an old PoolLens brand.
- Direct Stripe or web upgrade CTAs are hidden in `store=ios` mode.
- Manual lookup/calculators/notes still work after first load.
- Camera permission is requested only when the user starts scanner flow.
- Privacy and support links are reachable.

## IAP Boundary

Use:

- `app-store-connect/iap-products-draft.md`

Do not attach IAP products to the first submission unless native billing and entitlement checks are implemented in the wrapper. The first submission should be free-core.

## Mac Command

From Mac, after pulling this branch:

```bash
cd ~/PATH/TO/poolens && git pull && open docs/ASC_SUBMISSION_DETAILS_SPLASHLENS_2026-05-27.md
```

Then create or update the iOS wrapper using `https://app.splashlens.com/?store=ios` and copy the metadata from `app-store-connect/`.

## Open Blockers

- Native wrapper project still needs to be created or updated on Mac.
- App Store Connect record still needs manual creation/editing.
- Screenshots still need to be captured from the wrapper or simulator.
- Paid native billing should remain out of scope until IAP/entitlements are real.
- Cloudflare scanner production launch still requires `ANTHROPIC_API_KEY`, `ENVIRONMENT=production`, `SCAN_USAGE_KV`, and `SCAN_RATE_LIMITER`.
