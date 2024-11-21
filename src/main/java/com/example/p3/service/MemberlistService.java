package com.example.p3.service;

import com.example.p3.dto.MemberlistDTO;
import com.example.p3.model.Member;        // Entity for Member table
import com.example.p3.model.Boat;         // Entity for Boat table
import com.example.p3.model.Berth;        // Entity for Berth table
import com.example.p3.repository.MemberRepository;
import com.example.p3.repository.BoatRepository;
import com.example.p3.repository.BerthRepository;
import com.example.p3.repository.MemberlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MemberlistService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private BoatRepository boatRepository;

    @Autowired
    private BerthRepository berthRepository;

    @Autowired
    private MemberlistRepository memberlistRepository;

    // Fetch all member list details
    public List<MemberlistDTO> getAllMemberlistDetails() {
        return memberlistRepository.fetchAllMemberlistDetails();
    }

    // Function for updating member details across multiple tables
    @Transactional
    public MemberlistDTO updateMemberlist(MemberlistDTO dto) {
        System.out.println(dto);
        int memberID = dto.getMemberID();
        int boatID = dto.getBoatID();
        int berthID = dto.getBerthID();

        // Update Member table
        Member member = memberRepository.findByMemberID(memberID);
        if (member == null) {
            throw new IllegalArgumentException("Member not found with ID: " + memberID);
        }
        member.setName(dto.getMemberName());
        member.setEmail(dto.getMemberEmail());
        member.setAddress(dto.getMemberAddress());
        member.setPhonenumber(dto.getMemberPhonenumber());
        memberRepository.save(member);

        // Update Boat table (only if boatID is provided and valid)
        if (boatID != 0) {
            Boat boat = boatRepository.findByBoatID(boatID);
            if (boat == null) {
                throw new IllegalArgumentException("Boat not found with ID: " + boatID);
            }

            boat.setName(dto.getBoatName());
            boat.setLength(dto.getBoatLength());
            boat.setWidth(dto.getBoatWidth());
            boatRepository.save(boat);
        }

        // Update Berth table (only if berthID is provided and valid)
        if (berthID != 0) {
            Berth berth = berthRepository.findByBerthID(berthID);
            if (berth == null) {
                throw new IllegalArgumentException("Berth not found with ID: " + berthID);
            }

            berth.setName(dto.getBerthName());
            berthRepository.save(berth);
        }

        // Return the updated DTO
        return dto;
    }

    public List<MemberlistDTO> searchMembers(String query) {
        return memberlistRepository.searchMembers(query);
    }
}
