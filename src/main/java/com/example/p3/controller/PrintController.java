package com.example.p3.controller;

import com.example.p3.dto.BerthlistDTO;
import com.example.p3.repository.BerthlistRepository;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.*;
import com.example.p3.service.PrintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

//Controller for exporting the lists to excel format in order to print them
@Controller
public class PrintController {

    @Autowired
    private BerthlistRepository berthlistRepository;
    @Autowired
    private PrintService printService;

    // Function for exporting Excel document list from vessel inspector's berth list
    @GetMapping("/vesselBerthList/PladsExcel")
    public void generateBerthlistExcel(HttpServletResponse response) throws Exception{
        response.setContentType("application/octet-stream");

        String headerKey = "Content-Disposition";
        String headerValue = "attachment;filename=Plads liste.xls";

        response.setHeader(headerKey, headerValue);

        printService.generateBerthlistExcel(response); // calls the method from PrintService

        response.flushBuffer(); //remaining data in the response buffer is sent to the client immediately
    }

}
