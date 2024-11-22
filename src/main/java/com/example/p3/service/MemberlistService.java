package com.example.p3.service;

import com.example.p3.dto.MemberlistDTO;
import com.example.p3.model.Member;
import com.example.p3.model.Boat;
import com.example.p3.model.Berth;
import com.example.p3.repository.MemberRepository;
import com.example.p3.repository.BoatRepository;
import com.example.p3.repository.BerthRepository;
import com.example.p3.repository.MemberlistRepository;
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

    // Fetch alle member list detaljer
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
}