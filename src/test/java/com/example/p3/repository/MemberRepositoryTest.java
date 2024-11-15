package com.example.p3.repository;

import com.example.p3.model.Member;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class MemberRepositoryTest {

    @Autowired
    private MemberRepository memberRepository;

    @Test
    public void MemberRepository_FindByMemberId_ReturnMember() {

        //Arrange
        Member member = new Member();
        member.setMemberID(1);
        member.setName("John Doe");
        member.setAddress("123 Main St");
        member.setEmail("john.doe@example.com");
        member.setDateOfBirth(java.time.LocalDate.of(1990, 1, 1));
        member.setPhoneNumber(123456789L);
        member.setBoatOwnership(false);

        //Act
        Member foundMember = memberRepository.save(member);

        //Assert
        Assertions.assertNotNull(foundMember);
        Assertions.assertEquals(member.getMemberID(), foundMember.getMemberID());
        assertThat(foundMember.getName()).isEqualTo(member.getName());
        assertThat(foundMember.getMemberID()).isEqualTo(member.getMemberID());
        assertThat(foundMember.getDateofbirth()).isEqualTo(member.getDateofbirth());
        assertThat(foundMember.getEmail()).isEqualTo(member.getEmail());
        assertThat(foundMember.getAddress()).isEqualTo(member.getAddress());

    }

}
