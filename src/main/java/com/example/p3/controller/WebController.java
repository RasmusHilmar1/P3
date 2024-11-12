package com.example.p3.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/approvedMembers")
    public String showApprovedMembersPage() {
        return "approvedMembers";
    }

    @GetMapping("/approvedBoats")
    public String showApprovedBoatsPage() {
        return "approvedBoats";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/boat")
    public String showBoatsPage() {
        return "boat";
    }
}
