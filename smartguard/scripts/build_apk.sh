#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v flutter >/dev/null 2>&1; then
  echo "Flutter SDK is required but not found in PATH."
  exit 1
fi

if [ ! -d android ]; then
  flutter create . --platforms=android --project-name smartguard
fi

flutter pub get
flutter build apk --release

echo "APK generated at: build/app/outputs/flutter-apk/app-release.apk"
