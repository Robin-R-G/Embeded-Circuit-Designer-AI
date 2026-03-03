import 'package:flutter/material.dart';
import 'package:smartguard/core/theme/app_theme.dart';

class BlinkingAlertIcon extends StatefulWidget {
  const BlinkingAlertIcon({required this.active, super.key});

  final bool active;

  @override
  State<BlinkingAlertIcon> createState() => _BlinkingAlertIconState();
}

class _BlinkingAlertIconState extends State<BlinkingAlertIcon>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.active) {
      return const Icon(Icons.shield_outlined, size: 28);
    }

    return FadeTransition(
      opacity: Tween<double>(begin: 0.3, end: 1).animate(_controller),
      child: const Icon(
        Icons.warning_amber_rounded,
        color: AppTheme.warningRed,
        size: 30,
      ),
    );
  }
}
