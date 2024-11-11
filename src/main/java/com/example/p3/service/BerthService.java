package com.example.p3.service;

import com.example.p3.model.Berth;
import com.example.p3.repository.BerthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BerthService {

    @Autowired
    private BerthRepository berthRepository;

    public Berth updateBerthName(int berthId, String newName) {
        Berth berth = berthRepository.findByBerthID(berthId);
        if (berth != null) {
            berth.setName(newName.replace("\"",""));  // Update name
            return berthRepository.save(berth);  // Save updated member
        }
        return null;  // Return null if member not found
    }

    public Berth updateBerthInformation(int berthId, int length, int width) {
        Berth berth = berthRepository.findByBerthID(berthId);
        if (berth != null) {
            berth.setLength(length);
            berth.setWidth(width);
            return berthRepository.save(berth);  // Save updated member
        }
        return null;  // Return null if member not found
    }
}