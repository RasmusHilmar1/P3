package com.example.p3.dto;

// DTO som får de nødvendige værdier fra Member, Boat og Berth klasserne
public class BerthlistDTO {
    private int berthID;
    private String berthName;
    private double berthLength;
    private double berthWidth;
    private double berthAreal;
    private double berthUtil;
    private int boatID;
    private String boatName;
    private double boatLength;
    private double boatWidth;
    private double boatAreal;
    private int memberID;
    private String memberName;
    private String phoneNumber;

    public BerthlistDTO(int berthID, String berthName, double berthLength, double berthWidth,
                        int boatID, String boatName, double boatLength, double boatWidth, int memberID, String memberName, String phoneNumber) {

        this.berthID = berthID;
        this.berthName = berthName;
        this.berthLength = berthLength;
        this.berthWidth = berthWidth;
        this.berthAreal = berthLength * berthWidth;
        this.boatID = boatID;
        this.boatName = boatName;
        this.boatLength = boatLength;
        this.boatWidth = boatWidth;
        this.boatAreal = boatLength * boatWidth;
        this.memberID = memberID;
        this.memberName = memberName;
        this.phoneNumber = phoneNumber;

        // revised boat size to use in utilization calculation
        double adjustedBoatAreal = getAdjustedBoatAreal(boatLength, boatWidth);

        // calculate the utilization percentage
        if (this.berthAreal > 0) {
            this.berthUtil = (adjustedBoatAreal / this.berthAreal) * 100.0;
        } else {
            this.berthUtil = 0.0; // Avoid division by zero
        }
    }

    // function for taking the extra space into consideration when calculating utilization
    private static double getAdjustedBoatAreal(double boatLength, double boatWidth) {
        double adjustedBoatLength, adjustedBoatWidth, adjustedBoatAreal;
        if (boatWidth > 0 && boatLength > 0) {
            adjustedBoatLength = boatLength + 1.0;  // add 1 meter to the boat's length
            adjustedBoatWidth = boatWidth + 0.3;    // add 0.3 meters to the boat's width
        } else {
            adjustedBoatLength = boatLength;
            adjustedBoatWidth = boatWidth;
        }
        adjustedBoatAreal = adjustedBoatLength * adjustedBoatWidth;  // calculation of adjusted boat areal
        return adjustedBoatAreal;
    }

    public int getBerthID() {return berthID;}
    public String getBerthName() {return berthName;}
    public double getBerthLength() {return berthLength;}
    public double getBerthWidth() {return berthWidth;}
    public double getBerthAreal() {return berthAreal;}
    public double getBerthUtil() {return berthUtil;}
    public int getBoatID() {return boatID;}
    public String getBoatName() {return boatName;}
    public double getBoatLength() {return boatLength;}
    public double getBoatWidth() {return boatWidth;}
    public double getBoatAreal() {return boatAreal;}
    public int getMemberID() {return memberID;}
    public String getMemberName() {return memberName;}
    public String getMemberPhoneNumber() {return phoneNumber;}

    public void setBerthID(int berthID) {this.berthID = berthID;}
    public void setBerthName(String berthName) {this.berthName = berthName;}
    public void setBerthLength(double berthLength) {this.berthLength = berthLength;}
    public void setBerthWidth(double berthWidth) {this.berthWidth = berthWidth;}
    public void setBerthAreal(double berthAreal) {this.berthAreal = berthAreal;}
    public void setBerthUtil(double berthUtil) {this.berthUtil = berthUtil;}
    public void setBoatID(int boatID) {this.boatID = boatID;}
    public void setBoatName(String boatName) {this.boatName = boatName;}
    public void setBoatLength(double boatLength) {this.boatLength = boatLength;}
    public void setBoatWidth(double boatWidth) {this.boatWidth = boatWidth;}
    public void setBoatAreal(double boatAreal) {this.boatAreal = boatAreal;}
    public void setMemberID(int memberID) {this.memberID = memberID;}
    public void setMemberName(String memberName) {this.memberName = memberName;}
    public void setMemberPhoneNumber(String memberPhoneNumber) {this.phoneNumber = memberPhoneNumber;}
}

