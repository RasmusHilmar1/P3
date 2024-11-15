package com.example.p3.service;

import com.example.p3.dto.BoatDTO;
import com.example.p3.model.Boat;
import com.example.p3.repository.BoatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoatService {

    @Autowired
    private BoatRepository boatRepository;

    public Boat updateBoatName(int boatId, String newName) {
        Boat boat = boatRepository.findByBoatID(boatId);
        if (boat != null) {
            boat.setName(newName.replace("\"",""));  // Update name
            return boatRepository.save(boat);  // Save updated boat
        }
        return null;  // Return null if boat not found
    }

    // Update boat type
    public Boat updateBoatType(int boatId, String newType) {
        Boat boat = boatRepository.findByBoatID(boatId);
        if (boat != null) {
            boat.setType(newType.replace("\"",""));  // Update type
            return boatRepository.save(boat);  // Save updated boat
        }
        return null;  // Return null if boat not found
    }

    // Update boat manufacturer
    public Boat updateBoatManufacturer(int boatId, String newManufacturer) {
        Boat boat = boatRepository.findByBoatID(boatId);
        if (boat != null) {
            boat.setManufacturer(newManufacturer.replace("\"",""));  // Update manufacturer
            return boatRepository.save(boat);  // Save updated boat
        }
        return null;  // Return null if boat not found
    }

    // Update boat length
    public Boat updateBoatLength(int boatId, long newLength) {
        Boat boat = boatRepository.findByBoatID(boatId);
        if (boat != null) {
            boat.setLength(newLength);  // Update length
            return boatRepository.save(boat);  // Save updated boat
        }
        return null;  // Return null if boat not found
    }

    // Update boat width
    public Boat updateBoatWidth(int boatId, long newWidth) {
        Boat boat = boatRepository.findByBoatID(boatId);
        if (boat != null) {
            boat.setWidth(newWidth);  // Update width
            return boatRepository.save(boat);  // Save updated boat
        }
        return null;  // Return null if boat not found
    }

    // Update boat draught
    public Boat updateBoatDraught(int boatId, long newDraught) {
        Boat boat = boatRepository.findByBoatID(boatId);
        if (boat != null) {
            boat.setDraught(newDraught);  // Update draught
            return boatRepository.save(boat);  // Save updated boat
        }
        return null;  // Return null if boat not found
    }

    // Update boat insurance
    public Boat updateBoatInsurance(int boatId, String newInsurance) {
        Boat boat = boatRepository.findByBoatID(boatId);
        if (boat != null) {
            boat.setInsurance(newInsurance.replace("\"",""));  // Update insurance
            return boatRepository.save(boat);  // Save updated boat
        }
        return null;  // Return null if boat not found
    }

    // Update boat berth ID
    public Boat updateBoatBerthID(int boatId, int newBerthID) {
        Boat boat = boatRepository.findByBoatID(boatId);
        if (boat != null) {
            boat.setBerthID(newBerthID);  // Update berth ID
            return boatRepository.save(boat);  // Save updated boat
        }
        return null;  // Return null if boat not found
    }

    // Update boat member ID
    public Boat updateBoatMemberID(int boatId, int newMemberID) {
        Boat boat = boatRepository.findByBoatID(boatId);
        if (boat != null) {
            boat.setMemberID(newMemberID);  // Update member ID
            return boatRepository.save(boat);  // Save updated boat
        }
        return null;  // Return null if boat not found
    }

    public List<Boat> getAllBoats() {
        // Method to fetch all boats
            return boatRepository.findAll(); // Assuming you have a BoatRepository extending JpaRepository

    }

    public BoatDTO convertToDTO(Boat boat) {
        if (boat == null) {
            return null;
        }

        // Convert Boat entity to BoatDTO
        return new BoatDTO(boat.getBoatID(), boat.getName());
    }

    // Method to get all boats for a specific member
    public List<BoatDTO> getBoatsByMemberId(int memberId) {
        List<Boat> boats = boatRepository.findByMemberID(memberId);

        return boats.stream()
                .map(this::convertToDTO) // Convert each Boat entity to BoatDTO
                .collect(Collectors.toList()); // Return a list of BoatDTOs
    }
}
