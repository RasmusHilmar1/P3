package com.example.p3.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MemberlistDTO {
    /*
    private int memberID;
    private String Name;
    private String Address;
    private String Email;
    private String phonenumber;
    private int boatID;
    private String boatName;
    private double boatLength;
    private double boatWidth;
    private double boatAreal;
    private double boatPrice;
    private int berthID;
    private String berthName;
*/
    @JsonProperty("memberID")
    private int memberID;

    @JsonProperty("memberName")
    private String Name;

    @JsonProperty("memberAddress")
    private String Address;

    @JsonProperty("memberEmail")
    private String Email;

    @JsonProperty("memberPhonenumber")
    private String phonenumber;

    @JsonProperty("boatID")
    private int boatID;

    @JsonProperty("boatName")
    private String boatName;

    @JsonProperty("boatLength")
    private double boatLength;

    @JsonProperty("boatWidth")
    private double boatWidth;

    @JsonProperty("boatAreal")
    private double boatAreal;

    @JsonProperty("boatPrice")
    private double boatPrice;

    @JsonProperty("berthID")
    private int berthID;

    @JsonProperty("berthName")
    private String berthName;

    private double AREAL_PRICE_PR_SQM = 50;

    public MemberlistDTO(int memberID, String Name, String Address, String Email, String phonenumber, int boatID, String boatName,
                              double boatLength, double boatWidth, int berthID, String berthName) {

        this.memberID = memberID;
        this.Name = Name;
        this.Address = Address;
        this.Email = Email;
        this.phonenumber = phonenumber;
        this.boatID = boatID;
        this.boatName = boatName;
        this.boatLength = boatLength;
        this.boatWidth = boatWidth;
        this.boatAreal = boatLength * boatWidth;
        this.boatPrice = boatAreal*AREAL_PRICE_PR_SQM;
        this.berthID = berthID;
        this.berthName = berthName;
    }
    public int getMemberID() {return memberID;}
    public String getMemberName() {return Name;}
    public String getMemberAddress() {return Address;}
    public String getMemberEmail() {return Email;}
    public String getMemberPhonenumber() {return phonenumber;}
    public int getBoatID() {return boatID;}
    public String getBoatName() {return boatName;}
    public double getBoatLength() {return boatLength;}
    public double getBoatWidth() {return boatWidth;}
    public double getBoatAreal() {return boatAreal;}
    public double getBoatPrice() {return boatPrice;}
    public int getBerthID() {return berthID;}
    public String getBerthName() {return berthName;}
    public void setMemberID(int memberID) {this.memberID = memberID;}
    public void setMemberName(String memberName) {this.Name = memberName;}
    public void setMemberAddress(String memberAddress) {this.Address = memberAddress;}
    public void setMemberEmail(String memberEmail) {this.Email = memberEmail;}
    public void setMemberPhonenumber(String memberPhonenumber) {this.phonenumber = memberPhonenumber;}
    public void setBoatID(int boatID) {this.boatID = boatID;}
    public void setBoatName(String boatName) {this.boatName = boatName;}
    public void setBoatLength(double boatLength) {this.boatLength = boatLength;}
    public void setBoatWidth(double boatWidth) {this.boatWidth = boatWidth;}
    public void setBoatAreal(double boatAreal) {this.boatAreal = boatAreal;}
    public void setBoatPrice(double boatPrice) {this.boatPrice = boatPrice;}
    public void setBerthID(int berthID) {this.berthID = berthID;}
    public void setBerthName(String berthName) {this.berthName = berthName;}

}