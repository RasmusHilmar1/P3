package com.example.p3.controller;

import com.example.p3.model.Berth;
import com.example.p3.model.BerthWithCompatibility;
import com.example.p3.model.Boat;
import com.example.p3.service.BerthService;
import com.example.p3.service.BerthCompatibilityService;
import com.example.p3.service.ScriptRunnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/berths")
public class BerthController {

    @Autowired
    private BerthService berthService;

    @Autowired
    private ScriptRunnerService scriptRunnerService;

    @GetMapping("/getBerth/{id}")
    public Berth getBerthByBerthID(@PathVariable int id) { return berthService.findBerthByBerthId(id); } // Endpoint to get a specific berth by IDId(@PathVariable int id) {

    @GetMapping("/get/{id}")
    public Berth getBerthById(@PathVariable int id) { return berthService.findBerthByMemberID(id); } // Endpoint to get a specific berth by ID

    @GetMapping("/get")
    public List<Berth> getBerths() {
        return berthService.getAllBerths();
    }

    // Endpoint to update member name
    @PutMapping("/update/{id}")
    public Berth updateBerthName(@PathVariable int id, @RequestBody String newName) {
        return berthService.updateBerthName(id, newName);
    }
    // Endpoint for updating information of berth
    @PutMapping("/update/information/{id}")
    public Berth updateBerthInformation(@PathVariable int id, @RequestBody Berth info) {
        scriptRunnerService.runPythonScript();
        return berthService.updateBerthInformation(id, info);
    }

    @PutMapping("/update/availability/{id}")
    public Berth updateBerthAvailability(@PathVariable int id, @RequestBody int availability) {
        return berthService.updateBerthAvailability(id, availability);
    }

    @Autowired
    private BerthCompatibilityService berthCompatibilityService;

    // Endpoint to find compatible berths using GET
    @GetMapping("/find")
    public List<BerthWithCompatibility> findCompatibleBerths(
            @RequestParam double length,
            @RequestParam double width) {

        Boat boat = new Boat(); // Create the boat object
        boat.setLength(length); // Set the length
        boat.setWidth(width);  // Set the width

        // Now correctly call the method on the instance of the service
        return berthCompatibilityService.findCompatibleBerthsWithScore(boat);
    }
}
