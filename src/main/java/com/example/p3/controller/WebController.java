package com.example.p3.controller;
import com.example.p3.service.MemberlistService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    @Autowired
    private MemberlistService service;
    @Autowired
    private MemberlistService memberlistService;

    @PreAuthorize("hasRole('BOOKKEEPER_USER')")
    @GetMapping("/bookkeeperBoatRequests")
    public String showBoatRequests() {
        return "bookkeeperBoatRequests";
    }

    @PreAuthorize("hasRole('BOOKKEEPER_USER')")
    @GetMapping("/bookkeeperMemberList")
    public String getAllMembers(Model model) {
        model.addAttribute("memberlist", service.getAllMemberlistDetails());
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

    @GetMapping("/index")
    public String showIndexPage() {
        return "index";
    }

    @GetMapping("/berthscomp")
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

