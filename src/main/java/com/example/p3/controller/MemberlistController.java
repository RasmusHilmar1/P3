package com.example.p3.controller;

import com.example.p3.dto.MemberlistDTO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.*;
import com.example.p3.service.MemberlistService;

@Controller
public class MemberlistController {

    @Autowired
    private MemberlistService memberlistService;


    @PostMapping("/bookkeeperMemberList/updateMember")
    @ResponseBody
    public MemberlistDTO updateMember(@RequestBody MemberlistDTO dto) {
        System.out.println(dto);
        return memberlistService.updateMemberlist(dto);
    }
    @GetMapping("/bookkeeperMemberlist/MemberExcel")
    public void generateMemberlistExcel(HttpServletResponse response) throws Exception{

        response.setContentType("application/octet-stream");

        String headerKey = "Content-Disposition";
        String headerValue = "attachment;filename=Medlems liste.xls";

        response.setHeader(headerKey, headerValue);

        memberlistService.generateMemberlistExcel(response);

        response.flushBuffer();
    }

    @GetMapping("/bookkeeperMemberlist/EmailExcel")
    public void generateEmailListExcel(HttpServletResponse response) throws Exception{

        response.setContentType("application/octet-stream");

        String headerKey = "Content-Disposition";
        String headerValue = "attachment;filename=Email liste.xls";

        response.setHeader(headerKey, headerValue);

        memberlistService.generateEmailExcel(response);

        response.flushBuffer();
    }
}
