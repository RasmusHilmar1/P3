package com.example.p3;

import com.example.p3.dto.MemberlistDTO;
import com.example.p3.repository.MemberlistRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
public class ApproveMemberTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MemberlistRepository memberlistRepository;

    @Test
    public void approveMemberApprovesMember() throws Exception {
        List<MemberlistDTO> memberlistBeforeApproval = memberlistRepository.fetchAllMemberlistDetails();

        assertEquals(4, memberlistBeforeApproval.size(), "The list must contain at least 4 entries.");

        boolean memberWithId5Before = memberlistBeforeApproval.stream()
                .anyMatch(member -> member.getMemberID() == 5);
        assertFalse(memberWithId5Before, "Member with ID 5 should not be present before approval.");

        mockMvc.perform(post("/members/update/approve/member/5"))
                .andExpect(status().isOk());

        List<MemberlistDTO> memberlistAfterApproval = memberlistRepository.fetchAllMemberlistDetails();

        assertNotNull(memberlistAfterApproval.get(4));
        assertEquals(5, memberlistAfterApproval.size(), "The list must contain 5 entries after the approval.");

        boolean memberWithId5After = memberlistAfterApproval.stream()
                .anyMatch(member -> member.getMemberID() == 5);
        assertTrue(memberWithId5After, "Member with ID 5 should be present after approval.");
    }

}
