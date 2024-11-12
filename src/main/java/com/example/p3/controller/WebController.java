package com.example.p3.controller;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @PreAuthorize("hasRole('BOOKKEEPER_USER')")
    @GetMapping("/bookkeeper/bookkeeperBoatRequests")
    public String showBoatRequests() {
        return "bookkeeper/bookkeeperBoatRequests";
    }

    @PreAuthorize("hasRole('BOOKKEEPER_USER')")
    @GetMapping("/bookkeeper/bookkeeperMemberList")
    public String showBookkeeperMemberList() {
        return "bookkeeper/bookkeeperMemberList";
    }

    @PreAuthorize("hasRole('BOOKKEEPER_USER')")
    @GetMapping("/bookkeeper/bookkeeperMemberRequests")
    public String showBookkeeperMemberRequests() {
        return "bookkeeper/bookkeeperMemberRequests";
    }

    @PreAuthorize("hasRole('BOOKKEEPER_USER')")
    @GetMapping("/bookkeeper/bookkeeperStartPage")
    public String showBookkeeperStartPage() {
        return "bookkeeper/bookkeeperStartPage";
    }

    @PreAuthorize("hasRole('VESSEL_USER')")
    @GetMapping("/vesselInspector/vesselInspectorBerthList")
    public String showBerthListPage() {
        return "vesselInspector/vesselInspectorBerthList";
    }

    @PreAuthorize("hasRole('VESSEL_USER')")
    @GetMapping("/vesselInspector/vesselInspectorBoatRequests")
    public String showInspectorBoatRequests() {
        return "vesselInspector/vesselInspectorBoatRequests";
    }
    @PreAuthorize("hasRole('VESSEL_USER')")
    @GetMapping("/vesselInspector/vesselInspectorStartPage")
    public String showStartPage() {
        return "vesselInspector/vesselInspectorStartPage";
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
