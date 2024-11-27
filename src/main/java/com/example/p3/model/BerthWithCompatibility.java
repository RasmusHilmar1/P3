package com.example.p3.model;

import java.awt.*;

// Indre klasse til at repræsentere en plads med kompatibilitetsscore
    public class BerthWithCompatibility {
        private final Berth berth;
        private final double compatibilityScore;
        private Color color;

        public BerthWithCompatibility(Berth berth, double compatibilityScore, Color color) {
            this.berth = berth;
            this.compatibilityScore = compatibilityScore;
            this.color = color;
        }

        public Berth getBerth() {
            return berth;
        }

        public double getCompatibilityScore() {
            return compatibilityScore;
        }
        
        //set the color
        public void setColor(Color color) { this.color = color; }
        
        //get the color
        public Color getColor() { return color; }
    }
