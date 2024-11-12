package com.example.p3.controller;

import com.example.p3.model.Berth;
import com.example.p3.service.BerthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/update/information/{id}")
    public Berth updateBerthInformation(@PathVariable int id, @RequestBody int length, @RequestBody int width) {
        return berthService.updateBerthInformation(id, length, width);
    }
}