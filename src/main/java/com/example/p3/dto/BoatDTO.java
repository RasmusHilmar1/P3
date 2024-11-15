package com.example.p3.dto;

public class BoatDTO {

    private int boatID;
    private String name;

    // Constructor
    public BoatDTO(int boatID, String name) {
        this.boatID = boatID;
        this.name = name;
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
}
