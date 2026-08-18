import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class VolunteerHomeScreen extends StatefulWidget {
  final VoidCallback onSwitchToCitizen;
  const VolunteerHomeScreen({Key? key, required this.onSwitchToCitizen}) : super(key: key);

  @override
  State<VolunteerHomeScreen> createState() => _VolunteerHomeScreenState();
}

class _VolunteerHomeScreenState extends State<VolunteerHomeScreen> {
  bool _isAvailable = true;
  String? _acceptedRequestId;
  String _currentMissionStatus = "ASSIGNED"; // ASSIGNED -> ON_THE_WAY -> REACHED -> COMPLETED

  final List<Map<String, dynamic>> _nearbyRequests = [
    {
      "id": "req-101",
      "disaster_type": "Flood Rescue",
      "people": 5,
      "medical": true,
      "distance": "1.2 km",
      "match_score": "94%",
      "address": "Krishna Riverbank Colony, Sector 3",
      "priority": "CRITICAL"
    },
    {
      "id": "req-102",
      "disaster_type": "Building Collapse Debris",
      "people": 3,
      "medical": true,
      "distance": "2.8 km",
      "match_score": "88%",
      "address": "Old Bus Stand Road, Plot 45",
      "priority": "CRITICAL"
    },
    {
      "id": "req-103",
      "disaster_type": "Cyclone Roof Damage",
      "people": 2,
      "medical": false,
      "distance": "4.1 km",
      "match_score": "76%",
      "address": "Auto Nagar Sector 4",
      "priority": "HIGH"
    }
  ];

  void _acceptRequest(String id) {
    setState(() {
      _acceptedRequestId = id;
      _currentMissionStatus = "ON_THE_WAY";
    });
  }

  void _advanceMissionStatus() {
    setState(() {
      if (_currentMissionStatus == "ON_THE_WAY") {
        _currentMissionStatus = "REACHED";
      } else if (_currentMissionStatus == "REACHED") {
        _currentMissionStatus = "COMPLETED";
      } else if (_currentMissionStatus == "COMPLETED") {
        _acceptedRequestId = null;
        _currentMissionStatus = "ASSIGNED";
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: const [
            Icon(Icons.directions_boat, color: AppTheme.volunteerBlue, size: 22),
            SizedBox(width: 8),
            Text("Volunteer Dispatch", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.swap_horiz, color: Colors.amber),
            tooltip: "Switch to Citizen View",
            onPressed: widget.onSwitchToCitizen,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Duty Availability Toggle Card
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF1F2937),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 5,
                            backgroundColor: _isAvailable ? AppTheme.normalGreen : Colors.grey,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            _isAvailable ? "DUTY STATUS: AVAILABLE" : "DUTY STATUS: OFF DUTY",
                            style: TextStyle(
                              fontWeight: FontWeight.black,
                              fontSize: 13,
                              color: _isAvailable ? AppTheme.normalGreen : Colors.gray,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        "Unit: Ravi Kumar (Flood & Boat Specialist)",
                        style: TextStyle(fontSize: 11, color: Colors.gray),
                      ),
                    ],
                  ),
                  Switch(
                    value: _isAvailable,
                    activeColor: AppTheme.normalGreen,
                    onChanged: (val) => setState(() => _isAvailable = val),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Active Mission Navigation Card
            if (_acceptedRequestId != null)
              Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppTheme.volunteerBlue.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppTheme.volunteerBlue),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          "ACTIVE MISSION IN PROGRESS",
                          style: TextStyle(fontWeight: FontWeight.black, fontSize: 12, color: AppTheme.volunteerBlue),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.volunteerBlue,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            _currentMissionStatus,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.white),
                          ),
                        )
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      "Destination: Krishna Riverbank Colony, House #12",
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white),
                    ),
                    const Text("Victims: 5 people trapped in rising floodwater • Mother medical need", style: TextStyle(fontSize: 12, color: Colors.gray)),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.volunteerBlue),
                            icon: const Icon(Icons.navigation, color: Colors.white, size: 16),
                            label: const Text("Open Navigation", style: TextStyle(color: Colors.white, fontSize: 12)),
                            onPressed: () {},
                          ),
                        ),
                        const SizedBox(width: 8),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(backgroundColor: AppTheme.normalGreen),
                          onPressed: _advanceMissionStatus,
                          child: Text(
                            _currentMissionStatus == "ON_THE_WAY" ? "Mark Reached" : (_currentMissionStatus == "REACHED" ? "Complete Help" : "Resolve"),
                            style: const TextStyle(color: Colors.white, fontSize: 12),
                          ),
                        )
                      ],
                    )
                  ],
                ),
              ),

            const Text(
              "CRITICAL NEARBY EMERGENCY REQUESTS",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.gray),
            ),

            const SizedBox(height: 10),

            // Nearby Emergency Requests List
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _nearbyRequests.length,
              itemBuilder: (context, index) {
                final req = _nearbyRequests[index];
                final isAccepted = _acceptedRequestId == req["id"];

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
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: req["priority"] == "CRITICAL" ? AppTheme.criticalRed.withOpacity(0.2) : AppTheme.highOrange.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: req["priority"] == "CRITICAL" ? AppTheme.criticalRed : AppTheme.highOrange),
                              ),
                              child: Text(
                                "🔴 ${req['priority']} • ${req['disaster_type']}",
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 11,
                                  color: req["priority"] == "CRITICAL" ? AppTheme.criticalRed : AppTheme.highOrange,
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppTheme.volunteerBlue.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                "Match: ${req['match_score']}",
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppTheme.volunteerBlue),
                              ),
                            )
                          ],
                        ),
                        const SizedBox(height: 10),
                        Text(
                          "${req['people']} People Trapped • ${req['distance']} away",
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white),
                        ),
                        const SizedBox(height: 4),
                        Text(req["address"], style: const TextStyle(fontSize: 12, color: Colors.gray)),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            OutlinedButton(
                              onPressed: () {},
                              child: const Text("View Details", style: TextStyle(fontSize: 12, color: Colors.gray)),
                            ),
                            const SizedBox(width: 8),
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: isAccepted ? AppTheme.normalGreen : AppTheme.volunteerBlue,
                              ),
                              onPressed: isAccepted ? null : () => _acceptRequest(req["id"]),
                              child: Text(
                                isAccepted ? "Accepted" : "Accept Emergency",
                                style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        )
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
