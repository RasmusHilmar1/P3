package com.example.p3.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Member {

    @Id
    private int memberID;
    private String name;
    private String address;
    private String email;
    private int dateOfBirth;
    private Long phoneNumber;
    Boolean boatOwnership;


    public int getMemberID() {
        return memberID;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getEmail() {
        return email;
    }

    public int getDateOfBirth() {
        return dateOfBirth;
    }

    public Long getPhoneNumber() {
        return phoneNumber;
    }

    public Boolean getBoatOwnership() {
        return boatOwnership;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhoneNumber(Long phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setBoatOwnership(Boolean boatOwnership) {
        this.boatOwnership = boatOwnership;
    }

}
