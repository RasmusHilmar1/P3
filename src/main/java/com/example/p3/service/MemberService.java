package com.example.p3.service;

import com.example.p3.model.Member;
import com.example.p3.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    public String getMemberName(int memberId) {
        Member member = memberRepository.findByMemberID(memberId);
        return member.getName();
    }

    public Member updateMemberName(int memberId, String newName) {
        Member member = memberRepository.findByMemberID(memberId);
        if (member != null) {
            member.setName(newName.replace("\"",""));  // Update name
            return memberRepository.save(member);  // Save updated member
        }
        return null;  // Return null if member not found
    }

    public Member updateMemberAddress(int memberId, String newAddress) {
        Member member = memberRepository.findByMemberID(memberId);
        if (member != null) {
            member.setAddress(newAddress.replace("\"",""));
            return memberRepository.save(member);
        }
        return null;
    }

    public Member updateMemberEmail(int memberId, String newEmail) {
        Member member = memberRepository.findByMemberID(memberId);
        if (member != null) {
            member.setEmail(newEmail.replace("\"",""));
            return memberRepository.save(member);
        }
        return null;
    }

    public Member updateMemberPhoneNumber(int memberId, Long newPhoneNumber) {
        Member member = memberRepository.findByMemberID(memberId);
        if (member != null) {
            member.setPhonenumber(newPhoneNumber);
            return memberRepository.save(member);
        }
        return null;
    }
}
