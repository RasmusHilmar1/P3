package com.example.p3.unittest;

import com.example.p3.model.Member;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import java.time.LocalDate;

public class MemberUnitTests {

    @Test
    public void testMemberId() {
        Member member = new Member();
        member.setMemberID(3);

        Assertions.assertNotEquals(member.getMemberID(), 0);
        Assertions.assertEquals(3, member.getMemberID());
    }

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

    @Test
    public void testMemberEmail() {
        Member member = new Member();
        member.setEmail("john.doe@gmail.com");

        Assertions.assertNotEquals(member.getEmail(), null);
        assertThat(member.getEmail()).isEqualTo("john.doe@gmail.com");
    }

    @Test
    public void testDateOfBirth() {
        Member member = new Member();
        member.setDateOfBirth(LocalDate.of(1999, 2, 2));

        Assertions.assertNotEquals(member.getDateofbirth(), null);
        assertThat(member.getDateofbirth()).isEqualTo(LocalDate.of(1999, 2, 2));
    }

    @Test
    public void testPhoneNumber() {
        Member member = new Member();
        member.setPhoneNumber(112);

        Assertions.assertNotEquals(member.getPhonenumber(), null);
        assertThat(member.getPhonenumber()).isEqualTo(112);
    }

    @Test
    public void testBoatOwnershio() {
        Member member = new Member();
        member.setBoatOwnership(true);

        Assertions.assertNotEquals(member.getBoatownership(), null);
        assertThat(member.getBoatownership()).isNotEqualTo(false);
        assertThat(member.getBoatownership()).isEqualTo(true);
    }



}
