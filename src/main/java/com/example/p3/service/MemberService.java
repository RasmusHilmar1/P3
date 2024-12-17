package com.example.p3.service;

import com.example.p3.dto.MemberDTO;
import com.example.p3.model.*;
import com.example.p3.model.ApprovedMember;
import com.example.p3.model.PendingMember;
import com.example.p3.repository.ApprovedMemberRepository;
import com.example.p3.repository.MemberRepository;
import com.example.p3.repository.PendingMemberRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private PendingMemberRepository pendingMemberRepository;
    @Autowired
    private ApprovedMemberRepository approvedMemberRepository;

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

    public String getMemberPhoneNumber(int memberId) {
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

    public Member updateMemberPhoneNumber(int memberId, String newPhoneNumber) {
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

    public Member updateMemberNote( int memberId, String newNote) {
        Member member = memberRepository.findByMemberID(memberId);
        if (member != null) {
            member.setNote(newNote);
            return memberRepository.save(member);
        }
        return null; // Return null if member not found
    }

    public MemberDTO convertToDTO(Member member) {
        if (member == null) {
            return null;
        }

        return new MemberDTO(member.getMemberID(), member.getName(), member.getPhonenumber());
    }

    public List<Member> getAllMembers() {
        // Method to fetch all members
        return memberRepository.findAll();

    }

    // Function for moving pending members to approved members
    @Transactional
    public Member approveMember(int pendingMemberId) {
        PendingMember pendingMember = pendingMemberRepository.findById(pendingMemberId);// find the pending member with use of id
        System.out.println(pendingMember);
        if (pendingMember != null) {
            Member member = pendingMember.getMember(); // get the member object nested in the pending member
            int memberId = pendingMember.getId();
            ApprovedMember approvedMember = new ApprovedMember(); // create new approved member

            approvedMember.setMember(member); // move the member object to the new approved member
            approvedMember.setId(memberId); // set the ID as the member's ID

            approvedMemberRepository.save(approvedMember);
            pendingMemberRepository.delete(pendingMember);

            System.out.println("Approved member saved and pending member deleted.");

            return member;
        }
        return null;
    }

    // Function for denying and deleting pending member
    @Transactional
    public Member denyMember(int pendingMemberId) {
        // get both pending member from database
        PendingMember pendingMember = pendingMemberRepository.findById(pendingMemberId);

        if (pendingMember == null) {
            System.out.println("Pending member not found."); // check whether pending member is found
            return null; // return null if member is not found
        }

        // get corresponding member object
        Member member = pendingMember.getMember();

        pendingMemberRepository.delete(pendingMember);// delete the member from both repositories if it is denied
        memberRepository.delete(member);

        return member;
    }

    // Function for updating berth information
    public Member updateMemberInformation(int memberId, Member info) {
        Member member = memberRepository.findByMemberID(memberId);
        if (member != null) {
            if (info.getName() != null) {
                member.setName(info.getName().replace("\"", ""));
            }
            if (info.getAddress() != null) {
                member.setAddress(info.getAddress().replace("\"",""));
            }
            if (info.getEmail() != null) {
                member.setEmail(info.getEmail().replace("\"",""));
            }
            if (info.getPhonenumber() != null) {
                member.setPhonenumber(info.getPhonenumber());
            }
            return memberRepository.save(member);  // Save updated member
        }
        return null;  // Return null if member not found
    }
}
