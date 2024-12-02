package com.example.p3.repository;

import com.example.p3.dto.BerthlistDTO;
import com.example.p3.model.Berth;
import com.example.p3.model.Member;
import com.example.p3.model.Boat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BerthlistRepository extends JpaRepository<Berth, Integer> {
    @Query("SELECT new com.example.p3.dto.BerthlistDTO(br.berthID, br.name, br.length, br.width," +
            "COALESCE(b.boatID, ''), COALESCE(b.name, ''), COALESCE(b.length, ''), COALESCE(b.width, ''), " +
            "COALESCE(m.memberID, ''), COALESCE(m.name, ''), COALESCE(m.phonenumber, '') " + ") " +
            "FROM Berth br " +
            "LEFT JOIN Boat b ON b.berthID = br.berthID " +
            "LEFT JOIN Member m ON b.memberID = m.memberID " +
            "WHERE br.berthID != 9999")

    List<BerthlistDTO> fetchAllBerthlistDetails();
}