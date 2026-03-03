import 'package:flutter/material.dart';

class AppTheme {
  static const Color background = Color(0xFF121212);
  static const Color electricBlue = Color(0xFF1E90FF);
  static const Color warningRed = Color(0xFFFF3B30);

  static ThemeData darkTheme() {
    final base = ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      colorScheme: ColorScheme.fromSeed(
        brightness: Brightness.dark,
        seedColor: electricBlue,
        primary: electricBlue,
        error: warningRed,
        surface: const Color(0xFF1B1B1B),
      ),
    );

    return base.copyWith(
      cardTheme: CardTheme(
        color: const Color(0xFF1A1A1A),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        elevation: 5,
        shadowColor: Colors.black54,
      ),
      snackBarTheme: const SnackBarThemeData(behavior: SnackBarBehavior.floating),
      appBarTheme: const AppBarTheme(centerTitle: true, backgroundColor: background),
    );
  }
}
