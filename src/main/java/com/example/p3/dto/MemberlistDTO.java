package com.example.p3.dto;

public class MemberlistDTO {
    private int memberID;
    private String Name;
    private String Address;
    private String Email;
    private long phoneNumber;
    private String boatName;
    private double boatLength;
    private double boatWidth;
    private double boatAreal;
    private double boatPrice;
    private String berthName;

    public MemberlistDTO(int memberID, String Name, String Address, String Email, long phoneNumber, String boatName,
                         double boatLength, double boatWidth, String berthName) {
        this.memberID = memberID;
        this.Name = Name;
        this.Address = Address;
        this.Email = Email;
        this.phoneNumber = phoneNumber;
        this.boatName = boatName;
        this.boatLength = boatLength;
        this.boatWidth = boatWidth;
        this.boatAreal = boatLength * boatWidth;
        this.boatPrice = boatAreal*50;
        this.berthName = berthName;
    }

    public int getMemberID() {return memberID;}
    public String getMemberName() {return Name;}
    public String getMemberAddress() {return Address;}
    public String getMemberEmail() {return Email;}
    public long getMemberPhoneNumber() {return phoneNumber;}
    public String getBoatName() {return boatName;}
    public double getBoatLength() {return boatLength;}
    public double getBoatWidth() {return boatWidth;}
    public double getBoatAreal() {return boatAreal;}
    public double getBoatPrice() {return boatPrice;}
    public String getBerthName() {return berthName;}
    public void setMemberID(int memberID) {this.memberID = memberID;}
    public void setMemberName(String memberName) {this.Name = memberName;}
    public void setMemberAddress(String memberAddress) {this.Address = memberAddress;}
    public void setMemberEmail(String memberEmail) {this.Email = memberEmail;}
    public void setMemberPhoneNumber(long memberPhoneNumber) {this.phoneNumber = memberPhoneNumber;}
    public void setBoatName(String boatName) {this.boatName = boatName;}
    public void setBoatLength(double boatLength) {this.boatLength = boatLength;}
    public void setBoatWidth(double boatWidth) {this.boatWidth = boatWidth;}
    public void setBerthName(String berthName) {this.berthName = berthName;}
}
