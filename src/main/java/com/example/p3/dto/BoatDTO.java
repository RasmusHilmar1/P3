package com.example.p3.dto;

import com.example.p3.model.Berth;

public class BoatDTO {

    private int boatID;
    private String name;
    private int berth;

    // Constructor
    public BoatDTO(int boatID, String name, int berth) {
        this.boatID = boatID;
        this.name = name;
        this.berth = berth;
    }

    // Getters
    public int getBoatID() {
        return boatID;
    }

    public String getName() {
        return name;
    }

    // Setters
    public void setBoatID(int boatID) {
        this.boatID = boatID;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Getter for berth
    public int getBerth() { return berth; }
    // Setter for berth
    public void setBerth(int berth) { this.berth = berth; }
}
