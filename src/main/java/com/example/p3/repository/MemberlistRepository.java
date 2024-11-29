package com.example.p3.repository;

import com.example.p3.dto.MemberlistDTO;
import com.example.p3.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface MemberlistRepository extends JpaRepository<Member, Integer> {
    //Query til at lave memberlistDTO'er
    @Query("SELECT new com.example.p3.dto.MemberlistDTO(m.memberID, m.name, m.address, m.email, m.phonenumber, " +
            "b.boatID, " + // Altid få bådID
            "CASE WHEN ab.boat IS NOT NULL THEN b.name ELSE 'No Boat' END, " + // Bådnavn er "No Boat", hvis båden ikke findes i Approvedboat
            "CASE WHEN ab.boat IS NOT NULL THEN b.length ELSE 0 END, " + // Længden er 0 hvis....
            "CASE WHEN ab.boat IS NOT NULL THEN b.width ELSE 0 END, " + // Bredden er 0 hvis....
            "CASE WHEN ab.boat IS NOT NULL THEN br.berthID ELSE 0 END, " + // Berthid er 0 hvis....
            "CASE WHEN ab.boat IS NOT NULL THEN " +
            "   CASE WHEN br.berthID = 9999 THEN 'No Berth' ELSE br.name END " +
            "   ELSE 'No Berth' END) " + // Berthnavn er "No Berth", hvis berth id er 9999 eller en båd ikke findes til medlemmet.
            "FROM Member m " + // Hentes fra member tabel
            "JOIN ApprovedMember am ON am.member = m " + // Join Approvedmember tabellen (Medlemmer hentes altså kun hvis de er approved)
            "LEFT JOIN Boat b ON b.memberID = m.memberID " + // Left join båd via memberid (Båd bliver hentet, hvis den findes og passer til medlem)
            "LEFT JOIN ApprovedBoat ab ON ab.boat = b " + // Left join approvedboats, hvis båden er approved
            // (Bruges til at tjekke om båden er approved længere oppe sådan at kun de værdier, ud over id, kommer med) ID bruges til slet
            "LEFT JOIN Berth br ON br.berthID = b.berthID") // Left join Berthen hvis den sammenhængende båd....
    
    List<MemberlistDTO> fetchAllMemberlistDetails();


    @Query("SELECT new com.example.p3.dto.MemberlistDTO(" +
            "m.memberID, m.name, m.address, m.email, m.phonenumber, " +
            "b.boatID, COALESCE(b.name, 'No Boat'), COALESCE(b.length, 0), COALESCE(b.width, 0), " +
            "br.berthID, COALESCE(br.name, 'No Berth')) " +
            "FROM Member m " +
            "JOIN ApprovedMember am ON am.member = m " +
            "LEFT JOIN Boat b ON b.memberID = m.memberID " +
            "LEFT JOIN Berth br ON br.berthID = b.berthID " +
            "WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR CAST(m.memberID AS string) LIKE CONCAT('%', :query, '%')")
    List<MemberlistDTO> searchMembers(@Param("query") String query);


}
