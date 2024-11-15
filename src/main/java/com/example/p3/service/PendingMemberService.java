package com.example.p3.service;

import com.example.p3.model.ApprovedMember;
import com.example.p3.model.PendingMember;
import com.example.p3.repository.ApprovedMemberRepository;
import com.example.p3.repository.PendingMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PendingMemberService {

    private final PendingMemberRepository pendingMemberRepository;

    @Autowired
    public PendingMemberService(PendingMemberRepository pendingMemberRepository) {
        this.pendingMemberRepository = pendingMemberRepository;
    }

    public List<PendingMember> getAllPendingMembers() {
        return pendingMemberRepository.findAll();
    }
}
