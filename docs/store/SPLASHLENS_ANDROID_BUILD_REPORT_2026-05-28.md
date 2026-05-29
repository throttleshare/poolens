# SplashLens Android Build Report - 2026-05-28

## Result

- Android TWA wrapper created under `android-twa`.
- Package ID: `com.splashlens.fieldtools`.
- Start URL: `https://app.splashlens.com/?store=android`.
- PWA manifest upgraded with PNG 192, PNG 512, and maskable 512 icons.
- Release bundle build passed on Windows:
  - Command: `cmd /c gradlew.bat bundleRelease`
  - Output: `android-twa/app/build/outputs/bundle/release/app-release.aab`
- Signed Play upload candidate created:
  - `play-store-artifacts/SplashLens-Field-Tools-1.0.0-v1-com.splashlens.fieldtools-signed.aab`
  - Size: 1,389,029 bytes at build time.

## Signing

- Upload keystore is intentionally outside Git:
  - `C:\Users\sales\.keystores\splashlens\splashlens-upload.keystore`
- Password note is intentionally outside Git:
  - `C:\Users\sales\.keystores\splashlens\splashlens-upload-key-DO-NOT-COMMIT.txt`
- Upload-key SHA-256:
  - `9F:B4:69:CF:41:91:74:BF:76:21:32:34:AF:7A:53:0D:75:02:58:0A:33:77:C9:D8:91:71:E4:E9:4B:17:2E:96`

## Web Verification

- `https://app.splashlens.com/manifest.json` includes PNG and maskable icons.
- `.well-known/assetlinks.json` includes the upload-key fingerprint for `com.splashlens.fieldtools`.
- Mobile browser smoke for `https://app.splashlens.com/?store=android` passed with no console/page errors and no horizontal overflow.

## Play Console Note

Play Console execution completed on 2026-05-28:

- App: `SplashLens Field Tools`.
- Correct developer account: `ThrottleShare`.
- Correct developer account ID: `7017771963942604688`.
- Package: `com.splashlens.fieldtools`.
- App ID: `4974110437390812521`.
- Production release: `1.0.0 Android launch`, version `1 (1)`.
- Track URL: `https://play.google.com/console/u/2/developers/7017771963942604688/app/4974110437390812521/tracks/4697669214915845586`.
- Publishing status observed after submission: `Changes in review`.

The old `com.splashlens.app` Play record is on the wrong personal account and is not the launch lane. The ThrottleShare production release uses the new package `com.splashlens.fieldtools`.

Follow-up: when Google Play App Signing assigns the production app-signing SHA-256 for `com.splashlens.fieldtools`, add that fingerprint to `https://app.splashlens.com/.well-known/assetlinks.json` and redeploy the site.
