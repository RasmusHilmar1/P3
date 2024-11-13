package com.example.p3.service;

import com.example.p3.model.Berth;
import com.example.p3.repository.BerthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BerthService {

    @Autowired
    private BerthRepository berthRepository;

    public List<Berth> getAllBerths() {
        return berthRepository.findAll();
    }

    public Berth updateBerthName(int berthId, String newName) {
        Berth berth = berthRepository.findByBerthID(berthId);
        if (berth != null) {
            berth.setName(newName.replace("\"", ""));  // Update name
            return berthRepository.save(berth);  // Save updated member
        }
        return null;  // Return null if member not found
    }

    // Function for updating berth information
    public Berth updateBerthInformation(int berthId, Berth info) {
        Berth berth = berthRepository.findByBerthID(berthId);
        if (berth != null) {
            if (info.getName() != null) {
                berth.setName(info.getName().replace("\"", ""));
            }
            if (info.getLength() != 0) {
                berth.setLength(info.getLength());
            }
            if (info.getWidth() != 0) {
                berth.setWidth(info.getWidth());
            }
            if (info.getDepth() != 0) {
                berth.setDepth(info.getDepth());
            }
            return berthRepository.save(berth);  // Save updated member
        }
        return null;  // Return null if member not found
    }
}
