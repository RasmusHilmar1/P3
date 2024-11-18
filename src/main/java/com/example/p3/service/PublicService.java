package com.example.p3.service;

import com.example.p3.model.PublicMemberDTO;
import com.example.p3.model.Member;
import com.example.p3.repository.PublicMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PublicService {

    @Autowired
    private PublicMemberRepository publicMemberRepository;

    public Optional<PublicMemberDTO> getPublicMemberById(int id) {
        // Find PublicMember entity by ID and map to PublicMemberDTO
        return publicMemberRepository.findById(id)
                .map(member -> new PublicMemberDTO(
                        member.getId(),
                        member.getMemberName(),
                        member.getPhoneNumber()
                ));
    }
}
