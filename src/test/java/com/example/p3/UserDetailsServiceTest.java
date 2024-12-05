package com.example.p3;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.example.p3.repository.UsersRepository;
import com.example.p3.service.UsersService;
import com.example.p3.model.Users;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


import java.util.Optional;

@ExtendWith(MockitoExtension.class) // Det der gør mocking ting muligt
public class UserDetailsServiceTest {

    @Mock
    private UsersRepository usersRepository; // Mocking af indbygget Spring Boot UsersRepository

    @InjectMocks
    private UsersService userDetailsService;  // Service class under test

    @Test
    public void testLoadUserByUsername() {
        // Arrange
        String username = "vessel";
        Users mockUser = new Users();
        mockUser.setUsername("vessel");
        mockUser.setPassword("password123");
        when(usersRepository.findByUsername(username)).thenReturn(Optional.of(mockUser)); // Denne funktion bliver kaldt i loadUserByUsername
        // Vi siger at den skal retunere mockUser, i stedet for at bruge den rigtige method, som ville lede i db
        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        // Assert
        assertNotNull(userDetails);
        assertEquals("vessel", userDetails.getUsername());
        assertEquals("password123", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_VESSEL_USER")));
    }

    @Test
    public void testLoadUserByUsername_NotFound() {
        // Arrange
        String username = "nonexistent";
        when(usersRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername(username));
    }


}
