package com.example.p3.repository;

import com.example.p3.model.Berth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BerthRepository extends JpaRepository<Berth, Integer> {
    // Custom method to find a Berth by ID
    Berth findByBerthID(int BerthID);

}
