package com.example.p3.controller;

import com.example.p3.dto.MemberlistDTO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.example.p3.service.MemberlistService;
import com.example.p3.service.PrintService;
import java.util.List;
import org.springframework.http.ResponseEntity;

@Controller
public class MemberlistController {

    @Autowired

    private MemberlistService memberlistService;
    @Autowired
    private PrintService printService;

    // Post kald for at opdaterer et medlems informationgennem listen
    @PostMapping("/bookkeeperMemberList/updateMember")
    @ResponseBody
    public MemberlistDTO updateMember(@RequestBody MemberlistDTO dto) {
        return memberlistService.updateMemberlist(dto);
    }

    @GetMapping("/bookkeeperMemberList/search")
    public ResponseEntity<List<MemberlistDTO>> searchMembers(@RequestParam("query") String query) {
        List<MemberlistDTO> members = memberlistService.searchMembers(query);
        return ResponseEntity.ok(members);
    }

    @PostMapping("/bookkeeperMemberList/delete")
    @ResponseBody
    public MemberlistDTO deleteMember(@RequestBody MemberlistDTO dto) {
        return memberlistService.deleteMemberFromDatabase(dto);
    }

}
