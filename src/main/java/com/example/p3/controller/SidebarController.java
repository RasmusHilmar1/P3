package com.example.p3.controller;

import com.example.p3.dto.MemberDTO;
import com.example.p3.service.ApprovedMemberService;
import com.example.p3.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sidebar")
public class SidebarController {

    @Autowired
    private ApprovedMemberService ApprovedMemberService;

    @GetMapping("/approved-members")
    public List<MemberDTO> getApprovedMembers() {
        return ApprovedMemberService.getApprovedMembers();
    }
}
