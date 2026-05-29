# Google Play Execution Report - 2026-05-28

## SplashLens

- Play Console app: `SplashLens Field Tools`
- Correct developer account: `ThrottleShare`
- Correct developer account ID: `7017771963942604688`
- Play Console app ID: `4974110437390812521`
- Package: `com.splashlens.fieldtools`
- Uploaded artifact: `play-store-artifacts/SplashLens-Field-Tools-1.0.0-v1-com.splashlens.fieldtools-signed.aab`
- Production release: `1.0.0 Android launch`, version `1 (1)`
- Production track: `https://play.google.com/console/u/2/developers/7017771963942604688/app/4974110437390812521/tracks/4697669214915845586`
- Publishing overview: `https://play.google.com/console/u/2/developers/7017771963942604688/app/4974110437390812521/publishing`
- Console status observed after submission: `Changes in review`
- Upload-key SHA-256: `9F:B4:69:CF:41:91:74:BF:76:21:32:34:AF:7A:53:0D:75:02:58:0A:33:77:C9:D8:91:71:E4:E9:4B:17:2E:96`
- Current asset links: `.well-known/assetlinks.json` includes the upload-key fingerprint for `com.splashlens.fieldtools`.
- Follow-up after Play review/signing: add the Google Play App Signing SHA-256 for `com.splashlens.fieldtools` to `https://app.splashlens.com/.well-known/assetlinks.json` once Google assigns it.

## Privacy Policy Rejection Fix

- Google rejected the first review because `https://app.splashlens.com/privacy.html` was resolving to the app shell instead of a standalone privacy policy.
- Fixed in Git commit `7a97654`: added `privacy.html`, added `data-deletion.html`, and updated the Play launch packet to use the direct `200 OK` policy URL.
- Production Cloudflare Pages deployment `8eb0c0f4-f07e-4657-87f7-badd4304c98b` now serves `https://app.splashlens.com/privacy` as a standalone policy page.
- `https://app.splashlens.com/privacy.html` redirects to `/privacy` and now resolves to the same policy content.
- Play Console should use privacy policy URL: `https://app.splashlens.com/privacy`.

## 2026-05-29 Resubmission

- Logged into the correct ThrottleShare Google Play developer lane: developer ID `7017771963942604688`, app ID `4974110437390812521`.
- Updated the App content privacy policy declaration from `https://app.splashlens.com/privacy.html` to `https://app.splashlens.com/privacy`.
- Saved the declaration and sent all pending changes for review from Publishing overview.
- Play Console showed `Changes in review`; after the quick-check pass, the page showed `Your changes are now in review`.
- Evidence screenshots were saved in the working root:
  - `play-console-after-save.png`
  - `play-console-after-submit.png`
  - `play-console-after-submit-90s.png`

## Superseded Personal-Account App

The earlier personal-account app under `warmsnowman831` used package `com.splashlens.app`. That package is locked to the wrong developer account and should not be used for the ThrottleShare launch lane.

## Submission Verdict

SplashLens Android production has been submitted from the ThrottleShare Google Play account. Google Play still needs to finish its review and assign the production app-signing certificate before the final Android asset-links update can be completed.
