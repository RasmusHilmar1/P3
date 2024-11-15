package com.example.p3.unittest;

import com.example.p3.model.Member;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


public class MemberUnitTests {

    @Test
    public void testMemberName() {
        Member member = new Member();
        member.setName("John Doe");

        Assertions.assertNotEquals(member.getName(), null);
        Assertions.assertEquals(member.getName(), "John Doe");
        assertThat(member.getName()).isEqualTo("John Doe");
    }

    @Test
    public void testMemberAddress() {
        Member member = new Member();
        member.setAddress("123 Main St");

        assertThat(member.getAddress()).isEqualTo("123 Main St");
        Assertions.assertNotEquals(member.getAddress(), null);
    }


}
