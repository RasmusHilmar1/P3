package com.example.p3.controller;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @PreAuthorize("hasRole('BOOKKEEPER_USER')")
    @GetMapping("/approvedMembers")
    public String showApprovedMembersPage() {
        return "approvedMembers";
    }

    @PreAuthorize("hasRole('VESSEL_USER')")
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

    @GetMapping("/index")
    public String showIndexPage() {
        return "index";
    }
}
