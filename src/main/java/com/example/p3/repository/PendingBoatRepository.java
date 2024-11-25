package com.example.p3.repository;

import com.example.p3.model.PendingBoat;
import com.example.p3.model.PendingMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PendingBoatRepository extends JpaRepository<PendingBoat, Long>  {
    List<PendingBoat> findAll();


    // Created to find pending boat by temporary ID
    PendingBoat findById(int pendingBoatId);
}

