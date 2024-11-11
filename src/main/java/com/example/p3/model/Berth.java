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
    private int length;
    private int width;
    private int depth;
    private int dockID;

    // Getters and Setters
    public int getBerthID() {return berthID;}
    public void setBerthID(int berthID) {this.berthID = berthID;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public int getAvailability() {return availability;}
    public void setAvailability(int availability) {this.availability = availability;}

    public int getMemberID() {return memberID;}
    public void setMemberID(int memberID) {this.memberID = memberID;}

    public int getLength() {return length;}
    public void setLength(int length) {this.length = length;}

    public int getWidth() {return width;}
    public void setWidth(int width) {this.width = width;}

    public int getDepth() {return depth;}
    public void setDepth(int depth) {this.depth = depth;}

    public int getDockID() {return dockID;}
    public void setDockID(int dockID) {this.dockID = dockID;}

}
