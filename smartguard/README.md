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
├── pubspec.yaml
└── analysis_options.yaml
```

## Setup

1. Install Flutter 3.x and run `flutter pub get` in `smartguard`.
2. Add Firebase configuration files for Android/iOS.
3. Ensure biometric permissions are set in platform manifests.
4. Run the app with `flutter run`.

## Security Notes

- Token and sensitive settings are stored in `flutter_secure_storage`.
- Biometric authentication falls back to PIN.
- POST requests include token and request timestamp.
- Timestamp skew over 10 seconds is rejected client-side before dispatch.

