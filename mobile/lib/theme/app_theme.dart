import 'package:flutter/material.dart';

class AppTheme {
  static const Color darkBackground = Color(0xFF0B0F19);
  static const Color cardColor = Color(0xFF111827);
  static const Color criticalRed = Color(0xFFEF4444);
  static const Color highOrange = Color(0xFFF97316);
  static const Color normalGreen = Color(0xFF10B981);
  static const Color volunteerBlue = Color(0xFF3B82F6);
  static const Color shelterPurple = Color(0xFF8B5CF6);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBackground,
      colorScheme: const ColorScheme.dark(
        primary: criticalRed,
        secondary: volunteerBlue,
        surface: cardColor,
        background: darkBackground,
      ),
      cardTheme: CardTheme(
        color: cardColor,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFF1F2937)),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: darkBackground,
        elevation: 0,
        centerTitle: false,
      ),
    );
  }
}
