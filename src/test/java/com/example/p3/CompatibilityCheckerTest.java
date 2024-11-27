package com.example.p3;

import com.example.p3.model.Berth;
import com.example.p3.model.Boat;
import com.example.p3.service.CompatibilityChecker;
import org.approvaltests.Approvals;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

public class CompatibilityCheckerTest {

    @Test
    public void testCompatibilityReport() {
        // Create a boat
        Boat boat = new Boat();
        boat.setBoatID(1);
        boat.setName("Boat A");
        boat.setLength(10.0);
        boat.setWidth(3.5);

        // Create a list of berths
        List<Berth> berths = Arrays.asList(
                createBerth(1, "Berth 1", 12.0, 4.0, 1),
                createBerth(2, "Berth 2", 30.0, 4.0, 1),
                createBerth(3, "Berth 3", 10.0, 3.5, 1),
                createBerth(4, "Berth 4", 15.0, 4.5, 1),
                createBerth(5, "Berth 5", 7.0, 2.5, 1),
                createBerth(6, "Berth 6", 10.5, 3.6, 1),
                createBerth(7, "Berth 7", 14.0, 5.0, 1),
                createBerth(8, "Berth 8", 9.0, 3.0, 1),
                createBerth(9, "Berth 9", 11.0, 3.5, 1),
                createBerth(10, "Berth 10", 10.0, 4.0, 1)
        );

        // Generate the compatibility report
        String report = CompatibilityChecker.generateCompatibilityReport(boat, berths);
        Approvals.verify(report);
    }

    // Helper method to create berths for testing
    private Berth createBerth(int berthID, String name, double length, double width, int availability) {
        Berth berth = new Berth();
        berth.setBerthID(berthID);
        berth.setName(name);
        berth.setLength(length);
        berth.setWidth(width);
        berth.setAvailability(availability);
        return berth;
    }
}
