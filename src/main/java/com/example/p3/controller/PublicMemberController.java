package com.example.p3.controller;

import com.example.p3.model.PublicMemberDTO;
import com.example.p3.service.PublicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/publicmembers")
public class PublicMemberController {

    @Autowired
    private PublicService publicService;

    @GetMapping("/{id}")
    public ResponseEntity<PublicMemberDTO> getPublicMemberById(@PathVariable int id) {
        Optional<PublicMemberDTO> memberDTO = publicService.getPublicMemberById(id);
        return memberDTO.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
