import 'package:flutter/material.dart';
import 'package:smartguard/presentation/screens/dashboard_screen.dart';
import 'package:smartguard/presentation/screens/login_screen.dart';
import 'package:smartguard/presentation/screens/logs_screen.dart';
import 'package:smartguard/presentation/screens/settings_screen.dart';
import 'package:smartguard/presentation/screens/splash_screen.dart';

class AppRouter {
  static const String splash = '/';
  static const String login = '/login';
  static const String dashboard = '/dashboard';
  static const String logs = '/logs';
  static const String settings = '/settings';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case dashboard:
        return MaterialPageRoute(builder: (_) => const DashboardScreen());
      case logs:
        return MaterialPageRoute(builder: (_) => const LogsScreen());
      case settings:
        return MaterialPageRoute(builder: (_) => const SettingsScreen());
      default:
        return MaterialPageRoute(
          builder: (_) => const Scaffold(
            body: Center(child: Text('Route not found')),
          ),
        );
    }
  }
}
