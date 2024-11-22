package com.example.p3.service;

import com.example.p3.model.ApprovedMember;
import com.example.p3.model.Member;
import com.example.p3.dto.MemberDTO;
import com.example.p3.repository.ApprovedMemberRepository;
import com.example.p3.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ApprovedMemberService {

    private final ApprovedMemberRepository approvedMemberRepository;
    private final MemberRepository memberRepository;

    @Autowired
    public ApprovedMemberService(ApprovedMemberRepository approvedMemberRepository, MemberRepository memberRepository) {
        this.approvedMemberRepository = approvedMemberRepository;
        this.memberRepository = memberRepository;
    }

    // Method to get all approved members
    public List<ApprovedMember> getAllApprovedMembers() {
        return approvedMemberRepository.findAll();
    }

    // Method to get approved members with their details
    public List<MemberDTO> getApprovedMembers() {
        // Get all approved members
        List<ApprovedMember> approvedMembers = approvedMemberRepository.findAll();

        // Fetch the member details using the member object from approvedMember
        List<MemberDTO> memberDTOs = new ArrayList<>();
        for (ApprovedMember approvedMember : approvedMembers) {
            Member member = approvedMember.getMember(); // Get the associated Member

            if (member != null) {
                // Convert the member data to a DTO
                MemberDTO memberDTO = new MemberDTO(member.getMemberID(), member.getName(), member.getPhonenumber());
                memberDTOs.add(memberDTO);
            }
        }
        return memberDTOs;
    }
}
