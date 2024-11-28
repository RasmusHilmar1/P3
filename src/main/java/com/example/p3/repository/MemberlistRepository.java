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
    @Query("SELECT new com.example.p3.dto.MemberlistDTO(m.memberID, m.name, m.address, m.email, m.phonenumber, " +
            "b.boatID, " + // Show boat ID only if approved, otherwise 0
            "CASE WHEN ab.boat IS NOT NULL THEN b.name ELSE 'No Boat' END, " + // Show boat name only if approved
            "CASE WHEN ab.boat IS NOT NULL THEN b.length ELSE 0 END, " + // Show boat length only if approved
            "CASE WHEN ab.boat IS NOT NULL THEN b.width ELSE 0 END, " + // Show boat width only if approved
            "CASE WHEN ab.boat IS NOT NULL THEN COALESCE(br.berthID, 0) ELSE 0 END, " + // Show berth ID only if boat is approved
            "CASE WHEN ab.boat IS NOT NULL THEN " +
            "     CASE WHEN br.berthID = 9999 THEN 'No Berth' ELSE COALESCE(br.name, 'No Berth') END " +
            "     ELSE 'No Berth' END) " + // Handle berth name logic
            "FROM Member m " +
            "JOIN ApprovedMember am ON am.member = m " + // Ensure member is approved
            "LEFT JOIN Boat b ON b.memberID = m.memberID " +
            "LEFT JOIN ApprovedBoat ab ON ab.boat = b " + // Ensure boat is approved
            "LEFT JOIN Berth br ON br.berthID = b.berthID")



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
