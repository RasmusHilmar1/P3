package com.example.p3.unittest;

import com.example.p3.model.Boat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


public class BoatUnitTests {

    @Test
    public void testBoatId() {
        Boat boat = new Boat();
        boat.setBoatID(4);

        Assertions.assertNotEquals(boat.getBoatID(), 0);
        assertThat(boat.getBoatID()).isEqualTo(4);
    }

    @Test
    public void testMemberId() {
        Boat boat = new Boat();
        boat.setMemberID(5);

        Assertions.assertNotEquals(boat.getMemberID(), 0);
        assertThat(boat.getMemberID()).isEqualTo(5);
    }

    @Test
    public void testBerthId() {
        Boat boat = new Boat();
        boat.setBerthID(6);

        Assertions.assertNotEquals(boat.getBerthID(), 0);
        assertThat(boat.getBerthID()).isEqualTo(6);
    }

    @Test
    public void testBoatName() {
        Boat boat = new Boat();
        boat.setName("Titanic");

        Assertions.assertNotEquals(boat.getName(), null);
        assertThat(boat.getName()).isEqualTo("Titanic");
    }

    @Test
    public void testBoatType() {
        Boat boat = new Boat();
        boat.setType("Old boat");

        Assertions.assertNotEquals(boat.getType(), null);
        assertThat(boat.getType()).isEqualTo("Old boat");
    }

    @Test
    public void testBoatManufacturer() {
        Boat boat = new Boat();
        boat.setManufacturer("Harland & Wolff");

        Assertions.assertNotEquals(boat.getManufacturer(), null);
        assertThat(boat.getManufacturer()).isEqualTo("Harland & Wolff");
    }

    @Test
    public void testBoatWidth() {
        Boat boat = new Boat();
        boat.setWidth(20);

        Assertions.assertNotEquals(boat.getWidth(), null);
        assertThat(boat.getWidth()).isEqualTo(20);
    }

    @Test
    public void testBoatLength() {
        Boat boat = new Boat();
        boat.setLength(30);

        Assertions.assertNotEquals(boat.getLength(), null);
        assertThat(boat.getLength()).isEqualTo(30);
    }

    @Test
    public void testBoatDraught() {
        Boat boat = new Boat();
        boat.setDraught(2.4);

        Assertions.assertNotEquals(boat.getDraught(), null);
        assertThat(boat.getDraught()).isEqualTo(2.4);
    }

    @Test
    public void testBoatInsurance() {
        Boat boat = new Boat();
        boat.setInsurance("Lloyd's");

        Assertions.assertNotEquals(boat.getInsurance(), null);
        assertThat(boat.getInsurance()).isEqualTo("Lloyd's");
    }

}
