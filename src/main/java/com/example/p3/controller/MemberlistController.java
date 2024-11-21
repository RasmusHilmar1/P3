package com.example.p3.controller;

import com.example.p3.dto.MemberlistDTO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.example.p3.service.MemberlistService;

@Controller
public class MemberlistController {

    @Autowired
    private MemberlistService service;
    @Autowired
    private MemberlistService memberlistService;


    @PostMapping("/bookkeeperMemberList/updateMember")
    @ResponseBody
    public MemberlistDTO updateMember(@RequestBody MemberlistDTO dto) {
        System.out.println(dto);
        return memberlistService.updateMemberlist(dto);
    }
    @GetMapping("/bookkeeperMemberlist/excel")
    public void generateExcelReport(HttpServletResponse response) throws Exception{

        response.setContentType("application/octet-stream");

        String headerKey = "Content-Disposition";
        String headerValue = "attachment;filename=courses.xls";

        response.setHeader(headerKey, headerValue);

        memberlistService.generateExcel(response);

        response.flushBuffer();
    }
}
