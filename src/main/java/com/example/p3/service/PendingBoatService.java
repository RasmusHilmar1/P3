package com.example.p3.service;

import com.example.p3.model.PendingBoat;
import com.example.p3.model.PendingMember;
import com.example.p3.repository.PendingBoatRepository;
import com.example.p3.repository.PendingMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PendingBoatService {

    private final PendingBoatRepository pendingBoatRepository;

    @Autowired
    public PendingBoatService(PendingBoatRepository pendingBoatRepository) {
        this.pendingBoatRepository = pendingBoatRepository;
    }

    public List<PendingBoat> getAllPendingBoats() {
        return pendingBoatRepository.findAll();
    }
}
