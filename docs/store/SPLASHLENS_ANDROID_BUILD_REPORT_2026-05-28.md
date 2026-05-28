# SplashLens Android Build Report - 2026-05-28

## Result

- Android TWA wrapper created under `android-twa`.
- Package ID: `com.splashlens.app`.
- Start URL: `https://app.splashlens.com/?store=android`.
- PWA manifest upgraded with PNG 192, PNG 512, and maskable 512 icons.
- Release bundle build passed on Windows:
  - Command: `cmd /c gradlew.bat bundleRelease`
  - Output: `android-twa/app/build/outputs/bundle/release/app-release.aab`
- Signed Play upload candidate created:
  - `play-store-artifacts/SplashLens-Field-Tools-1.0.0-v1-signed.aab`
  - Size: 1,389,053 bytes at build time.

## Signing

- Upload keystore is intentionally outside Git:
  - `C:\Users\sales\.keystores\splashlens\splashlens-upload.keystore`
- Password note is intentionally outside Git:
  - `C:\Users\sales\.keystores\splashlens\splashlens-upload-key-DO-NOT-COMMIT.txt`
- Upload-key SHA-256:
  - `9F:B4:69:CF:41:91:74:BF:76:21:32:34:AF:7A:53:0D:75:02:58:0A:33:77:C9:D8:91:71:E4:E9:4B:17:2E:96`

## Web Verification

- `https://app.splashlens.com/manifest.json` includes PNG and maskable icons.
- `https://app.splashlens.com/.well-known/assetlinks.json` returns both the Play app-signing and upload-key fingerprints.
- Mobile browser smoke for `https://app.splashlens.com/?store=android` passed with no console/page errors and no horizontal overflow.

## Play Console Note

Play Console execution completed on 2026-05-28:

- App: `SplashLens Field Tools`.
- Package: `com.splashlens.app`.
- App ID: `4974408849765183344`.
- Internal testing release: `1 (1)`.
- Track URL: `https://play.google.com/console/u/0/developers/6282350079091140184/app/4974408849765183344/tracks/4701681232437528783?tab=releases`.
- Internal tester list: `Internal testers` with 1 user.
- Track status after tester save: `Active`.
- Google Play App Signing SHA-256: `A0:72:04:3D:00:60:69:48:55:CC:2B:01:95:DA:D8:9B:76:D7:52:F7:BB:C5:B8:7D:80:FB:DF:61:B4:F9:23:1F`.
- Live `https://app.splashlens.com/.well-known/assetlinks.json` now includes both the Google app-signing key and upload-key SHA-256 fingerprints.

Production is still gated by Google Play's closed-testing requirement for this account: at least 12 opted-in testers for at least 14 days before applying for production access.
