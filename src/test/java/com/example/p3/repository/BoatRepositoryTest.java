package com.example.p3.repository;

import com.example.p3.model.Boat;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class BoatRepositoryTest {

    @Autowired
    private BoatRepository boatRepository;

    @Test
    public void BoatRepository_FindByBoatId_ReturnBoat() {

        //Arrange
        Boat boat = new Boat();
        boat.setMemberID(5);
        boat.setBoatID(100);
        boat.setBerthID(1);
        boat.setName("Amalie");
        boat.setInsurance("Policy: 23231212");
        boatRepository.save(boat);

        //Act
        Boat foundBoat = boatRepository.save(boat);

        //Assert
        Assertions.assertNotNull(foundBoat);
        Assertions.assertEquals(foundBoat.getBoatID(), boat.getBoatID());
        Assertions.assertEquals(foundBoat.getMemberID(), boat.getMemberID());
        Assertions.assertEquals(foundBoat.getBerthID(), boat.getBerthID());

        Assertions.assertEquals(foundBoat.getName(), boat.getName());
        Assertions.assertEquals(foundBoat.getInsurance(), boat.getInsurance());

        Assertions.assertNotEquals(foundBoat.getName(), null);
    }
} 