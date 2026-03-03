import 'package:flutter/material.dart';

class NeumorphicCard extends StatelessWidget {
  const NeumorphicCard({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const <BoxShadow>[
          BoxShadow(
            color: Colors.black54,
            offset: Offset(6, 6),
            blurRadius: 12,
          ),
          BoxShadow(
            color: Colors.white12,
            offset: Offset(-3, -3),
            blurRadius: 8,
          ),
        ],
      ),
      child: child,
    );
  }
}
