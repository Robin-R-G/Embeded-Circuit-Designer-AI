class SystemStatus {
  const SystemStatus({
    required this.isLocked,
    required this.faceDetected,
    required this.intrusionDetected,
    required this.lastAccess,
  });

  final bool isLocked;
  final bool faceDetected;
  final bool intrusionDetected;
  final DateTime lastAccess;
}
