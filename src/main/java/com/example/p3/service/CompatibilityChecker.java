package com.example.p3.service;

import com.example.p3.model.Berth;
import com.example.p3.model.Boat;

import java.util.List;
import java.util.stream.Collectors;

public class CompatibilityChecker {

    public static String generateCompatibilityReport(Boat boat, List<Berth> berths) {
        StringBuilder report = new StringBuilder();
        int compatibleCount = 0;

        report.append("Compatibility Report for Boat: ").append(boat.getName()).append("\n");

        // Sort berths based on compatibility (highest to lowest)
        List<Berth> sortedBerths = berths.stream()
                .sorted((berth1, berth2) -> Double.compare(calculateCompatibility(boat, berth2), calculateCompatibility(boat, berth1)))
                .collect(Collectors.toList());

        // Check compatibility for each berth
        for (Berth berth : sortedBerths) {
            double compatibility = calculateCompatibility(boat, berth);
            String compatibilitySquare = getCompatibilitySquare(compatibility);

            report.append("Berth: ").append(berth.getName())
                    .append(" - Compatibility: ").append(String.format("%.2f", compatibility))
                    .append("% ").append(compatibilitySquare).append("\n");

            if (compatibility >90) {
                compatibleCount++;
            }
        }

        report.append("\nNumber of great great utilization (90%+) : ").append(compatibleCount).append("/").append(berths.size());

        return report.toString();
    }

    // Calculate compatibility based on boat and berth size
    private static double calculateCompatibility(Boat boat, Berth berth) {
        // If the boat is too large for the berth, return 0% compatibility
        if (boat.getLength() > berth.getLength() || boat.getWidth() > berth.getWidth()) {
            return 0;
        }

        // Calculate compatibility based on the length and width ratios
        double lengthRatio = Math.min(1.0, boat.getLength() / berth.getLength());
        double widthRatio = Math.min(1.0, boat.getWidth() / berth.getWidth());

        // Calculate the average compatibility
        double compatibility = (lengthRatio + widthRatio) / 2 * 100;

        return Math.max(0, Math.min(100, compatibility)); // Ensure compatibility is within 0-100 range
    }

    // Get a colored square emoji based on compatibility
    private static String getCompatibilitySquare(double compatibility) {
        if (compatibility >= 90) {
            return "🟩"; // Green square for high compatibility
        } else if (compatibility >= 70) {
            return "🟨"; // Yellow square for medium compatibility
        } else if (compatibility >= 50) {
            return "🟧"; // Orange square for low compatibility
        } else if (compatibility > 0) {
            return "🟥"; // Red square for very low compatibility
        } else {
            return "🟪"; // Purple square for incompatible
        }
    }
}
