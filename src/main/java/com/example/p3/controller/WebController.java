package com.example.p3.controller;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    @PreAuthorize("hasRole('BOOKKEEPER_USER')")
    @GetMapping("/bookkeeperBoatRequests")
    public String showBoatRequests() {
        return "bookkeeperBoatRequests";
    }

    @PreAuthorize("hasRole('BOOKKEEPER_USER')")
    @GetMapping("/bookkeeperMemberList")
    public String showBookkeeperMemberList() {
        return "bookkeeperMemberList";
    }

    @PreAuthorize("hasRole('BOOKKEEPER_USER')")
    @GetMapping("/bookkeeperMemberRequests")
    public String showBookkeeperMemberRequests() {
        return "bookkeeperMemberRequests";
    }

    @PreAuthorize("hasRole('BOOKKEEPER_USER')")
    @GetMapping("/bookkeeperStartPage")
    public String showBookkeeperStartPage() {
        return "bookkeeperStartPage";
    }

    @PreAuthorize("hasRole('VESSEL_USER')")
    @GetMapping("/vesselInspectorBerthList")
    public String showBerthListPage() {
        return "vesselInspectorBerthList";
    }

    @PreAuthorize("hasRole('VESSEL_USER')")
    @GetMapping("/vesselInspectorBoatRequests")
    public String showInspectorBoatRequests() {
        return "vesselInspectorBoatRequests";
    }
    @PreAuthorize("hasRole('VESSEL_USER')")
    @GetMapping("/vesselInspectorStartPage")
    public String showStartPage() {
        return "vesselInspectorStartPage";
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

    @GetMapping("/berths")
    public String showCompatablityScore() {
        return "comp";
    }

    @RequestMapping("/default")
    public String showDefaultPageAfterLogin(HttpServletRequest request) {
        if(request.isUserInRole("VESSEL_USER")) {
            return "redirect:/vesselInspectorStartPage";
        } else if (request.isUserInRole("BOOKKEEPER_USER")) {
            return "redirect:/bookkeeperStartPage";
        }
        return "default";
    }

}

