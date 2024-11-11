package com.example.p3.repository;

import com.example.p3.model.ApprovedMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovedMemberRepository extends JpaRepository<ApprovedMember, Long> {
    List<ApprovedMember> findAll(); // Retrieves all approved members with their details
}
