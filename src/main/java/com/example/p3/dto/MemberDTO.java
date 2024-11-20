package com.example.p3.dto;

public class MemberDTO {
    private final int memberID;
    private String name;
    private String PhoneNumber;

    // Constructor
    public MemberDTO(int memberID, String name, String phoneNumber) {
        this.memberID = memberID;
        this.name = name;
        this.PhoneNumber = phoneNumber;
    }

    public int getMemberID(){
        return memberID;
    }
    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return PhoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.PhoneNumber = phoneNumber;
    }
}
