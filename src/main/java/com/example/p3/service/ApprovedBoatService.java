package com.example.p3.service;

import com.example.p3.model.ApprovedBoat;
import com.example.p3.repository.ApprovedBoatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApprovedBoatService {

    private final ApprovedBoatRepository approvedBoatRepository;

    @Autowired
    public ApprovedBoatService(ApprovedBoatRepository approvedBoatRepository) {
        this.approvedBoatRepository = approvedBoatRepository;
    }

    public List<ApprovedBoat> getAllApprovedBoats() {
        return approvedBoatRepository.findAll();
    }
}
