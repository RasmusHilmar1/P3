package com.example.p3.repository;

import com.example.p3.model.PendingMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PendingMemberRepository extends JpaRepository<PendingMember, Long>  {
    List<PendingMember> findAll();

    // created to find pending member by temporary ID
    PendingMember findById(int pendingMemberId);
}

