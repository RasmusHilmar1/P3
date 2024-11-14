package com.example.p3.controller;

import com.example.p3.dto.MemberDTO;
import com.example.p3.model.Member;
import com.example.p3.repository.MemberRepository;
import com.example.p3.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/members")
public class MemberController {

    @Autowired // giver adgang til methods fra MemberService klassen.
    private MemberService memberService;

    @Autowired
    private MemberRepository memberRepository;


    @GetMapping("/getName/{id}")
    public String getMember(@PathVariable int id) {
        return memberService.getMemberName(id);
    }

    @GetMapping("/getAddress/{id}")
    public String getMemberAddress(@PathVariable int id) {
        return memberService.getMemberAddress(id);
    }

    @GetMapping("/getEmail/{id}")
    public String getMemberEmail(@PathVariable int id) {
        return memberService.getMemberEmail(id);
    }

    @GetMapping("/getDoB/{id}")
    public int getMemberDateOfBirth(@PathVariable int id) {
        return memberService.getMemberDoB(id);
    }

    @GetMapping("/getPhoneNumber/{id}")
    public Long getMemberPhoneNumber(@PathVariable int id) {
        return memberService.getMemberPhoneNumber(id);
    }

    @GetMapping("/getBoatOwnership/{id}")
    public Boolean getMemberBoatOwnership(@PathVariable int id) {
        return memberService.getMemberBoatOwnershipStatus(id);
    }

    @GetMapping("/getMemberID/{id}")
    public int getMemberID(@PathVariable int id) {
        return memberService.getMemberId(id);
    }

    @GetMapping("/getFullMember/{id}")
    public Member getFullMember(@PathVariable int id) {
        return memberService.getMember(id);
    }

    // Endpoint to update member name
    @PutMapping("/updateName/{id}")
    public Member updateMemberName(@PathVariable int id, @RequestBody String newName) {
        return memberService.updateMemberName(id, newName);
    }

    @PutMapping("/updateAddress/{id}")
    public Member updateMemberAddress(@PathVariable int id, @RequestBody String newAddress) {
        return memberService.updateMemberAddress(id, newAddress);
    }

    @PutMapping("/updateEmail/{id}")
    public Member updateMemberEmail(@PathVariable int id, @RequestBody String newEmail) {
        return memberService.updateMemberEmail(id, newEmail);
    }

    @PutMapping("/updatePhoneNumber/{id}")
    public Member updateMemberPhoneNumber(@PathVariable int id, @RequestBody Long newPhoneNumber) {
        return memberService.updateMemberPhoneNumber(id, newPhoneNumber);
    }

    @PutMapping("/updateBoatOwnershipStatus/{id}")
    public Member updateMemberBoatOwnershipStatus(@PathVariable int id, @RequestBody Boolean newStatus) {
        return memberService.updateMemberBoatOwnershipStatus(id, newStatus);
    }

    @GetMapping("/public/{id}")
    public MemberDTO getConvertDTO(@PathVariable int id) {

        Member member = getPublicMember(id);

        return memberService.convertToDTO(member);
    }

    public Member getPublicMember(int memberId) {
        return memberRepository.findByMemberID(memberId); 
    }
}
