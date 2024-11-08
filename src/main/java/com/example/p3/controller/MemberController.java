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
    @PutMapping("/update/{id}")
    public Member updateMemberName(@PathVariable int id, @RequestBody String newName) {
        return memberService.updateMemberName(id, newName);
    }

}
