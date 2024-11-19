package com.example.p3.service;

import com.example.p3.dto.MemberlistDTO;
import com.example.p3.repository.MemberlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MemberlistService {

    @Autowired
    private MemberlistRepository repository;

    public List<MemberlistDTO> getAllMemberlistDetails() {
        return repository.fetchAllMemberlistDetails();
    }

}
