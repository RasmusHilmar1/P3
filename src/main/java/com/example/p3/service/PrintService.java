package com.example.p3.service;

import com.example.p3.dto.BerthlistDTO;
import com.example.p3.dto.MemberlistDTO;
import com.example.p3.repository.BerthlistRepository;
import com.example.p3.repository.MemberlistRepository;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

// Service til at håndterer export (hedder print, fordi det var det jeg forbandt det med MB)
@Service
public class PrintService {

    @Autowired
    private MemberlistRepository memberlistRepository;
    @Autowired
    private BerthlistRepository berthlistRepository;

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
        String[] headers = {"Medlems nr.", "Navn", "Addresse", "Telefon nr.", "E-mail", "Båd navn",
                "Båd længde", "Båd bredde", "Båd areal", "Pris", "Plads navn"};
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
        HSSFSheet sheet = workbook.createSheet("E-mailListe");

        // Create header font and style using helper methods
        HSSFFont headerFont = createFont(workbook, true, (short) 12, "Arial");
        HSSFCellStyle headerStyle = createCellStyle(workbook, headerFont, BorderStyle.MEDIUM);

        // Create data font and style using helper methods
        HSSFFont dataFont = createFont(workbook, false, (short) 12, "Arial");
        HSSFCellStyle dataStyle = createCellStyle(workbook, dataFont, BorderStyle.THIN);

        // Create header row
        HSSFRow headerRow = sheet.createRow(0);
        String[] headers = {"Medlems nr.", "Navn", "E-mail", "Telefon nr."};
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
    public void generateBerthlistExcel(HttpServletResponse response) throws Exception {

        List<BerthlistDTO> berths = berthlistRepository.fetchAllBerthlistDetails();

        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet("Plads liste");

        // Create header font and style using helper methods
        HSSFFont headerFont = createFont(workbook, true, (short) 12, "Arial");
        HSSFCellStyle headerStyle = createCellStyle(workbook, headerFont, BorderStyle.MEDIUM);

        // Create data font and style using helper methods
        HSSFFont dataFont = createFont(workbook, false, (short) 12, "Arial");
        HSSFCellStyle dataStyle = createCellStyle(workbook, dataFont, BorderStyle.THIN);

        // Create header row
        HSSFRow headerRow = sheet.createRow(0);
        String[] headers = {"Nummer", "Plads", "Medlems nr.", "Bådnavn", "Båd længde", "Båd Bredde",
                "Båd Areal", "Plads Længde", "Plads Bredde", "Plads Areal", "Udnyt%"};
        for (int i = 0; i < headers.length; i++) {
            HSSFCell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle); // Apply header style
        }

        int dataRowIndex = 1;

        for (BerthlistDTO berthlistDTO : berths) {
            HSSFRow dataRow = sheet.createRow(dataRowIndex);
            dataRow.createCell(0).setCellValue(berthlistDTO.getBerthID());
            dataRow.createCell(1).setCellValue(berthlistDTO.getBerthName());
            dataRow.createCell(2).setCellValue(berthlistDTO.getMemberID());
            dataRow.createCell(3).setCellValue(berthlistDTO.getBoatName());
            dataRow.createCell(4).setCellValue(berthlistDTO.getBoatLength());
            dataRow.createCell(5).setCellValue(berthlistDTO.getBoatWidth());
            dataRow.createCell(6).setCellValue(berthlistDTO.getBoatAreal());
            dataRow.createCell(7).setCellValue(berthlistDTO.getBerthLength());
            dataRow.createCell(8).setCellValue(berthlistDTO.getBerthWidth());
            dataRow.createCell(9).setCellValue(berthlistDTO.getBerthAreal());
            dataRow.createCell(10).setCellValue(Math.round((berthlistDTO.getBerthUtil())));

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
}
