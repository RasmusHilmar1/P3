package com.example.p3;

import com.example.p3.dto.MemberlistDTO;
import com.example.p3.repository.MemberlistRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
public class DeleteMemberTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MemberlistRepository memberlistRepository;

    @Test
    public void deleteMemberDeletesMember() throws Exception {
        List<MemberlistDTO> memberlistBeforeDeletion = memberlistRepository.fetchAllMemberlistDetails();

        assertEquals(5, memberlistBeforeDeletion.size(), "The list must contain 5 entries before deletion.");

        boolean memberWithId5Before = memberlistBeforeDeletion.stream()
                .anyMatch(member -> member.getMemberID() == 5);
        assertTrue(memberWithId5Before, "Member with ID 5 should be present before deletion.");

        MemberlistDTO memberToDelete = memberlistBeforeDeletion.get(4);

        mockMvc.perform(post("/bookkeeperMemberList/delete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(memberToDelete)))
                .andExpect(status().isOk());

        List<MemberlistDTO> memberlistAfterDeletion = memberlistRepository.fetchAllMemberlistDetails();

        assertEquals(4, memberlistAfterDeletion.size(), "The list must contain 4 entries after deletion.");

        boolean memberWithId5After = memberlistAfterDeletion.stream()
                .anyMatch(member -> member.getMemberID() == 5);
        assertFalse(memberWithId5After, "Member with ID 5 should NOT be present after deletion.");
    }
}