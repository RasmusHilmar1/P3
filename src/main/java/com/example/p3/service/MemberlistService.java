package com.example.p3.service;

import com.example.p3.dto.MemberlistDTO;
import com.example.p3.model.Member;        // Entity for Member table
import com.example.p3.model.Boat;         // Entity for Boat table
import com.example.p3.model.Berth;        // Entity for Berth table
import com.example.p3.repository.MemberRepository;
import com.example.p3.repository.BoatRepository;
import com.example.p3.repository.BerthRepository;
import com.example.p3.repository.MemberlistRepository;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

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
    public void generateExcel(HttpServletResponse response) throws Exception {

        List<MemberlistDTO> members = memberlistRepository.fetchAllMemberlistDetails();

        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet("Courses Info");
        HSSFRow row = sheet.createRow(0);

        row.createCell(0).setCellValue("MemberID");
        row.createCell(1).setCellValue("Name");
        row.createCell(2).setCellValue("Adress");
        row.createCell(3).setCellValue("Phonenumber");
        row.createCell(4).setCellValue("Email");
        row.createCell(5).setCellValue("Boatname");
        row.createCell(6).setCellValue("Boatlength");
        row.createCell(7).setCellValue("Boatwidth");
        row.createCell(8).setCellValue("Boatareal");
        row.createCell(9).setCellValue("Price");
        row.createCell(10).setCellValue("Berthname");


        int dataRowIndex = 1;

        for (MemberlistDTO memberlistDTO : members) {
            HSSFRow dataRow = sheet.createRow(dataRowIndex);
            dataRow.createCell(0).setCellValue(memberlistDTO.getMemberID());
            dataRow.createCell(1).setCellValue(memberlistDTO.getMemberName());
            dataRow.createCell(2).setCellValue(memberlistDTO.getMemberAddress());
            dataRow.createCell(3).setCellValue(memberlistDTO.getMemberPhonenumber());
            dataRow.createCell(4).setCellValue(memberlistDTO.getMemberEmail());
            dataRow.createCell(5).setCellValue(memberlistDTO.getBoatName());
            dataRow.createCell(6).setCellValue(memberlistDTO.getBoatLength());
            dataRow.createCell(7).setCellValue(memberlistDTO.getBoatWidth());
            dataRow.createCell(8).setCellValue(memberlistDTO.getBoatAreal());
            dataRow.createCell(9).setCellValue(memberlistDTO.getBoatPrice());
            dataRow.createCell(10).setCellValue(memberlistDTO.getBerthName());


            dataRowIndex++;
        }

        ServletOutputStream ops = response.getOutputStream();
        workbook.write(ops);
        workbook.close();
        ops.close();

    }
}
