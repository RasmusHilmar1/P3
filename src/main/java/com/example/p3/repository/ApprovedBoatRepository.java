package com.example.p3.repository;

import com.example.p3.model.ApprovedBoat;
import com.example.p3.model.Boat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovedBoatRepository extends JpaRepository<ApprovedBoat, Long> {
    List<ApprovedBoat> findAll(); // Retrieves all approved members with their details

    ApprovedBoat findByBoat(Boat boat);
}
