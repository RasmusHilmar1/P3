package com.example.p3.repository;

import com.example.p3.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {
    // Custom method to find a member by ID
    Member findByMemberID(int MemberID);

}
