package com.example.p3;

import com.example.p3.controller.WebController;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class WebControllerTest {
    @InjectMocks
    private WebController webController;

    @Mock
    private HttpServletRequest request;

    @Test
    public void testShowDefaultPageAsVesselUser() {
        // Mocking the request to simulate "VESSEL_USER" role
        when(request.isUserInRole("VESSEL_USER")).thenReturn(true);

        // Act
        String result = webController.showDefaultPageAfterLogin(request);

        // Assert
        assertEquals("redirect:/vesselInspectorStartPage", result);
    }
}
