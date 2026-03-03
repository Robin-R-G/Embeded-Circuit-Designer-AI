class LogEvent {
  const LogEvent({
    required this.type,
    required this.timestamp,
    required this.location,
  });

  final String type;
  final DateTime timestamp;
  final String location;
}
