package com.example.p3.repository;

import com.example.p3.dto.MemberlistDTO;
import com.example.p3.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberlistRepository extends JpaRepository<Member, Integer> {
    @Query("SELECT new com.example.p3.dto.MemberlistDTO(m.memberID, m.name, m.address, m.email, m.phonenumber, " +
            "b.boatID, COALESCE(b.name, 'No Boat'), COALESCE(b.length, 0), COALESCE(b.width, 0), " +
            "br.berthID, COALESCE(br.name, 'No Berth')) " +
            "FROM Member m " +
            "JOIN ApprovedMember am ON am.member = m " +
            "LEFT JOIN Boat b ON b.memberID = m.memberID " +
            "LEFT JOIN Berth br ON br.berthID = b.berthID")

    List<MemberlistDTO> fetchAllMemberlistDetails();
}
