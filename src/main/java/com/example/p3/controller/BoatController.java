package com.example.p3.controller;

import com.example.p3.dto.BoatDTO;
import com.example.p3.dto.MemberDTO;
import com.example.p3.model.Boat;
import com.example.p3.model.Member;
import com.example.p3.service.BoatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/boats")
public class BoatController {

    @Autowired
    private BoatService boatService;

    // Endpoint to get all boats
    @GetMapping
    public List<Boat> getAllBoats() {
        return boatService.getAllBoats();
    }

    // Endpoint to update boat name
    @PutMapping("/update/name/{id}")
    public Boat updateBoatName(@PathVariable int id, @RequestBody String newName) {
        return boatService.updateBoatName(id, newName);
    }

    // Endpoint to update boat type
    @PutMapping("/update/type/{id}")
    public Boat updateBoatType(@PathVariable int id, @RequestBody String newType) {
        return boatService.updateBoatType(id, newType);
    }

    // Endpoint to update boat manufacturer
    @PutMapping("/update/manufacturer/{id}")
    public Boat updateBoatManufacturer(@PathVariable int id, @RequestBody String newManufacturer) {
        return boatService.updateBoatManufacturer(id, newManufacturer);
    }

    // Endpoint to update boat length
    @PutMapping("/update/length/{id}")
    public Boat updateBoatLength(@PathVariable int id, @RequestBody long newLength) {
        return boatService.updateBoatLength(id, newLength);
    }

    // Endpoint to update boat width
    @PutMapping("/update/width/{id}")
    public Boat updateBoatWidth(@PathVariable int id, @RequestBody long newWidth) {
        return boatService.updateBoatWidth(id, newWidth);
    }

    // Endpoint to update boat draught
    @PutMapping("/update/draught/{id}")
    public Boat updateBoatDraught(@PathVariable int id, @RequestBody long newDraught) {
        return boatService.updateBoatDraught(id, newDraught);
    }

    // Endpoint to update boat insurance
    @PutMapping("/update/insurance/{id}")
    public Boat updateBoatInsurance(@PathVariable int id, @RequestBody String newInsurance) {
        return boatService.updateBoatInsurance(id, newInsurance);
    }

    // Endpoint to update boat berth ID
    @PutMapping("/update/berth/{id}")
    public Boat updateBoatBerthID(@PathVariable int id, @RequestBody int newBerthID) {
        return boatService.updateBoatBerthID(id, newBerthID);
    }

    // Endpoint to update boat member ID
    @PutMapping("/update/member/{id}")
    public Boat updateBoatMemberID(@PathVariable int id, @RequestBody int newMemberID) {
        return boatService.updateBoatMemberID(id, newMemberID);
    }

    @GetMapping("/public/{memberId}")
    public List<BoatDTO> getBoatsByMemberId(@PathVariable int memberId) {
        return boatService.getBoatsByMemberId(memberId);
    }
}
