package com.example.p3.controller;

import com.example.p3.dto.MemberlistDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.example.p3.service.MemberlistService;

@Controller
public class MemberlistController {

    @Autowired
    private MemberlistService service;
    @Autowired
    private MemberlistService memberlistService;


    @PostMapping("/bookkeeperMemberList/updateMember")
    @ResponseBody
    public MemberlistDTO updateMember(@RequestBody MemberlistDTO dto) {
        System.out.println(dto);
        return memberlistService.updateMemberlist(dto);
    }
}
