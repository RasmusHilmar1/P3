package com.example.p3.service;

import com.example.p3.dto.MemberlistDTO;
import com.example.p3.model.*;
import com.example.p3.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    @Autowired
    private ApprovedMemberRepository approvedMemberRepository;

    @Autowired
    private ApprovedBoatRepository approvedBoatRepository;

    @Autowired
    private PendingBoatService pendingBoatService;
    @Autowired
    private PendingBoatRepository pendingBoatRepository;

    // Fetch all member list details
    public List<MemberlistDTO> getAllMemberlistDetails() {
        return memberlistRepository.fetchAllMemberlistDetails();
    }

    // Funktion til at opdaterer forskellige klasser på baggrund af DTO
    // Bruger transactional tagget for at alle de 3 saves sker i databasen på samme tid fremfor hver især
    // på den måde undgår vi, at den opdaterer en tabel uden de andre, in case noget går galt med de andre klasser
    @Transactional
    public MemberlistDTO updateMemberlist(MemberlistDTO dto) {
        // initierer 3 ID'er på baggrund af værdierne i DTO'en
        int memberID = dto.getMemberID();
        int boatID = dto.getBoatID();
        int berthID = dto.getBerthID();

        // Opdater member tabel ved brug af klassen. Finder de rigtige member objekt gennem DTO ID
        Member member = memberRepository.findByMemberID(memberID);
        if (member == null) {
            throw new IllegalArgumentException("Member not found with ID: " + memberID);
        }
        // Opdaterer objektets værdier på baggrund af DTO og gemmer
        member.setName(dto.getMemberName());
        member.setEmail(dto.getMemberEmail());
        member.setAddress(dto.getMemberAddress());
        member.setPhonenumber(dto.getMemberPhonenumber());
        memberRepository.save(member);

        // Opdater den tilhørende båd, hvis der er en til stede, samme måde som før
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

        // Opdater berth på samme måde som båd
        if (berthID != 0) {
            Berth berth = berthRepository.findByBerthID(berthID);
            if (berth == null) {
                throw new IllegalArgumentException("Berth not found with ID: " + berthID);
            }

            berth.setName(dto.getBerthName());
            berthRepository.save(berth);
        }

        // Return den opdatered DTO
        return dto;
    }

    public List<MemberlistDTO> searchMembers(String query) {
        return memberlistRepository.searchMembers(query);
    }

    @Transactional
    public MemberlistDTO deleteMemberFromDatabase(MemberlistDTO member) {
        int memberId = member.getMemberID();
        int boatId = member.getBoatID();

        // Find Boat entiteten ved hjælp af boatId
        Boat boat = boatRepository.findById(boatId).orElse(null);
        if (boat != null) {
            boat.setMemberID(0); // Fjern medlemmet fra båden
            boatRepository.save(boat); // Gem opdateret båd
        }

        // Find og slet PendingBoat, hvis det eksisterer
        PendingBoat pendingBoat = pendingBoatRepository.findByBoat(boat);
        if (pendingBoat != null) {
            pendingBoatRepository.deleteById((long) pendingBoat.getId()); // Brug PendingBoat's ID
        }

        // Find og slet ApprovedBoat, hvis det eksisterer
        ApprovedBoat approvedBoat = approvedBoatRepository.findByBoat(boat);
        if (approvedBoat != null) {
            approvedBoatRepository.deleteById((long) approvedBoat.getId()); // Brug ApprovedBoat's ID
        }

        // Slet Boat entiteten
        if (boat != null) {
            boatRepository.deleteById(boatId); // Slet båden
        }

        // Find og slet det tilknyttede medlem
        Member memberFromList = memberRepository.findByMemberID(memberId); // Find medlem fra medlems-ID
        ApprovedMember approvedMember = approvedMemberRepository.findByMember(memberFromList); // Find godkendt medlem
        approvedMemberRepository.delete(approvedMember); // Slet godkendt medlem
        memberRepository.delete(memberFromList); // Slet medlem

        return member; // Returnér den oprindelige MemberlistDTO
    }

}