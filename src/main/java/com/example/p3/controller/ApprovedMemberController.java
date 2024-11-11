package com.example.p3.controller;

import com.example.p3.model.ApprovedMember;
import com.example.p3.service.ApprovedMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/approvedMembers")
public class ApprovedMemberController {

    private final ApprovedMemberService approvedMemberService;

    @Autowired
    public ApprovedMemberController(ApprovedMemberService approvedMemberService) {
        this.approvedMemberService = approvedMemberService;
    }

    @GetMapping
    public List<ApprovedMember> getAllApprovedMembers() {
        return approvedMemberService.getAllApprovedMembers();
    }
}
