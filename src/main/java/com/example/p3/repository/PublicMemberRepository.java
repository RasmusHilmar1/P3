package com.example.p3.repository;

import com.example.p3.model.PublicMemberDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicMemberRepository extends JpaRepository<PublicMemberDTO, Integer> {
    PublicMemberDTO findById(int MemberID);
}
