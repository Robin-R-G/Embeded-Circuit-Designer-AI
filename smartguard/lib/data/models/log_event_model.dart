import 'package:smartguard/domain/entities/log_event.dart';

class LogEventModel extends LogEvent {
  const LogEventModel({
    required super.type,
    required super.timestamp,
    required super.location,
  });

  factory LogEventModel.fromJson(Map<String, dynamic> json) {
    return LogEventModel(
      type: json['type']?.toString() ?? 'Unknown',
      timestamp:
          DateTime.tryParse(json['timestamp']?.toString() ?? '') ?? DateTime.now(),
      location: json['location']?.toString() ?? 'Car',
    );
  }
}
