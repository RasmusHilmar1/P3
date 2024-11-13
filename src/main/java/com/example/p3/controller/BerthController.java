package com.example.p3.controller;

import com.example.p3.model.Berth;
import com.example.p3.model.Boat;
import com.example.p3.service.BerthService;
import com.example.p3.service.BerthCompatibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Berths")
public class BerthController {

    @Autowired
    private BerthService berthService;

    // Endpoint to update member name
    @PutMapping("/update/{id}")
    public Berth updateBerthName(@PathVariable int id, @RequestBody String newName) {
        return berthService.updateBerthName(id, newName);
    }
    // Endpoint for updating information of berth
    @PutMapping("/update/information/{id}")
    public Berth updateBerthInformation(@PathVariable int id, @RequestBody Berth info) {
        return berthService.updateBerthInformation(id, info);
    }

    @Autowired
    private BerthCompatibilityService berthCompatibilityService;

    // Endpoint to find compatible berths using GET
    @GetMapping("/find")
    public List<BerthCompatibilityService.BerthWithCompatibility> findCompatibleBerths(
            @RequestParam double length,
            @RequestParam double width) {

        Boat boat = new Boat(); // Create the boat object
        boat.setLength(length); // Set the length
        boat.setWidth(width);  // Set the width

        // Now correctly call the method on the instance of the service
        return berthCompatibilityService.findCompatibleBerthsWithScore(boat);
    }
}
