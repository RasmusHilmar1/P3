package com.example.p3.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Member {

    @Id //Dette fortæller hvad navne på felter er. Så de skal være PRÆCIS som i databasen.
    private int memberID;
    private String name;
    private String address;
    private String email;
    private int dateofbirth;
    private Long phonenumber;
    private Boolean boatownership;


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

    public int getDateofbirth() {
        return dateofbirth;
    }

    public Long getPhonenumber() {
        return phonenumber;
    }

    public Boolean getBoatownership() {
        return boatownership;
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

    public void setPhonenumber(Long phonenumber) {
        this.phonenumber = phonenumber;
    }

    public void setBoatownership(Boolean boatownership) {
        this.boatownership = boatownership;
    }

}
