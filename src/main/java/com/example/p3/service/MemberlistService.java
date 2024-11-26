package com.example.p3.service;

import com.example.p3.dto.MemberlistDTO;
import com.example.p3.model.Member;
import com.example.p3.model.Boat;
import com.example.p3.model.Berth;
import com.example.p3.repository.MemberRepository;
import com.example.p3.repository.BoatRepository;
import com.example.p3.repository.BerthRepository;
import com.example.p3.repository.MemberlistRepository;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
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

    private HSSFFont createFont(HSSFWorkbook workbook, boolean isBold, short fontSize, String fontName) {
        HSSFFont font = workbook.createFont();
        font.setBold(isBold);
        font.setFontHeightInPoints(fontSize);
        font.setFontName(fontName);
        return font;
    }

    private HSSFCellStyle createCellStyle(HSSFWorkbook workbook, HSSFFont font, BorderStyle borderStyle) {
        HSSFCellStyle style = workbook.createCellStyle();
        style.setFont(font);
        style.setBorderTop(borderStyle);
        style.setBorderBottom(borderStyle);
        style.setBorderLeft(borderStyle);
        style.setBorderRight(borderStyle);
        return style;
    }

    public void generateMemberlistExcel(HttpServletResponse response) throws Exception {

        List<MemberlistDTO> members = memberlistRepository.fetchAllMemberlistDetails();

        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet("Memberlist");

        // Create header font and style using helper methods
        HSSFFont headerFont = createFont(workbook, true, (short) 12, "Arial");
        HSSFCellStyle headerStyle = createCellStyle(workbook, headerFont, BorderStyle.MEDIUM);

        // Create data font and style using helper methods
        HSSFFont dataFont = createFont(workbook, false, (short) 12, "Arial");
        HSSFCellStyle dataStyle = createCellStyle(workbook, dataFont, BorderStyle.THIN);


        // Create header row
        HSSFRow headerRow = sheet.createRow(0);
        String[] headers = {"MemberID", "Name", "Address", "Phone Number", "Email", "Boat Name",
                "Boat Length", "Boat Width", "Boat Area", "Price", "Berth Name"};
        for (int i = 0; i < headers.length; i++) {
            HSSFCell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle); // Apply header style
        }

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

            // Apply data style with highlighted borders to each cell
            for (int i = 0; i <= 10; i++) {
                dataRow.getCell(i).setCellStyle(dataStyle);
            }

            dataRowIndex++;
        }

        // Auto-size all columns to fit content
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ServletOutputStream ops = response.getOutputStream();
        workbook.write(ops);
        workbook.close();
        ops.close();

    }

    public void generateEmailExcel(HttpServletResponse response) throws Exception {

        List<MemberlistDTO> members = memberlistRepository.fetchAllMemberlistDetails();

        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet("EmailList");

        // Create header font and style using helper methods
        HSSFFont headerFont = createFont(workbook, true, (short) 12, "Arial");
        HSSFCellStyle headerStyle = createCellStyle(workbook, headerFont, BorderStyle.MEDIUM);

        // Create data font and style using helper methods
        HSSFFont dataFont = createFont(workbook, false, (short) 12, "Arial");
        HSSFCellStyle dataStyle = createCellStyle(workbook, dataFont, BorderStyle.THIN);


        // Create header row
        HSSFRow headerRow = sheet.createRow(0);
        String[] headers = {"MemberID", "Name", "Email", "Phone Number"};
        for (int i = 0; i < headers.length; i++) {
            HSSFCell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle); // Apply header style
        }

        int dataRowIndex = 1;

        for (MemberlistDTO memberlistDTO : members) {
            HSSFRow dataRow = sheet.createRow(dataRowIndex);
            dataRow.createCell(0).setCellValue(memberlistDTO.getMemberID());
            dataRow.createCell(1).setCellValue(memberlistDTO.getMemberName());
            dataRow.createCell(2).setCellValue(memberlistDTO.getMemberEmail());
            dataRow.createCell(3).setCellValue(memberlistDTO.getMemberPhonenumber());

            // Apply data style with highlighted borders to each cell
            for (int i = 0; i <= 3; i++) {
                dataRow.getCell(i).setCellStyle(dataStyle);
            }

            dataRowIndex++;
        }

        // Auto-size all columns to fit content
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ServletOutputStream ops = response.getOutputStream();
        workbook.write(ops);
        workbook.close();
        ops.close();
    }
}
