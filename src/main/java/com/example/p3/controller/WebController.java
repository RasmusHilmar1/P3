package com.example.p3.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/approvedMembers")
    public String showApprovedMembersPage() {
        return "approvedMembers";
    }

    @GetMapping("/berths")
    public String showCompatablityScore() {
        return "comp";
    }
}

