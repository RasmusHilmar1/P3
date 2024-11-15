package com.example.p3.dto;

public class MemberDTO {

    private int memberID;
    private String name;
    private Long phonenumber;

    public MemberDTO(int memberID, String name, Long phonenumber) {
        this.memberID = memberID;
        this.name = name;
        this.phonenumber = phonenumber;
    }

    public int getMemberID() {
        return memberID;
    }

    public String getName() {
        return name;
    }

    public Long getPhonenumber() {
        return phonenumber;
    }

    public void setMemberID(int memberID) {
        this.memberID = memberID;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPhonenumber(Long phonenumber) {
        this.phonenumber = phonenumber;
    }
}
