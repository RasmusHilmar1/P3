package com.example.p3.dto;

// DTO som får de nødvendige værdier fra Member, Boat og Berth klasserne
public class MemberlistDTO {

    private Integer memberID;
    private String Name;
    private String Address;
    private String Email;
    private String phonenumber;
    private Integer boatID;
    private String boatName;
    private Double boatLength;
    private Double boatWidth;
    private Double boatAreal;
    private Double boatPrice;
    private Integer berthID;
    private String berthName;

    private double AREAL_PRICE_PR_SQM = 50;

    public MemberlistDTO(Integer memberID, String Name, String Address, String Email, String phonenumber, Integer boatID, String boatName,
                              Double boatLength, Double boatWidth, Integer berthID, String berthName) {

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
    public Integer getMemberID() {return memberID;}
    public String getMemberName() {return Name;}
    public String getMemberAddress() {return Address;}
    public String getMemberEmail() {return Email;}
    public String getMemberPhonenumber() {return phonenumber;}
    public Integer getBoatID() {return boatID;}
    public String getBoatName() {return boatName;}
    public Double getBoatLength() {return boatLength;}
    public Double getBoatWidth() {return boatWidth;}
    public Double getBoatAreal() {return boatAreal;}
    public Double getBoatPrice() {return boatPrice;}
    public Integer getBerthID() {return berthID;}
    public String getBerthName() {return berthName;}

    public void setMemberID(Integer memberID) {this.memberID = memberID;}
    public void setMemberName(String memberName) {this.Name = memberName;}
    public void setMemberAddress(String memberAddress) {this.Address = memberAddress;}
    public void setMemberEmail(String memberEmail) {this.Email = memberEmail;}
    public void setMemberPhonenumber(String memberPhonenumber) {this.phonenumber = memberPhonenumber;}
    public void setBoatID(Integer boatID) {this.boatID = boatID;}
    public void setBoatName(String boatName) {this.boatName = boatName;}
    public void setBoatLength(Double boatLength) {this.boatLength = boatLength;}
    public void setBoatWidth(Double boatWidth) {this.boatWidth = boatWidth;}
    public void setBoatAreal(Double boatAreal) {this.boatAreal = boatAreal;}
    public void setBoatPrice(Double boatPrice) {this.boatPrice = boatPrice;}
    public void setBerthID(Integer berthID) {this.berthID = berthID;}
    public void setBerthName(String berthName) {this.berthName = berthName;}

}
