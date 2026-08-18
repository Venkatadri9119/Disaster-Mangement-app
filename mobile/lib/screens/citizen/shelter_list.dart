import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class ShelterListScreen extends StatelessWidget {
  const ShelterListScreen({Key? key}) : super(key: key);

  final List<Map<String, dynamic>> _shelters = const [
    {
      "name": "Vijayawada Central Relief Shelter",
      "distance": "1.4 km away",
      "capacity": "380 / 500 Available",
      "facilities": ["Food", "Water", "Medical Bay", "Power Generator"],
      "phone": "+918662450001"
    },
    {
      "name": "Auto Nagar Emergency Safe Shelter",
      "distance": "2.8 km away",
      "capacity": "255 / 300 Available",
      "facilities": ["Food", "Sleeping Mats", "First Aid"],
      "phone": "+918662450002"
    },
    {
      "name": "Kanaka Durga Shelter Center",
      "distance": "4.2 km away",
      "capacity": "190 / 400 Available",
      "facilities": ["Food", "Clean Water", "Infant Care"],
      "phone": "+918662450003"
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Nearby Safe Shelters", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(14),
        itemCount: _shelters.length,
        itemBuilder: (context, index) {
          final s = _shelters[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          s["name"],
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.shelterPurple.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          s["distance"],
                          style: const TextStyle(fontSize: 11, color: AppTheme.shelterPurple, fontWeight: FontWeight.bold),
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Capacity: ${s['capacity']}",
                    style: const TextStyle(fontSize: 13, color: AppTheme.normalGreen, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    children: (s["facilities"] as List<String>)
                        .map((f) => Chip(
                              backgroundColor: const Color(0xFF1F2937),
                              label: Text(f, style: const TextStyle(fontSize: 10, color: Colors.white70)),
                            ))
                        .toList(),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          icon: const Icon(Icons.call, size: 14, color: AppTheme.volunteerBlue),
                          label: Text(s["phone"], style: const TextStyle(fontSize: 12, color: AppTheme.volunteerBlue)),
                          onPressed: () {},
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(backgroundColor: AppTheme.volunteerBlue),
                        icon: const Icon(Icons.directions, size: 14, color: Colors.white),
                        label: const Text("Directions", style: TextStyle(fontSize: 12, color: Colors.white)),
                        onPressed: () {},
                      )
                    ],
                  )
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
