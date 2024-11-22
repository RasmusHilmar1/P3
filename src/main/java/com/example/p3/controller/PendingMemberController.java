package com.example.p3.controller;

import com.example.p3.model.ApprovedMember;
import com.example.p3.model.PendingMember;
import com.example.p3.service.ApprovedMemberService;
import com.example.p3.service.PendingMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/pendingMembers")
public class PendingMemberController {

    private final PendingMemberService pendingMemberService;

    @Autowired
    public PendingMemberController(PendingMemberService pendingMemberService) {
       this.pendingMemberService = pendingMemberService;
    }

    @GetMapping
    public List<PendingMember> getAllPendingMembers() {
        return pendingMemberService.getAllPendingMembers();
    }
}
