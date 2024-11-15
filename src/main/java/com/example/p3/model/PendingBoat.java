package com.example.p3.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "pendingboat")
public class PendingBoat {

    @Id
    private int id;

    @OneToOne
    @JoinColumn(name = "tempid", referencedColumnName = "boatid")
    private Boat boat;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Boat getBoat() {
        return boat;
    }

    public void setBoat(Boat boat) {
        this.boat = boat;
    }
}
