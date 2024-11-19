package com.example.p3.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.example.p3.service.MemberlistService;

@Controller
public class MemberlistController {

    @Autowired
    private MemberlistService service;

    @GetMapping("/memberlist")
    public String getAllMembers(Model model) {
        model.addAttribute("memberlist", service.getAllMemberlistDetails());
        return "memberlist";
    }
}
