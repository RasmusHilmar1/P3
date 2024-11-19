package com.example.p3.repository;

import com.example.p3.dto.MemberlistDTO;
import com.example.p3.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberlistRepository extends JpaRepository<Member, Integer> {

    @Query("SELECT new com.example.p3.dto.MemberlistDTO(m.memberID, m.name, m.address, m.email, m.phonenumber, b.name, " +
            "b.length, b.width, br.name) " +
            "FROM Member m " +
            "JOIN Boat b ON b.memberID = m.memberID " +
            "JOIN Berth br ON br.berthID = b.berthID")
    List<MemberlistDTO> fetchAllMemberlistDetails();
}