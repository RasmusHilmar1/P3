package com.example.p3;

import com.example.p3.model.Berth;
import com.example.p3.model.Boat;
import com.example.p3.service.BerthCompatibilityService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BerthCompatibilityServiceTest {

    private final BerthCompatibilityService service = new BerthCompatibilityService(null); // Skaber instance af service.
    // Dette har parametreren null, da den ikke behøver hente nogle repositories eller eksterne services

    @Test
    void testCalculateCompatibilityScore_ValidFit() {
        Boat boat = new Boat();
        boat.setLength(10);
        boat.setWidth(3);
        Berth berth = new Berth();
        berth.setLength(12);
        berth.setWidth(4);

        double score = service.calculateCompatibilityScore(boat, berth);

        assertTrue(score > 0 && score < 100, "Compatibility score should be greater than 0.0 for valid fit but less than 100.");
    }

    @Test
    void testCalculateCompatibilityScore_SmallerBerth() {
        Boat boat = new Boat();
        boat.setLength(10);
        boat.setWidth(3);
        Berth berth = new Berth();
        berth.setLength(9);
        berth.setWidth(2);

        double score = service.calculateCompatibilityScore(boat, berth);

        assertEquals(0.0, score, "Compatibility score should be 0.0 when berth is smaller than boat plus offsets.");
    }

    @Test
    void testCalculateCompatibilityScore_PerfectFit() {
        Boat boat = new Boat();
        boat.setLength(10);
        boat.setWidth(3);
        Berth berth = new Berth();
        berth.setLength(11);
        berth.setWidth(3.3);

        double score = service.calculateCompatibilityScore(boat, berth);

        assertEquals(100.0, score, "Compatibility score should be 100.0 for a perfect fit.");
    }

    @Test
    void testCalculateCompatibilityScore_InvalidBoatDimensions() {
        Boat boat = new Boat();
        boat.setLength(0);
        boat.setWidth(0);
        Berth berth = new Berth();
        berth.setLength(12);
        berth.setWidth(4);


        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.calculateCompatibilityScore(boat, berth),
                "An IllegalArgumentException should be thrown for invalid boat dimensions."
        );

        assertEquals("Boat dimensions must be greater than zero.", exception.getMessage());
    }
}
