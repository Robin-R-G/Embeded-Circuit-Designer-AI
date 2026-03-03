import 'package:smartguard/domain/entities/system_status.dart';

class SystemStatusModel extends SystemStatus {
  const SystemStatusModel({
    required super.isLocked,
    required super.faceDetected,
    required super.intrusionDetected,
    required super.lastAccess,
  });

  factory SystemStatusModel.fromJson(Map<String, dynamic> json) {
    return SystemStatusModel(
      isLocked: json['isLocked'] as bool? ?? true,
      faceDetected: json['faceDetected'] as bool? ?? false,
      intrusionDetected: json['intrusionDetected'] as bool? ?? false,
      lastAccess: DateTime.tryParse(json['lastAccess']?.toString() ?? '') ??
          DateTime.now(),
    );
  }
}
