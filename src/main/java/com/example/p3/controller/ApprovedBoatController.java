package com.example.p3.controller;

import com.example.p3.model.ApprovedBoat;
import com.example.p3.service.ApprovedBoatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/approvedBoats")
public class ApprovedBoatController {

    private final ApprovedBoatService approvedBoatService;

    @Autowired
    public ApprovedBoatController(ApprovedBoatService approvedBoatService) {
        this.approvedBoatService = approvedBoatService;
    }

    @GetMapping
    public List<ApprovedBoat> getAllApprovedBoats() {
        return approvedBoatService.getAllApprovedBoats();
    }
}
