package com.example.p3.model;

public class PublicMemberDTO {

    @id
    private int id;
    private String memberName;
    private String phoneNumber;

    public PublicMemberDTO(int id, String memberName, String phoneNumber) {
        this.id = id;
        this.memberName = memberName;
        this.phoneNumber = phoneNumber;
    }

    public int getId() {
        return id;
    }

    public String getMemberName() {
        return memberName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }
}
