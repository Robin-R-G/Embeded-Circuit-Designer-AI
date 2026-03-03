import 'package:intl/intl.dart';

class DateFormatter {
  static String format(DateTime dateTime) {
    return DateFormat('yyyy-MM-dd HH:mm:ss').format(dateTime.toLocal());
  }
}
