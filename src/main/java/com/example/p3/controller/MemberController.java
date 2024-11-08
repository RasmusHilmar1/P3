package com.example.p3.controller;

import com.example.p3.model.Member;
import com.example.p3.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

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

}
