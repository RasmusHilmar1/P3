package com.example.p3.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

import java.time.LocalDate;

@Entity
public class Member {

    @Id //Dette fortæller hvad navne på felter er. Så de skal være PRÆCIS som i databasen.
    private int memberID;
    private String name;
    private String address;
    private String email;
    private LocalDate dateofbirth;
    private Long phonenumber;
    private Boolean boatownership;

    @OneToOne(mappedBy = "member")
    @JsonBackReference
    private ApprovedMember approvedMember;

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

    public LocalDate getDateofbirth() {
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

    public void setMemberID(int i) {
        memberID = i;
    }

    public void setDateOfBirth(LocalDate of) {
        dateofbirth = of;
    }

    public void setPhoneNumber(long l) {
        phonenumber = l;
    }

    public void setBoatOwnership(boolean b) {
        boatownership = b;
    }
}
