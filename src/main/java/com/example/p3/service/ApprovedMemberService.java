package com.example.p3.service;

import com.example.p3.model.ApprovedMember;
import com.example.p3.repository.ApprovedMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApprovedMemberService {

    private final ApprovedMemberRepository approvedMemberRepository;

    @Autowired
    public ApprovedMemberService(ApprovedMemberRepository approvedMemberRepository) {
        this.approvedMemberRepository = approvedMemberRepository;
    }

    public List<ApprovedMember> getAllApprovedMembers() {
        return approvedMemberRepository.findAll();
    }
}
