package com.example.p3.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Berth {

    // Attributes
    @Id
    private int berthID;
    private String name;
    private int availability;
    private int memberID;
    private double length;
    private double width;
    private double depth;
    private int pierId;

    // Getters and Setters
    public int getBerthID() {return berthID;}
    public void setBerthID(int berthID) {this.berthID = berthID;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public int getAvailability() {return availability;}
    public void setAvailability(int availability) {this.availability = availability;}

    public int getMemberID() {return memberID;}
    public void setMemberID(int memberID) {this.memberID = memberID;}

    public double getLength() {return length;}
    public void setLength(double length) {this.length = length;}

    public double getWidth() {return width;}
    public void setWidth(double width) {this.width = width;}

    public double getDepth() {return depth;}
    public void setDepth(double depth) {this.depth = depth;}

    public int getPierId() {return pierId;}
    public void setDockID(int pierId) {this.pierId = pierId;}

}
