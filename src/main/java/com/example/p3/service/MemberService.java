package com.example.p3.service;

import com.example.p3.model.Member;
import com.example.p3.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    public Member updateMemberName(int memberId, String newName) {
        Member member = memberRepository.findByMemberID(memberId);
        if (member != null) {
            member.setName(newName.replace("\"",""));  // Update name
            return memberRepository.save(member);  // Save updated member
        }
        return null;  // Return null if member not found
    }
}
