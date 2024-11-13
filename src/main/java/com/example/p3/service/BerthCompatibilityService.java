package com.example.p3.service;

import com.example.p3.model.Berth;
import com.example.p3.model.Boat;
import com.example.p3.repository.BerthRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BerthCompatibilityService {

    private final BerthRepository berthRepository;

    public BerthCompatibilityService(BerthRepository berthRepository) {
        this.berthRepository = berthRepository;
    }

    // Metode til at beregne kompatibilitetsscore for en båd og en plads
    private double calculateCompatibilityScore(Boat boat, Berth berth) {
        // Valider bådens dimensioner for at undgå nul eller negative værdier
        if (boat.getLength() <= 0 || boat.getWidth() <= 0) {
            throw new IllegalArgumentException("Båd dimensioner skal være større end nul.");
        }

        // Definer de minimale dimensioner, som pladserne skal overstige bådens dimensioner med
        double lengthOffset = boat.getLength() + 1.0;  // 1 meter ekstra i længde
        double widthOffset = boat.getWidth() + 0.3;    // 0.3 meter (30 cm) ekstra i bredde

        // Hvis pladsen er for lille, er den ikke kompatibel
        if (berth.getLength() < lengthOffset || berth.getWidth() < widthOffset) {
            return 0.0;
        }

        // Beregn hvor meget pladsen overstiger de nødvendige dimensioner for båden
        double lengthExcess = berth.getLength() - lengthOffset;
        double widthExcess = berth.getWidth() - widthOffset;

        // Beregn den oprindelige længde- og bredde-score (hvor meget pladsen overstiger den nødvendige størrelse)
        double lengthScore = 100.0 - ((lengthExcess / lengthOffset) * 100); // Lavere score hvis pladsen er større
        double widthScore = 100.0 - ((widthExcess / widthOffset) * 100); // Lavere score hvis pladsen er større

        // Beregn den gennemsnitlige kompatibilitetsscore (gennemsnit af længde og bredde score)
        double compatibilityScore = (lengthScore + widthScore) / 2;

        // Sørg for, at kompatibilitetsscoren ikke bliver negativ
        compatibilityScore = Math.max(compatibilityScore, 0.0);

        return compatibilityScore;
    }
    // Metode til at finde kompatible pladser og returnere dem med kompatibilitetsscorer
    public List<BerthWithCompatibility> findCompatibleBerthsWithScore(Boat boat) {
        // Hent alle pladser, filtrer dem der ikke opfylder de minimale krav og har availability = 1
        List<Berth> berths = berthRepository.findAll().stream()
                .filter(berth -> berth.getLength() >= boat.getLength() + 1.0
                        && berth.getWidth() >= boat.getWidth() + 0.3
                        && berth.getAvailability() == 1)  // Filtrering af kun tilgængelige pladser
                .collect(Collectors.toList());

        // Map hver plads til et kompatibilitetsobjekt med kompatibilitetsscoren
        List<BerthWithCompatibility> compatibilityList = berths.stream()
                .map(berth -> new BerthWithCompatibility(
                        berth,
                        calculateCompatibilityScore(boat, berth)
                ))
                .collect(Collectors.toList());

        return compatibilityList;
    }


    // Indre klasse til at repræsentere en plads med kompatibilitetsscore
    public static class BerthWithCompatibility {
        private final Berth berth;
        private final double compatibilityScore;

        public BerthWithCompatibility(Berth berth, double compatibilityScore) {
            this.berth = berth;
            this.compatibilityScore = compatibilityScore;
        }

        public Berth getBerth() {
            return berth;
        }

        public double getCompatibilityScore() {
            return compatibilityScore;
        }
    }
}
