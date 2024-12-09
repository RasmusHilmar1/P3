package com.example.p3;

import com.example.p3.model.Berth;
import com.example.p3.model.Boat;
import com.example.p3.model.BerthWithCompatibility;
import com.example.p3.service.BerthCompatibilityService;
import org.approvaltests.Approvals;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import java.util.List;
import java.util.stream.Collectors;

@SpringBootTest
public class BerthCompatibilityServiceIntegrationTest {

    @Autowired
    private BerthCompatibilityService berthCompatibilityService;


    @Test
    public void testCompatibilityReport() { // Virker kun hvis man ændrer databasen til v2
        // Set up a boat with specific dimensions for testing
        Boat boat = new Boat();
        boat.setLength(10.0); // Length of the boat
        boat.setWidth(2.5);  // Width of the boat

        // Call the method to find compatible berths from the real database
        List<BerthWithCompatibility> compatibleBerths = berthCompatibilityService.findCompatibleBerthsWithScore(boat);

        // Generate the compatibility report with ranks
        StringBuilder report = new StringBuilder();
        for (int i = 0; i < compatibleBerths.size(); i++) {
            int rank = i + 1; // Rank starts at 1
            BerthWithCompatibility berthWithCompatibility = compatibleBerths.get(i);
            Berth berth = berthWithCompatibility.getBerth();
            double compatibilityScore = berthWithCompatibility.getCompatibilityScore();
            String compatibilitySquare = getCompatibilitySquare(compatibilityScore);
            report.append(String.format("Rank: %d, Berth: %s, Length: %.2f, Width: %.2f, Availability: %d, " +
                            "Compatibility Score: %.2f, %s%n",
                    rank, berth.getName(), berth.getLength(), berth.getWidth(),
                    berth.getAvailability(), compatibilityScore, compatibilitySquare));
        }

        // Use ApprovalTests to verify the report
        Approvals.verify(report.toString());
    }




    // Method to get the colored square emoji based on compatibility score
    private static String getCompatibilitySquare(double compatibility) {
        if (compatibility >= 90) {
            return "🟩"; // Green square for high compatibility
        } else if (compatibility >= 70) {
            return "🟨"; // Yellow square for medium compatibility
        } else if (compatibility >= 50) {
            return "🟧"; // Orange square for low compatibility
        } else if (compatibility > 0) {
            return "🟥"; // Red square for very low compatibility
        } else {
            return "🟪"; // Purple square for incompatible
        }
    }
}
