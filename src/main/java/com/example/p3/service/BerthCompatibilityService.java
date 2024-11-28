package com.example.p3.service;

import com.example.p3.model.Berth;
import com.example.p3.model.BerthWithCompatibility;
import com.example.p3.model.Boat;
import com.example.p3.repository.BerthRepository;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class BerthCompatibilityService {

    private final BerthRepository berthRepository;

    public BerthCompatibilityService(BerthRepository berthRepository) {
        this.berthRepository = berthRepository;
    }

    // Method to calculate compatibility score for a boat and a berth
    private double calculateCompatibilityScore(Boat boat, Berth berth) {
        if (boat.getLength() <= 0 || boat.getWidth() <= 0) {
            throw new IllegalArgumentException("Boat dimensions must be greater than zero.");
        }

        double lengthOffset = boat.getLength() + 1.0;
        double widthOffset = boat.getWidth() + 0.3;

        if (berth.getLength() < lengthOffset || berth.getWidth() < widthOffset) {
            return 0.0;
        }

        double lengthExcess = berth.getLength() - lengthOffset;
        double widthExcess = berth.getWidth() - widthOffset;

        double lengthScore = 100.0 - ((lengthExcess / lengthOffset) * 100);
        double widthScore = 100.0 - ((widthExcess / widthOffset) * 100);

        double compatibilityScore = (lengthScore + widthScore) / 2;
        return Math.max(compatibilityScore, 0.0);
    }

  private Color getCompatibilityColor(double score) {
    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Calculate RGB values (0-255)
    int red = (int) Math.round((100 - score) * 2.55);
    int green = (int) Math.round(score * 2.55);
    int blue = 0;

    // Return RGB color
    return new Color(red, green, blue);
}
    // Method to find compatible berths with scores and colors
    public List<BerthWithCompatibility> findCompatibleBerthsWithScore(Boat boat) {
        List<Berth> berths = berthRepository.findAll().stream()
                .filter(berth -> berth.getLength() >= boat.getLength() + 1.0
                        && berth.getWidth() >= boat.getWidth() + 0.3
                        && berth.getAvailability() == 1)
                .collect(Collectors.toList());

        List<BerthWithCompatibility> compatibilityList = berths.stream()
                .map(berth -> {
                    double score = calculateCompatibilityScore(boat, berth);
                    return new BerthWithCompatibility(
                            berth,
                            score,
                            getCompatibilityColor(score) // Set color based on score
                    );
                })
                .collect(Collectors.toList());

        compatibilityList.sort(Comparator.comparingDouble(BerthWithCompatibility::getCompatibilityScore).reversed());

        return compatibilityList;
    }
}
