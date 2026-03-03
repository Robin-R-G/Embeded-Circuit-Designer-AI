# SmartGuard Flutter App

SmartGuard is a secure AI-based smart car lock mobile application built with Flutter 3.x using clean architecture, Provider state management, secure storage, biometric authentication, and Firebase Cloud Messaging.

## Folder Structure

```text
smartguard/
├── lib/
│   ├── core/
│   │   ├── constants/
│   │   ├── error/
│   │   ├── router/
│   │   ├── theme/
│   │   └── utils/
│   ├── data/
│   │   ├── datasources/
│   │   ├── models/
│   │   └── repositories/
│   ├── domain/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── usecases/
│   ├── presentation/
│   │   ├── providers/
│   │   ├── screens/
│   │   └── widgets/
│   ├── services/
│   └── main.dart
├── scripts/
├── pubspec.yaml
└── analysis_options.yaml
```

## Downloadable APK (GitHub Actions)

A CI workflow is included at `.github/workflows/smartguard_build_apk.yml`.

How to get APK:

1. Push your branch to GitHub.
2. Open **Actions** → **Build SmartGuard APK**.
3. Run workflow (`workflow_dispatch`).
4. Open the completed run and download artifact **smartguard-release-apk**.
5. The artifact contains `app-release.apk` ready for installation.

## Local Build

1. Install Flutter 3.x and run `flutter pub get` in `smartguard`.
2. If this directory does not yet contain Flutter platform folders, run:
   - `flutter create . --platforms=android --project-name smartguard`
3. Add Firebase configuration files for Android/iOS.
4. Ensure biometric permissions are set in platform manifests.
5. Build APK with `flutter build apk --release`.

## Security Notes

- Token and sensitive settings are stored in `flutter_secure_storage`.
- Biometric authentication falls back to PIN.
- POST requests include token and request timestamp.
- Timestamp skew over 10 seconds is rejected client-side before dispatch.
