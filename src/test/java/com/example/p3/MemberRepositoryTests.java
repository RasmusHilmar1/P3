package com.example.p3;

import com.example.p3.model.Member;
import com.example.p3.repository.MemberRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.ContextConfiguration;

import java.util.List;


@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
@ContextConfiguration(classes = P3Application.class)
public class MemberRepositoryTests {

    @Autowired MemberRepository memberRepository;

    @Test
    public void MemberRepository_GetAll_ReturnsMoreThanOneMember() {
        // Arrange
        Member member1 = Member.builder().memberID(1).name("pikachu").build();
        Member member2 = Member.builder().memberID(2).name("yyy").build();
        memberRepository.save(member1);
        memberRepository.save(member2);

        // Act
        List<Member> memberList = memberRepository.findAll();

        // Assert
        Assertions.assertTrue(memberList.size() >= 2, "There should be at least 2 members.");
        Assertions.assertTrue(memberList.contains(member1), "The first member should be in the list.");
        Assertions.assertTrue(memberList.contains(member2), "The second member should be in the list.");
    }

    @Test
    public void MemberRepository_FindByMemberID() {
        // Arrange
        Member member1 = Member.builder().memberID(1).name("pikachu").build();
        Member member2 = Member.builder().memberID(2).name("yyy").build();
        memberRepository.save(member1);
        memberRepository.save(member2);

        // Act
        Member foundMember = memberRepository.findByMemberID(1); // Find by ID 1

        // Assert
        Assertions.assertNotNull(foundMember);
        Assertions.assertEquals(1, foundMember.getMemberID());
        Assertions.assertEquals("pikachu", foundMember.getName());
    }


}
