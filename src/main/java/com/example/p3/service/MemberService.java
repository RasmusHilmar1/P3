package com.example.p3.service;

import com.example.p3.dto.MemberDTO;
import com.example.p3.model.Member;
import com.example.p3.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    public String getMemberName(int memberId) {
        Member member = memberRepository.findByMemberID(memberId);
        return member.getName();
    }

    public String getMemberAddress(int memberId) {
        Member member = memberRepository.findByMemberID(memberId);
        return member.getAddress();
    }

    public String getMemberEmail(int memberId) {
        Member member = memberRepository.findByMemberID(memberId);
        return member.getEmail();
    }

    public LocalDate getMemberDoB(int memberId) {
        Member member = memberRepository.findByMemberID(memberId);
        return member.getDateofbirth();
    }

    public Long getMemberPhoneNumber(int memberId) {
        Member member = memberRepository.findByMemberID(memberId);
        return member.getPhonenumber();
    }

    public Boolean getMemberBoatOwnershipStatus(int memberId) {
        Member member = memberRepository.findByMemberID(memberId);
        return member.getBoatownership();
    }

    // jeg ved ikke hvor nyttigt dette er, men nu er den lavet.
    public int getMemberId(int memberId) {
        Member member = memberRepository.findByMemberID(memberId);
        return member.getMemberID();
    }

    // finder et helt member, igen jeg ved ikke hvor brugbart det er, men nu findes det.
    public Member getMember(int memberId) {
        return memberRepository.findByMemberID(memberId);
    }


    // Methods der opdaterer værdier i databasen
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

    public Member updateMemberBoatOwnershipStatus(int memberId, Boolean boatOwnership) {
        Member member = memberRepository.findByMemberID(memberId);
        if (member != null) {
            member.setBoatownership(boatOwnership);
            return memberRepository.save(member);
        }
        return null;
    }

    public MemberDTO convertToDTO(Member member) {
        if (member == null) {
            return null;
        }

        return new MemberDTO(member.getMemberID(), member.getName(), member.getPhonenumber());
    }

    public List<Member> getAllMembers() {
        // Method to fetch all members
        return memberRepository.findAll(); // Assuming you have a MemberRepository extending JpaRepository

    }

}
