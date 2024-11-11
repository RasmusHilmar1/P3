package com.example.p3.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Boat {

    @Id
    private int memberID;
    private int boatID;
    private int berthID;
    private String name;
    private String type;
    private String manufacturer;
    private long length;
    private long width;
    private long draught;
    private String insurance;

    // Getters and Setters
    public int getMemberID() {
        return memberID;
    }

    public void setMemberID(int memberID) {
        this.memberID = memberID;
    }

    public int getBoatID() {
        return boatID;
    }

    public void setBoatID(int boatID) {
        this.boatID = boatID;
    }

    public int getBerthID() {
        return berthID;
    }

    public void setBerthID(int berthID) {
        this.berthID = berthID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public long getLength() {
        return length;
    }

    public void setLength(long length) {
        this.length = length;
    }

    public long getWidth() {
        return width;
    }

    public void setWidth(long width) {
        this.width = width;
    }

    public long getDraught() {
        return draught;
    }

    public void setDraught(long draught) {
        this.draught = draught;
    }

    public String getInsurance() {
        return insurance;
    }

    public void setInsurance(String insurance) {
        this.insurance = insurance;
    }
}