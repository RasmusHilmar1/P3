package com.example.p3.controller;

import com.example.p3.model.ApprovedBoat;
import com.example.p3.model.PendingBoat;
import com.example.p3.model.PendingMember;
import com.example.p3.service.ApprovedBoatService;
import com.example.p3.service.PendingBoatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/pendingBoats")
public class PendingBoatController {

    private final PendingBoatService pendingBoatService;

    @Autowired
    public PendingBoatController(PendingBoatService pendingBoatService) {
        this.pendingBoatService = pendingBoatService;
    }

    @GetMapping
    public List<PendingBoat> getAllPendingBoats() {
        return pendingBoatService.getAllPendingBoats();
    }
}
