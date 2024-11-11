package com.example.p3.repository;

import com.example.p3.model.Boat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoatRepository extends JpaRepository<Boat, Integer> {
    // Custom method to find a boat by ID
    Boat findByBoatID(int BoatID);

}
