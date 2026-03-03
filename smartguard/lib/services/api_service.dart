import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:smartguard/core/constants/app_constants.dart';
import 'package:smartguard/core/error/app_exception.dart';
import 'package:smartguard/data/models/log_event_model.dart';
import 'package:smartguard/data/models/system_status_model.dart';

class ApiService {
  ApiService({required this.baseUrl, required this.token, http.Client? client})
      : _client = client ?? http.Client();

  final String baseUrl;
  final String token;
  final http.Client _client;

  Uri _uri(String path) => Uri.parse('$baseUrl$path');

  Map<String, dynamic> _securePayload() {
    final nowMs = DateTime.now().millisecondsSinceEpoch;
    return <String, dynamic>{
      'token': token,
      'timestamp': nowMs,
    };
  }

  void _validateTimestamp(int requestMs) {
    final delta =
        ((DateTime.now().millisecondsSinceEpoch - requestMs).abs() / 1000).round();
    if (delta > AppConstants.maxTimestampSkewSeconds) {
      throw AppException('Request timestamp validation failed. Retry request.');
    }
  }

  void _validateToken() {
    if (token.isEmpty) {
      throw AppException('Authentication token is missing or expired.');
    }
  }

  Future<SystemStatusModel> fetchStatus() async {
    _validateToken();
    final response = await _client.get(_uri('/status'));
    if (response.statusCode == 200) {
      return SystemStatusModel.fromJson(
        jsonDecode(response.body) as Map<String, dynamic>,
      );
    }
    throw AppException('Status fetch failed (${response.statusCode}).');
  }

  Future<void> unlock() => _postSecure('/unlock');

  Future<void> lock() => _postSecure('/lock');

  Future<void> lockdown() => _postSecure('/lockdown');

  Future<void> _postSecure(String path) async {
    _validateToken();
    final payload = _securePayload();
    _validateTimestamp(payload['timestamp'] as int);

    final response = await _client.post(
      _uri(path),
      headers: <String, String>{'Content-Type': 'application/json'},
      body: jsonEncode(payload),
    );

    if (response.statusCode == 401) {
      throw AppException('Token expired. Please log in again.');
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw AppException('Action failed (${response.statusCode}).');
    }
  }

  Future<List<LogEventModel>> fetchLogs() async {
    _validateToken();
    final response = await _client.get(_uri('/logs'));
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body) as List<dynamic>;
      return decoded
          .map((dynamic e) => LogEventModel.fromJson(e as Map<String, dynamic>))
          .toList();
    }
    throw AppException('Failed to fetch logs (${response.statusCode}).');
  }
}
